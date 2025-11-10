function salvarTarefas(tarefas) {
    localStorage.setItem('minhaAgenda', JSON.stringify(tarefas));
}

function carregarTarefas() {
    const dados = localStorage.getItem('minhaAgenda');
    return dados ? JSON.parse(dados) : [];
}

function renderizarTarefas() {
    const taskList = document.getElementById('taskList');
    const tarefas = carregarTarefas(); 

   
    taskList.innerHTML = ''; 

    if (tarefas.length === 0) {
        
        taskList.innerHTML = '<p class="no-tasks-message">🎉 Nenhuma tarefa pendente. Adicione uma nova!</p>';
        return;
    }

    
    tarefas.forEach(tarefa => {
        
        const listItem = document.createElement('li');
        
        listItem.classList.add('task-item');
        if (tarefa.completa) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <span class="task-text">${tarefa.texto}</span>
            <span class="task-date">Criada em: ${tarefa.dataCriacao}</span>
            
            <div class="task-actions">
                <button class="ant-btn ant-btn-icon-only toggle-complete" data-id="${tarefa.id}">
                    ${tarefa.completa ? '↩️' : '✔️'}
                </button>
                
                <button class="btn btn-danger remove-task" data-id="${tarefa.id}">
                    🗑️
                </button>
            </div>
        `;

        taskList.appendChild(listItem);
    });

    
    anexarListenersDeAcao(); 
}


const getIdNumerico = (idString) => parseInt(idString);


function toggleTarefa(id) {
    const tarefas = carregarTarefas();
    const idNumerico = getIdNumerico(id);

    
    const tarefasAtualizadas = tarefas.map(tarefa => {
        if (tarefa.id === idNumerico) {
            return { ...tarefa, completa: !tarefa.completa }; 
        }
        return tarefa;
    });

    salvarTarefas(tarefasAtualizadas);
    renderizarTarefas(); 
}


function removerTarefa(id) {
    const tarefas = carregarTarefas();
    const idNumerico = getIdNumerico(id);

    
    const tarefasAtualizadas = tarefas.filter(tarefa => tarefa.id !== idNumerico);

    salvarTarefas(tarefasAtualizadas);
    renderizarTarefas(); 
}



function anexarListenersDeAcao() {
    
    document.querySelectorAll('.toggle-complete').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = e.currentTarget.dataset.id; 
            toggleTarefa(taskId);
        });
    });

    
    document.querySelectorAll('.remove-task').forEach(button => {
        button.addEventListener('click', (e) => {
            const taskId = e.currentTarget.dataset.id; 
            
            if (confirm('Tem certeza que deseja remover esta tarefa?')) {
                 removerTarefa(taskId);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDateInput = document.getElementById('taskDate'); 
    const taskTimeInput = document.getElementById('taskTime'); 
    
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); 
        
        const textoTarefa = taskInput.value.trim();
        const dataTarefa = taskDateInput.value; 
        const horaTarefa = taskTimeInput.value; 
        
        if (textoTarefa === "" || dataTarefa === "") {
            alert("Por favor, preencha a descrição e a data.");
            return;
        }

        const novaTarefa = {
            id: Date.now(),
            texto: textoTarefa,
            data: dataTarefa,
            hora: horaTarefa,
            completa: false
        };

        const tarefasAtuais = carregarTarefas();
        tarefasAtuais.push(novaTarefa);
        salvarTarefas(tarefasAtuais);
       
        taskInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = ''; 

        renderizarTarefas(); 
    });
    
    renderizarTarefas(); 
});
