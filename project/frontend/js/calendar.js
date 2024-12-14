let currentDate = new Date();
let bookedEvents = JSON.parse(localStorage.getItem('bookedEvents')) || {};
const calendarBody = document.getElementById('calendar-body');
const monthNameElement = document.getElementById('month-name');
const eventPopup = document.getElementById('event-popup');
const eventNameInput = document.getElementById('event-name');
const eventTimeInput = document.getElementById('event-time');
const cancelBtn = document.getElementById('cancel-btn');
const bookEventBtn = document.getElementById('book-event-btn');
const popupTitle = document.getElementById('popup-title');
const eventListContainer = document.getElementById('event-list-container');
cancelBtn.addEventListener('click', () => {
  eventPopup.style.display = 'none';
});

bookEventBtn.addEventListener('click', () => {
  const eventName = eventNameInput.value;
  const eventTime = eventTimeInput.value;
  const selectedDay = eventPopup.dataset.selectedDay;

  if (eventName && eventTime && selectedDay) {
    if (!bookedEvents[selectedDay]) {
      bookedEvents[selectedDay] = [];
    }
    bookedEvents[selectedDay].push({ eventName, eventTime });
    localStorage.setItem('bookedEvents', JSON.stringify(bookedEvents));

    alert(`Event "${eventName}" booked for ${selectedDay} at ${eventTime}`);

    eventNameInput.value = '';
    eventTimeInput.value = '';
    eventPopup.style.display = 'none';

    generateCalendar();
  } else {
    alert('Please fill in all details');
  }
});

function generateCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  let dayCount = 1;
  let rows = [];

  calendarBody.innerHTML = '';
  let row = document.createElement('tr');
  
  for (let i = 0; i < 6; i++) { 
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDayOfMonth) {
        row.appendChild(document.createElement('td'));
      } else if (dayCount <= daysInMonth) {
        let day = `${year}-${month + 1}-${dayCount}`;
        let dayCell = document.createElement('td');
        dayCell.classList.add('calendar-day');
        dayCell.dataset.day = day;
        dayCell.innerText = dayCount;
        if (bookedEvents[day] && bookedEvents[day].length > 0) {
          dayCell.innerText = `${dayCount} (${bookedEvents[day].length})`;
        }

        row.appendChild(dayCell);
        dayCount++;
      } else {
        row.appendChild(document.createElement('td'));
      }
    }
    rows.push(row);
    row = document.createElement('tr');
  }
  rows.forEach(r => calendarBody.appendChild(r));

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  monthNameElement.innerText = `${monthNames[month]} ${year}`;

  updateBookedDays();
}
function updateBookedDays() {
  const days = document.querySelectorAll('.calendar-day');
  days.forEach(day => {
    const dayDate = day.dataset.day;
    if (bookedEvents[dayDate] && bookedEvents[dayDate].length > 0) {
      day.classList.add('booked');
    }
  });
}
function showEventPopup(day) {
  eventPopup.dataset.selectedDay = day;
  
  if (bookedEvents[day] && bookedEvents[day].length > 0) {
    eventListContainer.innerHTML = '';
    bookedEvents[day].forEach((event, index) => {
      const eventDiv = document.createElement('div');
      eventDiv.classList.add('event-item');
      eventDiv.innerHTML = `
        <p><strong>Event:</strong> ${event.eventName}</p>
        <p><strong>Time:</strong> ${event.eventTime}</p>
        <button class="remove-event-btn" data-day="${day}" data-index="${index}">Remove</button>
      `;
      eventListContainer.appendChild(eventDiv);
    });
    const removeButtons = document.querySelectorAll('.remove-event-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const day = e.target.dataset.day;
        const index = e.target.dataset.index;

        removeEvent(day, index);
      });
    });
  } else {
    eventListContainer.innerHTML = '<p>No events booked for this day.</p>';
  }

  popupTitle.innerText = `Events for ${day}`;
  eventPopup.style.display = 'block';
}
function removeEvent(day, index) {
  if (bookedEvents[day] && bookedEvents[day].length > 0) {
    bookedEvents[day].splice(index, 1);

    if (bookedEvents[day].length === 0) {
      delete bookedEvents[day];
    }

    localStorage.setItem('bookedEvents', JSON.stringify(bookedEvents));
    generateCalendar();
  }
}
calendarBody.addEventListener('click', (event) => {
  if (event.target.classList.contains('calendar-day')) {
    const selectedDay = event.target.dataset.day;

    showEventPopup(selectedDay);
  }
});
document.getElementById('prev-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
});

document.getElementById('next-month').addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
});

generateCalendar();