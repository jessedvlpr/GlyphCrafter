if (!checkCookie('fg')) setCookie('fg', [12, 45, 126], 365);
if (!checkCookie('bg')) setCookie('bg', [4, 97, 123], 365);
if (!checkCookie('text')) setCookie('text', [255, 255, 255], 365);

changeColour('fg')
changeColour('bg')
changeColour('text')

function colourPicker(area) {
    let pckr = document.getElementById('colour-picker-' + area).value;
    let r = parseInt(pckr.substring(1, 3), 16);
    let g = parseInt(pckr.substring(3, 5), 16);
    let b = parseInt(pckr.substring(5, 7), 16);
    setCookie(area, [r, g, b], 365);
    changeColour(area)
}

function changeColour(area) {
    let c = getCookie(area).split(',');
    document.documentElement.style.setProperty('--' + area + '-colour', `rgb(${c[0]}, ${c[1]}, ${c[2]})`);
    let hexC = '#';
    for (let i = 0; i < c.length; i++) {
        c[i] = Number(c[i]).toString(16);
        if (c[i].length < 2) c[i] = '0' + c[i];
        hexC += c[i];
    }
    document.getElementById('colour-picker-' + area).value = hexC;
}

function resetColours() {
    setCookie('fg', [12, 45, 126], 365);
    setCookie('bg', [4, 97, 123], 365);
    setCookie('text', [255, 255, 255], 365);
    changeColour('fg');
    changeColour('bg');
    changeColour('text');
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    let n = name + "=";
    let ca = decodeURIComponent(document.cookie).split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(n) == 0) {
            return c.substring(n.length, c.length);
        }
    }
    return "";
}

function checkCookie(name) {
    let cookie = getCookie(name);
    if (cookie != "" && cookie != null) {
        return true;
    } else {
        return false;
    }
}