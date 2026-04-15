const passwordInput = document.getElementById('password-input');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');
const entropyText = document.getElementById('entropy-text');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');

let isManualInput = false;
let inputHistory = "";

lengthSlider.oninput = () => {
    lengthVal.innerText = lengthSlider.value;
};

function generate() {
    isManualInput = false;
    inputHistory = "";

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

function formatTime(sec) {
    if (sec < 1) return "мгновенно";
    if (sec < 60) return Math.round(sec) + " сек";
    if (sec < 3600) return Math.round(sec / 60) + " мин";
    if (sec < 86400) return Math.round(sec / 3600) + " ч";
    if (sec < 31536000) return Math.round(sec / 86400) + " дней";
    if (sec < 3153600000) return Math.round(sec / 31536000) + " лет";
    return "сотни лет";
}

function updateStrength(pwd) {
    if (!pwd) {
        strengthBar.style.width = '0%';
        strengthBar.style.background = '#ecf0f1';

        strengthText.innerText = 'Введите пароль...';
        strengthText.style.color = '#7f8c8d';

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

    const entropy = pwd.length * Math.log2(charsetSize);
    entropyText.innerText = "Энтропия: " + Math.round(entropy) + " бит";

    const combinations = Math.pow(2, entropy);
    const seconds = combinations / 1e9;

    crackTimeText.innerText = "Взлом: " + formatTime(seconds);

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

passwordInput.addEventListener('input', (e) => {
    isManualInput = true;

    const value = e.target.value;
    inputHistory += value.slice(-1);

    updateStrength(value);
    checkEasterEgg(value);
});

generateBtn.addEventListener('click', generate);

copyBtn.addEventListener('click', () => {
    if (!passwordInput.value) return;

    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.innerText = "OK";

    setTimeout(() => {
        copyBtn.innerText = "📋";
    }, 1000);
});

// пасхалки
function checkEasterEgg(pwd) {
    if (!isManualInput) return;

    if (/^#[0-9A-Fa-f]{6}$/.test(pwd)) {
        document.body.style.background = pwd;
    }

    if (pwd.toLowerCase() === "matrix") {
        triggerMatrix();
    }

    if (pwd === "112358") {
        alert("Фибоначчи обнаружен");
    }

    if (/^[01]{8,}$/.test(pwd)) {
        alert("Двоичный режим активирован");
    }

    if (pwd.length > 4 && pwd === pwd.split('').reverse().join('')) {
        alert("Палиндром!");
    }

    if (inputHistory.includes("upupdowndown")) {
        alert("Секретная комбинация активирована");
        inputHistory = "";
    }
}

function triggerMatrix() {
    document.body.style.background = "black";
    document.body.style.color = "#00ff00";

    const text = document.createElement("div");
    text.innerText = "Wake up, Neo...";
    text.style.position = "fixed";
    text.style.top = "50%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.fontSize = "24px";

    document.body.appendChild(text);

    setTimeout(() => {
        text.remove();
        document.body.style.background = "";
        document.body.style.color = "";
    }, 3000);
}
