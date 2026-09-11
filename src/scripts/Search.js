const container = document.getElementById("cards-container");
const campoBusca = document.getElementById("campo-busca");

const selectServ = document.getElementById("select-servico");
const selectLoc = document.getElementById("select-loc");
const ordenacao = document.getElementById("ordenacao");

const contador = document.getElementById("qtd-pesquisa");
const vazio = document.getElementById("prof-vazio");

let perfis = [];

fetch("../data/PerfisAt.json")
  .then((res) => res.json())
  .then((data) => {
    perfis = data.perfis;
    preencherFiltros();
    atualizar();
  });

function preencherFiltros() {
  criarOpcoes(selectServ, "area");
  criarOpcoes(selectLoc, "regiao");
}

function criarOpcoes(select, campo) {
  const valores = [...new Set(perfis.map((p) => p[campo]))].sort();

  valores.forEach((valor) => {
    select.add(new Option(valor, valor));
  });
}

function filtrar() {
  const busca = campoBusca.value.toLowerCase().trim();

  return perfis.filter((p) => {
      const texto = [p.nome, p.area, p.regiao, p.atuacao].join(" ").toLowerCase();

      return (
        (!selectServ.value || p.area === selectServ.value) &&
        (!selectLoc.value || p.regiao === selectLoc.value) &&
        texto.includes(busca)
      );
    })
    .sort((a, b) => {
      if (ordenacao.value === "nomeAz") {
        return a.nome.localeCompare(b.nome, "pt-BR");
      }

      return b[ordenacao.value] - a[ordenacao.value];
    });
}

function atualizar() {
  const filtrados = filtrar();
  console.log(filtrados);

  // filtrados.forEach((p) => {
  //   container.innerHTML += criarCard(p);
  // });

  container.innerHTML = filtrados.map((p) => criarCard(p)).join("")

  contador.textContent = `${filtrados.length} profissionais encontrados`;

  vazio.hidden = filtrados.length > 0;
}

function criarCard(p) {
  return `
    <div class="card" onclick="abrirPerfil(${p.id})">
      <div class="banner" style="background-image:url('${p.banner}')"></div>
      <div class="img" style="background-image:url('${p.img}')"></div>

      <h1>${p.nome}</h1>
      <h2>${p.area}</h2>
      <p class="location">${p.regiao}</p>

      <div class="stats">
        <span>★ ${p.avaliacao.toFixed(1)}</span>
        <span>${p.anosAt} anos de atuação</span>
      </div>

      <div class="card-area">
        ${p.atuacao.map((a) => `<p>${a}</p>`).join("")}
      </div>
    </div>
  `;
}

[campoBusca, selectServ, selectLoc, ordenacao].forEach((el) =>
  el.addEventListener("input", atualizar),
);

function abrirPerfil(id) {
  location.href = `ViewAT.html?id=${id}`;
}
