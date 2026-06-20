import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import SearchForm from "./components/SearchForm";
import AddressCard from "./components/AddressCard";
import PlanCard from "./components/PlanCard";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const [endereco, setEndereco] = useState(null);
  const [listaPlanos, setListaPlanos] = useState([]);
  const { estaLogado, logout, usuario } = useAuth();

  function handleEnderecoEncontrado(dados) {
    // CORREÇÃO: Só zera tudo se a requisição falhar de verdade (erro de rede ou token inválido)
    if (!dados || !dados.endereco) {
      setEndereco(null);
      setListaPlanos([]);
      return;
    }

    // Se a busca trouxe um endereço válido (mesmo sem planos), nós injetamos na tela
    setEndereco(dados.endereco);
    
    // Atualiza a lista com os planos reais ou deixa o array vazio para o aviso rodar
    if (dados.planos && dados.planos.length > 0) {
      setListaPlanos(dados.planos);
    } else {
      setListaPlanos([]);
    }
  }

  if (!estaLogado) {
    return <LoginForm />;
  }

  return (
    <>
      <AppBar position="static" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight={600}>
            ISP — Central do Assinante
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {usuario}
            </Typography>
            <Button color="inherit" variant="outlined" size="small" onClick={logout}>
              Sair
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mt: 5, mb: 6 }}>
          <Typography variant="body1" color="text.secondary" mb={3}>
            Vai mudar de endereco ou quer conhecer novos planos? digite seu CEP para verificar a disponibilidade de planos na sua região.
          </Typography>
          
          <SearchForm onEnderecoEncontrado={handleEnderecoEncontrado} />
          
          {endereco && (
            <Box sx={{ mt: 3 }}>
              {/* Ajustamos o objeto para o AddressCard não quebrar com a falta de 'localidade' */}
              <AddressCard endereco={{
                ...endereco,
                localidade: endereco.cidade // Duplica cidade em localidade por segurança
              }} />
              
              <Typography variant="h5" fontWeight={600} sx={{ mt: 4, mb: 3 }}>
                Planos disponíveis para {endereco.cidade}
              </Typography>
              
              {listaPlanos.length === 0 ? (
                <Typography variant="body1" color="warning.main" fontWeight={500} sx={{ mt: 1 }}>
                  No momento ainda nao temos planos disponíveis para esta cidade.
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {listaPlanos.map((plano) => (
                    <Grid item xs={12} sm={6} key={plano.id}>
                      <PlanCard plano={plano} />
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
