const express = require('express');
const cors = require('cors');
const server = express();

// Configuração do CORS
server.use(cors());

// Configuração para permitir o uso do JSON no corpo das requisições
server.use(express.json());

// Dados simulados - será substituído por um banco de dados real em produção
const contas = require('./contas.json').contas;

// Contador para gerar IDs únicos para as contas
let contadorIds = contas.length;

// Rota para obter todas as contas
server.get('/contas', (req, res) => {
  return res.json(contas);
});

// Rota para adicionar uma nova conta
server.post('/contas', (req, res) => {
  const novaConta = req.body;

  // Incrementar o contador e atribuir o ID único à nova conta
  novaConta.id = ++contadorIds;

  contas.push(novaConta);
  return res.status(201).json(novaConta);
});

// Rota para apagar uma conta pelo ID
server.delete('/contas/:id', (req, res) => {
  const idConta = parseInt(req.params.id);

  // Verificar se o id é um número válido
  if (isNaN(idConta)) {
    return res.status(400).json({ error: 'ID de conta inválido' });
  }

  // Procurar a conta pelo ID
  const indexConta = contas.findIndex(conta => conta.id === idConta);

  // Verificar se a conta foi encontrada
  if (indexConta === -1) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }

  // Remover a conta do array de contas
  contas.splice(indexConta, 1);

  return res.status(200).json({ message: 'Conta removida com sucesso' });
});

// Rota para atualizar uma conta pelo ID
server.put('/contas/:id', (req, res) => {
  const idConta = parseInt(req.params.id);
  const novaConta = req.body;

  // Verificar se o id é um número válido
  if (isNaN(idConta)) {
    return res.status(400).json({ error: 'ID de conta inválido' });
  }

  // Procurar a conta pelo ID
  const indexConta = contas.findIndex(conta => conta.id === idConta);

  // Verificar se a conta foi encontrada
  if (indexConta === -1) {
    return res.status(404).json({ error: 'Conta não encontrada' });
  }

  // Atualizar a conta no array de contas
  contas[indexConta] = { ...contas[indexConta], ...novaConta };

  return res.status(200).json(contas[indexConta]);
});

server.listen(5000, () => {
  console.log('Servidor está ligado! Acesse http://localhost:5000');
});
