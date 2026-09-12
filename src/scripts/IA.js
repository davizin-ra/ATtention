const areaMensagens = document.querySelector(".area-mensagens");
const formulario = document.querySelector(".formulario-chat");
const campoMensagem = document.querySelector(".campo-mensagem");

const API_URL = "https://attentionweb.vercel.app/api/chat";

let perfis = [];
let historico = [];

function criarBalaoUsuario(msg) {
  return `
    <div class="linha-mensagem linha-mensagem-usuario">
      <p class="balao balao-usuario">${msg}</p>
    </div>
  `;
}

function criarBalaoIA(msg) {
  return `
    <div class="linha-mensagem linha-mensagem-ia">
      <div class="avatar-ia"></div>
      <p class="balao balao-ia">${msg}</p>
    </div>
  `;
}

function criarCardProfissional(perfil, msg) {
  return `
    <div class="linha-mensagem linha-mensagem-ia">
      <div class="avatar-ia"></div>

      <div class="recomendacao">
        <p class="texto-recomendacao">${msg}</p>

        <a
          class="card-profissional"
          href="ViewAT.html?id=${perfil.id}"
        >
          <img
            src="${perfil.img}"
            alt="Foto de ${perfil.nome}"
          >

          <span class="dados-profissional">
            <strong>${perfil.nome}</strong>

            <span>${perfil.area}</span>

            <small>
              ${perfil.regiao} · ★ ${perfil.avaliacao.toFixed(1)}
            </small>
          </span>
        </a>
      </div>
    </div>
  `;
}

function mostrarCarregando() {
  areaMensagens.innerHTML += `
    <div
      id="indicador-carregando"
      class="linha-mensagem linha-mensagem-ia"
    >
      <div class="avatar-ia"></div>
      <p class="balao balao-ia">...</p>
    </div>
  `;

  areaMensagens.scrollTop = areaMensagens.scrollHeight;
}

async function perguntarAoGemini(mensagem) {
  const resposta = await fetch(API_URL, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      mensagem,
      historico,
    }),
  });

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || "Erro na req frontend");
  }

  return dados;
}

async function enviarMensagem(e) {
  e.preventDefault();

  const mensagem = campoMensagem.value.trim();

  if (!mensagem) return;

  areaMensagens.innerHTML += criarBalaoUsuario(mensagem);

  campoMensagem.value = "";
  campoMensagem.disabled = true;
  formulario.querySelector("button").disabled = true;

  mostrarCarregando();

  try {
    const resposta = await perguntarAoGemini(mensagem);

    const textoResposta =
      resposta.mensagem || "Posso ajudar com dúvidas sobre TEA e inclusão";

    const perfil = Number(resposta.perfilId)
      ? perfis.find((item) => item.id === Number(resposta.perfilId))
      : null;

    if (resposta.tipo === "recomendacao" && perfil) {
      areaMensagens.innerHTML += criarCardProfissional(perfil, textoResposta);
    } else {
      areaMensagens.innerHTML += criarBalaoIA(textoResposta);
    }

    historico.push(
      {
        role: "user",
        parts: [
          {
            text: mensagem,
          },
        ],
      },

      {
        role: "model",
        parts: [
          {
            text: textoResposta,
          },
        ],
      },
    );
  } catch (erro) {
    areaMensagens.innerHTML += criarBalaoIA(`Erro. ${erro.message}`);
  } finally {
    document.getElementById("indicador-carregando")?.remove();

    campoMensagem.disabled = false;

    formulario.querySelector("button").disabled = false;

    areaMensagens.scrollTop = areaMensagens.scrollHeight;

    campoMensagem.focus();
  }
}

formulario.addEventListener("submit", enviarMensagem);

fetch("../data/PerfisAt.json")
  .then((resposta) => resposta.json())

  .then((dados) => {
    perfis = dados.perfis;
  })

  .catch(() => {
    areaMensagens.innerHTML += criarBalaoIA(
      "Não foi possível carregar a base de profissionais agora.",
    );
  });
