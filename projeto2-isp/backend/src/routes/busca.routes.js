const express = require("express");
const axios = require("axios");
const authMiddleware = require("../middlewares/auth.middleware");
const cache = require("../config/cache");
const PlanoModel = require("../models/plano.model");

const router = express.Router();


router.get("/busca", authMiddleware, async (req, res) => {
  const { cep } = req.query;

  if (!cep || cep.length < 8) {
    return res.status(400).json({ erro: "CEP invalido" });
  }

  const cepLimpo = cep.replace(/\D/g, "");
  const cacheKey = "cep_" + cepLimpo;
  const dadosEmCache = cache.get(cacheKey);

  if (dadosEmCache) {
    return res.json(dadosEmCache);
  }

  try {
    
    const url = "https://viacep.com.br" + "/ws/" + cepLimpo + "/json/";
    const response = await axios.get(url);

    const dadosCep = response.data;

    if (dadosCep.erro) {
      return res.status(404).json({ erro: "CEP nao encontrado" });
    }

    const planos = await PlanoModel.findByCidade(dadosCep.localidade);

    const resultadoFinal = {
      endereco: {
        logradouro: dadosCep.logradouro,
        bairro: dadosCep.bairro,
        cidade: dadosCep.localidade,
        uf: dadosCep.uf
      },
      planos: planos
    };

    cache.set(cacheKey, resultadoFinal);
    return res.json(resultadoFinal);

  } catch (error) {
    console.error("Erro na busca:", error.message);
    return res.status(500).json({ erro: "Erro no CEP", detalhe: error.message });
  }
});

module.exports = router;
