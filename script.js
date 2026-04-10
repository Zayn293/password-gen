onst passwordInput = document.getElementById('password-input');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

// Обновление длины
lengthSlider.oninput = () => {
    lengthVal.innerText = lengthSlider.value;
};

// Генерация пароля
function generate() {
    const length = parseInt(lengthSlider.value);

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = document.getElementById('use-upper').checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
    const numbers = document.getElementById('use-numbers').checked ? "0123456789" : "";
    const symbols = document.getElementById('use-symbols').checked ? "!@#$%^&*()_+~|}{[]:;?><,./-=" : "";

    const allChars = lower + upper + numbers + symbols;

    // защита от пустого набора символов
    if (!allChars) {
        alert("Выберите хотя бы один тип символов!");
        return;
    }

    let password = "";

    for (let i = 0; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    passwordInput.value = password;
    updateStrength(password);
}

// Проверка надёжности
function updateStrength(pwd) {
    let score = 0;

    if (!pwd) {
        strengthBar.style.width = '0%';
        strengthText.innerText = 'Введите пароль...';
        strengthText.style.color = '#7f8c8d';
        return;
    }

    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    const states = [
        { color: '#e74c3c', text: 'Очень слабый', width: '20%' },
        { color: '#e67e22', text: 'Слабый', width: '40%' },
        { color: '#f1c40f', text: 'Средний', width: '60%' },
        { color: '#3498db', text: 'Надежный', width: '80%' },
        { color: '#2ecc71', text: 'Максимальный', width: '100%' }
    ];

    const index = Math.min(score - 1, states.length - 1);
    const state = states[index];

    strengthBar.style.width = state.width;
    strengthBar.style.background = state.color;
    strengthText.innerText = state.text;
    strengthText.style.color = state.color;
}

// Кнопка генерации
generateBtn.addEventListener('click', generate);

// Проверка при вводе
passwordInput.addEventListener('input', (e) => {
    updateStrength(e.target.value);
});

// Копирование
copyBtn.addEventListener('click', () => {
    if (!passwordInput.value) {
        alert("Нет пароля для копирования!");
        return;
    }

    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.innerText = "✅";

    setTimeout(() => {
        copyBtn.innerText = "📋";
    }, 1000);
});
