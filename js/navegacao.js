const tasksButton = document.getElementById('tasksButton');
const agendaButton = document.getElementById('agendaButton');
const configButton = document.getElementById('configButton');

function handleNavigation(targetPage) {
    if (targetPage) {
        window.location.href = targetPage;
    }
}

if (tasksButton) {
    tasksButton.addEventListener('click', () => {
      
        handleNavigation('../app/tasks.html'); 
    });
}

if (agendaButton) {
    agendaButton.addEventListener('click', () => {
        handleNavigation('../app/agenda.html'); 
    });
}


if (configButton) {
    configButton.addEventListener('click', () => {
        handleNavigation('../app/configuracoes.html'); 
    });
}