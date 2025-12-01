// ----------------------------------------------------
// LÓGICA DE DADOS (CARREGAR E SALVAR)
// ----------------------------------------------------

function salvarTarefas(tarefas) {
    localStorage.setItem('minhaAgenda', JSON.stringify(tarefas));
}

function carregarTarefas() {
    const dados = localStorage.getItem('minhaAgenda');
    return dados ? JSON.parse(dados) : [];
}

// ----------------------------------------------------
//  FUNÇÕES DE CONVERSÃO DE DATA (DD/MM/AAAA <-> YYYY-MM-DD) E HORA
// ----------------------------------------------------

function convertToISO(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('/');
    if (parts.length === 3) {
        // parts[2] = AAAA, parts[1] = MM, parts[0] = DD
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return ''; // Retorna vazio se o formato for inválido
}

function convertToDDMMYYYY(isoString) {
    if (!isoString) return '';
    const parts = isoString.split('-');
    if (parts.length === 3) {
        // parts[0] = YYYY, parts[1] = MM, parts[2] = DD
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoString; 
}

function applyTimeMask(inputElement) {
    inputElement.addEventListener('input', function(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não é número

        if (value.length > 4) {
            value = value.slice(0, 4); // Limita a 4 dígitos (HHMM)
        }

        // Adiciona os dois pontos (:)
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, '$1:$2');
        }

        input.value = value;
    });
    
    //Validação básica para evitar horas como "99:99"
    inputElement.addEventListener('blur', function(e) {
        const input = e.target;
        const timeValue = input.value;
        const parts = timeValue.split(':');
        
        if (parts.length === 2) {
            const hours = parseInt(parts[0], 10);
            const minutes = parseInt(parts[1], 10);
            
            // Verifica se a hora está entre 00 e 23 e minutos entre 00 e 59
            if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                 // Limpa o campo se for inválido, forçando o usuário a corrigir
                 input.value = ''; 
                 alert('Hora inválida! Por favor, use o formato 24h (HH:MM) válido.');
            }
        } else if (timeValue.length > 0 && timeValue.length < 5) {
             // Se digitou algo mas não completou o formato HH:MM
             input.value = '';
             alert('Hora incompleta. Por favor, use o formato HH:MM.');
        }
    });
}

// ----------------------------------------------------
//  FUNÇÃO PARA MÁSCARA DE INPUT (CORRIGIDA)
// ----------------------------------------------------

function applyDateMask(inputElement) {
    inputElement.addEventListener('input', function(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, ''); // Remove tudo que não é número

        if (value.length > 8) {
            value = value.slice(0, 8); // Limita a 8 dígitos (DDMMYYYY)
        }

        // Adiciona as barras (/) automaticamente
        if (value.length > 4) {
            value = value.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
        } else if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }

        input.value = value;
    });
}


// ----------------------------------------------------
// RENDERIZAÇÃO E AÇÕES
// ----------------------------------------------------

function renderizarTarefas() {
    const taskList = document.getElementById('taskList');
    const tarefas = carregarTarefas(); 

    taskList.innerHTML = ''; 

    if (tarefas.length === 0) {
        taskList.innerHTML = '<p class="no-tasks-message">🎉 Nenhuma tarefa pendente. Adicione uma nova!</p>';
        return;
    }

    tarefas.sort((a, b) => new Date(a.data) - new Date(b.data));

    tarefas.forEach(tarefa => {
        //  Converte a data ISO para DD/MM/AAAA para exibição
        const displayDate = convertToDDMMYYYY(tarefa.data);

        const listItem = document.createElement('li');
        listItem.classList.add('task-item');
        if (tarefa.completa) {
            listItem.classList.add('completed');
        }

        listItem.innerHTML = `
            <span class="task-text">${tarefa.texto}</span>
            <span class="task-date">${displayDate} ${tarefa.hora ? `às ${tarefa.hora}` : ''}</span>
            
            <div class="task-actions">
                <button class="btn-icon-only toggle-complete" data-id="${tarefa.id}">
                    ${tarefa.completa ? '↩️' : '✔️'}
                </button>
                
                <button class="btn-danger" data-id="${tarefa.id}">
                    🗑️
                </button>
            </div>
        `;

        // Anexa os listeners de ação
        listItem.querySelector('.toggle-complete').addEventListener('click', (e) => {
            toggleTarefa(Number(e.currentTarget.dataset.id));
        });

        listItem.querySelector('.btn-danger').addEventListener('click', (e) => {
            if (confirm('Tem certeza que deseja remover esta tarefa?')) {
                 removerTarefa(Number(e.currentTarget.dataset.id));
            }
        });

        taskList.appendChild(listItem);
    });
}

function removerTarefa(id) {
    let tarefas = carregarTarefas();
    tarefas = tarefas.filter(t => t.id !== id);
    salvarTarefas(tarefas);
    renderizarTarefas();
}

function toggleTarefa(id) {
    let tarefas = carregarTarefas();
    const tarefa = tarefas.find(t => t.id === id);
    if (tarefa) {
        tarefa.completa = !tarefa.completa;
        salvarTarefas(tarefas);
        renderizarTarefas();
    }
}


// ----------------------------------------------------
//  INICIALIZAÇÃO (Bloco DOMContentLoaded UNIFICADO)
// ----------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    // 1. Referências do DOM (apenas uma declaração)
    const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDateInput = document.getElementById('taskDate'); 
    const taskTimeInput = document.getElementById('taskTime'); 
    
    // 2. Aplica a máscara de data e hora
    if (taskDateInput) {
        applyDateMask(taskDateInput);
    }

    if (taskTimeInput) {
        applyTimeMask(taskTimeInput);
    }

    // 3. Listener do Formulário (Formato Corrigido)
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            
            const textoTarefa = taskInput.value.trim();
            const dataTarefaDDMMYYYY = taskDateInput.value.trim(); // Pega a data no formato DD/MM/AAAA
            const horaTarefa = taskTimeInput.value; 

            // Validação de Preenchimento
            if (textoTarefa === "" || dataTarefaDDMMYYYY === "") {
                alert("Por favor, preencha a descrição e a data.");
                return;
            }

            //  CONVERTE PARA FORMATO ISO ANTES DE SALVAR
            const isoDate = convertToISO(dataTarefaDDMMYYYY);
            
            if (!isoDate) {
                alert("Formato de data inválido. Use DD/MM/AAAA.");
                return;
            }

            const novaTarefa = {
                id: Date.now(),
                texto: textoTarefa,
                data: isoDate, // Salva no formato ISO (YYYY-MM-DD)
                hora: horaTarefa,
                completa: false
            };

            const tarefasAtuais = carregarTarefas();
            tarefasAtuais.push(novaTarefa);
            salvarTarefas(tarefasAtuais);
            
            // Limpa o formulário
            taskInput.value = '';
            taskDateInput.value = '';
            taskTimeInput.value = ''; 

            renderizarTarefas(); 
        });
    }

    // 4. Renderiza as tarefas existentes ao carregar a página
    renderizarTarefas(); 
});