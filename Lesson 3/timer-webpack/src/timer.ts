import './style.css';

var m = document.getElementById("minute");
var s = document.getElementById("second");

//set time with the URL: ../?t=time where time is in seconds
var url = new URL(window.location.toString());
var time = parseInt(url.searchParams.get("t"));


function pad(num: number): string {
    var s = "00" + num.toString();
    return s.substr(s.length - 2);
}

var tick = function () {
    var minutes, seconds;
    minutes = Math.floor(time / 60)
    seconds = time % 60;
    m.innerText = pad(minutes);
    s.innerText = pad(seconds);
    if (time != 0) {
        time = time - 1;
    }
}

declare global {
    interface  Window {start: any;}
}

window.start = function() {
    window.setInterval(tick, 1000);
    tick();
    document.getElementById("starter").style.display = "none";
}