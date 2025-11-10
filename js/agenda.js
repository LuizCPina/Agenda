let currentMonth = new Date();
const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

function renderCalendar() {
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const daysContainer = document.getElementById('calendarDays');
    
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


document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => navigateMonth('prev'));
    document.getElementById('nextMonth').addEventListener('click', () => navigateMonth('next'));
    
});