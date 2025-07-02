// Функции для управления админ-панелью
const adminPanel = document.getElementById('adminPanel');
const adminForm = document.getElementById('adminForm');
const addTeamBtn = document.getElementById('addTeam');
const editTeamBtn = document.getElementById('editTeam');
const deleteTeamBtn = document.getElementById('deleteTeam');
const teamFilter = document.getElementById('teamFilter');
const teamGrid = document.getElementById('teamGrid');

document.addEventListener('DOMContentLoaded', function() {
    // Функция для мобильного меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        // Закрыть меню при клике вне его
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                mobileNav.classList.remove('active');
            }
        });
    }
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = '1234';
    const loginScreen = document.getElementById('login-screen');
    const adminContent = document.getElementById('admin-content');
    const loginForm = document.getElementById('login-form');
    const loginUser = document.getElementById('login-user');
    const loginPass = document.getElementById('login-pass');
    const addTeamButton = document.getElementById('add-team');
    const teamsTbody = document.getElementById('teams-tbody');
    const logged = sessionStorage.getItem('isAdmin') === 'true';

    // Проверка авторизации
    if (logged) {
        loginScreen.classList.add('d-none');
        adminContent.classList.remove('d-none');
        initAdmin();
    } else {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (loginUser.value === ADMIN_USER && loginPass.value === ADMIN_PASS) {
                sessionStorage.setItem('isAdmin', 'true');
                loginScreen.classList.add('d-none');
                adminContent.classList.remove('d-none');
                initAdmin();
            } else {
                alert('Неверные данные');
            }
        });
    }

    function initAdmin() {
        // Инициализация таблицы команд
        let store = JSON.parse(localStorage.getItem('teamsStore') || '{}');
        if (!store.teams || store.teams.length === 0) {
            // Импортируем существующие команды из DOM
            const temp = document.createElement('div');
            fetch('student-page.html').then(r => r.text()).then(html => {
                temp.innerHTML = html;
                const cards = temp.querySelectorAll('.team-card');
                store.teams = Array.from(cards).map(c => ({
                    name: c.querySelector('h3')?.textContent.trim() || '',
                    region: c.querySelector('.team-location')?.textContent.trim() || '',
                    direction: c.querySelector('.team-direction')?.textContent.trim() || '',
                    status: c.querySelector('.team-status')?.textContent.trim() || '',
                    image: c.querySelector('img')?.getAttribute('src') || '',
                    description: c.querySelector('.team-description')?.textContent.trim() || '',
                    members: c.querySelector('.team-members')?.textContent.trim() || '0',
                    projects: c.querySelector('.team-projects')?.textContent.trim() || '0'
                }));
                renderTable(teamsTbody, store.teams);
            });
        } else {
            renderTable(teamsTbody, store.teams);
        }

        // Обработчик добавления команды
        addTeamButton.addEventListener('click', () => {
            store.teams.push({
                name: '',
                region: '',
                direction: '',
                status: '',
                image: '',
                description: '',
                members: '0',
                projects: '0'
            });
            renderTable(teamsTbody, store.teams);
        });
    }

    function renderTable(tbody, teams) {
        tbody.innerHTML = '';
        teams.forEach((team, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input class="form-control" value="${team.name || ''}"></td>
                <td><input class="form-control" value="${team.region || ''}"></td>
                <td><input class="form-control" value="${team.direction || ''}"></td>
                <td><input class="form-control" value="${team.status || ''}"></td>
                <td><input class="form-control" value="${team.image || ''}"></td>
                <td><input class="form-control" value="${team.description || ''}"></td>
                <td><input class="form-control" value="${team.members || ''}"></td>
                <td><input class="form-control" value="${team.projects || ''}"></td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteTeam(${idx})">✖</button>
                </td>`;

            // Обновляем значения при изменении
            const inputs = tr.querySelectorAll('input');
            inputs.forEach((input, i) => {
                input.addEventListener('input', () => {
                    const fields = ['name', 'region', 'direction', 'status', 'image', 'description', 'members', 'projects'];
                    team[fields[i]] = input.value;
                    localStorage.setItem('teamsStore', JSON.stringify(store));
                });
            });
            tbody.appendChild(tr);
        });
    }

    // Функция удаления команды
    function deleteTeam(idx) {
        if (confirm('Вы уверены, что хотите удалить эту команду?')) {
            store.teams.splice(idx, 1);
            localStorage.setItem('teamsStore', JSON.stringify(store));
            renderTable(teamsTbody, store.teams);
        }
    }
});

// Функционал для страницы инженерных команд

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация фильтров
    const filters = {
        region: document.querySelector('select[name="region"]'),
        discipline: document.querySelector('select[name="discipline"]'),
        status: document.querySelector('select[name="status"]')
    };

    // Обработка поиска
    const searchInput = document.querySelector('input[type="search"]');
    searchInput.addEventListener('input', debounce(searchTeams, 300));

    // Функция для поиска команд
    function searchTeams() {
        const searchTerm = searchInput.value.toLowerCase();
        const teams = document.querySelectorAll('.team-card');
        
        teams.forEach(team => {
            const title = team.querySelector('p').textContent.toLowerCase();
            const location = team.querySelector('.team-location').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm) || location.includes(searchTerm);
            team.style.display = isVisible ? 'block' : 'none';
        });
    }

    // Функция для фильтрации команд
    function filterTeams() {
        const teams = document.querySelectorAll('.team-card');
        const selectedRegion = filters.region.value;
        const selectedDiscipline = filters.discipline.value;
        const selectedStatus = filters.status.value;
        
        teams.forEach(team => {
            let isVisible = true;
            
            // Проверка региона
            if (selectedRegion !== 'one') {
                const region = team.dataset.region;
                isVisible = isVisible && region === selectedRegion;
            }
            
            // Проверка направления
            if (selectedDiscipline !== 'one') {
                const discipline = team.dataset.discipline;
                isVisible = isVisible && discipline === selectedDiscipline;
            }
            
            // Проверка статуса
            if (selectedStatus !== 'one') {
                const status = team.dataset.status;
                isVisible = isVisible && status === selectedStatus;
            }
            
            team.style.display = isVisible ? 'block' : 'none';
        });
    }

    // Добавление обработчиков событий для фильтров
    Object.values(filters).forEach(filter => {
        filter.addEventListener('change', filterTeams);
    });

    // Функция для плавного скролла
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Функция для дебаунса
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Функция для отображения команд
function displayTeams() {
    teamGrid.innerHTML = '';
    
    teams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <img src="${team.image}" alt="${team.name}" class="team-image">
            <div class="team-info">
                <h3 class="team-name">${team.name}</h3>
                <p class="team-position">Руководитель: ${team.leader}</p>
                <p class="team-description">${team.description}</p>
            </div>
        `;
        teamGrid.appendChild(teamCard);
    });
}

// Функции для админ-панели
function openAdminPanel() {
    adminPanel.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeAdminPanel() {
    adminPanel.style.display = 'none';
    document.body.style.overflow = 'auto';
    adminForm.style.display = 'none';
}

// Обработчики событий для кнопок админ-панели
addTeamBtn.addEventListener('click', () => {
    showAddTeamForm();
});

editTeamBtn.addEventListener('click', () => {
    showEditTeamForm();
});

deleteTeamBtn.addEventListener('click', () => {
    showDeleteTeamForm();
});

// Функции для показа форм
function showAddTeamForm() {
    adminForm.innerHTML = `
        <h3>Добавить команду</h3>
        <form id="addTeamForm">
            <input type="text" placeholder="Название команды" required><br>
            <input type="text" placeholder="Руководитель" required><br>
            <textarea placeholder="Описание команды" required></textarea><br>
            <input type="url" placeholder="Ссылка на фото" required><br>
            <select required>
                <option value="lead">Руководители</option>
                <option value="member">Члены команды</option>
            </select><br>
            <button type="submit">Добавить</button>
            <button type="button" onclick="closeAdminPanel()">Отмена</button>
        </form>
    `;
    adminForm.style.display = 'block';
}

function showEditTeamForm() {
    adminForm.innerHTML = `
        <h3>Редактировать команду</h3>
        <form id="editTeamForm">
            <select id="teamSelect" required>
                ${teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
            </select><br>
            <input type="text" placeholder="Название команды" required><br>
            <input type="text" placeholder="Руководитель" required><br>
            <textarea placeholder="Описание команды" required></textarea><br>
            <input type="url" placeholder="Ссылка на фото" required><br>
            <select required>
                <option value="lead">Руководители</option>
                <option value="member">Члены команды</option>
            </select><br>
            <button type="submit">Сохранить</button>
            <button type="button" onclick="closeAdminPanel()">Отмена</button>
        </form>
    `;
    adminForm.style.display = 'block';
}

function showDeleteTeamForm() {
    adminForm.innerHTML = `
        <h3>Удалить команду</h3>
        <form id="deleteTeamForm">
            <select id="teamToDelete" required>
                ${teams.map(team => `<option value="${team.id}">${team.name}</option>`).join('')}
            </select><br>
            <button type="submit">Удалить</button>
            <button type="button" onclick="closeAdminPanel()">Отмена</button>
        </form>
    `;
    adminForm.style.display = 'block';
}

// Фильтр команд
function filterTeams() {
    const filterValue = teamFilter.value;
    const filteredTeams = teams.filter(team => {
        return filterValue === 'all' || team.type === filterValue;
    });
    
    teamGrid.innerHTML = '';
    filteredTeams.forEach(team => {
        const teamCard = document.createElement('div');
        teamCard.className = 'team-card';
        teamCard.innerHTML = `
            <img src="${team.image}" alt="${team.name}" class="team-image">
            <div class="team-info">
                <h3 class="team-name">${team.name}</h3>
                <p class="team-position">Руководитель: ${team.leader}</p>
                <p class="team-description">${team.description}</p>
            </div>
        `;
        teamGrid.appendChild(teamCard);
    });
}

// Инициализация
window.addEventListener('load', () => {
    displayTeams();
    teamFilter.addEventListener('change', filterTeams);
});

// Закрытие админ-панели при клике вне её
adminPanel.addEventListener('click', (e) => {
    if (e.target === adminPanel) {
        closeAdminPanel();
    }
});
