if (!checkCookie('gc-fg')) setCookie('gc-fg', [56, 56, 56], 365);
if (!checkCookie('gc-bg')) setCookie('gc-bg', [23, 23, 23], 365);
if (!checkCookie('gc-text')) setCookie('gc-text', [255, 255, 255], 365);

changeColour('fg')
changeColour('bg')
changeColour('text')

function colourPicker(area) {
    let pckr = document.getElementById('colour-picker-' + area.split("-")[1]).value;
    let r = parseInt(pckr.substring(1, 3), 16);
    let g = parseInt(pckr.substring(3, 5), 16);
    let b = parseInt(pckr.substring(5, 7), 16);
    setCookie(area, [r, g, b], 365);
    changeColour(area.split("-")[1])
}

function changeColour(area) {
    let c = getCookie("gc-" + area).split(',');
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
    setCookie('gc-fg', [56, 56, 56], 365);
    setCookie('gc-bg', [23, 23, 23], 365);
    setCookie('gc-text', [255, 255, 255], 365);
    changeColour('fg');
    changeColour('bg');
    changeColour('text');
}