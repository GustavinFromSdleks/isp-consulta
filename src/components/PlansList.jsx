import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import PlanCard from "./PlanCard";
import { usePlans } from "../contexts/PlansContext";

function PlansList() {
 
  const { cidade, planosDisponiveis, temCobertura } = usePlans();

  // Se nenhuma cidade foi consultada ainda, não exibe nada
  if (cidade === "") return null;

  // Cidade consultada mas sem cobertura nos dados mock
  if (!temCobertura) {
    return (
      <Box sx={{ mt: 3 }}>
        <Alert severity="warning">
          Ainda não temos cobertura em <strong>{cidade}</strong>.
          Registre seu interesse e avisaremos quando chegarmos à sua região.
        </Alert>
      </Box>
    );
  }

  // Cidade com cobertura — exibe os planos disponíveis
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" fontWeight={500} mb={2}>
        Planos disponíveis em {cidade}
      </Typography>

      {/* Grid responsivo: 1 coluna em mobile, 2 em tablet, 3 em desktop */}
      <Grid container spacing={2}>
        {planosDisponiveis.map((plano) => (
          <Grid item xs={12} sm={6} md={4} key={plano.id}>
            <PlanCard plano={plano} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PlansList;