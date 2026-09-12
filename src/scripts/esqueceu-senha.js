const form = document.querySelector("#form-recuperacao");
const mensagem = document.querySelector("#mensagem");

form.addEventListener("submit", function(event) {

    event.preventDefault();

    mensagem.classList.add("ativa");

    form.reset();

});