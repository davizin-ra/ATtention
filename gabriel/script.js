"use strict";

// O script usa defer no HTML e inicia o menu depois da leitura da pagina.
function inicializarMenu() {
    const botaoMenu = document.querySelector("#menu-toggle");
    const menu = document.querySelector("#nav-menu");
    const linksMenu = menu.querySelectorAll("a");

    function atualizarMenu(aberto) {
        menu.classList.toggle("aberto", aberto);
        botaoMenu.setAttribute("aria-expanded", String(aberto));
        botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    }

    botaoMenu.addEventListener("click", function () {
        const menuAberto = menu.classList.contains("aberto");
        atualizarMenu(!menuAberto);
    });

    linksMenu.forEach(function (link) {
        link.addEventListener("click", function () {
            atualizarMenu(false);
        });
    });

    document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && menu.classList.contains("aberto")) {
            atualizarMenu(false);
            botaoMenu.focus();
        }
    });
}

inicializarMenu();
