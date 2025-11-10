document.addEventListener('DOMContentLoaded', () => {

    const paginaAtual = window.location.pathname;
    const paginaDesejada = '/index.html';

    if (paginaAtual.endsWith(paginaDesejada)) {

        const corpoPagina = document.body;  

        corpoPagina.addEventListener('click', () => {
            window.location.href = 'tasks.html';
        });
    }

    const sider = document.getElementById('mySider');
    const toggleButton = document.getElementById('toggleButton');

    toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        sider.classList.toggle('collapsed');

        if (sider.classList.contains('collapsed')) {
            toggleButton.textContent = '▶'; 
        } else {
            toggleButton.textContent = '☰'; 
        }
    });

});