import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchForm from "./components/SearchForm";
import AddressCard from "./components/AddressCard";
import PlansList from "./components/PlansList";
import { usePlans } from "./contexts/PlansContext";

function App() {
  const [endereco, setEndereco] = useState(null);
  const { setCidade } = usePlans();

  function handleEnderecoEncontrado(dados) {
    setEndereco(dados);
    
    setCidade(dados.localidade);
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={500} mb={3}>
          Consulta de cobertura
        </Typography>

        <SearchForm onEnderecoEncontrado={handleEnderecoEncontrado} />
        <AddressCard endereco={endereco} />
        <PlansList />
      </Box>
    </Container>
  );
}

export default App;