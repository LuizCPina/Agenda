document.addEventListener('DOMContentLoaded', () => {

    // 1. Lógica de Redirecionamento do Index
    const paginaAtual = window.location.pathname;
    const paginaDesejada = '/Agenda/.html';

    if (paginaAtual.endsWith(paginaDesejada)) {
        const corpoPagina = document.body;  

        corpoPagina.addEventListener('click', () => {
            window.location.href = 'app/tasks.html';
        });
    }

    // ------------------------------------------
    // 2. Lógica de Toggle (Recolher/Expandir) o Sidebar
    // ------------------------------------------
    const sider = document.getElementById('mySider');
    const toggleButton = document.getElementById('toggleButton');

    if (sider && toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Alterna a classe 'collapsed' que o CSS usa para mudar a largura
            sider.classList.toggle('collapsed');

            // Mantém o texto do botão como o ícone ☰
            toggleButton.textContent = '☰'; 
        }); 
    }
});