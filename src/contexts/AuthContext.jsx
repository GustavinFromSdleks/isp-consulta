import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("isp_token") || null
  );
  const [usuario, setUsuario] = useState(
    () => sessionStorage.getItem("isp_usuario") || null
  );

  // Alterada para async/await para fazer a requisição real ao backend
  async function login(email, senha) {
    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || "Credenciais inválidas");
      }

      const data = await response.json();
      
      // Salva os dados retornados pelo backend (repare nas propriedades exatas do seu controller)
      setToken(data.token);
      setUsuario(email);
      sessionStorage.setItem("isp_token", data.token);
      sessionStorage.setItem("isp_usuario", email);
      
      return true;
    } catch (error) {
      throw error;
    }
  }

  function logout() {
    // Adicionado o prefixo /api na rota de logout
    if (token) {
      fetch("http://localhost:3001/api/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {}); // ignora erro de rede no logout
    }
    setToken(null);
    setUsuario(null);
    sessionStorage.removeItem("isp_token");
    sessionStorage.removeItem("isp_usuario");
  }

  // true se tiver token válido na sessão
  const estaLogado = !!token;

  return (
    <AuthContext.Provider value={{ token, usuario, login, logout, estaLogado }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir o contexto em qualquer componente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
