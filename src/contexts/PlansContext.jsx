import { createContext, useContext, useState } from "react";

// ─────────────────────────────────────────────
//DADOS MOCK
// Chave = nome da cidade (igual ao campo "localidade" da ViaCEP).
// Quando o usuário consultar um CEP, a cidade retornada é usada
// para filtrar quais planos aparecem.
// ─────────────────────────────────────────────
const planosPorCidade = {
  "São Paulo": [
    { id: 1, nome: "Essencial",   velocidade: "100 Mbps", preco: "R$ 79,90",  tecnologia: "Fibra" },
    { id: 2, nome: "Avançado",    velocidade: "300 Mbps", preco: "R$ 99,90",  tecnologia: "Fibra" },
    { id: 3, nome: "Profissional",velocidade: "500 Mbps", preco: "R$ 129,90", tecnologia: "Fibra" },
  ],
  "Rio de Janeiro": [
    { id: 1, nome: "Essencial",   velocidade: "100 Mbps", preco: "R$ 79,90",  tecnologia: "Fibra" },
    { id: 2, nome: "Avançado",    velocidade: "300 Mbps", preco: "R$ 99,90",  tecnologia: "Fibra" },
  ],
  "Curitiba": [
    { id: 1, nome: "Básico",      velocidade: "50 Mbps",  preco: "R$ 59,90",  tecnologia: "Cabo"  },
    { id: 2, nome: "Essencial",   velocidade: "100 Mbps", preco: "R$ 79,90",  tecnologia: "Fibra" },
    { id: 3, nome: "Avançado",    velocidade: "300 Mbps", preco: "R$ 99,90",  tecnologia: "Fibra" },
    { id: 4, nome: "Turbo",       velocidade: "1 Gbps",   preco: "R$ 179,90", tecnologia: "Fibra" },
  ],
  "Belo Horizonte": [
    { id: 1, nome: "Essencial",   velocidade: "100 Mbps", preco: "R$ 79,90",  tecnologia: "Fibra" },
    { id: 2, nome: "Avançado",    velocidade: "300 Mbps", preco: "R$ 99,90",  tecnologia: "Fibra" },
  ],
  "Cornélio Procópio": [
    { id: 1, nome: "Básico",      velocidade: "50 Mbps",  preco: "R$ 59,90",  tecnologia: "Cabo"  },
    { id: 2, nome: "Essencial",   velocidade: "100 Mbps", preco: "R$ 79,90",  tecnologia: "Fibra" },
    { id: 3, nome: "Avançado",    velocidade: "300 Mbps", preco: "R$ 99,90",  tecnologia: "Fibra" },
  ],
};

// ─────────────────────────────────────────────
// OBS: AQUI TENHO A CRIAÇÃO DO CONTEXTO
// createContext() cria o "canal" pelo qual os dados vão fluir.
// O valor padrão (null) só é usado se algum componente tentar
// consumir o contexto fora do Provider — o que nunca deve acontecer.
// ─────────────────────────────────────────────
const PlansContext = createContext(null);

// ─────────────────────────────────────────────
// 
// Preciso disponibilizar para todos os componentes que precisam acessar os dados.
// Deixei no App.jsx para que todos os filhos
// consigam acessar cidade e planos.
// ─────────────────────────────────────────────
export function PlansProvider({ children }) {
  const [cidade, setCidade] = useState("");

  // Filtra os planos com base na cidade atual.
  // Se a cidade não existir nos dados mock, retorna array vazio.
  const planosDisponiveis = planosPorCidade[cidade] ?? [];

  // Feito Verificador -> temCobertura: true se a cidade existe nos dados mock
  const temCobertura = cidade !== "" && planosDisponiveis.length > 0;

  return (
    <PlansContext.Provider
      value={{
        cidade,
        setCidade,       // SearchForm chama isso ao encontrar o endereço
        planosDisponiveis,
        temCobertura,
      }}
    >
      {children}
    </PlansContext.Provider>
  );
}

// 
// HOOK 
// 
export function usePlans() {
  const context = useContext(PlansContext);
  if (!context) {
    throw new Error("usePlans deve ser usado dentro de PlansProvider");
  }
  return context;
}