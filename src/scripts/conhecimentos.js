// barra de pesquisa

const campoPesquisa = document.getElementById("campoPesquisa");
const limparPesquisa = document.getElementById("limparPesquisa");
const mensagemPesquisa = document.getElementById("mensagemPesquisa");

// fazer pesquisa

campoPesquisa.addEventListener("input", function() {

    const texto = campoPesquisa.value.toLowerCase().trim();
    const todosCards = document.querySelectorAll(".card");

    let encontrados = 0;

    todosCards.forEach(function(card) {

        const palavras = card.dataset.pesquisa.toLowerCase();

        if (palavras.includes(texto)) {

            card.classList.remove("escondido");
            encontrados++;

        } else {

            card.classList.add("escondido");

        }

    });

    posicao = 0;  // Volta para o primeiro card

// Mostra o resultado da pesquisa

    if (texto === "") {
        mensagemPesquisa.textContent = "";

    } else {
        mensagemPesquisa.textContent =
            encontrados + " conteúdo(s) encontrado(s).";
    }

    atualizarCarrossel();

});

// Limpar pesquisa

limparPesquisa.addEventListener("click", function() {

    campoPesquisa.value = "";
    campoPesquisa.dispatchEvent(new Event("input"));
    campoPesquisa.focus();

});

//carrossel

const cards = document.getElementById("cards");
const botaoVoltar = document.getElementById("voltar");
const botaoAvancar = document.getElementById("avancar");

let posicao = 0;

// Botão avançar

botaoAvancar.addEventListener("click", function() {

    const quantidadeCards =
        document.querySelectorAll(".card:not(.escondido)").length;

    if (posicao < quantidadeCards - 3) {

        posicao++;

        atualizarCarrossel();

    }

});

// Botão voltar

botaoVoltar.addEventListener("click", function() {

    if (posicao > 0) {

        posicao--;

        atualizarCarrossel();

    }

});

// Atualizar a posição do carrossel

function atualizarCarrossel() {

    const card =
        document.querySelector(".card:not(.escondido)");

    if (!card) {
        return;
    }

    const largura = card.offsetWidth;

    cards.style.transform =
        "translateX(-" + posicao * (largura + 12) + "px)";

    atualizarBotoes();

}

// Atualizar os botões

function atualizarBotoes() {

    const quantidadeCards =
        document.querySelectorAll(".card:not(.escondido)").length;


    if (posicao === 0) {
        botaoVoltar.disabled = true;

    } else {
        botaoVoltar.disabled = false;

    }

    if (posicao >= quantidadeCards - 3) {
        botaoAvancar.disabled = true;

    } else {
        botaoAvancar.disabled = false;

    }

}

// Atualizar quando a tela mudar de tamanho

window.addEventListener("resize", function() {
    atualizarCarrossel();

});

atualizarCarrossel(); // Atualiza o carrossel quando a página é carregada
