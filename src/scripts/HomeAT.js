// abrir perfil

const foto = document.querySelector(".inicio-foto");

foto.onclick = function () {
    window.location.href = "PerfilAT.html";
};


// botão sair

const botaoSair = document.querySelector(".inicio-botao-sair");

botaoSair.onclick = function () {

    if (confirm("Deseja realmente sair da sua conta?")) {
        window.location.href = "Login.html";
    }

};


// enviar recusa

const botoesRecusa = document.querySelectorAll(".botao-branco");

function enviarRecusa(botao) {

    if (confirm("Deseja recusar esta solicitação?")) {

        alert("A recusa foi enviada com sucesso!");

        botao.textContent = "Recusa enviada";
        botao.disabled = true;

    }

}

botoesRecusa[0].onclick = function () {
    enviarRecusa(botoesRecusa[0]);
};

botoesRecusa[1].onclick = function () {
    enviarRecusa(botoesRecusa[1]);
};


// entrar em contato

const botoesContato = document.querySelectorAll(".botao-vermelho");

function entrarEmContato(email) {

    const mensagemPadrao =
        "Olá, tudo bem?\n\n" +
        "Sou Ana, acompanhante terapêutica da plataforma ATtention.\n\n" +
        "Gostaria de conversar sobre a solicitação de acompanhamento.\n\n" +
        "Atenciosamente,\n" +
        "Ana - Acompanhante Terapêutica";

    const mensagem = prompt(
        "Confira ou altere a mensagem:",
        mensagemPadrao
    );

    if (mensagem !== null && confirm("Deseja enviar esta mensagem?")) {

        window.location.href =
            "mailto:" + email +
            "?subject=" + encodeURIComponent("Acompanhamento terapêutico - ATtention") +
            "&body=" + encodeURIComponent(mensagem);

    }

}

botoesContato[0].onclick = function () {
    entrarEmContato("familiasouza@email.com");
};

botoesContato[1].onclick = function () {
    entrarEmContato("familiaalmeida@email.com");
};


// agendar sessão

const botaoAgendar = document.querySelector("#botaoAgendar");

botaoAgendar.onclick = function () {

    const data = document.querySelector("#dataSessao").value;
    const paciente = document.querySelector("#pacienteSessao").value;
    const horario = document.querySelector("#horarioSessao").value;

    if (data === "" || paciente === "" || horario === "") {

        alert("Preencha todos os campos.");

    } else {

        const sessao = document.createElement("div");

        sessao.className = "sessao-nova";

        sessao.textContent =
            "Paciente: " + paciente + "\n" +
            "Data: " + data + "\n" +
            "Horário: " + horario;

        document.querySelector("#sessoesAgendadas").appendChild(sessao);

        alert("Sessão agendada com sucesso!");

        document.querySelector("#dataSessao").value = "";
        document.querySelector("#pacienteSessao").value = "";
        document.querySelector("#horarioSessao").value = "";

    }

};


// cadastrar paciente

const botaoCadastrar = document.querySelector("#botaoCadastrarPaciente");
const cadastro = document.querySelector("#cadastroPaciente");
const botaoSalvar = document.querySelector("#botaoSalvarPaciente");

botaoCadastrar.onclick = function () {

    if (cadastro.style.display === "block") {

        cadastro.style.display = "none";
        botaoCadastrar.textContent = "Cadastrar novo paciente";

    } else {

        cadastro.style.display = "block";
        botaoCadastrar.textContent = "Fechar cadastro";

    }

};


botaoSalvar.onclick = function () {

    const nome = document.querySelector("#nomePaciente").value;
    const idade = document.querySelector("#idadePaciente").value;
    const responsavel = document.querySelector("#responsavelPaciente").value;
    const email = document.querySelector("#emailPaciente").value;
    const telefone = document.querySelector("#telefonePaciente").value;

    if (
        nome === "" ||
        idade === "" ||
        responsavel === "" ||
        email === "" ||
        telefone === ""
    ) {

        alert("Preencha os campos obrigatórios.");

    } else {

        alert("Paciente cadastrado com sucesso!");

        document.querySelector("#nomePaciente").value = "";
        document.querySelector("#idadePaciente").value = "";
        document.querySelector("#responsavelPaciente").value = "";
        document.querySelector("#emailPaciente").value = "";
        document.querySelector("#telefonePaciente").value = "";
        document.querySelector("#observacoesPaciente").value = "";

        cadastro.style.display = "none";
        botaoCadastrar.textContent = "Cadastrar novo paciente";

    }

};