const nowTime= ()=>{
        const d = new Date();
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

const addmessage = (content)=>{
    const typingEl = document.getElementById('typing');
    const messagesEl = document.getElementById('messages');
    
    const wrap = document.createElement('div');
    wrap.className = 'message bot';
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'S';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerText = `${content}`;
    const time = document.createElement('div')
    time.className = 'message-time'
    time.textContent = nowTime(); 
    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    wrap.appendChild(time);
    
    if (typingEl && typingEl.classList.contains('show')) {
            messagesEl.insertBefore(wrap,typingEl);
    } else {
            messagesEl.append(wrap, typingEl);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

export const addWordle = () => {
    // 1. Hapus container Wordle lama jika ada
    if (document.querySelector('.wordle-container')) {
        document.querySelector('.wordle-container').remove();
    }

    const typingEl = document.getElementById('typing');
    const messagesEl = document.getElementById('messages');

    // 2. Buat string 6 baris grid dengan cara yang benar
    const singleRowHtml = `<div class="wordle-row"><div class="tile"></div><div class="tile"></div><div class="tile"></div><div class="tile"></div><div class="tile"></div></div>`;
    const gridRowsHtml = singleRowHtml.repeat(6);

    const wrap = document.createElement('div');
    wrap.className = 'message bot';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'S';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = `
        <div class="wordle-container">
            <div class="wordle-grid">
                ${gridRowsHtml}
            </div>
            <div class="wordle-keyboard">
                <div class="kb-row">
                    ${['Q','W','E','R','T','Y','U','I','O','P'].map(k => `<button class="key">${k}</button>`).join('')}
                </div>
                <div class="kb-row">
                    ${['A','S','D','F','G','H','J','K','L'].map(k => `<button class="key">${k}</button>`).join('')}
                </div>
                <div class="kb-row">
                    <button class="key wide" id="wordle-enter">ENTER</button>
                    ${['Z','X','C','V','B','N','M'].map(k => `<button class="key">${k}</button>`).join('')}
                    <button class="key wide" id="wordle-del">DEL</button>
                </div>
            </div>
        </div>
    `;

    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = typeof nowTime === 'function' ? nowTime() : '';

    wrap.appendChild(avatar);
    wrap.appendChild(bubble);
    wrap.appendChild(time);

    // Sisipkan ke Chat Box
    if (typingEl && typingEl.classList.contains('show')) {
        messagesEl.insertBefore(wrap, typingEl);
    } else {
        messagesEl.append(wrap, typingEl);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;

    // 3. Logika Game Wordle
    const targetWord = "UTAMA"; 
    let currentRow = 0;
    let currentTile = 0;
    let gameOver = false;

    // Ambil elemen baris KHUSUS di dalam wrap bubble ini
    const rows = wrap.querySelectorAll('.wordle-row');

    const handleKeyPress = (letter) => {
        if (gameOver) return;

        if (letter === 'ENTER') {
            submitGuess();
        } else if (letter === 'DEL') {
            deleteLetter();
        } else if (/^[A-Z]$/.test(letter)) {
            addLetter(letter);
        }
    };

    const addLetter = (letter) => {
        if (currentTile < 5 && currentRow < 6) {
            const tiles = rows[currentRow].querySelectorAll('.tile');
            tiles[currentTile].textContent = letter;
            currentTile++;
        }
    };

    const deleteLetter = () => {
        if (currentTile > 0) {
            currentTile--;
            const tiles = rows[currentRow].querySelectorAll('.tile');
            tiles[currentTile].textContent = '';
        }
    };

    const submitGuess = () => {
        if (!rows[currentRow]) return;

        const tiles = rows[currentRow].querySelectorAll('.tile');
        let guess = "";
        tiles.forEach(tile => guess += tile.textContent);

        if (guess.length !== 5) {
            if (typeof addmessage === 'function') addmessage("⚠️ Kata harus 5 huruf!");
            return;
        }

        const targetArr = targetWord.split('');
        const guessArr = guess.split('');
        const result = new Array(5).fill('absent');
        const used = new Array(5).fill(false);

        // Pass 1: Hijau (Correct)
        for (let i = 0; i < 5; i++) {
            if (guessArr[i] === targetArr[i]) {
                result[i] = 'correct';
                used[i] = true;
            }
        }

        // Pass 2: Kuning (Present)
        for (let i = 0; i < 5; i++) {
            if (result[i] !== 'correct') {
                for (let j = 0; j < 5; j++) {
                    if (!used[j] && guessArr[i] === targetArr[j]) {
                        result[i] = 'present';
                        used[j] = true;
                        break;
                    }
                }
            }
        }

        // Terapkan warna ke tile & keyboard
        for (let i = 0; i < 5; i++) {
            tiles[i].classList.add(result[i]);
            
            const keyBtn = Array.from(wrap.querySelectorAll('.key'))
                                .find(btn => btn.textContent === guessArr[i]);
            if (keyBtn) {
                if (result[i] === 'correct') {
                    keyBtn.className = 'key correct';
                } else if (result[i] === 'present' && !keyBtn.classList.contains('correct')) {
                    keyBtn.className = 'key present';
                } else if (!keyBtn.classList.contains('correct') && !keyBtn.classList.contains('present')) {
                    keyBtn.classList.add('absent');
                }
            }
        }

        // Cek Menang / Kalah
        if (guess === targetWord) {
            gameOver = true;
            if (typeof addmessage === 'function') addmessage(`🎉 Selamat! Tebakanmu benar: **${targetWord}**`);
        } else if (currentRow === 5) {
            gameOver = true;
            if (typeof addmessage === 'function') addmessage(`❌ Kesempatan habis! Katanya adalah **${targetWord}**.`);
        } else {
            currentRow++;
            currentTile = 0; // Reset index huruf untuk baris berikutnya
        }
    };

    // Event Listener Klip Keyboard Virtual
    wrap.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => handleKeyPress(key.textContent.trim()));
    });
};