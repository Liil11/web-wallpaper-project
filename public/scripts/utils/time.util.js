

export const time = ()=>{
    const d = new Date();
    return d;   
}

export const updateClock=()=>{
    const d = time();
    const hours = String(d.getHours()).padStart(2,'0');
    const minutes = String(d.getMinutes()).padStart(2,'0');
    const seconds = String(d.getSeconds()).padStart(2,'0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    document.getElementById('clock').textContent = timeString

}