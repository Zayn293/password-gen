const passwordInput = document.getElementById('password-input');
const generateBtn = document.getElementById('generate-btn');
const copyBtn = document.getElementById('copy-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');
const crackTimeText = document.getElementById('crack-time');
const lengthSlider = document.getElementById('length-slider');
const lengthVal = document.getElementById('length-val');
const themeBtn = document.getElementById('theme-toggle');

lengthSlider.oninput = () => lengthVal.innerText = lengthSlider.value;

// ✨ анимация генерации
function animatePassword(finalPassword) {
    let chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let iterations = 0;

    const interval = setInterval(() => {
        passwordInput.value = finalPassword
            .split("")
            .map((char, i) => {
                if (i < iterations) return finalPassword[i];
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("");

        if (iterations >= finalPassword.length) {
            clearInterval(interval);
            updateStrength(finalPassword);
        }

        iterations += 1 / 2;
    }, 30);
}

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

    animatePassword(password);
}

function updateStrength(pwd) {
    let score = 0;

    if (!pwd) return;

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

    const state = states[Math.min(score - 1, states.length - 1)];

    strengthBar.style.width = state.width;
    strengthBar.style.background = state.color;
    strengthText.innerText = state.text;

    crackTimeText.innerText = "Взлом: ~" + pwd.length + " символов → долго 😎";
}

generateBtn.addEventListener('click', generate);

passwordInput.addEventListener('input', (e) => {
    updateStrength(e.target.value);
});

copyBtn.addEventListener('click', () => {
    if (!passwordInput.value) return;

    navigator.clipboard.writeText(passwordInput.value);
    copyBtn.innerText = "✅";

    setTimeout(() => {
        copyBtn.innerText = "📋";
    }, 1000);
});

// тема
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeBtn.innerText = '☀️';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');

    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeBtn.innerText = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeBtn.innerText = '🌙';
    }
});
