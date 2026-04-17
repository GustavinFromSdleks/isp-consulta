// src/App.jsx
import { useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import SearchForm from "./components/SearchForm";
import AddressCard from "./components/AddressCard";

function App() {
  // Guarda o endereço retornado pela ViaCEP
  const [endereco, setEndereco] = useState(null);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" fontWeight={500} mb={3}>
          Consulta de cobertura
        </Typography>

        <SearchForm onEnderecoEncontrado={setEndereco} />

        {/* Aparece automaticamente quando o endereço for encontrado */}
        <AddressCard endereco={endereco} />
      </Box>
    </Container>
  );
}

export default App;