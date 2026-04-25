import Alert from "@mui/material/Alert";
 
// Componente simples de exibição de erro.
// Recebe uma prop "message" e exibe com o Alert do MUI.
// Se não tiver mensagem, não renderiza nada.
function ErrorMessage({ message }) {
  if (!message) return null;
 
  return (
    <Alert severity="error" sx={{ mt: 2 }}>
      {message}
    </Alert>
  );
}
 
export default ErrorMessage;