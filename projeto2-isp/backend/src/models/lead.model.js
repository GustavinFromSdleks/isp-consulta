const pool = require('../config/database');

const LeadModel = {
  create: async (cep, cidade, plano_id, email_contato) => {
    const result = await pool.query(
      'INSERT INTO leads (cep, cidade, plano_id, email_contato) VALUES ($1, $2, $3, $4) RETURNING *',
      [cep, cidade, plano_id, email_contato]
    );
    return result.rows[0];
  }
};

module.exports = LeadModel;
