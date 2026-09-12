const container = document.querySelector('#login-container');
const switchButton = document.querySelector('.alternar');

if (container && switchButton) {
    const switchText = switchButton.querySelector('.texto-alternar');

    switchButton.addEventListener('click', () => {
        const psychologistMode = container.classList.toggle('modo-psicologo');

        if (psychologistMode) {
            if (switchText) {
                switchText.textContent = 'Fazer login como responsável';
            }

            switchButton.setAttribute(
                'aria-label',
                'Voltar para entrar como responsável'
            );
        } else {
            if (switchText) {
                switchText.textContent = 'Fazer login como psicólogo';
            }

            switchButton.setAttribute(
                'aria-label',
                'Ir para entrar como psicólogo'
            );
        }
    });
}


// AQUI É PRA QUANDO A PESSOA CLICAR NO BOTÃO "ENTRAR" NA PÁGINA DE LOGIN, ELA VÁ DIRETO PARA A PÁGINA DE RESPONSÁVEL OU PARA A PÁGINA DE PSICÓLOGO

const formularioResponsavel = document.querySelector("#form-responsavel");
const formularioPsicologo = document.querySelector("#form-psicologo");

formularioResponsavel.addEventListener("submit", (event) => {
    event.preventDefault();

    if (formularioResponsavel.checkValidity()) {
        window.location.href = "cadastre-se.html";
    }
});

formularioPsicologo.addEventListener("submit", (event) => {
    event.preventDefault();

    if (formularioPsicologo.checkValidity()) {
        window.location.href = "cadastre-se.html";
    }
});