const THEME_KEY = 'appTheme';
const DARK_CLASS = 'theme-dark';
const LIGHT_CLASS = 'theme-light';

function carregarEAplicarTema() {
    // 1. Carrega o tema salvo no localStorage (padrão é escuro se não houver)
    const savedTheme = localStorage.getItem(THEME_KEY) || DARK_CLASS;
    const body = document.body;

    // 2. Aplica a classe correspondente ao body
    if (savedTheme === LIGHT_CLASS) {
        body.classList.remove(DARK_CLASS);
        body.classList.add(LIGHT_CLASS);
    } else {
        body.classList.remove(LIGHT_CLASS);
        body.classList.add(DARK_CLASS);
    }

    // 3. Verifica se estamos na página de configurações para sincronizar o toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.checked = (savedTheme === LIGHT_CLASS);
    }
}

function salvarTema(isLight) {
    const themeToSave = isLight ? LIGHT_CLASS : DARK_CLASS;
    localStorage.setItem(THEME_KEY, themeToSave);
    carregarEAplicarTema(); // Aplica imediatamente após salvar
}


document.addEventListener('DOMContentLoaded', () => {
    // Aplica o tema imediatamente ao carregar a página
    carregarEAplicarTema();

    const themeToggle = document.getElementById('themeToggle');

    // Listener para o switch de tema
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            salvarTema(e.target.checked);
        });
    }
});