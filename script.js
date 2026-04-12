const passwordInput = document.getElementById('password-input');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');
const entropyText = document.getElementById('entropy-text');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

lengthSlider.oninput = () => {
    lengthVal.innerText = lengthSlider.value;
};

// генерация пароля
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

// формат времени
function formatTime(sec) {
    if (sec < 1) return "мгновенно";
    if (sec < 60) return Math.round(sec) + " сек";
    if (sec < 3600) return Math.round(sec / 60) + " мин";
    if (sec < 86400) return Math.round(sec / 3600) + " ч";
    if (sec < 31536000) return Math.round(sec / 86400) + " дней";
    if (sec < 3153600000) return Math.round(sec / 31536000) + " лет";
    return "сотни лет";
}

// оценка надежности через энтропию
function updateStrength(pwd) {
    if (!pwd) {
        strengthBar.style.width = '0%';
        strengthText.innerText = 'Введите пароль...';
        crackTimeText.innerText = '';
        entropyText.innerText = '';
        return;
    }

    let charsetSize = 0;

    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charsetSize += 32;

    if (charsetSize === 0) charsetSize = 1;

    // энтропия
    const entropy = pwd.length * Math.log2(charsetSize);
    entropyText.innerText = "Энтропия: " + Math.round(entropy) + " бит";

    // время взлома
    const combinations = Math.pow(2, entropy);
    const guessesPerSecond = 1e9;
    const seconds = combinations / guessesPerSecond;

    crackTimeText.innerText = "Взлом: " + formatTime(seconds);

    // оценка по энтропии
    let state;

    if (entropy < 40) {
        state = { color: '#e74c3c', text: 'Очень слабый', width: '20%' };
    } else if (entropy < 60) {
        state = { color: '#e67e22', text: 'Слабый', width: '40%' };
    } else if (entropy < 80) {
        state = { color: '#f1c40f', text: 'Средний', width: '60%' };
    } else if (entropy < 100) {
        state = { color: '#3498db', text: 'Надежный', width: '80%' };
    } else {
        state = { color: '#2ecc71', text: 'Максимальный', width: '100%' };
    }

    strengthBar.style.width = state.width;
    strengthBar.style.background = state.color;
    strengthText.innerText = state.text;
    strengthText.style.color = state.color;
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
