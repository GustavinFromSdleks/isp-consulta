// src/components/SearchForm.jsx
import { useReducer } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import ErrorMessage from "./ErrorMessage";
 
// ─────────────────────────────────────────────
// 1. ESTADO INICIAL
// Tudo que o formulário precisa saber está aqui.
// ─────────────────────────────────────────────
const estadoInicial = {
  status: "idle",    // idle | loading | success | error
  cep: "",           // valor digitado no campo
  endereco: null,    // dados retornados pela ViaCEP
  erro: "",          // mensagem de erro a exibir
};
 
// ─────────────────────────────────────────────
// 2. REDUCER
// Recebe o estado atual + uma action, e retorna o novo estado.
// Cada "case" representa uma coisa que pode acontecer.
// ─────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case "DIGITAR_CEP":
      // Usuário está digitando — só atualiza o campo, limpa erros
      return { ...state, cep: action.payload, erro: "", status: "idle" };
 
    case "INICIAR_BUSCA":
      // Clicou em consultar e o CEP é válido — ativa o loading
      return { ...state, status: "loading", erro: "", endereco: null };
 
    case "BUSCA_OK":
      // ViaCEP respondeu com sucesso
      return { ...state, status: "success", endereco: action.payload };
 
    case "BUSCA_ERRO":
      // Algo deu errado — validação ou resposta da API
      return { ...state, status: "error", erro: action.payload, endereco: null };
 
    default:
      return state;
  }
}
 
// ─────────────────────────────────────────────
// 3. COMPONENTE
// ─────────────────────────────────────────────
function SearchForm({ onEnderecoEncontrado }) {
  // useReducer retorna: [estado atual, função dispatch]
  // dispatch(action) → chama o reducer → atualiza o estado → React re-renderiza
  const [state, dispatch] = useReducer(reducer, estadoInicial);
 
  // ── Validação e busca ──────────────────────
  async function handleConsultar() {
    const cepLimpo = state.cep.replace(/\D/g, ""); // remove tudo que não for número
 
    // VALIDAÇÃO ANTES DO ENVIO (critério do projeto)
    if (cepLimpo.length === 0) {
      dispatch({ type: "BUSCA_ERRO", payload: "Digite um CEP para consultar." });
      return;
    }
    if (cepLimpo.length !== 8) {
      dispatch({ type: "BUSCA_ERRO", payload: "CEP inválido. Digite os 8 dígitos completos." });
      return;
    }
 
    // Passou na validação — inicia a busca
    dispatch({ type: "INICIAR_BUSCA" });
 
    try {
      const resposta = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
 
      // VALIDAÇÃO DEPOIS DO ENVIO (critério do projeto)
      if (!resposta.ok) {
        dispatch({ type: "BUSCA_ERRO", payload: "Não foi possível conectar ao serviço de CEP. Tente novamente." });
        return;
      }
 
      const dados = await resposta.json();
 
      // ViaCEP retorna { erro: true } quando o CEP não existe
      if (dados.erro) {
        dispatch({ type: "BUSCA_ERRO", payload: "CEP não encontrado. Verifique e tente novamente." });
        return;
      }
 
      // Tudo certo — atualiza o estado com os dados do endereço
      dispatch({ type: "BUSCA_OK", payload: dados });
 
      // Avisa o componente pai (App.jsx) que encontrou um endereço.
      // No dia 4 você vai usar isso para atualizar o PlansContext com a cidade.
      if (onEnderecoEncontrado) {
        onEnderecoEncontrado(dados);
      }
 
    } catch (erro) {
      // Erro de rede — sem internet, timeout, etc.
      dispatch({ type: "BUSCA_ERRO", payload: "Erro de conexão. Verifique sua internet e tente novamente." });
    }
  }
 
  // ── Renderização ───────────────────────────
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
 
      {/* Exibe erro se houver — componente que você criou acima */}
      <ErrorMessage message={state.erro} />
    </Box>
  );
}
 
export default SearchForm;