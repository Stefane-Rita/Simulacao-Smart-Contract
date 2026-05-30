# Simulação de Smart Contract

Este projeto é uma demonstração prática para a disciplina de Fundamentos de Sistemas de Informação (SI). Ele simula um smart contract de compra e venda na blockchain, com passos claros, nomes intuitivos e um visual interativo para facilitar a explicação em um seminário.

## Objetivo

- Mostrar como um smart contract funciona na prática
- Demonstrar o fluxo de um contrato de custódia (escrow) entre comprador e vendedor
- Explicar a lógica de depósito, envio do produto, confirmação de recebimento e reembolso
- Usar uma interface visual para tornar a demonstração mais didática e próxima de um contrato real

## O que está sendo simulado

O projeto simula um contrato de compra e venda com as seguintes etapas:

1. `depositar()`
   - O comprador envia o valor combinado para o contrato
   - O valor fica bloqueado na custódia do smart contract
   - O vendedor não pode retirar o valor até a confirmação

2. Envio do produto (etapa off-chain)
   - O vendedor despacha o produto
   - A simulação mostra o status e o comprador pode confirmar o recebimento

3. `confirmarRecebimento()`
   - Se o produto chegou corretamente, o comprador confirma
   - O contrato libera o valor para o vendedor
   - O estado muda para `CONCLUÍDO`

4. `solicitarReembolso()`
   - Se o prazo de entrega expirar ou houver problema, o comprador pode pedir reembolso
   - O valor volta para a carteira do comprador
   - O estado muda para `REEMBOLSADO`

## Arquivos principais

- `smart_contract_demo_vercel.html` — interface web da simulação
- `style.css` — estilos visuais e estética da aplicação
- `script.js` — lógica do contrato, estados, transições e registro de eventos

## Como usar

1. Abra o arquivo `smart_contract_demo_vercel.html` no navegador.
2. Observe os cartões de status e os saldos das carteiras do comprador e do vendedor.
3. Clique em `depositar()` para simular o envio de 2,50 ETH para o contrato.
4. Em seguida, clique em `Simular despacho` para validar a etapa de envio off-chain.
5. Depois, use `confirmarRecebimento()` para liberar o pagamento ao vendedor ou `solicitarReembolso()` para devolver o valor ao comprador.
6. Use o botão `Reiniciar simulação` para voltar ao estado inicial.

## Pontos de aprendizagem

- Diferença entre off-chain e on-chain: o envio do produto é simulado como uma ação externa, enquanto o depósito e a liberação de fundos são registrados como transações do contrato.
- Regras do contrato: o smart contract só permite ações válidas quando o estado estiver correto.
- Transparência e imutabilidade: o log mostra operações que se comportam como eventos e transações de blockchain.
- Contrato de custódia (escrow): o valor fica bloqueado até que o comprador confirme o recebimento ou peça reembolso.

## Conteúdo de demonstração

O simulado contém:

- Endereço do contrato fictício
- Contador de bloco e hash de transação simulados
- Carteiras do vendedor e comprador com saldos em ETH
- Visual de custódia do contrato
- Passos de execução com botões para cada função
- Log de eventos com registros de validação e transferências

## Nota

Esta aplicação é uma simulação educativa. Não há deploy real na blockchain e o endereço exibido é fictício. A ideia é apresentar o comportamento lógico de um smart contract de forma visual e acessível.
