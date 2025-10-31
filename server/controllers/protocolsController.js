const db = require("../config/dbConfig");

const getProtocolsByInstructionId = (req, res) => {
  const {id} = req.query;
  if (!id) return res.status(400).json({error: 'Instruction ID is required'});

  const sqlProtocols = `
    SELECT *
    FROM protocolTemplates
    WHERE instruction_id = ?
  `;

  db.query(sqlProtocols, [id], (err, protocols) => {
    if (err) return res.status(500).json({error: 'DB error', details: err});
    if (!protocols.length) return res.json([]);

    const protoIds = protocols.map(p => p.id);

    const sqlJobs = `SELECT *
                     FROM protocolTemplateJobs
                     WHERE protocolTemplate_id IN (?)`;
    db.query(sqlJobs, [protoIds], (err, jobs) => {
      if (err) return res.status(500).json({error: 'DB error', details: err});

      const sqlExtra = `SELECT *
                        FROM protocolTemplateExtraInfo
                        WHERE protocolTemplate_id IN (?)`;
      db.query(sqlExtra, [protoIds], (err, extras) => {
        if (err) return res.status(500).json({error: 'DB error', details: err});

        const sqlEquipment = `SELECT *
                              FROM protocolTemplateEquipmentInfo
                              WHERE protocolTemplate_id IN (?)`;
        db.query(sqlEquipment, [protoIds], (err, equipment) => {
          if (err) return res.status(500).json({error: 'DB error', details: err});

          const result = protocols.map(proto => ({
            id: proto.id,
            title: proto.title,
            repairType: proto.repairType,
            measurements: proto.measurements,
            equipmentInfo: equipment.filter(e => e.protocolTemplate_id === proto.id).map(e => e.info),
            extraInfo: extras.filter(e => e.protocolTemplate_id === proto.id).map(e => e.info),
            jobs: jobs
              .filter(j => j.protocolTemplate_id === proto.id)
              .reduce((acc, j) => {
                let job = acc.find(x => x.number === j.jobNumber);
                if (!job) {
                  job = {number: j.jobNumber, jobsDesc: []};
                  acc.push(job);
                }
                job.jobsDesc.push(j.jobDescription);
                return acc;
              }, [])
          }));

          res.json(result);
        });
      });
    });
  });
};

const addRegisteredProtocol = (req, res) => {

  const regDate = new Date()
  const regYear = regDate.getFullYear();
  const regMonth = regDate.getMonth();
  const regDay = regDate.getDate();

  const { user_id, instruction_id, protocol_number, protocol_title, protocols, protocol_template_id } = req.body;

  if (!instruction_id || !protocol_number || !protocol_title || !protocols?.length) {
    return res.status(400).json({ message: 'Неповні дані у запиті' });
  }

  db.query(
    `INSERT INTO registeredProtocols (user_id, instruction_id, protocol_title, protocol_number, protocol_date, protocol_template_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [user_id, instruction_id, protocol_title, protocol_number, `${regDay}.${regMonth + 1}.${regYear}`, protocol_template_id],
    (err, protocolResult) => {
      if (err) {
        console.error('Помилка при додаванні протоколу:', err);
        return res.status(500).json({ message: 'Помилка сервера', error: err });
      }

      const reg_protocol_id = protocolResult.insertId;

      const updatedProtocolNumber = `${protocol_number}${reg_protocol_id}`;

      db.query(
        `UPDATE registeredProtocols
         SET protocol_number = ?
         WHERE id = ?`,
        [updatedProtocolNumber, reg_protocol_id],
        (err2) => {
          if (err2) {
            console.error('Помилка при оновленні protocol_number:', err2);
            return res.status(500).json({ message: 'Помилка сервера', error: err2 });
          }

          protocols.forEach((protocol) => {
            if (protocol.equipmentInfo && protocol.equipmentInfo.length) {
              protocol.equipmentInfo.forEach((item) => {
                const note = item.note || null;

                const eqInfoKey = Object.keys(item).find((k) => k !== "note");
                const eqInfoValue = item[eqInfoKey];

                db.query(
                  `INSERT INTO registeredProtocolsEqInfo (eq_info, eq_info_result, eq_info_note_result, reg_protocol_id)
                   VALUES (?, ?, ?, ?)`,
                  [eqInfoKey, eqInfoValue, note, reg_protocol_id],
                  (err3) => {
                    if (err3) {
                      console.error('Помилка при додаванні equipmentInfo:', err3);
                    }
                  }
                );
              });
            }
            if (protocol.extraInfo && protocol.extraInfo.length) {
              protocol.extraInfo.forEach((item) => {
                const note = item.note || null;
                const exInfoKey = Object.keys(item).find((k) => k !== "note");
                const exInfoValue = item[exInfoKey];

                db.query(
                  `INSERT INTO registeredProtocolsExtraInfo (ex_info, ex_info_result, ex_info_note_result, reg_protocol_id)
                   VALUES (?, ?, ?, ?)`,
                  [exInfoKey, exInfoValue, note, reg_protocol_id],
                  (err4) => {
                    if (err4) console.error('Помилка при додаванні extraInfo:', err4);
                  }
                );
              });
            }
            if (protocol.jobs && protocol.jobs.length) {
              protocol.jobs.forEach((job) => {
                const job_number = job.number;

                db.query(
                  `INSERT INTO registeredProtocolsJobsInfo (job_number, reg_protocol_id)
                   VALUES (?, ?)`,
                  [job_number, reg_protocol_id],
                  (err5, jobResult) => {
                    if (err5) {
                      console.error('Помилка при додаванні job:', err5);
                      return;
                    }

                    const job_id = jobResult.insertId;

                    if (job.jobsDesc && job.jobsDesc.length) {
                      job.jobsDesc.forEach((desc) => {
                        const note = desc.note || null;
                        const descKey = Object.keys(desc).find((k) => k !== "note");
                        const descValue = desc[descKey];

                        db.query(
                          `INSERT INTO registeredProtocolsJobsDescInfo (job_description, job_result, job_note, registered_protocol_job_id)
                           VALUES (?, ?, ?, ?)`,
                          [descKey, descValue, note, job_id],
                          (err6) => {
                            if (err6) console.error('Помилка при додаванні jobDesc:', err6);
                          }
                        );
                      });
                    }
                  }
                );
              });
            }
            if (protocol.measurements && protocol.measurements.length) {
              protocol.measurements.forEach((m) => {
                const { title, type, number, date } = m;

                db.query(
                  `INSERT INTO registeredProtocolsMeasurements (title, type, number, date, reg_protocol_id)
                   VALUES (?, ?, ?, ?, ?)`,
                  [title, type, number, date, reg_protocol_id],
                  (err7) => {
                    if (err7) console.error('Помилка при додаванні measurement:', err7);
                  }
                );
              });
            }
          });

          res.status(201).json({
            message: 'Протокол додано',
            reg_protocol_id,
            protocol_number: updatedProtocolNumber
          });
        }
      );


    }
  );
};

const getRegisteredProtocolsByIds = (req, res) => {
  const { instructionId, protocolTemplateId } = req.query;

  if (!instructionId || !protocolTemplateId) {
    return res.status(400).json({ message: 'Відсутні параметри instructionId або protocolTemplateId' });
  }

  const sql = `
    SELECT *
    FROM registeredProtocols
    WHERE instruction_id = ? AND protocol_template_id = ?
  `;

  db.query(sql, [instructionId, protocolTemplateId], (err, results) => {
    if (err) {
      console.error('Помилка при отриманні протоколів:', err);
      return res.status(500).json({ message: 'Помилка сервера', error: err });
    }

    res.json(results);
  });
}

const getProtocolsByTemplateId = (req, res) => {
  const {id} = req.query;
  if (!id) return res.status(400).json({error: 'Instruction ID is required'});

  const sqlProtocols = `
    SELECT *
    FROM protocolTemplates
    WHERE id = ?
  `;

  db.query(sqlProtocols, [id], (err, protocols) => {
    if (err) return res.status(500).json({error: 'DB error', details: err});
    if (!protocols.length) return res.json([]);

    const protoIds = protocols.map(p => p.id);

    const sqlJobs = `SELECT *
                     FROM protocolTemplateJobs
                     WHERE protocolTemplate_id IN (?)`;
    db.query(sqlJobs, [protoIds], (err, jobs) => {
      if (err) return res.status(500).json({error: 'DB error', details: err});

      const sqlExtra = `SELECT *
                        FROM protocolTemplateExtraInfo
                        WHERE protocolTemplate_id IN (?)`;
      db.query(sqlExtra, [protoIds], (err, extras) => {
        if (err) return res.status(500).json({error: 'DB error', details: err});

        const sqlEquipment = `SELECT *
                              FROM protocolTemplateEquipmentInfo
                              WHERE protocolTemplate_id IN (?)`;
        db.query(sqlEquipment, [protoIds], (err, equipment) => {
          if (err) return res.status(500).json({error: 'DB error', details: err});

          const result = protocols.map(proto => ({
            id: proto.id,
            title: proto.title,
            repairType: proto.repairType,
            measurements: proto.measurements,
            equipmentInfo: equipment.filter(e => e.protocolTemplate_id === proto.id).map(e => e.info),
            extraInfo: extras.filter(e => e.protocolTemplate_id === proto.id).map(e => e.info),
            jobs: jobs
              .filter(j => j.protocolTemplate_id === proto.id)
              .reduce((acc, j) => {
                let job = acc.find(x => x.number === j.jobNumber);
                if (!job) {
                  job = {number: j.jobNumber, jobsDesc: []};
                  acc.push(job);
                }
                job.jobsDesc.push(j.jobDescription);
                return acc;
              }, [])
          }));

          res.json(result);
        });
      });
    });
  });
};

const getRegisteredProtocolByProtocolId = (req, res) => {
  const { protocolId } = req.query;

  if (!protocolId) return res.status(400).json({ message: 'Не передан protocolId' });

  const sqlMain = `SELECT * FROM registeredProtocols WHERE id = ?`;

  db.query(sqlMain, [protocolId], (err, protocolResults) => {
    if (err) return res.status(500).json({ message: 'Помилка при отриманні протоколу', error: err });
    if (!protocolResults.length) return res.status(404).json({ message: 'Протокол не знайдено' });

    const protocol = protocolResults[0];

    db.query(
      `SELECT repairType FROM protocolTemplates WHERE id = ?`,
      [protocol.protocol_template_id],
      (err, templateResults) => {
        if (err) return res.status(500).json({ message: 'Помилка при отриманні шаблону протоколу', error: err });
        if (!templateResults.length) return res.status(404).json({ message: 'Шаблон протоколу не знайдено' });

        const template = templateResults[0];

        // Итоговый объект
        const result = {
          id: protocol.id,
          title: protocol.protocol_title,
          repairType: template.repairType, // берём из шаблона
          equipmentInfo: [],
          extraInfo: [],
          jobs: [],
          measurements: []
        };

    // --- Получаем equipmentInfo ---
    db.query(
      `SELECT eq_info, eq_info_result, eq_info_note_result
       FROM registeredProtocolsEqInfo WHERE reg_protocol_id = ?`,
      [protocolId],
      (err2, eqResults) => {
        if (err2) console.error(err2);
        else {
          result.equipmentInfo = eqResults.map(r => ({
            [r.eq_info]: r.eq_info_result,
            note: r.eq_info_note_result || ''
          }));
        }

        // --- extraInfo ---
        db.query(
          `SELECT ex_info, ex_info_result, ex_info_note_result
           FROM registeredProtocolsExtraInfo WHERE reg_protocol_id = ?`,
          [protocolId],
          (err3, extraResults) => {
            if (err3) console.error(err3);
            else {
              result.extraInfo = extraResults.map(r => ({
                [r.ex_info]: r.ex_info_result,
                note: r.ex_info_note_result || ''
              }));
            }

            // --- jobs + jobsDesc ---
            db.query(
              `SELECT * FROM registeredProtocolsJobsInfo WHERE reg_protocol_id = ?`,
              [protocolId],
              (err4, jobsResults) => {
                if (err4) console.error(err4);
                else {
                  const jobsWithDesc = [];

                  let remaining = jobsResults.length;
                  if (!remaining) finishJobs(); // если нет jobs

                  jobsResults.forEach(job => {
                    db.query(
                      `SELECT job_description, job_result, job_note
                       FROM registeredProtocolsJobsDescInfo
                       WHERE registered_protocol_job_id = ?`,
                      [job.id],
                      (err5, descResults) => {
                        if (err5) console.error(err5);
                        else {
                          jobsWithDesc.push({
                            number: job.job_number,
                            jobsDesc: descResults.map(d => ({
                              [d.job_description]: d.job_result,
                              note: d.job_note || ''
                            }))
                          });
                        }
                        remaining--;
                        if (remaining === 0) finishJobs();
                      }
                    );
                  });

                  function finishJobs() {
                    result.jobs = jobsWithDesc;

                    // --- measurements ---
                    db.query(
                      `SELECT title, type, number, \`date\`
                       FROM registeredProtocolsMeasurements
                       WHERE reg_protocol_id = ?`,
                      [protocolId],
                      (err6, mResults) => {
                        if (err6) console.error(err6);
                        else {
                          result.measurementsArray = mResults.map(m => ({
                            title: m.title,
                            type: m.type,
                            number: m.number,
                            date: m.date
                          }));
                        }
                        // --- отправляем клиенту ---
                        res.status(200).json([result]); // ⬅ оборачиваем в массив, как при отправке!
                      }
                    );
                  }
                }
              }
            );
          }
        );
      }
    );
  });
})};


module.exports = {
  getProtocolsByInstructionId, addRegisteredProtocol, getRegisteredProtocolsByIds, getProtocolsByTemplateId, getRegisteredProtocolByProtocolId
}
