const pool = require('../config/database');

const UserModel = {
  findByEmail: async (email) => {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    return result.rows[0];
  },
  create: async (email, senhaHash) => {
    const result = await pool.query(
      'INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2) RETURNING id, email, criado_em',
      [email, senhaHash]
    );
    return result.rows[0];
  }
};

module.exports = UserModel;
