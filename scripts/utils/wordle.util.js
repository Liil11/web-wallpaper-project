import { addMessage } from './syschat.util.js';
import { nowTime } from './time.util.js';
export const addWordle = async () => {
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

    // 3. Mengambil Wordle Resmi NYT via CORS Proxy
    let targetWord = "CATER"; // Default fallback
    
    // Format tanggal lokal hari ini ke YYYY-MM-DD
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;

    const nytUrl = `https://www.nytimes.com/svc/wordle/v2/${todayStr}.json`;
    const proxyUrl = `https://proxy.corsfix.com/?url=${encodeURIComponent(nytUrl)}`;

    try {
        const res = await fetch(proxyUrl);
        if (res.ok) {
            const data = await res.json();
            if (data && data.solution) {
                targetWord = data.solution.toUpperCase();
                console.log("NYT Solution Loaded");
            }
        }
    } catch (e) {
        console.warn("Gagal fetch NYT API, menggunakan fallback word:", e);
    }

    // 4. Logika Game Wordle
    let currentRow = 0;
    let currentTile = 0;
    let gameOver = false;

    const rows = document.querySelectorAll('.wordle-row');

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
        const tiles = rows[currentRow].querySelectorAll('.tile');
        let guess = "";
        tiles.forEach(tile => guess += tile.textContent);

        if (guess.length !== 5) {
            addmessage("Kata harus terdiri dari 5 huruf!");
            return;
        }

        const targetArr = targetWord.split('');
        const guessArr = guess.split('');
        const result = new Array(5).fill('absent');
        const used = new Array(5).fill(false);

        // Pass 1: Correct (Hijau)
        for (let i = 0; i < 5; i++) {
            if (guessArr[i] === targetArr[i]) {
                result[i] = 'correct';
                used[i] = true;
            }
        }

        // Pass 2: Present (Kuning)
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

        // Update Warna Tile & Keyboard
        for (let i = 0; i < 5; i++) {
            tiles[i].classList.add(result[i]);
            
            const keyBtn = Array.from(document.querySelectorAll('.key'))
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

        // Cek Status Menang / Kalah
        if (guess === targetWord) {
            gameOver = true;
            addmessage(`Selamat! Kamu berhasil memecahkan Wordle NYT hari ini (${todayStr}) dalam ${currentRow + 1} percobaan!`);
        } else if (currentRow === 5) {
            gameOver = true;
            addmessage(`Kesempatan habis! Kata NYT hari ini adalah **${targetWord}**.`);
        } else {
            currentRow++;
            currentTile = 0;
        }
    };

    // Event Listener Keyboard Virtual
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => handleKeyPress(key.textContent.trim()));
    });
};
