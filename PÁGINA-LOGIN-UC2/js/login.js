const container = document.querySelector('#login-container');
const switchButton = document.querySelector('.alternar');
const switchIcon = switchButton.querySelector('.switch-icon');
const switchText = switchButton.querySelector('.switch-text');

switchButton.addEventListener('click', () => {
    const psychologistMode = container.classList.toggle('modo-psicologo');

    if (psychologistMode) {
        switchIcon.textContent = '←';
        switchText.textContent = 'Fazer login como responsável';
        switchButton.setAttribute(
            'aria-label',
            'Voltar para entrar como responsável'
        );
    } else {
        switchIcon.textContent = '→';
        switchText.textContent = 'Fazer login como psicólogo';
        switchButton.setAttribute(
            'aria-label',
            'Ir para entrar como psicólogo'
        );
    }
});