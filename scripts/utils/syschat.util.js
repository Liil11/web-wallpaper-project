import { nowTime } from "./time.util.js";

const welcomeEl = document.getElementById('welcome');
const popupEl = document.getElementById('popup');
const typingEl = document.getElementById('typing');
const messagesEl = document.getElementById('messages');

function escapeHtml(s) {
        return String(s)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

const hideWelcome = ()=>{
        if (welcomeEl && !welcomeEl.classList.contains('hidden')) {
            welcomeEl.classList.add('hidden');
        }
    }

export const addMessage = (role, content)=>{
    hideWelcome();
    const messageRole = role === 'user'? 'user' : 'bot'
    const wrap = document.createElement('div');
    wrap.className = `message ${messageRole}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? 'U' : 'S';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = escapeHtml(content).replace(/\n/g, '<br>');
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
            messagesEl.append(popupEl);
    }
    messagesEl.scrollTop = messagesEl.scrollHeight;
}