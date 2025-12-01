let currentMonth = new Date();
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

let taskModal, modalDateTitle, modalTaskList, closeModalBtn; 

// --- Funções de Renderização do Calendário (mantidas globais) ---

function renderCalendar() {
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const daysContainer = document.getElementById('calendarDays');

    const todasAsTarefas = carregarTarefas();
    
    const today = new Date();
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    
    daysContainer.innerHTML = ''; 

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'other-month');
        daysContainer.appendChild(emptyDiv);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = day;
        
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('current-day');
        }
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const tarefasDoDia = todasAsTarefas.filter(tarefa => tarefa.data === dateString);
        if (tarefasDoDia.length > 0) {
            adicionarTarefasAoDia(dayDiv, tarefasDoDia);
        }

        // 🚨 CHAMA openDayDetails (que é a função completa de renderização)
        dayDiv.addEventListener('click', () => {
            const todasTarefas = carregarTarefas(); 
            const tarefasDoDia = todasTarefas.filter(tarefa => tarefa.data === dateString);
            
            const dayText = day;
            const monthText = monthNames[month];
            
            openDayDetails(dateString, dayText, monthText, tarefasDoDia);
        });

        daysContainer.appendChild(dayDiv);
    }
}

function navigateMonth(direction) {
    if (direction === 'prev') {
        currentMonth.setMonth(currentMonth.getMonth() - 1);
    } else if (direction === 'next') {
        currentMonth.setMonth(currentMonth.getMonth() + 1);
    }
    renderCalendar();
}

function adicionarTarefasAoDia(dayDiv, tarefas) {
    // ... (Seu código para adicionar a prévia de tarefas ao dia) ...
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

// --- Funções do Modal (Globais) ---
function openDayDetails(dateString, dayText, monthText, tarefas) {
    
    modalDateTitle.textContent = `Tarefas para ${dayText} de ${monthText}`;
    modalTaskList.innerHTML = ''; 

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
M
    taskModal.classList.remove('active');
    
    setTimeout(() => {
        openDayDetails(dateString, dayText, monthText, tarefasAtualizadas);
    }, 50); 
}


// --- Inicialização (Bloco DOMContentLoaded) ---

document.addEventListener('DOMContentLoaded', () => {
    taskModal = document.getElementById('taskModal');
    modalDateTitle = document.getElementById('modalDateTitle');
    modalTaskList = document.getElementById('modalTaskList');
    closeModalBtn = document.getElementById('closeModalBtn');
    
    closeModalBtn.addEventListener('click', () => {
        taskModal.classList.remove('active');
    });

    taskModal.addEventListener('click', (e) => {
        if (e.target === taskModal) {
            taskModal.classList.remove('active');
        }
    });

    renderCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => navigateMonth('prev'));
    document.getElementById('nextMonth').addEventListener('click', () => navigateMonth('next'));
});