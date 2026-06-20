const bcrypt = require('bcryptjs');
const pool = require('./config/database');

async function seed() {
  const email = 'admin@isp.com';
  const senhaPura = '123456';
  
  try {
    const senhaHash = await bcrypt.hash(senhaPura, 10);
    
    // verificador, e se já existe não vai duplicar  ---- SEM QUEBRAR DESSA VEZ
    const check = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    
    if (check.rows.length === 0) {
      await pool.query('INSERT INTO usuarios (email, senha_hash) VALUES ($1, $2)', [email, senhaHash]);
      console.log('✅ Usuário de teste (admin@isp.com) criado com sucesso!');
    } else {
      console.log('⚠ O usuário admin@isp.com já existe no banco.');
    }
  } catch (err) {
    console.error('❌ Erro ao rodar script de sementes:', err.message);
  } finally {
    pool.end();
  }
}

seed();
