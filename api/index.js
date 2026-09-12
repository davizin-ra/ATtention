const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.5-flash-lite";

const dados = require("../src/data/PerfisAt.json");
const perfis = dados.perfis;

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
- retorne o ID exato do profissional.

Quando o usuário fizer apenas uma pergunta informativa:

- não recomende profissional;
- responda normalmente.

Retorne SOMENTE JSON válido.

O campo "tipo" deve ser:

- "mensagem"
- "recomendacao"

O campo "perfilId" deve ser:

- o ID do profissional quando houver recomendação;
- null quando não houver recomendação.

Exemplo de pergunta informativa:

{
  "tipo": "mensagem",
  "mensagem": "Texto curto para o usuário.",
  "perfilId": null
}

Exemplo de recomendação:

{
  "tipo": "recomendacao",
  "mensagem": "Encontrei um profissional que pode ajudar nessa situação.",
  "perfilId": 5
}

IMPORTANTE:

- Nunca invente profissionais.
- Nunca invente IDs.
- O perfilId deve existir na base fornecida abaixo.

Base de profissionais:

${JSON.stringify(perfis)}
`;
}

function limparJson(texto) {
  return texto
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

async function perguntarAoGemini(mensagem, historico = []) {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API do Gemini não configurada.");
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

  console.log("Resposta Gemini:", JSON.stringify(dados, null, 2));

  if (!resposta.ok) {
    throw new Error(dados.error?.message || "Erro na API do Gemini.");
  }

  if (dados.promptFeedback?.blockReason) {
    throw new Error(
      `Gemini bloqueou a solicitação: ${dados.promptFeedback.blockReason}`,
    );
  }

  const candidato = dados.candidates?.[0];

  if (!candidato) {
    throw new Error("O Gemini não retornou nenhum candidato.");
  }

  if (candidato.finishReason && candidato.finishReason !== "STOP") {
    throw new Error(
      `O Gemini encerrou a resposta com: ${candidato.finishReason}`,
    );
  }

  const texto = candidato.content?.parts
    ?.filter((parte) => typeof parte.text === "string")
    .map((parte) => parte.text)
    .join("");

  if (!texto) {
    console.error("Resposta sem texto:", JSON.stringify(candidato, null, 2));

    throw new Error("O Gemini não retornou texto.");
  }

  try {
    const jsonLimpo = limparJson(texto);

    return JSON.parse(jsonLimpo);
  } catch (erro) {
    console.error("JSON recebido do Gemini:", texto);

    throw new Error("O Gemini retornou um JSON inválido.");
  }
}

app.post("/api/chat", async (req, res) => {
  try {
    const { mensagem, historico = [] } = req.body;

    if (!mensagem || typeof mensagem !== "string") {
      return res.status(400).json({
        erro: "Mensagem inválida.",
      });
    }

    const resposta = await perguntarAoGemini(mensagem, historico);

    if (!resposta.tipo || !resposta.mensagem) {
      return res.status(500).json({
        erro: "A IA retornou um formato inválido.",
      });
    }

    if (resposta.tipo === "recomendacao" && resposta.perfilId != null) {
      const perfilExiste = perfis.some(
        (perfil) => Number(perfil.id) === Number(resposta.perfilId),
      );

      if (!perfilExiste) {
        return res.status(500).json({
          erro: "A IA retornou um profissional que não existe na base.",
        });
      }
    }

    res.json(resposta);
  } catch (erro) {
    console.error("Erro em /api/chat:", erro);

    res.status(500).json({
      erro: erro.message || "Erro interno da API.",
    });
  }
});

module.exports = app;

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
  });
}
