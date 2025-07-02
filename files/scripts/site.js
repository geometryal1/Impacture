document.addEventListener('DOMContentLoaded', () => {
  const store = JSON.parse(localStorage.getItem('siteContent') || '{}');

  // Главная страница
  const titleEl = document.getElementById('main-title');
  if (titleEl && store.mainTitle) titleEl.textContent = store.mainTitle;
  const subtitleEl = document.getElementById('main-subtitle');
  if (subtitleEl && store.mainSubtitle) subtitleEl.textContent = store.mainSubtitle;

  // Карточки главной страницы
  const cardsContainer = document.getElementById('cards-container');
  // If no stored cards and there are cards in DOM, import them
  if ((!store.cards || store.cards.length === 0) && cardsContainer) {
    const domCards = cardsContainer.querySelectorAll('.card');
    store.cards = Array.from(domCards).map((c) => ({
      title: c.querySelector('.card-title')?.textContent.trim() || '',
      text: c.querySelector('.card-text')?.textContent.trim() || '',
      img: c.querySelector('img')?.getAttribute('src') || '',
    }));
    localStorage.setItem('siteContent', JSON.stringify(store));
  }
  if (cardsContainer && Array.isArray(store.cards)) {
    cardsContainer.innerHTML = '';
    store.cards.forEach((card) => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 mt-4';
      col.innerHTML = `
        <div class="card" style="width: 18rem">
          <img src="${card.img || ''}" class="card-img-top" alt="" />
          <div class="card-body">
            <h5 class="card-title">${card.title || ''}</h5>
            <p class="card-text">${card.text || ''}</p>
          </div>
        </div>`;
      cardsContainer.appendChild(col);
    });
  }

  // Карточки страницы студентов
  let studentCardsContainer = document.getElementById('student-cards');
  if (!studentCardsContainer) {
    // fallback: первая .row внутри section
    const section = document.querySelector('section');
    if (section) studentCardsContainer = section.querySelector('.row');
  }
  // import student cards if empty
  if ((!store.studentCards || store.studentCards.length === 0) && studentCardsContainer) {
    const domCards = studentCardsContainer.querySelectorAll('.card');
    store.studentCards = Array.from(domCards).map((c) => ({
      title: c.querySelector('.card-title')?.textContent.trim() || '',
      text: c.querySelector('.card-text')?.textContent.trim() || '',
      img: c.querySelector('img')?.getAttribute('src') || '',
    }));
    localStorage.setItem('siteContent', JSON.stringify(store));
  }
  if (studentCardsContainer && Array.isArray(store.studentCards)) {
    studentCardsContainer.innerHTML = '';
    store.studentCards.forEach((card) => {
      const col = document.createElement('div');
      col.className = 'col-lg-4 col-md-6 mt-4';
      col.innerHTML = `
        <div class="card" style="width: 18rem">
          <img src="${card.img || ''}" class="card-img-top" alt="" />
          <div class="card-body">
            <h5 class="card-title">${card.title || ''}</h5>
            <p class="card-text">${card.text || ''}</p>
          </div>
        </div>`;
      studentCardsContainer.appendChild(col);
    });
  }
});
