// src/components/AddressCard.jsx
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

// Recebe a prop "endereco" com os dados retornados pela ViaCEP.
// Estrutura do objeto que a ViaCEP retorna:
// {
//   cep, logradouro, complemento, bairro,
//   localidade (cidade), uf, ddd
// }
function AddressCard({ endereco }) {
  if (!endereco) return null;

  // Monta uma linha só se o valor existir — evita linhas em branco
function Linha({ rotulo, valor }) {
  if (!valor) return null;
  return (
    <Box sx={{ 
      display: "flex", 
      justifyContent: "space-between", 
      py: 1, // Aumentei um pouco o espaçamento
      borderBottom: "1px dashed #e0e0e0", // Uma linha pontilhada entre itens
      '&:last-child': { borderBottom: 'none' } // Remove a linha no último item
    }}>
      <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
        {rotulo}
      </Typography>
      <Typography variant="body2">
        {valor}
      </Typography>
    </Box>
  );
}

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          Endereço encontrado
        </Typography>

        <Divider sx={{ mb: 1 }} />

        <Linha rotulo="CEP"        valor={endereco.cep} />
        <Linha rotulo="Logradouro" valor={endereco.logradouro} />
        <Linha rotulo="Bairro"     valor={endereco.bairro} />
        <Linha rotulo="Cidade"     valor={endereco.localidade} />
        <Linha rotulo="Estado"     valor={endereco.uf} />
        <Linha rotulo="DDD"        valor={endereco.ddd} />
      </CardContent>
    </Card>
  );
}

export default AddressCard;