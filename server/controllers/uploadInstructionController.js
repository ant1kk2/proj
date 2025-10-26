const multer = require("multer");
const path = require('path');
const fs = require("fs");
const db = require("../config/dbConfig");

const baseUploadDir = path.join(__dirname, '../uploads/documents');

if (!fs.existsSync(baseUploadDir)) {
  fs.mkdirSync(baseUploadDir, {recursive: true});
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const originalNameBuffer = Buffer.from(file.originalname, 'latin1');
    const originalNameUtf8 = originalNameBuffer.toString('utf8');
    const originalNameWithoutExt = path.basename(originalNameUtf8, path.extname(originalNameUtf8));
    const folderName = originalNameWithoutExt.split(' ').join('_');

    const folderPath = path.join(baseUploadDir, folderName);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, {recursive: true});
    }

    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const originalNameBuffer = Buffer.from(file.originalname, 'latin1');
    const originalNameUtf8 = originalNameBuffer.toString('utf8');
    const originalName = originalNameUtf8.split(' ').join('_');
    cb(null, originalName);
  }
});

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.doc', '.docx'];
    const ext = path.extname(file.originalname);
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Тільки Word файли дозволені'));
    }
  }
});

const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({error: "No file uploaded"});
  }

  const {number, title, date, tegs, user_id, protocols} = req.body;

  const path_word = path
    .relative(path.join(__dirname, "../"), req.file.path)
    .replace(/\\/g, "/");

  const path_pdf = null;

  let parsedProtocols = [];
  if (protocols) {
    try {
      parsedProtocols =
        typeof protocols === "string" ? JSON.parse(protocols) : protocols;

    } catch (err) {
      console.error("Invalid protocols JSON:", err);
      return res.status(400).json({error: "Invalid protocols JSON"});
    }
  }

  db.beginTransaction((err) => {
    if (err) {
      console.error("Transaction start error:", err);
      return res.status(500).json({error: "Transaction error"});
    }

    // 1. Вставляем инструкцию
    const sqlInstruction = `
      INSERT INTO instructions
        (number, title, date, tegs, user_id, path_pdf, path_word)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const instructionParams = [
      number,
      title,
      date,
      tegs,
      user_id,
      path_pdf,
      path_word,
    ];

    db.query(sqlInstruction, instructionParams, (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Insert instruction error:", err);
          res.status(500).json({error: "Database error"});
        });
      }

      const instructionId = result.insertId;
      const protocolIds = [];

      // Если нет протоколов — сразу коммитим
      if (!parsedProtocols.length) {
        return db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({error: "Commit error"});
            });
          }
          res.json({message: "File uploaded", instructionId});
        });
      }

      // Вспомогательные функции для вставки деталей протокола
      const insertJobs = (jobs, protoId, cb) => {
        if (!jobs?.length) return cb();

        let i = 0;
        const nextJob = () => {
          if (i >= jobs.length) return cb();
          const job = jobs[i++];
          let j = 0;

          const nextDesc = () => {
            if (j >= job.jobsDesc.length) return nextJob(); // переходим к следующему job
            const desc = job.jobsDesc[j++];

            db.query(
              `INSERT INTO protocolTemplateJobs (protocolTemplate_id, jobNumber, jobDescription)
               VALUES (?, ?, ?)`,
              [protoId, job.number, desc],
              (err) => {
                if (err) return cb(err);
                nextDesc(); // рекурсивно вставляем следующее описание
              }
            );
          };

          nextDesc();
        };

        nextJob();
      };

      const insertExtraInfo = (extraInfo, protoId, cb) => {
        if (!extraInfo?.length) return cb();
        let i = 0;
        const next = () => {
          if (i >= extraInfo.length) return cb();
          const info = extraInfo[i++];
          db.query(
            `INSERT INTO protocolTemplateExtraInfo (protocolTemplate_id, info)
             VALUES (?, ?)`,
            [protoId, info],
            (err) => {
              if (err) return cb(err);
              next();
            }
          );
        };
        next();
      };

      const insertEquipmentInfo = (equipmentInfo, protoId, cb) => {
        if (!equipmentInfo?.length) return cb();
        let i = 0;
        const next = () => {
          if (i >= equipmentInfo.length) return cb();
          const info = equipmentInfo[i++];
          db.query(
            `INSERT INTO protocolTemplateEquipmentInfo (protocolTemplate_id, info)
             VALUES (?, ?)`,
            [protoId, info],
            (err) => {
              if (err) return cb(err);
              next();
            }
          );
        };
        next();
      };

      // Функция для последовательной вставки протоколов
      const insertProtocol = (index) => {
        if (index >= parsedProtocols.length) {
          // Все протоколы вставлены → коммит
          return db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({error: "Commit error"});
              });
            }
            res.json({
              message: "File and protocols uploaded",
              instructionId,
              protocolIds,
            });
          });
        }

        const proto = parsedProtocols[index];

        // Вставка протокола
        const sqlProtocol = `
          INSERT INTO protocolTemplates
            (instruction_id, title, repairType, measurements)
          VALUES (?, ?, ?, ?)
        `;
        const protoParams = [
          instructionId,
          proto.title,
          proto.repairType,
          proto.measurements,
        ];

        db.query(sqlProtocol, protoParams, (err, protoResult) => {
          if (err) {
            return db.rollback(() => {
              console.error("Insert protocol error:", err);
              res.status(500).json({error: "Database error"});
            });
          }

          const protocolId = protoResult.insertId;
          protocolIds.push(protocolId);

          // Вставляем jobs → extraInfo → equipmentInfo последовательно
          insertJobs(proto.jobs, protocolId, (err) => {
            if (err)
              return db.rollback(() => {
                console.error("Insert jobs error:", err);
                res.status(500).json({error: "Database error"});
              });

            insertExtraInfo(proto.extraInfo, protocolId, (err) => {
              if (err)
                return db.rollback(() => {
                  console.error("Insert extraInfo error:", err);
                  res.status(500).json({error: "Database error"});
                });

              insertEquipmentInfo(proto.equipmentInfo, protocolId, (err) => {
                if (err)
                  return db.rollback(() => {
                    console.error("Insert equipmentInfo error:", err);
                    res.status(500).json({error: "Database error"});
                  });

                // Переходим к следующему протоколу
                insertProtocol(index + 1);
              });
            });
          });
        });
      };

      insertProtocol(0);
    });
  });
};

module.exports = {
  upload,
  uploadFile
};
