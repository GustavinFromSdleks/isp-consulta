const pool = require('../config/database');

const PlanoModel = {
  findByCidade: async (cidade) => {
    const result = await pool.query('SELECT * FROM planos WHERE cidade = $1', [cidade]);
    return result.rows;
  }
};

module.exports = PlanoModel;
