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

    // оценка взлома
    if (pwd.length < 8) {
        crackTimeText.innerText = "Взлом: очень быстро";
    } else if (pwd.length < 12) {
        crackTimeText.innerText = "Взлом: минуты/часы";
    } else if (pwd.length < 16) {
        crackTimeText.innerText = "Взлом: дни/годы";
    } else {
        crackTimeText.innerText = "Взлом: практически невозможно";
    }
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
