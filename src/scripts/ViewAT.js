const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const banner = document.getElementById("banner")
const img = document.getElementById("img")

const nome = document.getElementById("nome");
const area = document.getElementById("area");
const regiao = document.getElementById("regiao");
const atendimentos = document.getElementById("atendimentos");
const avaliacao = document.getElementById("avaliacao");
const familias = document.getElementById("familias");
const anosAT = document.getElementById("anosAT");

const sobre = document.getElementById("sobre");
const formacao = document.getElementById("formacao-container");
const capacitacao = document.getElementById("capacitacoes-container");
const modalidades = document.getElementById("modalidades");
const atuacao = document.getElementById("atuacao");

const dias = document.querySelectorAll(".disp p");

console.log(id);

fetch("../data/PerfisAt.json")
  .then((response) => response.json())
  .then((dados) => {
    const perfil = dados.perfis.find((p) => p.id == id);
    console.log(perfil);

    img.src = `${perfil.img}`
    banner.style.backgroundImage = `url(${perfil.banner})`

    nome.innerText = perfil.nome;
    area.innerText = perfil.area;
    regiao.innerText = perfil.regiao;
    atendimentos.innerText = "+ " + perfil.atendimentos;
    avaliacao.innerText = perfil.avaliacao;
    familias.innerText = perfil.familias;
    anosAT.innerText = perfil.anosAt;
    sobre.innerText = perfil.sobre;

    perfil.formacao.forEach((form) => {
      formacao.innerHTML += `            <div class="form">
              <p>${form.titulo}</p>
              <p class="desc">${form.desc}</p>
            </div>`;
    });

    perfil.capacitacoes.forEach((cap) => {
      capacitacao.innerHTML += `
                        <div class="cap">
              <p>
                ${cap}
              </p>
            </div>
        `;
    });

    perfil.modalidades.forEach((mod) => {
      modalidades.innerHTML += `
            <p>${mod}</p>
        `;
    });

    perfil.atuacao.forEach((at) => {
      atuacao.innerHTML += `
            <p>${at}</p>
        `;
    });

    dias.forEach((dia) => {
      const nomeDia = dia.getAttribute("data");
      console.log(dia)

      if (perfil.disponibilidade.includes(nomeDia)) {
        console.log(dia)
        dia.classList.add("disponivel");
      }
    });
  });
