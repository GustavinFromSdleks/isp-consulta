const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  try {
    const usuario = await UserModel.findByEmail(email);
    if (!usuario) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ erro: 'Erro interno no servidor' });
  }
});

router.post('/logout', (req, res) => {
  
  return res.json({ mensagem: 'Logout efetuado com sucesso (remova o token do cliente)' });
});

module.exports = router;
