// Зашифрованные данные для аутентификации
const AUTH_DATA = {
    "hash": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // Замените на ваш хеш
    "salt": "$2b$10$92IXUNpkjO0rOQ5byMi.Ye", // Замените на ваш соль
    "iterations": 10000
};

// Функция для проверки пароля
function verifyPassword(password) {
    const hash = AUTH_DATA.hash;
    const salt = AUTH_DATA.salt;
    const iterations = AUTH_DATA.iterations;

    // Шифруем введенный пароль с той же солью
    const hashedInput = CryptoJS.PBKDF2(password, salt, {
        keySize: 256/32,
        iterations: iterations
    }).toString(CryptoJS.enc.Hex);

    // Сравниваем хеши
    return hash === hashedInput;
}

// Экспортируем функцию для использования
export { verifyPassword };
