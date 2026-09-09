const container = document.querySelector('#login-container');
const switchButton = document.querySelector('.alternar');

if (container && switchButton) {
    const switchIcon = switchButton.querySelector('.seta');
    const switchText = switchButton.querySelector('.texto-alternar');

    switchButton.addEventListener('click', () => {
        const psychologistMode = container.classList.toggle('modo-psicologo');

        if (psychologistMode) {
            if (switchIcon) {
                switchIcon.textContent = '←';
            }

            if (switchText) {
                switchText.textContent = 'Fazer login como responsável';
            }

            switchButton.setAttribute(
                'aria-label',
                'Voltar para entrar como responsável'
            );
        } else {
            if (switchIcon) {
                switchIcon.textContent = '→';
            }

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