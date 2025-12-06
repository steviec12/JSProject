let hourEl = document.getElementById("hour");
let minuteEl = document.getElementById("minute");
let secondsEl = document.getElementById("seconds");
let ampmEl = document.getElementById("ampm");

function updateClock(){
    let now = new Date();
    let h = now.getHours();
    let m = now.getMinutes();
    let s = now.getSeconds();
    let ampm = 'AM';
    if (h>12){
        h = h - 12;
        ampm = 'PM';
    } else if (h==0){
        h = 12;
    }
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    hourEl.innerText = h;
    minuteEl.innerText = m;
    secondsEl.innerText = s;
    ampmEl.innerText = ampm;
    
}

setInterval(updateClock,1000);