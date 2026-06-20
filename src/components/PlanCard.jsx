// src/components/PlanCard.jsx
import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { useAuth } from "../contexts/AuthContext";

function PlanCard({ plano }) {
  const { token } = useAuth();
  const [etapa, setEtapa] = useState("inicial"); // inicial | email | loading | concluido | erro
  const [email, setEmail] = useState("");
  const [erroEmail, setErroEmail] = useState("");

  async function handleRegistrarInteresse() {
    // Validação do e-mail antes de enviar
    if (!email || !email.includes("@")) {
      setErroEmail("Informe um e-mail válido.");
      return;
    }

    setEtapa("loading");

    try {
      // Ajuste seguro para capturar o token da sessão ativa
      const tokenAutorizacao = token || sessionStorage.getItem("isp_token");
      
      // Ajuste seguro para recuperar o CEP legítimo consultado na tela
      const ultimoCep = sessionStorage.getItem("isp_ultimo_cep") || "86300000";

      // CORREÇÃO CRUCIAL: Inclusão do prefixo /api na rota do backend
      const resposta = await fetch("http://localhost:3001/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenAutorizacao}`,
        },
        body: JSON.stringify({
          cep: ultimoCep, // Envia o CEP real capturado da busca
          cidade: plano.cidade,
          plano_id: plano.id,
          email_contato: email,
        }),
      });

      if (!resposta.ok) {
        setEtapa("erro");
        return;
      }

      setEtapa("concluido");

    } catch {
      setEtapa("erro");
    }
  }

  return (
    <Card variant="outlined" sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={500}>
            {plano.nome}
          </Typography>
          <Chip
            label={plano.tecnologia}
            size="small"
            color={plano.tecnologia === "Fibra" ? "primary" : "default"}
          />
        </Box>
        <Typography variant="h5" fontWeight={700} color="primary" mb={0.5}>
          {plano.velocidade}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {plano.preco}/mês
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2, flexDirection: "column", alignItems: "stretch", gap: 1 }}>
        {etapa === "inicial" && (
          <Button variant="contained" fullWidth onClick={() => setEtapa("email")}>
            Tenho interesse
          </Button>
        )}

        {etapa === "email" && (
          <>
            <TextField
              label="Seu e-mail para contato"
              type="email"
              size="small"
              fullWidth
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErroEmail(""); }}
              error={!!erroEmail}
              helperText={erroEmail}
              onKeyDown={(e) => e.key === "Enter" && handleRegistrarInteresse()}
            />
            <Button variant="contained" fullWidth onClick={handleRegistrarInteresse}>
              Confirmar interesse
            </Button>
          </>
        )}

        {etapa === "loading" && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {etapa === "concluido" && (
          <Typography variant="body2" color="success.main" fontWeight={500} textAlign="center">
            ✓ Interesse registrado! Entraremos em contato.
          </Typography>
        )}

        {etapa === "erro" && (
          <Typography variant="body2" color="error" textAlign="center">
            Erro ao registrar. Tente novamente.
          </Typography>
        )}
      </CardActions>
    </Card>
  );
}

export default PlanCard;
