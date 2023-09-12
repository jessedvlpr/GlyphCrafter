var mouseX = 0, mouseY = 0;

document.onmousemove = function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

const svg = document.getElementById('draw-area');
const viewBox = {
    width: parseFloat(svg.getAttribute("viewBox").split(" ")[2]),
    height: parseFloat(svg.getAttribute("viewBox").split(" ")[3])
}

var svgRect = svg.getClientRects()[0];
var svgCenter = {x: ((svgRect.width/2) * (viewBox.width/svgRect.width)).toFixed(3), y: ((svgRect.height/2) * (viewBox.height/svgRect.height)).toFixed(3)};
var sx, sy, ex, ey, x, y;
var clicked = false;


document.body.onresize = function () { 
    refresh();
}

document.body.onscroll = function () { 
    refresh();
}

svg.onclick = function (e) { }
svg.onmouseleave = function (e) { if (clicked) endLine(e); }

svg.onmousedown = startLine = function (e) {
    if (clicked) return;
    sx = x = ((mouseX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3);
    sy = y = ((mouseY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3);
    if ((x - svgCenter.x)**2 + (y - svgCenter.y)**2 > 500**2) return;
    clicked = true;

    undoList = [];
    clearList = [];

    line = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
    line.setAttribute("fill", "none");
    line.setAttribute("stroke", "white");
    line.setAttribute("stroke-width", "5");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("points", `${x},${y}`);
    svg.appendChild(line);
}

svg.onmouseup = endLine = function (e) {
    if (!clicked) return;

    clicked = false;

    ex = ((mouseX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3);
    ey = ((mouseY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3);

    if((sx - ex)**2 + (sy - ey)**2 < 150**2){
        line.setAttribute("points", line.getAttribute("points") + ` ${sx},${sy}`);
        circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("fill","none");
        circle.setAttribute("stroke","white");
        circle.setAttribute("stroke-width","5");
        circle.setAttribute("stroke-linecap","round");
    }
    
    let points = cullPoints(line.getAttribute("points").split(" ")
    .map((el) => el.split(",").map((el2) => parseFloat(el2))));
    
    if((sx - ex)**2 + (sy - ey)**2 < 150**2){
        let leastX = points[0][0], leastY = points[0][1], mostX = points[0][0], mostY = points[0][1];
        for(let i = 0; i < points.length; i++){
            for(let j = 0; j < points.length; j++){
                if(mostX < points[j][0])
                    mostX = points[j][0];
                if(leastX > points[j][0])
                    leastX = points[j][0];
                if(mostY < points[j][1])
                    mostY = points[j][1];
                if(leastY > points[j][1])
                    leastY = points[j][1];
            }
        }
        console.log(mostX-leastX/2)
        console.log(mostX-leastX/2 * (viewBox.width / svgRect.width))
        circle.setAttribute("cx", (mostX-leastX/2 + svgRect.left).toFixed(3));
        circle.setAttribute("cy", (mostY-leastY/2 + svgRect.top).toFixed(3));
        circle.setAttribute("r",((mostX-leastX)/2).toFixed(3) < ((mostY-leastY)/2).toFixed(3) ? ((mostX-leastX)/2).toFixed(3) : ((mostY-leastY)/2).toFixed(3));
        // svg.appendChild(circle);
    }

    line.setAttribute("points", points.join(" "));

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "5");
    path.setAttribute("stroke-linecap", "round");

    if (points.length > 2) path.setAttribute("d", `M ${sx} ${sy} C ${points[1][0]} ${points[1][1]} ${points[2][0]} ${points[2][1]} ${points[3][0]} ${points[3][1]}`);
    else path.setAttribute("d", `M ${sx} ${sy} ${ex} ${ey}`);
    for (let i = 4; i < points.length; i++) {
        let d = path.getAttribute("d");
        if (i % 3 == 0 || i == points.length - 1) path.setAttribute("d", d + ` S ${points[i - 1][0]} ${points[i - 1][1]} ${points[i][0]} ${points[i][1]}`);
    }
    svg.appendChild(path);
    svg.removeChild(line);
}

svg.onmousemove = drawLine = function (e) {
    if (!clicked) return;

    x = ((mouseX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3);
    y = ((mouseY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3);
    let dist = (x - svgCenter.x)**2 + (y - svgCenter.y)**2;
    if (dist >= (viewBox.width/2)**2) {
        endLine(e);
    }

    line.setAttribute("points", line.getAttribute("points") + ` ${x},${y}`);
}

function cullPoints(points) {
    let temp = [];
    let min = 10;
    let refPoint = points[0];

    for (let j = 0; j < points.length; j++) {
        let pos = points[j];
        let lineA = pos[0] - refPoint[0];
        let lineB = pos[1] - refPoint[1];
        let lineC = (lineA * lineA) + (lineB * lineB);

        if (j != 0 && j != points.length - 1 && lineC < min * min) {
            continue;
        } else {
            refPoint = pos;
            temp.push(points[j]);
        }
    }

    points = temp.slice();

    return temp;
}

function refresh(){
    svgRect = svg.getClientRects()[0];
    svgCenter = {x: ((svgRect.width/2) * (viewBox.width/svgRect.width)).toFixed(3), y: ((svgRect.height/2) * (viewBox.height/svgRect.height)).toFixed(3)};
}