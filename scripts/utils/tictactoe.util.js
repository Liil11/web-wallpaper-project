import { addMessage } from './syschat.util.js';
import {nowTime}  from './time.util.js';
//html var
const popupEl = document.getElementById('popup')

//time

export const addTictactoe = (sys)=>{
    if(document.querySelector('.tictactoe-container')){
        document.querySelector('.tictactoe-container').remove();
    }
    const typingEl = document.getElementById('typing');
    const messagesEl = document.getElementById('messages');

    const wrap = document.createElement('div');
    wrap.className = 'message bot';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = 'S';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = `<div class="tictactoe-container">
    <button class="box"></button><button class="box"></button><button class="box"></button>
    <button class="box"></button><button class="box"></button><button class="box"></button>
    <button class="box"></button><button class="box"></button><button class="box"></button>
    </div>`;

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
    const winPatterns = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [3, 4, 5],
        [6, 7, 8]
    ];
    let turn = true;
    let t = document.querySelectorAll('.box');
    t.forEach((box)=>{
        box.addEventListener('click', ()=>{
            if(turn){
                box.style.color = '#08519C'
                box.innerText = 'O';
                box.disabled = true;
                turn = false;
                if (checkWinner() != true){
                    opponentMoves();
                }
            }
        })
    })
    const disableBoxes = () => {
        for (let box of t) {
            box.disabled = true;
        }
    };
    const checkWinner = () => {
        let hasWin = false;
        for (let pattern of winPatterns) {
            let pos1Val = t[pattern[0]].innerText;
            let pos2Val = t[pattern[1]].innerText;
            let pos3Val = t[pattern[2]].innerText;

            if (pos1Val !== "" && pos2Val!=="" && pos3Val!=="" 
                && pos1Val === pos2Val && pos2Val === pos3Val) {
                hasWin = true;
                disableBoxes();
                addMessage('bot',`Congratulations! ${pos1Val} is a Winner!`);
                return true;
            }
        }

        if (!hasWin) {
            const allBoxes = [...t].every((box) => box.innerText !== "");
            if (allBoxes) {
                addMessage('bot',`That's it's folks, what a close match!`);
                return true;
            }
        }
        
    };
    const opponentMoves = async ()=>{
        const box = Array.from(document.querySelectorAll('.box'));
        const emptyBox = box.filter(box => !box.disabled);
        
        if(emptyBox === 0 ) return;

        const typing = document.getElementById('typing');
        typing.classList.toggle('show', true)
        messagesEl.scrollTop = messagesEl.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, 500))
        typing.classList.toggle('show', false)
        let choice;

        choice = getW('X', box);

        if(!choice){
            choice = getW('O', box);
        }

        if(!choice){
            const center = box[4];
            if(!center.disabled){
                choice = center;
            }
        }

        if(!choice){
            const corner = [box[0],box[2],box[6],box[8]].filter(box => !box.disabled);
            if(corner.length > 0){
                choice = corner[Math.floor(Math.random()*corner.length)];   
            }
        }

        if(!choice){
            choice = emptyBox[Math.floor(Math.random()*emptyBox.length)];
        }
        
        if(choice != undefined){
            choice.textContent = 'X';
            choice.style.color = '#FA003F'
            choice.disabled = true;
            checkWinner();
            turn = true;
        }
    }
     const getW = (side, boxes)=>{
        for (let combo of winPatterns){
            const [a,b,c] = combo;
            const values = [
                boxes[a].textContent,
                boxes[b].textContent,
                boxes[c].textContent
            ]
            if (values.filter(value => value === side ).length === 2 && values.includes('')){
                const emptyBoxes = combo[
                    values.findIndex(value => value === '')
                ];

                return boxes[emptyBoxes];
            }
        }
        return;
    }   
    
}
