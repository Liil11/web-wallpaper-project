
import { functionMap } from "./map/function.map.js";
import { firstGreeting, updateClock } from "./utils/time.util.js";
import { addMessage } from "./utils/syschat.util.js";

    'use strict';
    //element camelCase 
    const messagesEl = document.getElementById('messages');
    const welcomeEl   = document.getElementById('welcome');
    const typingEl    = document.getElementById('typing');
    const formEl      = document.getElementById('composer');
    const inputEl     = document.getElementById('input');
    const sendBtn     = document.getElementById('send');
    //maybe we don't need it, maybe we need,idk
    const popupBtn = document.getElementById('option-btn');
    const popupEl = document.getElementById('popup');


    firstGreeting();
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
            const funcVar = query.split(' ');
            try {
                if(funcVar.length != 1){
                    if(functionMap[funcVar[0]]){
                        return functionMap[funcVar[0]](funcVar[1]);
                    }
                }
                if(functionMap[query]){
                    return functionMap[query]();
                }
            } catch (error) {
                console.log(error);
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
        
        chip.addEventListener('click', () =>{ 
            send(chip.dataset.text || chip.textContent);
            if(popupEl.classList.contains('show') && popupBtn.classList.contains('rotate')){ 
            popupEl.classList.toggle('show');
            popupBtn.classList.toggle('rotate');
        };
        });
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
    popupBtn.addEventListener('click',()=>{
       popupEl.classList.toggle('show');
       popupBtn.classList.toggle('rotate');
       messagesEl.scrollTop = messagesEl.scrollHeight;
    })
    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const availableTheme = ['theme-dark','theme-light'];
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            themeToggle.classList.toggle('rotate');
            if (body.classList.contains('theme-dark')) {
                body.classList.replace('theme-dark', 'theme-light');
            } else if (body.classList.contains('theme-light')) {
                body.classList.replace('theme-light', 'theme-dark');
            } else {
                body.classList.add('theme-dark');
            }
        });
    }
    // Set default theme on load
    document.body.classList.add('theme-dark');

    // Friendly initial state
    if (welcomeEl) welcomeEl.classList.remove('hidden');
    inputEl.focus();

    