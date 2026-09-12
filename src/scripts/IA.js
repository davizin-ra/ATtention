const areaMensagens = document.querySelector(".area-mensagens");
const formulario = document.querySelector(".formulario-chat");
const campoMensagem = document.querySelector(".campo-mensagem");

const GEMINI_API_KEY = window.ATTENTION_GEMINI_API_KEY || "";
const GEMINI_MODEL = "gemini-3.5-flash-lite";

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

function limparJson(texto) {
  return texto.replace(/^```json\s*|\s*```$/gi, "").trim();
}

function instrucaoDoSistema() {
  return `
Você é o "pecinha", assistente virtual da ATtention.
Responda sempre em português, de forma acolhedora, clara e concisa.

Seu escopo é exclusivamente:
- TEA (autismo)
- neurodesenvolvimento
- inclusão
- acessibilidade
- acompanhamento terapêutico
- escola
- famílias
- áreas profissionais relacionadas

Para assuntos fora desse escopo, diga educadamente que só pode ajudar nesses temas.

Não dê diagnósticos, prescrições ou certezas clínicas.

Você recebeu a base de profissionais da ATtention abaixo.

Quando o usuário pedir indicação de profissional:
- escolha APENAS um profissional presente na base;
- analise área, atuação, capacitações e região;
- retorne o id exato do profissional.

Quando o usuário fizer apenas uma pergunta informativa, não recomende profissional.
Retorne SOMENTE JSON válido.

O campo "tipo" deve ser:
- "mensagem"
- "recomendacao"

Exemplo:
{
  "tipo": "mensagem",
  "mensagem": "texto curto para o usuário",
  "perfilId": null
}
Base de profissionais:

${JSON.stringify(perfis)}
`;
}

async function perguntarAoGemini(mensagem) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "A IA está indisponível no momento",
    );
  }

  if (!perfis.length) {
    throw new Error("A base de profissionais ainda está carregando");
  }

  const resposta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: instrucaoDoSistema(),
            },
          ],
        },
        contents: [
          ...historico,

          {
            role: "user",
            parts: [
              {
                text: mensagem,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
        },
      }),
    },
  );

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.error?.message || "Erro na requisição");
  }

  const texto = dados.candidates?.[0]?.content?.parts
    ?.filter((parte) => parte.text)
    .map((parte) => parte.text)
    .join("");

  if (!texto) {
    throw new Error("Erro, não houve retorno");
  }

  try {
    console.log(texto)
    return JSON.parse(limparJson(texto));
  } catch {
    throw new Error("Erro no retorno");
  }
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
    const textoResposta = resposta.mensagem || "Posso ajudar com dúvidas sobre TEA e inclusão";

    const perfil = Number(resposta.perfilId) ? perfis.find((item) => item.id === resposta.perfilId) : null;

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
