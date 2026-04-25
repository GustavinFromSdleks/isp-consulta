import { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
 
// Recebe um objeto "plano" com: id, nome, velocidade, preco, tecnologia
function PlanCard({ plano }) {
  // Controla o estado do botão de interesse localmente neste card
  const [interesseRegistrado, setInteresseRegistrado] = useState(false);
 
  function handleInteresse() {
    setInteresseRegistrado(true);
    // No futuro, aqui posso fazer uma chamada ao backend Python -- ideia aplicacao trabalho/tcc
    // para registrar o lead de venda
    console.log("Interesse registrado no plano:", plano.nome);
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
 
      <CardActions sx={{ px: 2, pb: 2 }}>
        {interesseRegistrado ? (
          // Feedback visual após clicar — botão some, mensagem aparece -- pretendo aprimorar
          <Typography variant="body2" color="success.main" fontWeight={500}>
            Interesse registrado! Entraremos em contato.
          </Typography>
        ) : (
          <Button
            variant="contained"
            fullWidth
            onClick={handleInteresse}
          >
            Tenho interesse
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
 
export default PlanCard;