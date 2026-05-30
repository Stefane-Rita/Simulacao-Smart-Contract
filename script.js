const S = {
  fase: 0,
  vendedor: 10.0,
  comprador: 5.0,
  contrato: 0.0,
  bloco: 19847201,
  txCount: 0,
  produto: false,
  startTime: Date.now()
};

function ts() {
  const e = Math.floor((Date.now() - S.startTime) / 1000);
  const h = String(Math.floor(e/3600)).padStart(2,'0');
  const m = String(Math.floor((e%3600)/60)).padStart(2,'0');
  const sc = String(e%60).padStart(2,'0');
  return `${h}:${m}:${sc}`;
}

function rndHash() {
  return '0x' + Math.random().toString(16).slice(2,6) + '…' + Math.random().toString(16).slice(2,6);
}

function addLog(msg, tipo='') {
  const log = document.getElementById('log');
  const div = document.createElement('div');
  div.className = 'log-entry';
  const cls = tipo==='ok'?'log-ok':tipo==='err'?'log-err':tipo==='info'?'log-info':tipo==='warn'?'log-warn':'log-msg';
  S.bloco++;
  const tx = tipo==='ok'?'TX ✓':tipo==='err'?'TX ✗':tipo==='info'?'INFO':'EVENT';
  div.innerHTML = `<span class="log-ts">${ts()}</span><span class="log-tx ${cls}" style="min-width:52px">${tx}</span><span class="${cls}">${msg}</span>`;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  document.getElementById('st-bloco').textContent = S.bloco.toLocaleString('pt-BR');
  document.getElementById('st-hash').textContent = rndHash();
}

function updateUI() {
  const estados = ['AGUARDANDO','ATIVO','CONCLUÍDO','REEMBOLSADO'];
  const badges = [
    '<span class="badge badge-wait">Pendente</span>',
    '<span class="badge badge-active">Ativo</span>',
    '<span class="badge badge-done">Concluído</span>',
    '<span class="badge badge-refund">Reembolsado</span>'
  ];
  document.getElementById('st-estado').textContent = estados[S.fase];
  document.getElementById('st-badge').innerHTML = badges[S.fase];
  document.getElementById('st-contrato').textContent = S.contrato.toFixed(2).replace('.',',');
  document.getElementById('st-txcount').textContent = S.txCount;
  document.getElementById('bal-vendedor').textContent = S.vendedor.toFixed(2).replace('.',',') + ' ETH';
  document.getElementById('bal-comprador').textContent = S.comprador.toFixed(2).replace('.',',') + ' ETH';
  document.getElementById('bal-contrato').textContent = S.contrato.toFixed(2).replace('.',',') + ' ETH';
  const fill = (S.contrato / 2.5) * 100;
  document.getElementById('lock-fill').style.width = Math.min(fill, 100) + '%';
  document.getElementById('lock-status').textContent = S.contrato > 0 ? 'bloqueado 🔒' : 'desbloqueado';
}

function setStep(n, tipo) {
  const el = document.getElementById('ico-' + n);
  el.className = 'step-num ' + tipo;
  el.textContent = tipo==='done' ? '✓' : n;
  if (n > 1) {
    const step = document.getElementById('step-' + n);
    if (tipo !== 'waiting') step.classList.remove('disabled');
  }
}

function flashCard(id, color) {
  const el = document.getElementById(id);
  el.style.animation = 'none';
  el.offsetHeight;
  el.style.animation = `flash-${color} .8s ease`;
}

function depositar() {
  if (S.fase !== 0) return;
  S.comprador -= 2.5;
  S.contrato = 2.5;
  S.fase = 1;
  S.txCount++;
  addLog(`depositar() · tx: ${rndHash()} · 2,50 ETH enviados pelo comprador`, 'ok');
  addLog(`  require(msg.value == 2,50 ETH) → ✓ passou`, 'info');
  addLog(`  require(estado == AGUARDANDO) → ✓ passou`, 'info');
  addLog(`  estado: AGUARDANDO → ATIVO`, 'warn');
  addLog(`  emit DepositoRealizado(0x9Dc4…A71E, 2,50 ETH)`, 'info');
  document.getElementById('btn-dep').disabled = true;
  document.getElementById('btn-env').disabled = false;
  document.getElementById('step-2').classList.remove('disabled');
  setStep(1, 'done');
  setStep(2, 'current');
  flashCard('card-comprador', 'red');
  flashCard('contract-wallet', 'green');
  updateUI();
}

function enviarProduto() {
  if (S.fase !== 1 || S.produto) return;
  S.produto = true;
  S.txCount++;
  addLog(`📦 Vendedor confirmou despacho do produto [transação off-chain]`, 'warn');
  addLog(`  Rastreio: BR493821750BR · ETA: 7 dias`, 'info');
  addLog(`  Contrato aguardando confirmação do comprador…`);
  document.getElementById('btn-env').disabled = true;
  document.getElementById('btn-conf').disabled = false;
  document.getElementById('btn-reimb').disabled = false;
  document.getElementById('step-3').classList.remove('disabled');
  setStep(2, 'done');
  setStep(3, 'current');
}

function confirmar() {
  if (S.fase !== 1) return;
  const val = S.contrato;
  S.vendedor += val;
  S.contrato = 0;
  S.fase = 2;
  S.txCount++;
  addLog(`confirmarRecebimento() · tx: ${rndHash()}`, 'ok');
  addLog(`  require(msg.sender == comprador) → ✓ passou`, 'info');
  addLog(`  require(estado == ATIVO) → ✓ passou`, 'info');
  addLog(`  estado: ATIVO → CONCLUÍDO`, 'warn');
  addLog(`  vendedor.transfer(${val.toFixed(2).replace('.',',')} ETH) → ✓ executado`, 'ok');
  addLog(`  emit EntregaConfirmada(0x9Dc4…A71E, ${val.toFixed(2).replace('.',',')} ETH)`, 'info');
  addLog(`🎉 Contrato concluído com sucesso! Ambas as partes satisfeitas.`, 'ok');
  document.getElementById('btn-conf').disabled = true;
  document.getElementById('btn-reimb').disabled = true;
  setStep(3, 'done');
  flashCard('card-vendedor', 'green');
  flashCard('contract-wallet', 'red');
  updateUI();
}

function reembolso() {
  if (S.fase !== 1) return;
  const val = S.contrato;
  S.comprador += val;
  S.contrato = 0;
  S.fase = 3;
  S.txCount++;
  addLog(`solicitarReembolso() · tx: ${rndHash()}`, 'err');
  addLog(`  require(msg.sender == comprador) → ✓ passou`, 'info');
  addLog(`  require(estado == ATIVO) → ✓ passou`, 'info');
  addLog(`  require(block.timestamp > dataDeposito + 7 days) → ✓ passou`, 'info');
  addLog(`  estado: ATIVO → REEMBOLSADO`, 'warn');
  addLog(`  comprador.transfer(${val.toFixed(2).replace('.',',')} ETH) → ✓ executado`, 'ok');
  addLog(`  emit ReembolsoExecutado(0x9Dc4…A71E, ${val.toFixed(2).replace('.',',')} ETH)`, 'info');
  document.getElementById('btn-conf').disabled = true;
  document.getElementById('btn-reimb').disabled = true;
  setStep(3, 'done');
  flashCard('card-comprador', 'green');
  flashCard('contract-wallet', 'red');
  updateUI();
}

function resetar() {
  Object.assign(S, {
    fase:0, vendedor:10.0, comprador:5.0, contrato:0.0,
    bloco:19847201, txCount:0, produto:false, startTime:Date.now()
  });
  document.getElementById('log').innerHTML = `
    <div class="log-entry"><span class="log-ts">00:00:00</span><span class="log-tx log-info" style="min-width:52px">DEPLOY</span><span class="log-info">Contrato ContratoCompraVenda deployado em 0xA3f8…7d2C · bloco #19847201</span></div>
    <div class="log-entry"><span class="log-ts">00:00:00</span><span class="log-tx" style="min-width:52px">INFO</span><span class="log-msg">Aguardando depósito do comprador (2,50 ETH)…</span></div>`;
  ['btn-dep','btn-env','btn-conf','btn-reimb'].forEach((id,i) => {
    document.getElementById(id).disabled = i!==0;
  });
  for(let n=1;n<=3;n++){
    setStep(n, n===1?'current':'waiting');
    if(n>1) document.getElementById('step-'+n).classList.add('disabled');
  }
  updateUI();
}

// Bloco counter animation
setInterval(() => {
  if (Math.random() < 0.15) {
    S.bloco++;
    document.getElementById('st-bloco').textContent = S.bloco.toLocaleString('pt-BR');
    document.getElementById('st-hash').textContent = rndHash();
  }
}, 3000);