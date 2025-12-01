let currentView = 'month'; // 'month', '14days', '4days'
let currentStartDate = new Date(); // Data que inicia a visualização
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let taskModal, modalDateTitle, modalTaskList, closeModalBtn;


// Utilitário para formatar a data YYYY-MM-DD
function getFormattedDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// ----------------------------------------------------
//  FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO (REVISADA)
// ----------------------------------------------------

function renderCalendar() {
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const calendarGrid = document.querySelector('.calendar-grid'); // Seleciona o elemento principal do grid
    const daysContainer = document.getElementById('calendarDays');
    const todasAsTarefas = typeof carregarTarefas === 'function' ? carregarTarefas() : [];

    daysContainer.innerHTML = '';
    
    let daysToRender = 0;
    let titleText = "";
    let startDate = new Date(currentStartDate); 
    const today = new Date();

    calendarGrid.classList.remove('view-14days', 'view-4days');

    // 1. Configurações baseadas no modo de visualização
    if (currentView === 'month') {
        const year = startDate.getFullYear();
        const month = startDate.getMonth();
        
        titleText = `${monthNames[month]} ${year}`;
        
        // Encontra o primeiro dia a ser exibido (domingo da semana do 1º dia do mês)
        const firstDayOfMonth = new Date(year, month, 1);
        startDate = new Date(firstDayOfMonth);
        startDate.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
        
        daysToRender = 42; 
        calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)';
        daysContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
        
    } else {
        // Lógica para Visualização de Período (14 Dias ou 4 Dias)
        
        daysToRender = currentView === '14days' ? 14 : 4;
        
        calendarGrid.classList.add(`view-${daysToRender}days`); 

        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + daysToRender - 1);
        
        const startDay = String(startDate.getDate()).padStart(2, '0');
        const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
        const endDay = String(endDate.getDate()).padStart(2, '0');
        const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
        
        titleText = `${startDay}/${startMonth} - ${endDay}/${endMonth} (${startDate.getFullYear()})`;
        
        if (currentView === '14days') {
             calendarGrid.style.gridTemplateColumns = 'repeat(7, 1fr)'; 
             daysContainer.style.gridTemplateColumns = 'repeat(7, 1fr)';
        } else if (currentView === '4days') {
             calendarGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
             daysContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }
    }
    
    monthYearDisplay.textContent = titleText;

    // 2. Criação dos Cabeçalhos dos Dias da Semana (Dom, Seg, ...)
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    // Remove os cabeçalhos existentes antes de adicionar novos (ou nada)
    calendarGrid.querySelectorAll('.day-header').forEach(header => header.remove());
    
    if (currentView === 'month' || currentView === '14days') {
        const headerHtml = dayNames.map(name => `<div class="day-header">${name}</div>`).join('');
        calendarGrid.insertAdjacentHTML('afterbegin', headerHtml);
    } 

    // 3. Renderiza os Dias (O restante do loop permanece o mesmo)
    for (let i = 0; i < daysToRender; i++) {
        // ... (o código do loop for continua aqui sem alterações) ...
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const day = currentDate.getDate();

        const dateString = getFormattedDate(currentDate);
        
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        
        // NOVO: Adiciona a abreviação do dia da semana (Se for o passo que você escolheu)
        // const dayOfWeekName = dayNames[currentDate.getDay()];
        // dayDiv.innerHTML = `<span class="day-of-week">${dayOfWeekName}</span><span class="day-number">${day}</span>`;
        // Ou o formato simples que você já tinha:
        dayDiv.textContent = day;
        
        // Estilo e Classes
        // ... (o código de classes current-day, other-month, has-tasks continua aqui) ...
        if (dateString === getFormattedDate(today)) {
             dayDiv.classList.add('current-day');
        }

        if (currentView === 'month' && month !== currentStartDate.getMonth()) {
            dayDiv.classList.add('other-month');
        }

        const tarefasDoDia = todasAsTarefas.filter(tarefa => tarefa.data === dateString);
        if (tarefasDoDia.length > 0) {
            adicionarTarefasAoDia(dayDiv, tarefasDoDia);
        }

        dayDiv.addEventListener('click', () => {
            const dayText = day;
            const monthText = monthNames[month];
            openDayDetails(dateString, dayText, monthText, tarefasDoDia);
        });

        daysContainer.appendChild(dayDiv);
    }
}


// ----------------------------------------------------
//  LÓGICA DE NAVEGAÇÃO (REVISADA)
// ----------------------------------------------------

function navigatePeriod(direction) {
    
    if (currentView === 'month') {
        if (direction === 'prev') {
            currentStartDate.setMonth(currentStartDate.getMonth() - 1);
        } else if (direction === 'next') {
            currentStartDate.setMonth(currentStartDate.getMonth() + 1);
        }
        
    } else {
        let numDays = currentView === '14days' ? 14 : 4;

        if (direction === 'prev') {
            currentStartDate.setDate(currentStartDate.getDate() - numDays);
        } else {
            currentStartDate.setDate(currentStartDate.getDate() + numDays);
        }
    }
    
    renderCalendar();
}


// --- Funções Auxiliares (mantidas como você enviou) ---

function adicionarTarefasAoDia(dayDiv, tarefas) {
    dayDiv.classList.add('has-tasks');
    
    const taskListDiv = document.createElement('div');
    taskListDiv.classList.add('day-task-list');
    
    tarefas.slice(0, 2).forEach(tarefa => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('calendar-task-preview');
        
        taskElement.innerHTML = `
            <span class="task-dot ${tarefa.completa ? 'completed-dot' : 'pending-dot'}"></span>
            ${tarefa.texto.substring(0, 15)}...
        `;
        
        taskListDiv.appendChild(taskElement);
    });

    if (tarefas.length > 2) {
        const moreTasks = document.createElement('div');
        moreTasks.classList.add('more-tasks');
        moreTasks.textContent = `+${tarefas.length - 2} mais...`;
        taskListDiv.appendChild(moreTasks);
    }

    dayDiv.appendChild(taskListDiv);
}

// --- Funções do Modal (Mantidas como você enviou) ---

function openDayDetails(dateString, dayText, monthText, tarefas) {
    
    modalDateTitle.textContent = `Tarefas para ${dayText} de ${monthText}`;
    modalTaskList.innerHTML = ''; 

    const oldAddButton = document.getElementById('addTaskModalButton');
    if (oldAddButton) {
        oldAddButton.remove();
    }

    const addButton = document.createElement('button');
    addButton.id = 'addTaskModalButton';
    addButton.classList.add('app-btn', 'btn-primary', 'btn-add-task-modal');
    addButton.textContent = `➕ Adicionar Tarefa para ${dayText}/${monthText}`;
    
    addButton.onclick = () => {
        window.location.href = `tasks.html?date=${dateString}`;
    };

    modalTaskList.insertAdjacentElement('beforebegin', addButton);

    if (tarefas.length === 0) {
        modalTaskList.innerHTML = '<p style="text-align: center; color: #777;">Nenhuma tarefa agendada para este dia.</p>';
    } else {
        
        tarefas.forEach(tarefa => {
            const taskItem = document.createElement('div');
            taskItem.classList.add('modal-task-item');
            taskItem.innerHTML = `
                <div>
                    <span class="task-time-text">${tarefa.hora || ''}</span> 
                    <span class="${tarefa.completa ? 'task-completed-text' : ''}">${tarefa.texto}</span>
                </div>
                <div>
                    <button class="app-btn btn-small btn-toggle" data-id="${tarefa.id}" 
                            style="background-color: ${tarefa.completa ? '#52c41a' : '#faad14'}; color: white;">
                        ${tarefa.completa ? 'Concluída' : 'Pendente'}
                    </button>
                    <button class="app-btn btn-small btn-delete" data-id="${tarefa.id}" 
                            style="background-color: #f5222d; color: white;">
                        🗑️
                    </button>
                </div>
            `;
            modalTaskList.appendChild(taskItem);
        });

        modalTaskList.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.addEventListener('click', (e) => handleTaskAction(e.target.dataset.id, 'toggle', dateString));
        });
        modalTaskList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => handleTaskAction(e.target.dataset.id, 'delete', dateString));
        });
    }

    taskModal.classList.add('active');
}

function handleTaskAction(taskId, action, dateString) {
    const id = Number(taskId);
    let shouldUpdate = false; 

    // Executa a ação e salva no localStorage
    if (action === 'delete' && typeof removerTarefa === 'function') {
        if (confirm('Tem certeza que deseja remover esta tarefa?')) {
            removerTarefa(id);
            shouldUpdate = true;
        } else {
            return;
        }
    } 
    else if (action === 'toggle' && typeof toggleTarefa === 'function') {
        toggleTarefa(id);
        shouldUpdate = true;
    }
    
    if (!shouldUpdate) return;

    // Atualiza o calendário principal
    renderCalendar();
    
    // Novo fetch de dados
    const todasTarefas = carregarTarefas();
    const tarefasAtualizadas = todasTarefas.filter(t => t.data === dateString);
    
    const [year, monthIndex, day] = dateString.split('-').map(Number);
    const dayText = day;
    const monthText = monthNames[monthIndex - 1]; 

    taskModal.classList.remove('active');
    
    // Pequeno delay para reabrir o modal após a atualização do calendário
    setTimeout(() => {
        // Reabre o modal apenas se ainda houver tarefas
        if (tarefasAtualizadas.length > 0) {
            openDayDetails(dateString, dayText, monthText, tarefasAtualizadas);
        }
    }, 50); 
}


// --- Inicialização (Bloco DOMContentLoaded) ---

document.addEventListener('DOMContentLoaded', () => {
    taskModal = document.getElementById('taskModal');
    modalDateTitle = document.getElementById('modalDateTitle');
    modalTaskList = document.getElementById('modalTaskList');
    closeModalBtn = document.getElementById('closeModalBtn');
    
    // Listeners do Modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => taskModal.classList.remove('active'));
    }

    if (taskModal) {
        taskModal.addEventListener('click', (e) => {
            if (e.target === taskModal) {
                taskModal.classList.remove('active');
            }
        });
    }
    
    //  NOVO: Listeners para os botões de Visualização
    document.querySelectorAll('.btn-view').forEach(button => {
        button.addEventListener('click', (e) => {
            const newView = e.target.dataset.view;
            
            // Gerencia a classe 'active'
            document.querySelectorAll('.btn-view').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            // Centraliza a visualização na data atual ao trocar o modo
            currentStartDate = new Date(); 
            currentView = newView;
            renderCalendar();
        });
    });

    //  ATUALIZADO: Listeners para navegação
    document.getElementById('prevMonth').addEventListener('click', () => navigatePeriod('prev'));
    document.getElementById('nextMonth').addEventListener('click', () => navigatePeriod('next'));
    
    // Renderiza a visualização inicial
    renderCalendar();
});