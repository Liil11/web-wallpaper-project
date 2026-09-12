

export const time = ()=>{
    const d = new Date();
    return d;   
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
    const timeString = `${day}, ${date} ${month} :: ${hours}:${minutes}:${seconds}`;

    document.getElementById('clock').textContent = timeString

}