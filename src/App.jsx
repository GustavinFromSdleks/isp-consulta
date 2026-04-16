// src/App.jsx
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchForm from "./components/SearchForm";

function App() {
  function handleEnderecoEncontrado(dados) {
    // Por enquanto só loga no console — no dia 4 você conecta ao PlansContext
    console.log("Endereço encontrado:", dados);
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={500} mb={3}>
          Consulta de cobertura
        </Typography>
        <SearchForm onEnderecoEncontrado={handleEnderecoEncontrado} />
      </Box>
    </Container>
  );
}

export default App;