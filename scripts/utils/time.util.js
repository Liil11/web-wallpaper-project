

export const time = ()=>{
    const d = new Date();
    return d;   
}

export const nowTime= ()=>{
        const h = String(time().getHours()).padStart(2, '0');
        const m = String(time().getMinutes()).padStart(2, '0');
        return `${h}:${m}`;
    }

const dayofWeek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const monthofYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const updateClock=()=>{
    const d = time();
    const date = String(d.getDate());
    const month = monthofYear[d.getMonth()];
    const day = dayofWeek[d.getDay()]; //ada error hari 
    const hours = String(d.getHours()).padStart(2,'0');
    const minutes = String(d.getMinutes()).padStart(2,'0');
    const seconds = String(d.getSeconds()).padStart(2,'0');
    const timeString = `${day}, ${date} ${month} :: 🕰️ ${hours}:${minutes}:${seconds}`;

    document.getElementById('clock').textContent = timeString

}

export const firstGreeting = ()=>{
    const d = time().getHours();
    let greeting = 'System Online at 100%! Welcome Master!';
    if (d >= 5 && d < 11) {
        greeting = `Good Morning Master! Let's start our day!`;
    } 
    else if (d >= 11 && d < 15) {
        greeting = `Greeting Master! What is your plan this day?`;
    } 
    else if (d >= 15 && d < 19) {
        greeting = `Good afternoon Master! Should you rest soon?`;
    } 
    else if (d >= 19) {
        greeting = `Good Evening Master! You Should sleep well and tight at night!`;
    } 
    else {
        greeting = `You should sleep soon Master, Late Night activity is not good for your body!`;
    }
    document.querySelector('.welcome-subtitle').textContent = greeting;
}