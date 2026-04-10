const passwordInput = document.getElementById('password-input');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

lengthSlider.oninput = () => lengthVal.innerText = lengthSlider.value;

// генерация
function generate() {
    const length = parseInt(lengthSlider.value);

    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = document.getElementById('use-upper').checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "";
    const numbers = document.getElementById('use-numbers').checked ? "0123456789" : "";
    const symbols = document.getElementById('use-symbols').checked ? "!@#$%^&*()_+~|}{[]:;?><,./-=" : "";

    const allChars = lower + upper + numbers + symbols;

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

// перевод секунд в нормальный текст
function formatTime(seconds) {
    if (seconds < 1) return "мгновенно";
    if (seconds < 60) return `${Math.round(seconds)} сек`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} мин`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} ч`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} дней`;
    if (seconds < 3153600000) return `${Math.round(seconds / 31536000)} лет`;
    return "сотни лет";
}

// проверка
function updateStrength(pwd) {
    if (!pwd) {
        strengthBar.style.width = '0%';
        strengthText.innerText = 'Введите пароль...';
        crackTimeText.innerText = '';
        return;
    }

    let score = 0;

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

    const index = Math.max(0, Math.min(score - 1, states.length - 1));
    const state = states[index];

    strengthBar.style.width = state.width;
    strengthBar.style.background = state.color;
    strengthText.innerText = state.text;
    strengthText.style.color = state.color;

    // РЕАЛЬНАЯ ОЦЕНКА ВРЕМЕНИ ВЗЛОМА

    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charsetSize += 32;

    const combinations = Math.pow(charsetSize, pwd.length);

    // скорость перебора (примерно)
    const guessesPerSecond = 1e9; // 1 миллиард/сек

    const seconds = combinations / guessesPerSecond;

    crackTimeText.innerText = "Взлом: " + formatTime(seconds);
}

// события
generateBtn.addEventListener('click', generate);

passwordInput.addEventListener('input', (e) => {
    updateStrength(e.target.value);
});

copyBtn.addEventListener('click', () => {
    if (!passwordInput.value) return;

    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.innerText = "OK";

    setTimeout(() => {
        copyBtn.innerText = "📋";
    }, 1000);
});
