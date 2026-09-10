const filtros = document.querySelectorAll(".filtro");
const cards = document.getElementById("cards");
const todosCards = document.querySelectorAll(".card");
const destaque = document.getElementById("destaque");
const botaoVoltar = document.getElementById("voltar");
const botaoAvancar = document.getElementById("avancar");

let posicao = 0;

// filtra os conteúdos pelos botões
filtros.forEach(function(filtro) {
    filtro.addEventListener("click", function() {
        const categoria = filtro.dataset.filtro;

        filtros.forEach(function(botao) {
            botao.classList.remove("ativo");
        });

        filtro.classList.add("ativo");
        posicao = 0;

        todosCards.forEach(function(card) {
            if (categoria === "todos" || card.dataset.categorias.includes(categoria)) {
                card.classList.remove("escondido");
            } else {
                card.classList.add("escondido");
            }
        });

        // o destaque aparece apenas em todos
        if (categoria === "todos") {
            destaque.style.display = "block";
        } else {
            destaque.style.display = "none";
        }

        atualizarCarrossel();
    });
});

// avança os cards
botaoAvancar.addEventListener("click", function() {
    const visiveis = document.querySelectorAll(".card:not(.escondido)").length;

    if (posicao < visiveis - 3) {
        posicao++;
        atualizarCarrossel();
    }
});

// volta os cards
botaoVoltar.addEventListener("click", function() {
    if (posicao > 0) {
        posicao--;
        atualizarCarrossel();
    }
});

// atualiza a posição do carrossel
function atualizarCarrossel() {
    const card = document.querySelector(".card:not(.escondido)");

    if (!card) {
        return;
    }

    const largura = card.offsetWidth;
    const gap = 18;

    cards.style.transform = "translateX(-" + posicao * (largura + gap) + "px)";

    atualizarBotoes();
}

// ativa ou desativa as setas
function atualizarBotoes() {
    const visiveis = document.querySelectorAll(".card:not(.escondido)").length;

    botaoVoltar.disabled = posicao === 0;
    botaoAvancar.disabled = visiveis <= 3 || posicao >= visiveis - 3;
}

window.addEventListener("resize", function() {
    posicao = 0;
    atualizarCarrossel();
});

atualizarCarrossel();
