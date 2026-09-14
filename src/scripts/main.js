"use strict";

function inicializarMenus() {
    const cabecalhos = document.querySelectorAll("[data-header]");

    cabecalhos.forEach(function (cabecalho) {
        const botaoMenu = cabecalho.querySelector("[data-site-menu-toggle]");
        const menu = cabecalho.querySelector("[data-site-menu]");

        if (!botaoMenu || !menu) return;

        const linksMenu = menu.querySelectorAll("a");

        function atualizarMenu(aberto) {
            menu.classList.toggle("header-menu--open", aberto);
            botaoMenu.setAttribute("aria-expanded", String(aberto));
            botaoMenu.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
        }

        botaoMenu.addEventListener("click", function () {
            atualizarMenu(!menu.classList.contains("header-menu--open"));
        });

        linksMenu.forEach(function (link) {
            link.addEventListener("click", function () {
                atualizarMenu(false);
            });
        });

        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape" && menu.classList.contains("header-menu--open")) {
                atualizarMenu(false);
                botaoMenu.focus();
            }
        });
    });
}

inicializarMenus();
