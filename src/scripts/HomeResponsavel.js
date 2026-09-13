// abrir perfil do responsável

const foto = document.querySelector(".inicio-foto");

foto.onclick = function () {
    window.location.href = "PerfilResponsavel.html";
};

foto.style.cursor = "pointer";


// botão sair

const botaoSair = document.querySelector(".inicio-botao-sair");

botaoSair.onclick = function () {

    if (confirm("Deseja realmente sair da sua conta?")) {
        window.location.href = "Login.html";
    }

};


// enviar mensagem para a AT

const botaoMensagem = document.querySelector(".botao-azul");

botaoMensagem.onclick = function () {

    const mensagem = prompt("Digite sua mensagem para a AT:");

    if (mensagem !== null && mensagem !== "") {

        const confirmar = confirm("Deseja enviar esta mensagem?");

        if (confirmar) {
            window.location.href =
                "mailto:anaoliveira@email.com" +
                "?subject=Mensagem pelo ATtention" +
                "&body=" + encodeURIComponent(mensagem);
        }

    }

};

// confirmar sessão pendente

const sessaoPendente = document.querySelector(".tag-amarela");

if (sessaoPendente) {

    const botaoConfirmar = document.createElement("button");

    botaoConfirmar.textContent = "Confirmar sessão";
    botaoConfirmar.className = "botao-confirmar";

    sessaoPendente.replaceWith(botaoConfirmar);

    botaoConfirmar.onclick = function () {

        if (confirm("Deseja confirmar esta sessão?")) {

            botaoConfirmar.textContent = "Sessão confirmada";
            botaoConfirmar.disabled = true;

        }

    };

}