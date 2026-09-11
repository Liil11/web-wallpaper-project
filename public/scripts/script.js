
import { functionMap } from "./map/function.map.js";
import { updateClock } from "./utils/time.util.js";
(() => {
    'use strict';

    //element camelCase 
    const messagesEl = document.getElementById('messages');
    const welcomeEl   = document.getElementById('welcome');
    const typingEl    = document.getElementById('typing');
    const formEl      = document.getElementById('composer');
    const inputEl     = document.getElementById('input');
    const sendBtn     = document.getElementById('send');
    //maybe we don't need it, maybe we need,idk
    const refreshBtn = document.getElementById('option-btn');
    const popupEl = document.getElementById('popup');

    updateClock();
    setInterval(updateClock,1000);

    // Demo mode flag - set to false to use real API
    const DEMO_MODE = false;
    let prodMode = true;

    // Fake responses for demo mode
    const RESPONSES = [
        'I received your question.',
        'Thanks for asking! That\'s a great question.',
        'Let me help you with that.',
        'I\'m here to assist you.'
    ];

    function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    //const d=date h=hours m=minutes
    const nowTime= ()=>{
        const d = new Date();
        const h = String(d.getHours()).padStart(2, '0');
        const m = String(d.getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

    const hideWelcome = ()=>{
        if (welcomeEl && !welcomeEl.classList.contains('hidden')) {
            welcomeEl.classList.add('hidden');
        }
    }

    const addMessage = (role, text)=>{
        hideWelcome();

        const wrap = document.createElement('div');
        wrap.className = `message ${role}`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = role === 'user' ? 'U' : 'S';

        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

        const time = document.createElement('div');
        time.className = 'message-time';
        time.textContent = nowTime();

        wrap.appendChild(avatar);
        wrap.appendChild(bubble);
        wrap.appendChild(time);

        // Insert messages before typing indicator so typing appears at bottom
        if (typingEl && typingEl.classList.contains('show')) {
            messagesEl.insertBefore(wrap,typingEl);
        } else {;
            messagesEl.append(wrap, popupEl)
            messagesEl.append(wrap, typingEl);
        }
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    const setTyping = (on)=>{
        if (!typingEl) return ;
        typingEl.classList.toggle('show', !!on);
        if (on) messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    const disableInput = (disabled)=>{
        inputEl.disabled = disabled;
        sendBtn.disabled = disabled;
        inputEl.focus();
    }

    const getResponse = ()=>{
        const idx = Math.floor(Math.random() * RESPONSES.length);
        return RESPONSES[idx];
    }

    const sysRes = async (message)=>{
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (DEMO_MODE) {
            // Simulate delay and return fake response
            if (message.toLowerCase().includes("this is sparta")){
                return "Zeus!, Your Son Has Return!";
            }
            return getResponse();
        }


        if(message.toLowerCase().startsWith('/')){
            const query = message.toLowerCase().slice(1);
            try {
                if(functionMap[query]){
                    return functionMap[query]();
                } else {
                    return `${query} is not a Function Fool!`
                }
            } catch (error) {
                return error.message;
            }
        }
        return 'have a good day!';
    }

    //clear chat after interval
    let clearTimer;
    const chatClearTimer = async ()=>{
            clearTimeout(clearTimer);
            clearTimer = setTimeout(
                ()=>{
                    messagesEl.innerHTML= '';
                    addMessage('bot','hello, I am Aria, How can I help you?');
                    console.log('interval 10 sec');
                },60*1000 //10 sec
            );
        
    }

    const send = async (text)=>{
        const trimmed = String(text || '').trim();
        if (!trimmed) return;

        addMessage('user', trimmed);
        disableInput(true);
        setTyping(true);

        const answer = await sysRes(trimmed);

        setTyping(false);
        addMessage('bot', answer);
        disableInput(false);
    }

    
    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => send(chip.dataset.text || chip.textContent));
    });

    // Form submit (button + Enter)
    formEl.addEventListener('submit', e => {
        e.preventDefault();
        const v = inputEl.value;
        inputEl.value = '';
        send(v);
    });
    inputEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' ) {
            const v = inputEl.value;
            inputEl.value = '';
            send(v);
        }
        });


    // Auto-grow textarea
    inputEl.addEventListener('input', () => {
        inputEl.style.height = 'auto';
        inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
    });
    inputEl.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            formEl.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    });

    //malah buat ini aku jir
    //popupmenu
    refreshBtn.addEventListener('click',()=>{
       popupEl.classList.toggle('show');
    })
    // Friendly initial state
    if (welcomeEl) welcomeEl.classList.remove('hidden');
    inputEl.focus();
    
})();