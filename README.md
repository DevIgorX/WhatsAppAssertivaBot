# WhatsApp Bot para Consulta de Clientes

## Descrição

Este projeto visa automatizar o atendimento aos motoristas de uma empresa de transporte durante o processo de entrega. A ideia é criar um bot no WhatsApp que consulte informações de clientes, como telefone e endereço, no sistema Assertiva Soluções, usando o CPF, e retorne essas informações diretamente para o motorista. Esse processo, que atualmente é manual, será automatizado, tornando as entregas mais eficientes e reduzindo o tempo de espera dos motoristas.

## Funcionalidades

- **Consulta de informações via CPF**: O bot integra-se com a API do Assertiva Soluções para buscar dados como telefone e endereço do cliente.
- **Automação de atendimento**: O bot atenderá automaticamente os motoristas via WhatsApp, reduzindo a carga sobre o time de suporte.
- **Validação de CPF**: O sistema valida o CPF fornecido para garantir consultas precisas.
  
## Tecnologias Utilizadas

- **Node.js**: Backend do sistema.
- **API Assertiva Soluções**: Integração para consulta de informações dos clientes.
- **WhatsApp API**: (A ser implementado) Utilização de bibliotecas como `Venom-Bot` para integração com o WhatsApp.

## Como Funciona

1. O motorista envia o CPF do cliente para o bot no WhatsApp.
2. O bot valida o CPF e consulta a API do Assertiva Soluções.
3. As informações de telefone e endereço do cliente são retornadas ao motorista via WhatsApp.

## Instalação e Configuração

1. Clone este repositório:
   ```bash
   git clone https://github.com/DevIgorX/seu-projeto.git
   cd seu-projeto
