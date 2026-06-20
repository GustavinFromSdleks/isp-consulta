// src/components/SearchForm.jsx
import { useReducer } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ErrorMessage from "./ErrorMessage";

const estadoInicial = {
  status: "idle",
  cep: "",
  endereco: null,
  erro: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "DIGITAR_CEP":
      return { ...state, cep: action.payload, erro: "", status: "idle" };
    case "INICIAR_BUSCA":
      return { ...state, status: "loading", erro: "", endereco: null };
    case "BUSCA_OK":
      return { ...state, status: "success", endereco: action.payload };
    case "BUSCA_ERRO":
      return { ...state, status: "error", erro: action.payload, endereco: null };
    default:
      return state;
  }
}

function SearchForm({ onEnderecoEncontrado }) {
  const [state, dispatch] = useReducer(reducer, estadoInicial);

  async function handleConsultar() {
    const cepLimpo = state.cep.replace(/\D/g, "");

    if (cepLimpo.length === 0) {
      dispatch({ type: "BUSCA_ERRO", payload: "Digite um CEP para consultar." });
      if (onEnderecoEncontrado) onEnderecoEncontrado(null);
      return;
    }
    if (cepLimpo.length !== 8) {
      dispatch({ type: "BUSCA_ERRO", payload: "CEP inválido. Digite os 8 dígitos completos." });
      if (onEnderecoEncontrado) onEnderecoEncontrado(null);
      return;
    }

    dispatch({ type: "INICIAR_BUSCA" });

    try {
      const tokenSessao = sessionStorage.getItem("isp_token");

      if (!tokenSessao) {
        dispatch({ type: "BUSCA_ERRO", payload: "Sessão inválida. Faça login novamente." });
        if (onEnderecoEncontrado) onEnderecoEncontrado(null);
        return;
      }

      const resposta = await fetch(
        `http://localhost:3001/api/busca?cep=${cepLimpo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${tokenSessao}`,
          },
        }
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        dispatch({ type: "BUSCA_ERRO", payload: dados.erro || "Erro ao consultar CEP." });
        if (onEnderecoEncontrado) onEnderecoEncontrado(null);
        return;
      }

      sessionStorage.setItem("isp_ultimo_cep", cepLimpo);

      // CORREÇÃO: Mesmo se não houver planos, mandamos o endereço para a tela exibir os dados cadastrais
      dispatch({ type: "BUSCA_OK", payload: dados.endereco });

      if (onEnderecoEncontrado) {
        onEnderecoEncontrado(dados);
      }

    } catch (err) {
      dispatch({ type: "BUSCA_ERRO", payload: "Não foi possível conectar ao servidor backend na porta 3001." });
      if (onEnderecoEncontrado) onEnderecoEncontrado(null);
    }
  }

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <TextField
          label="CEP"
          placeholder="00000-000"
          value={state.cep}
          onChange={(e) =>
            dispatch({ type: "DIGITAR_CEP", payload: e.target.value })
          }
          inputProps={{ maxLength: 9 }}
          disabled={state.status === "loading"}
          sx={{ flex: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleConsultar}
          disabled={state.status === "loading"}
          sx={{ height: 56 }}
        >
          {state.status === "loading" ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Consultar"
          )}
        </Button>
      </Box>
      <ErrorMessage message={state.erro} />
    </Box>
  );
}

export default SearchForm;
