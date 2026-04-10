const passwordInput = document.getElementById('password-input');

const generateBtn = document.getElementById('generate-btn');

const copyBtn = document.getElementById('copy-btn');

const strengthBar = document.getElementById('strength-bar');

const strengthText = document.getElementById('strength-text');

const lengthSlider = document.getElementById('length-slider');

const lengthVal = document.getElementById('length-val');

// Обновление цифры длины

lengthSlider.oninput = () => lengthVal.innerText = lengthSlider.value;

// Логика генерации

function generate() {

    const length = lengthSlider.value;

    const charset = {

        lower: "abcdefghijklmnopqrstuvwxyz",

        upper: document.getElementById('use-upper').checked ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",

        numbers: document.getElementById('use-numbers').checked ? "0123456789" : "",

        symbols: document.getElementById('use-symbols').checked ? "!@#$%^&*()_+~`|}{[]:;?><,./-=" : ""

    };

    let allChars = charset.lower + charset.upper + charset.numbers + charset.symbols;

    let password = "";

    

    for (let i = 0; i < length; i++) {

        password += allChars.charAt(Math.floor(Math.random() * allChars.length));

    }

    passwordInput.value = password;

    updateStrength(password);

}

// Проверка надежности

function updateStrength(pwd) {

    let score = 0;

    if (!pwd) {

        score = 0;

    } else {

        if (pwd.length >= 8) score++;

        if (pwd.length >= 12) score++;

        if (/[A-Z]/.test(pwd)) score++;

        if (/[0-9]/.test(pwd)) score++;

        if (/[^A-Za-z0-9]/.test(pwd)) score++;

    }

    const states = [

        { color: '#e74c3c', text: 'Очень слабый', width: '20%' },

        { color: '#e67e22', text: 'Слабый', width: '40%' },

        { color: '#f1c40f', text: 'Средний', width: '60%' },

        { color: '#3498db', text: 'Надежный', width: '80%' },

        { color: '#2ecc71', text: 'Максимальный', width: '100%' }

    ];

    if (score === 0) {

        strengthBar.style.width = '0';

        strengthText.innerText = 'Введите пароль...';

        strengthText.style.color = '#7f8c8d';

    } else {

        const state = states[score - 1];

        strengthBar.style.width = state.width;

        strengthBar.style.background = state.color;

        strengthText.innerText = state.text;

        strengthText.style.color = state.color;

    }

}

// Слушатели событий

generateBtn.addEventListener('click', generate);

passwordInput.addEventListener('input', (e) => updateStrength(e.target.value));

copyBtn.addEventListener('click', () => {

    navigator.clipboard.writeText(passwordInput.value);

    alert('Пароль скопирован!');

});
