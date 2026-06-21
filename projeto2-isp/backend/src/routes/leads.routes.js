const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
const LeadModel = require('../models/lead.model');

const router = express.Router();

router.post(
  '/leads',
  [
    body('cep').notEmpty().withMessage('O CEP é obrigatório'),
    body('email_contato').isEmail().withMessage('E-mail de contato inválido'),
    body('plano_id').isInt().withMessage('ID do plano precisa ser um número inteiro')
  ],
  async (req, res) => {
    const erros = validationResult(req);
    if (!erros.isEmpty()) {
      return res.status(400).json({ erros: erros.array() });
    }

    const { cep, plano_id, email_contato } = req.body;
    const cepLimpo = cep.replace(/\D/g, '');

    try {
      
      const url = "https://viacep.com.br" + "/ws/" + cepLimpo + "/json/";
      const response = await axios.get(url);
      const dadosCep = response.data;
      
      const cidade = dadosCep.erro ? 'Não identificada' : dadosCep.localidade;

      const novoLead = await LeadModel.create(cepLimpo, cidade, plano_id, email_contato);
      return res.status(201).json(novoLead[0]); // Retorna o lead inserido
    } catch (error) {
      console.error('❌ Erro ao inserir lead:', error.message);
      return res.status(500).json({ erro: 'Erro ao registrar lead', detalhe: error.message });
    }
  }
);

module.exports = router;
