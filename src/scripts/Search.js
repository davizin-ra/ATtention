const container = document.getElementById("cards-container");

fetch("../data/PerfisAt.json")
  .then((response) => response.json())
  .then((dados) => {
    console.log(dados);

    dados.perfis.forEach((perfil) => {
      container.innerHTML += `

        <div class="card" onclick="abrirPerfil(${perfil.id})">
            <div
              style="background-image: url(${perfil.banner})"
              class="banner"
            >
              <div
                style="background-image: url(${perfil.img})"
                class="img"
              ></div>
            </div>
            <h1>${perfil.nome}</h1>
            <h2>${perfil.area}</h2>
            <p>${perfil.regiao}</p>
            <div class="card-area">
              <p>${perfil.atuacao[0]}</p>
              <p>${perfil.atuacao[1]}</p>
              <p>${perfil.atuacao[2]}</p>
              <p>${perfil.atuacao[3]}</p>
            </div>
          </div>
        </div>

            `;
    });
  });

function abrirPerfil(id) {
    window.location.href = `ViewAT.html?id=${id}`
}