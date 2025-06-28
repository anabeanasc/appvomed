// VOMED - Front-end funcional (JS sem frameworks)
// Paleta: Roxo, Azul claro, Preto, Branco

// Utilidades
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

const STORAGE_KEY = "vomed.local";
const defaultUser = { nome: "", numero: "" };
const defaultConfig = { fonte: "normal", tema: "claro", lembreteSonoro: false };

function lerStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
    usuario: defaultUser,
    medicamentos: [],
    historico: {},
    config: defaultConfig
  };
}
function salvarStorage(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
function limparStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function getSaudacao() {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
}

// Navegação
let telaAtual = "boasvindas";
function navegar(tela, params = {}) {
  telaAtual = tela;
  renderTela(tela, params);
}

// Ícones SVG acessíveis
const icones = {
  "mais": `<svg class="icone" viewBox="0 0 24 24"><path fill="currentColor" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z"/></svg>`,
  "calendario": `<svg class="icone" viewBox="0 0 24 24"><path fill="currentColor" d="M19,4H18V2H16V4H8V2H6V4H5C3.89,4 3,4.89 3,6V20C3,21.11 3.89,22 5,22H19C20.11,22 21,21.11 21,20V6C21,4.89 20.11,4 19,4M19,20H5V10H19V20M19,8H5V6H19V8Z"/></svg>`,
  "config": `<svg class="icone" viewBox="0 0 24 24"><path fill="currentColor" d="M12,8A4,4 0 1,0 16,12A4,4 0 0,0 12,8M4.22,10.22L2,12V14H4.22C4.4,14.82 4.8,15.59 5.36,16.22L4.22,17.36L5.64,18.78L6.78,17.64C7.41,18.2 8.18,18.6 9,18.78V21H11V18.78C11.82,18.6 12.59,18.2 13.22,17.64L14.36,18.78L15.78,17.36L14.64,16.22C15.2,15.59 15.6,14.82 15.78,14H18V12H15.78C15.6,11.18 15.2,10.41 14.64,9.78L15.78,8.64L14.36,7.22L13.22,8.36C12.59,7.8 11.82,7.4 11,7.22V5H9V7.22C8.18,7.4 7.41,7.8 6.78,8.36L5.64,7.22L4.22,8.64L5.36,9.78C4.8,10.41 4.4,11.18 4.22,12Z"/></svg>`,
  "ajuda": `<svg class="icone" viewBox="0 0 24 24"><path fill="currentColor" d="M10.5,17H13.5V14.5H10.5V17M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,7A3,3 0 0,1 15,10A3,3 0 0,1 13,12.74V13.5H11V12A1,1 0 0,1 12,11A1,1 0 0,1 11,10H13A1,1 0 0,1 12,9A1,1 0 0,1 11,8H13A1,1 0 0,1 12,7Z"/></svg>`
};

// Telas
function renderTela(tela, params = {}) {
  const data = lerStorage();
  let html = "";
  switch (tela) {
    case "boasvindas":
      html = `
        <div class="tela" id="tela-boasvindas">
          <div class="titulo" style="font-size:2.7rem;">VOMED</div>
          <div class="slogan">Por quem você ama</div>
          <button class="botao" id="btn-entrar">Entrar</button>
        </div>`;
      break;
    case "login":
      html = `
        <form class="tela" id="tela-login">
          <div class="titulo">Bem-vindo!</div>
          <div style="width:100%;max-width:260px;text-align:center;color:#6c3cc6;margin-bottom:1.3em;">Faça login ou cadastre-se para continuar:</div>
          <input type="text" id="input-nome" placeholder="Nome completo" maxlength="40" autocomplete="name" required value="${data.usuario.nome || ""}">
          <input type="tel" id="input-numero" placeholder="Celular (apenas números)" maxlength="15" autocomplete="tel" required value="${data.usuario.numero || ""}">
          <button class="botao" type="submit">Entrar</button>
        </form>`;
      break;
    case "home":
      html = `
        <div class="tela" id="tela-home">
          <div class="cabecalho">
            <span class="saudar">${getSaudacao()}, ${primeiroNome(data.usuario.nome)}!</span>
            <button class="botao-icone" onclick="navegar('config')">${icones.config}<span style="font-size:0.8em">Configurações</span></button>
          </div>
          <div class="resumo-medicamentos">
            <h3>Medicamentos de hoje</h3>
            <ul>
              ${medicamentosHoje(data).length === 0 ? `<li>Nenhum medicamento programado</li>` : medicamentosHoje(data).map(m=>`
                <li>
                  <span style="font-size:1.2em">💊</span>
                  <b>${m.nome}</b> &bull; ${m.horario}
                </li>
              `).join("")}
            </ul>
          </div>
          <div class="botoes-linha">
            <button class="botao" style="gap:0.5em;" onclick="navegar('cadastroMedicamento')">${icones.mais}Novo medicamento</button>
            <button class="botao secundario" onclick="navegar('listaMedicamentos')">Ver todos</button>
          </div>
          <div class="botoes-linha" style="margin-top:2em;">
            <button class="botao-icone" onclick="navegar('historico')">${icones.calendario}<span>Histórico</span></button>
            <button class="botao-icone" onclick="navegar('ajuda')">${icones.ajuda}<span>Ajuda</span></button>
          </div>
        </div>`;
      break;
    case "listaMedicamentos":
      html = `
        <div class="tela" id="tela-lista-medicamentos">
          <div class="cabecalho">
            <span class="titulo" style="font-size:1.3em;">Medicamentos</span>
            <button class="botao-icone" onclick="navegar('home')" title="Voltar"><span style="font-size:1.5em;">⬅️</span><span style="font-size:0.8em;">Voltar</span></button>
          </div>
          ${data.medicamentos.length === 0 ?
            `<div style="color:#6c3cc6;text-align:center;">Nenhum medicamento cadastrado.</div>` :
            data.medicamentos.map((m,i)=>`
            <div class="card-medicamento">
              <span class="nome">💊 ${m.nome}</span>
              <span class="dose">Dose: ${m.dose}</span>
              <span class="horario">Horário: ${m.horario}</span>
              <span class="frequencia">Frequência: ${legendaFrequencia(m.frequencia)}</span>
              <button class="botao mini secundario" onclick="excluirMedicamento(${i})">Excluir</button>
            </div>
            `).join("")}
          <button class="botao" style="margin-top:1.2em;" onclick="navegar('cadastroMedicamento')">${icones.mais}Novo medicamento</button>
        </div>`;
      break;
    case "cadastroMedicamento":
      html = `
        <form class="tela" id="tela-cadastro-medicamento">
          <div class="cabecalho">
            <span class="titulo" style="font-size:1.3em;">Novo medicamento</span>
            <button class="botao-icone" onclick="navegar('home');return false;" title="Voltar"><span style="font-size:1.5em;">⬅️</span><span style="font-size:0.8em;">Voltar</span></button>
          </div>
          <input type="text" id="med-nome" placeholder="Nome do medicamento" maxlength="40" required>
          <input type="text" id="med-dose" placeholder="Dose (ex: 1 comprimido)" maxlength="30" required>
          <input type="time" id="med-horario" required>
          <select id="med-frequencia" required>
            <option value="" disabled selected>Frequência</option>
            <option value="diario">Diário</option>
            <option value="dias_alternados">Dias alternados</option>
            <option value="semanal">Semanal</option>
          </select>
          <button class="botao" type="submit">${icones.mais}Salvar</button>
        </form>`;
      break;
    case "historico":
      html = renderHistoricoTela(data);
      break;
    case "config":
      html = `
        <div class="tela" id="tela-config">
          <div class="cabecalho">
            <span class="titulo" style="font-size:1.3em;">Configurações</span>
            <button class="botao-icone" onclick="navegar('home')" title="Voltar"><span style="font-size:1.5em;">⬅️</span><span style="font-size:0.8em;">Voltar</span></button>
          </div>
          <div class="config-opcoes">
            <div class="config-opcao">
              <span>Tamanho da fonte</span>
              <select id="config-fonte">
                <option value="normal"${data.config.fonte==="normal"?" selected":""}>Normal</option>
                <option value="grande"${data.config.fonte==="grande"?" selected":""}>Grande</option>
              </select>
            </div>
            <div class="config-opcao">
              <span>Modo escuro</span>
              <label class="switch"><input id="config-tema" type="checkbox"${data.config.tema==="escuro"?" checked":""}><span class="slider"></span></label>
            </div>
            <div class="config-opcao">
              <span>Lembretes sonoros</span>
              <label class="switch"><input id="config-lembrete-sonoro" type="checkbox"${data.config.lembreteSonoro?" checked":""}><span class="slider"></span></label>
            </div>
          </div>
          <button class="botao mini secundario" onclick="deslogar()">Sair</button>
        </div>`;
      break;
    case "ajuda":
      html = `
        <div class="tela" id="tela-ajuda">
          <div class="cabecalho">
            <span class="titulo" style="font-size:1.3em;">Ajuda</span>
            <button class="botao-icone" onclick="navegar('home')" title="Voltar"><span style="font-size:1.5em;">⬅️</span><span style="font-size:0.8em;">Voltar</span></button>
          </div>
          <div class="faq">
            <details class="faq-pergunta" open>
              <summary>Como cadastrar um novo medicamento?</summary>
              <p>Clique em "+ Novo medicamento" na tela inicial e preencha as informações.</p>
            </details>
            <details class="faq-pergunta">
              <summary>O que acontece se eu esquecer de marcar como "tomado"?</summary>
              <p>O medicamento ficará como "não tomado" no seu histórico e você poderá ajustar manualmente se necessário.</p>
            </details>
            <details class="faq-pergunta">
              <summary>Como ativar/desativar lembretes sonoros?</summary>
              <p>Acesse "Configurações" e ative ou desative a opção de lembretes sonoros.</p>
            </details>
            <details class="faq-pergunta">
              <summary>Como alterar o tamanho da fonte?</summary>
              <p>Vá em "Configurações" e escolha o tamanho de fonte desejado.</p>
            </details>
          </div>
        </div>`;
      break;
    default:
      html = `<div class="tela"><div style="color:#be4a4a;">Tela não encontrada.</div></div>`;
  }
  $("#app").innerHTML = html;

  // Adicionando eventos
  if (tela === "boasvindas") {
    $("#btn-entrar").onclick = () => navegar("login");
  }
  if (tela === "login") {
    $("#tela-login").onsubmit = evt => {
      evt.preventDefault();
      const nome = $("#input-nome").value.trim();
      const numero = $("#input-numero").value.trim();
      if (!nome || !numero) return;
      data.usuario = { nome, numero };
      salvarStorage(data);
      navegar("home");
    };
  }
  if (tela === "cadastroMedicamento") {
    $("#tela-cadastro-medicamento").onsubmit = evt => {
      evt.preventDefault();
      const nome = $("#med-nome").value.trim();
      const dose = $("#med-dose").value.trim();
      const horario = $("#med-horario").value;
      const frequencia = $("#med-frequencia").value;
      if (!nome || !dose || !horario || !frequencia) return;
      data.medicamentos.push({ nome, dose, horario, frequencia });
      salvarStorage(data);
      navegar("listaMedicamentos");
    };
  }
  if (tela === "config") {
    $("#config-fonte").onchange = e => {
      data.config.fonte = e.target.value;
      salvarStorage(data);
      aplicarFonte(data.config.fonte);
    };
    $("#config-tema").onchange = e => {
      data.config.tema = e.target.checked ? "escuro" : "claro";
      salvarStorage(data);
      aplicarTema(data.config.tema);
    };
    $("#config-lembrete-sonoro").onchange = e => {
      data.config.lembreteSonoro = e.target.checked;
      salvarStorage(data);
    };
  }
}

// Utilidades de dados
function primeiroNome(nome) {
  return nome.split(" ")[0] || "";
}
function legendaFrequencia(f) {
  if (f==="diario") return "Diário";
  if (f==="dias_alternados") return "Dias alternados";
  if (f==="semanal") return "Semanal";
  return "";
}
function medicamentosHoje(data) {
  const hoje = new Date();
  return data.medicamentos.filter(med => {
    if (med.frequencia === "diario") return true;
    if (med.frequencia === "dias_alternados") {
      // Dias alternados: base = data de cadastro (aproximação: 1o med cadastrado = dia par)
      const primeiroDia = 1; // sempre alternando por paridade do dia do mês
      return (hoje.getDate() % 2) === (primeiroDia % 2);
    }
    if (med.frequencia === "semanal") {
      // semanal: só no mesmo dia da semana em que foi cadastrado (aproximação: domingo)
      return hoje.getDay() === 0;
    }
    return false;
  });
}

// Histórico/adherence
function renderHistoricoTela(data) {
  const dias = diasDoMesAtual();
  const historico = data.historico || {};
  let total = 0, feitos = 0;
  dias.forEach(dia => {
    const key = dataKeyDia(dia);
    if (historico[key]) {
      total++;
      if (historico[key].tomado) feitos++;
    }
  });
  const adesao = total ? Math.round(100 * feitos / total) : 100;
  return `
    <div class="tela" id="tela-historico">
      <div class="cabecalho">
        <span class="titulo" style="font-size:1.3em;">Histórico de Medicação</span>
        <button class="botao-icone" onclick="navegar('home')" title="Voltar"><span style="font-size:1.5em;">⬅️</span><span style="font-size:0.8em;">Voltar</span></button>
      </div>
      <div id="adesao-porcentagem">Adesão: ${adesao}% do mês</div>
      <div id="historico-calendario">
        ${dias.map(dia => {
          const key = dataKeyDia(dia);
          let classe = "";
          if (historico[key]) {
            classe = historico[key].tomado ? "completo" : "incompleto";
          }
          return `<div class="dia-calendario ${classe}" title="${dia.toLocaleDateString()}" onclick="marcarDiaHistorico('${key}')">${dia.getDate()}</div>`;
        }).join("")}
      </div>
    </div>
  `;
}

function diasDoMesAtual() {
  const now = new Date();
  const ano = now.getFullYear(), mes = now.getMonth();
  const dias = [];
  for (let d = 1; d <= diasNoMes(ano, mes); d++) {
    dias.push(new Date(ano, mes, d));
  }
  return dias;
}
function diasNoMes(ano, mes) {
  return new Date(ano, mes + 1, 0).getDate();
}
function dataKeyDia(date) {
  return date.toISOString().slice(0,10);
}
window.marcarDiaHistorico = function(key) {
  const data = lerStorage();
  if (!data.historico[key]) {
    data.historico[key] = { tomado: true };
  } else {
    data.historico[key].tomado = !data.historico[key].tomado;
  }
  salvarStorage(data);
  renderTela("historico");
};

window.excluirMedicamento = function(idx) {
  const data = lerStorage();
  data.medicamentos.splice(idx,1);
  salvarStorage(data);
  renderTela("listaMedicamentos");
};

// Configurações de fonte e tema
function aplicarFonte(tamanho) {
  document.body.style.fontSize = tamanho === "grande" ? "1.27rem" : "1.1rem";
}
function aplicarTema(tema) {
  document.documentElement.setAttribute("data-theme", tema === "escuro" ? "dark" : "");
  document.body.style.background = tema === "escuro" ? "#191929" : "var(--azul-claro)";
}

// Lembrete (simulação JS)
function agendarLembretes() {
  setInterval(() => {
    const data = lerStorage();
    const agora = new Date();
    medicamentosHoje(data).forEach(med => {
      const [h, m] = med.horario.split(":");
      if (parseInt(h) === agora.getHours() && Math.abs(agora.getMinutes()-parseInt(m)) < 1) {
        // Só mostra lembrete se não foi marcado como tomado esse dia ainda
        const key = dataKeyDia(agora) + "_" + med.nome;
        if (!localStorage.getItem("lembrete." + key)) {
          mostrarLembrete(med, key, data);
        }
      }
    });
  }, 20000); // Checa a cada 20s
}

function mostrarLembrete(med, lembreteKey, data) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <div class="titulo">Hora do remédio!</div>
    <div style="margin:1em 0 0.7em 0;font-size:1.13em;color:#49317f;">
      Tome <b>${med.dose}</b> de <b>${med.nome}</b> agora.<br>
      <span style="color:var(--azul-claro);font-weight:500;">Horário: ${med.horario}</span>
    </div>
    <div class="popup-botoes">
      <button class="botao mini" id="btn-tomei">Tomei</button>
      <button class="botao mini secundario" id="btn-lembrete-depois">Lembrar depois</button>
    </div>
  `;
  $("#popup-container").appendChild(popup);

  // Som
  if (data.config.lembreteSonoro) {
    const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
    audio.play();
  }

  $("#btn-tomei").onclick = () => {
    registrarTomada(med);
    localStorage.setItem("lembrete." + lembreteKey, "feito");
    popup.remove();
  };
  $("#btn-lembrete-depois").onclick = () => {
    setTimeout(() => {
      localStorage.removeItem("lembrete." + lembreteKey);
    }, 60000); // Lembrar em 1 min
    popup.remove();
  };
}
function registrarTomada(med) {
  const data = lerStorage();
  const key = dataKeyDia(new Date());
  if (!data.historico[key]) data.historico[key] = { tomado: true };
  else data.historico[key].tomado = true;
  salvarStorage(data);
}

// Sair
window.deslogar = function() {
  if (confirm("Deseja realmente sair? Suas informações serão apagadas.")) {
    limparStorage();
    navegar("login");
  }
}

// Início: restaura configurações, navega para tela inicial correta
window.onload = function() {
  const data = lerStorage();
  aplicarFonte(data.config.fonte);
  aplicarTema(data.config.tema);
  if (!data.usuario.nome) {
    navegar("boasvindas");
  } else {
    navegar("home");
  }
  agendarLembretes();
};

// Acessibilidade extra: Enter em botões .botao-icone
document.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const ativo = document.activeElement;
    if (ativo && ativo.classList.contains("botao-icone")) {
      ativo.click();
    }
  }
});

// Responsividade: ajusta fonte para mobile
window.addEventListener("resize", () => {
  const largura = window.innerWidth;
  if (largura < 420) document.body.style.fontSize = "1rem";
});