const db = require("../config/dbConfig");

const getProtocolsByInstructionId = (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Instruction ID is required' });

  const sqlProtocols = `
    SELECT *
    FROM protocolTemplates
    WHERE instruction_id = ?
  `;

  db.query(sqlProtocols, [id], (err, protocols) => {
    if (err) return res.status(500).json({ error: 'DB error', details: err });
    if (!protocols.length) return res.json([]);

    const protoIds = protocols.map(p => p.id);

    const sqlJobs = `SELECT * FROM protocolTemplateJobs WHERE protocolTemplate_id IN (?) ORDER BY jobNumber`;
    db.query(sqlJobs, [protoIds], (err, jobs) => {
      if (err) return res.status(500).json({ error: 'DB error', details: err });

      const sqlExtra = `SELECT * FROM protocolTemplateExtraInfo WHERE protocolTemplate_id IN (?)`;
      db.query(sqlExtra, [protoIds], (err, extras) => {
        if (err) return res.status(500).json({ error: 'DB error', details: err });

        const sqlEquipment = `SELECT * FROM protocolTemplateEquipmentInfo WHERE protocolTemplate_id IN (?)`;
        db.query(sqlEquipment, [protoIds], (err, equipment) => {
          if (err) return res.status(500).json({ error: 'DB error', details: err });

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
                  job = { number: j.jobNumber, jobsDesc: [] };
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

module.exports = {getProtocolsByInstructionId}
