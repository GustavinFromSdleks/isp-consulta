const express = require('express');
const cors = require('cors'); // 1. IMPORTAÇÃO DO CORS
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Inicializa o banco de dados
require('./config/database');

// Importa as Rotas
const authRoutes = require('./routes/auth.routes');
const buscaRoutes = require('./routes/busca.routes');
const leadsRoutes = require('./routes/leads.routes');

const app = express();

// 2. ATIVAÇÃO DO CORS (Deve vir antes de qualquer rota ou middleware de segurança)
app.use(cors()); 

// Middlewares Globais
//app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());

// Limitador de requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { erro: 'Muitas requisições vindas deste IP, tente novamente mais tarde.' }
});
app.use('/api/', limiter);

// Ativação das Rotas no Servidor
app.use('/api', authRoutes);
app.use('/api', buscaRoutes);
app.use('/api', leadsRoutes);

// Tratamento de 404
app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`📡 Servidor rodando na porta ${PORT}`);
});

module.exports = app;
