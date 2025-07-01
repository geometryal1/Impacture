import { verifyPassword } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginScreen = document.getElementById('login-screen');
  const adminContent = document.getElementById('admin-content');
  const loginForm = document.getElementById('login-form');
  const loginUser = document.getElementById('login-user');
  const loginPass = document.getElementById('login-pass');

  // Обработчик формы входа
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const enteredPassword = loginPass.value;
    
    // Проверяем пароль
    if (verifyPassword(enteredPassword)) {
      // Устанавливаем токен в localStorage
      localStorage.setItem('adminToken', 'valid');
      
      // Скрываем форму входа и показываем админ-панель
      loginScreen.classList.add('d-none');
      adminContent.classList.remove('d-none');
      initAdmin();
    } else {
      alert('Неверный логин или пароль');
    }
  });

  // Проверяем наличие токена при загрузке страницы
  if (localStorage.getItem('adminToken') === 'valid') {
    loginScreen.classList.add('d-none');
    adminContent.classList.remove('d-none');
    initAdmin();
  }

  function initAdmin() {
    const titleInput = document.getElementById('title-input');
    const subtitleInput = document.getElementById('subtitle-input');
    const cardsBody = document.getElementById('cards-tbody');
    const studentCardsBody = document.getElementById('student-cards-tbody');
    const addStudentCardBtn = document.getElementById('add-student-card');
    const saveBtn = document.getElementById('save-btn');

    let store = JSON.parse(localStorage.getItem('siteContent') || '{}');
    if (!store.cards || store.cards.length === 0) {
      // импорт карт из DOM главной
      const temp = document.createElement('div');
      const response = fetch('index.html');
      response.text().then(html => {
        temp.innerHTML = html;
        const cards = temp.querySelectorAll('#cards-container .card');
        store.cards = Array.from(cards).map(c => ({
          title: c.querySelector('.card-title')?.textContent.trim() || '',
          text: c.querySelector('.card-text')?.textContent.trim() || '',
          img: c.querySelector('img')?.getAttribute('src') || ''
        }));
        renderTable(cardsBody, store.cards);
      });
    }

    if (!store.studentCards || store.studentCards.length === 0) {
      const temp2 = document.createElement('div');
      const response2 = fetch('student-page.html');
      response2.text().then(html2 => {
        temp2.innerHTML = html2;
        const cards = temp2.querySelectorAll('.card');
        store.studentCards = Array.from(cards).map(c => ({
          title: c.querySelector('.card-title')?.textContent.trim() || '',
          text: c.querySelector('.card-text')?.textContent.trim() || '',
          img: c.querySelector('img')?.getAttribute('src') || ''
        }));
        renderTable(studentCardsBody, store.studentCards);
      });
    }

    // заполнение полей
    if (store.mainTitle) titleInput.value = store.mainTitle;
    if (store.mainSubtitle) subtitleInput.value = store.mainSubtitle;

    function renderTable(tbody, arr) {
      tbody.innerHTML = '';
      arr.forEach((card, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><input class="form-control" value="${card.title || ''}"></td>
          <td><input class="form-control" value="${card.text || ''}"></td>
          <td><input class="form-control" value="${card.img || ''}"></td>
          <td>
            <button class="btn btn-danger btn-sm">✖</button>
            <button class="btn btn-info btn-sm" onclick="createTeamPage(${idx})">Создать страницу</button>
          </td>`;

        const [titleI, textI, imgI] = tr.querySelectorAll('input');
        titleI.addEventListener('input', () => (card.title = titleI.value));
        textI.addEventListener('input', () => (card.text = textI.value));
        imgI.addEventListener('input', () => (card.img = imgI.value));
        tr.querySelector('button').addEventListener('click', () => {
          arr.splice(idx, 1);
          renderTable(tbody, arr);
        });
        tbody.appendChild(tr);
      });
    }

    // начальный рендер
    renderTable(cardsBody, store.cards);
    renderTable(studentCardsBody, store.studentCards);

    addStudentCardBtn.addEventListener('click', () => {
      store.studentCards.push({ title: '', text: '', img: '' });
      renderTable(studentCardsBody, store.studentCards);
    });

    saveBtn.addEventListener('click', () => {
      store.mainTitle = titleInput.value;
      store.mainSubtitle = subtitleInput.value;
      localStorage.setItem('siteContent', JSON.stringify(store));
      alert('Сохранено!');
    });
  }
});
