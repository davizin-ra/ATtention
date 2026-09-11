const areaMensagens = document.querySelector(".area-mensagens");
const formulario = document.querySelector(".formulario-chat");
const campoMensagem = document.querySelector(".campo-mensagem");

// const GEMINI_API_KEY = window.ATTENTION_GEMINI_API_KEY || "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const GEMINI_MODEL = "gemini-3.5-flash-lite";
let perfis = [];
let historico = [];

function criarBalaoUsuario(texto) {
  const linha = document.createElement("div");
  linha.className = "linha-mensagem linha-mensagem-usuario";
  const balao = document.createElement("p");
  balao.className = "balao balao-usuario";
  balao.textContent = texto;
  linha.appendChild(balao);
  return linha;
}

function criarBalaoIA(texto) {
  const linha = document.createElement("div");
  linha.className = "linha-mensagem linha-mensagem-ia";
  linha.innerHTML = '<div class="avatar-ia" aria-hidden="true">Pecinha</div>';
  const balao = document.createElement("p");
  balao.className = "balao balao-ia";
  balao.textContent = texto;
  linha.appendChild(balao);
  return linha;
}

function criarCardProfissional(perfil, mensagem) {
  const linha = document.createElement("div");
  linha.className = "linha-mensagem linha-mensagem-ia";
  linha.innerHTML = '<div class="avatar-ia" aria-hidden="true">AT</div>';
  const conteudo = document.createElement("div");
  conteudo.className = "recomendacao";
  const introducao = document.createElement("p");
  introducao.className = "texto-recomendacao";
  introducao.textContent = mensagem;
  const card = document.createElement("a");
  card.className = "card-profissional";
  card.href = `ViewAT.html?id=${perfil.id}`;
  card.setAttribute("aria-label", `Ver o perfil de ${perfil.nome}`);
  card.innerHTML = `<img src="${perfil.img}" alt="Foto de ${perfil.nome}"><span class="dados-profissional"><strong>${perfil.nome}</strong><span>${perfil.area}</span><small>${perfil.regiao} · ★ ${perfil.avaliacao.toFixed(1)}</small></span><span class="seta-card" aria-hidden="true">→</span>`;
  conteudo.append(introducao, card);
  linha.appendChild(conteudo);
  return linha;
}

function mostrarCarregando() {
  const linha = criarBalaoIA("Pensando...");
  linha.id = "indicador-carregando";
  areaMensagens.appendChild(linha);
  areaMensagens.scrollTop = areaMensagens.scrollHeight;
}

function limparJson(texto) {
  return texto.replace(/^```json\s*|\s*```$/gi, "").trim();
}

function instrucaoDoSistema() {
  return `Você é a assistente virtual da ATtention. Responda sempre em português, de modo acolhedor, claro e conciso.

Seu escopo é exclusivamente TEA (autismo), neurodesenvolvimento, inclusão, acessibilidade, acompanhamento terapêutico, escola, famílias e áreas profissionais relacionadas. Para qualquer assunto fora desse escopo, diga educadamente que só pode ajudar nesses temas. Não dê diagnósticos, prescrições ou certezas clínicas; quando necessário, incentive uma avaliação profissional.

Você recebeu a base de profissionais da ATtention abaixo. Quando o usuário pedir indicação, recomendação ou ajuda para encontrar um profissional, escolha APENAS um perfil realmente presente nesta base e responda com o id exato dele. Avalie área, atuação, capacitações e região. Quando a pessoa estiver apenas fazendo uma pergunta informativa, não recomende um profissional.

Retorne SOMENTE JSON válido, sem markdown. O campo "tipo" deve ser "mensagem" ou "recomendacao". Exemplo:
{"tipo":"mensagem","mensagem":"texto curto para o usuário","perfilId":null}

Base de profissionais:
${JSON.stringify(perfis)}`;
}

async function perguntarAoGemini(mensagem) {
  if (!GEMINI_API_KEY)
    throw new Error(
      "Configure a chave da API Gemini no arquivo src/scripts/IA-config.js antes de usar o chat.",
    );
  if (!perfis.length)
    throw new Error(
      "A base de profissionais ainda está carregando. Tente novamente em instantes.",
    );

  const resposta = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instrucaoDoSistema() }] },
        contents: [...historico, { role: "user", parts: [{ text: mensagem }] }],
        generationConfig: {
          temperature: 0.35,
          responseMimeType: "application/json",
        },
      }),
    },
  );
  const dados = await resposta.json();
  if (!resposta.ok)
    throw new Error(dados.error?.message || "Não foi possível consultar a IA.");

  const texto = dados.candidates?.[0]?.content?.parts
    ?.filter((parte) => parte.text)
    .map((parte) => parte.text)
    .join("");
  if (!texto) throw new Error("A IA não retornou uma resposta.");
  try {
    return JSON.parse(limparJson(texto));
  } catch {
    throw new Error("A IA retornou um formato inesperado. Tente novamente.");
  }
}

async function enviarMensagem(evento) {
  evento.preventDefault();
  const mensagem = campoMensagem.value.trim();
  if (!mensagem) return;
  areaMensagens.appendChild(criarBalaoUsuario(mensagem));
  campoMensagem.value = "";
  campoMensagem.disabled = true;
  formulario.querySelector("button").disabled = true;
  mostrarCarregando();

  try {
    const resposta = await perguntarAoGemini(mensagem);
    const textoResposta =
      resposta.mensagem || "Posso ajudar com dúvidas sobre TEA e inclusão.";
    const perfil = Number.isInteger(resposta.perfilId)
      ? perfis.find((item) => item.id === resposta.perfilId)
      : null;
    if (resposta.tipo === "recomendacao" && perfil)
      areaMensagens.appendChild(criarCardProfissional(perfil, textoResposta));
    else areaMensagens.appendChild(criarBalaoIA(textoResposta));
    historico = [
      ...historico,
      { role: "user", parts: [{ text: mensagem }] },
      { role: "model", parts: [{ text: textoResposta }] },
    ];
  } catch (erro) {
    areaMensagens.appendChild(
      criarBalaoIA(`Não consegui responder agora. ${erro.message}`),
    );
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
  .then((resposta) => (resposta.ok ? resposta.json() : Promise.reject()))
  .then((dados) => {
    perfis = dados.perfis;
  })
  .catch(() =>
    areaMensagens.appendChild(
      criarBalaoIA("Não foi possível carregar a base de profissionais agora."),
    ),
  );
