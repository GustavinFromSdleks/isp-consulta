import { useReducer } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { useAuth } from "../contexts/AuthContext";

const estadoInicial = {
  email: "",
  senha: "",
  status: "idle",   // idle | loading | error
  erro: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "CAMPO":
      // Atualiza email ou senha dinamicamente 
      return { ...state, [action.campo]: action.valor, erro: "", status: "idle" };
    case "LOADING":
      return { ...state, status: "loading", erro: "" };
    case "ERRO":
      return { ...state, status: "error", erro: action.payload };
    default:
      return state;
  }
}

function LoginForm() {
  const [state, dispatch] = useReducer(reducer, estadoInicial);
  const { login } = useAuth();

  async function handleLogin() {
    // Validação local
    if (!state.email) {
      dispatch({ type: "ERRO", payload: "Informe o e-mail." });
      return;
    }
    if (!state.senha) {
      dispatch({ type: "ERRO", payload: "Informe a senha." });
      return;
    }

    dispatch({ type: "LOADING" });

    try {
      // Chama a função login do AuthContext que faz a requisição correta para o backend
      await login(state.email, state.senha);
      
      // O AuthContext salva o token e o App.jsx mudará a tela automaticamente.
    } catch (error) {
      // Exibe o erro exato retornado pelo backend (ex: erro de senha, rate limit, etc.)
      dispatch({ 
        type: "ERRO", 
        payload: error.message || "Não foi possível conectar ao servidor." 
      });
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 10,
        p: 4,
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" fontWeight={600} mb={1}>
        ISP — Acesso ao sistema
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Faça login para acessar a Central do Assinante.
      </Typography>

      <TextField
        label="E-mail"
        type="email"
        fullWidth
        value={state.email}
        onChange={(e) =>
          dispatch({ type: "CAMPO", campo: "email", valor: e.target.value })
        }
        disabled={state.status === "loading"}
        sx={{ mb: 2 }}
      />

      <TextField
        label="Senha"
        type="password"
        fullWidth
        value={state.senha}
        onChange={(e) =>
          dispatch({ type: "CAMPO", campo: "senha", valor: e.target.value })
        }
        disabled={state.status === "loading"}
        // Permite fazer login apertando Enter no teclado
        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        sx={{ mb: 2 }}
      />

      {/* Exibe o alerta de erro caso exista */}
      {state.erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {state.erro}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        disabled={state.status === "loading"}
        sx={{ height: 44 }}
      >
        {state.status === "loading" ? (
          <CircularProgress size={22} color="inherit" />
        ) : (
          "Entrar"
        )}
      </Button>
    </Box>
  );
}

export default LoginForm;
