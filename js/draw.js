var mouseX = 0, mouseY = 0;

document.onmousemove = function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

const svg = document.getElementById('draw-area');
const viewBox = {
    width: parseFloat(svg.getAttribute("viewBox").split(" ")[2]),
    height: parseFloat(svg.getAttribute("viewBox").split(" ")[3])
}

var svgRect = svg.getClientRects()[0];
var svgCenter = { x: ((svgRect.width / 2) * (viewBox.width / svgRect.width)).toFixed(3), y: ((svgRect.height / 2) * (viewBox.height / svgRect.height)).toFixed(3) };
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
    if ((x - svgCenter.x) ** 2 + (y - svgCenter.y) ** 2 > 500 ** 2) return;
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

    if ((sx - ex) ** 2 + (sy - ey) ** 2 < 150 ** 2) {
        line.setAttribute("points", line.getAttribute("points") + ` ${sx},${sy}`);
    }

    let points = cullPoints(line.getAttribute("points").split(" ")
        .map((el) => el.split(",").map((el2) => parseFloat(el2))));

    let leastX = points[0][0];
    let leastY = points[0][1];
    let mostX = points[0][0];
    let mostY = points[0][1];
    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < points.length; j++) {
            if (mostX < points[j][0])
                mostX = points[j][0];
            if (leastX > points[j][0])
                leastX = points[j][0];
            if (mostY < points[j][1])
                mostY = points[j][1];
            if (leastY > points[j][1])
                leastY = points[j][1];
        }
    }

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "5");
    path.setAttribute("stroke-linecap", "round");

    if (points.length > 3)
        path.setAttribute("d", `M ${sx} ${sy} C ${points[1][0]} ${points[1][1]} ${points[2][0]} ${points[2][1]} ${points[3][0]} ${points[3][1]}`);
    else
        path.setAttribute("d", `M ${sx} ${sy} ${ex} ${ey}`);

    for (let i = 4; i < points.length; i++) {
        if (i % 3 == 0 || i == points.length - 1)
            path.setAttribute("d", path.getAttribute("d") + ` S ${points[i - 1][0]} ${points[i - 1][1]} ${points[i][0]} ${points[i][1]}`);
    }

    svg.appendChild(path);
    svg.removeChild(line);
    if (points.length > 3 && (sx - ex) ** 2 + (sy - ey) ** 2 < 150 ** 2) {
        let diff = { x: 1, y: 1 };
        let lastDiff = { x: 1, y: 1 };
        let endPoints = [];
        for (let i = 1; i < points.length; i++) {
            diff.x = points[i - 1][0] / points[i][0];
            diff.y = points[i - 1][1] / points[i][1];
            let RoC = { x: Math.abs((diff.x / lastDiff.x) - 1) + 1, y: Math.abs((diff.y / lastDiff.y) - 1) + 1 };

            if (RoC.x * RoC.y > 1.035) {
                endPoints.push(points[i]);
                // console.log(RoC.x * RoC.y);
            }
            lastDiff.x = diff.x;
            lastDiff.y = diff.y;
            // if(i+5 >= points.length && !(i >= points.length - 1)) i+= (points.length - i) - 1;
            // else i+=5;
        }
        if (endPoints.length > 2) {
            let shape = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            shape.setAttribute("fill", "none");
            shape.setAttribute("stroke", "white");
            shape.setAttribute("stroke-width", "5");
            shape.setAttribute("stroke-linecap", "round");
            shape.setAttribute("points", `${sx},${sy}`);
            for (let i = 0; i < endPoints.length; i++) {
                shape.setAttribute("points", shape.getAttribute("points") + ` ${endPoints[i][0]} ${endPoints[i][1]}`);
            }
            shape.setAttribute("points", shape.getAttribute("points") + ` ${sx} ${sy}`);
            svg.appendChild(shape);
        } else {
            let cx = (leastX + mostX) / 2;
            let cy = (leastY + mostY) / 2;
            let radius = (mostX - leastX) / 2 >= (mostY - leastY) / 2 ? (mostX - leastX) / 2 : (mostY - leastY) / 2;
            let pointDist = (2 * Math.PI * radius) / points.length;
            let angle = pointDist / radius;
            let circlePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
            circlePath.setAttribute("fill", "none");
            circlePath.setAttribute("stroke", "white");
            circlePath.setAttribute("stroke-width", "5");
            circlePath.setAttribute("stroke-linecap", "round");
            circlePath.setAttribute("d", `M ${cx + radius} ${cy} `);
            let circlePoints = [];
            for (let i = 0; i < points.length; i++) {
                let curAngle = angle * (i + 1);
                circlePath.setAttribute("d", circlePath.getAttribute("d") + `A ${radius} ${radius} ${curAngle} 0 1 ${cx + radius * Math.cos(curAngle)} ${cy + radius * Math.sin(curAngle)} `);
                circlePoints.push([cx + radius * Math.cos(curAngle), cy + radius * Math.sin(curAngle)]);
            }
            // let frames = 20;
            // for (let i = 0; i < frames; i++) {
            //     id = setTimeout(async function () {
            //         for (let j = 0; j < points.length; j++) {
            //             // console.log(i + " " + j);
            //             let distX = (points[j][0] + circlePoints[j][0]) / frames;
            //             let distY = (points[j][1] + circlePoints[j][1]) / frames;
            //             console.log("lerp");
            //         }
            //         clearTimeout(id);
            //     }, 100 * i);
            // }
            svg.appendChild(circlePath);
        }
        svg.removeChild(path)
    }
}

svg.onmousemove = drawLine = function (e) {
    if (!clicked) return;

    x = ((mouseX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3);
    y = ((mouseY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3);
    let dist = (x - svgCenter.x) ** 2 + (y - svgCenter.y) ** 2;
    if (dist >= (viewBox.width / 2) ** 2) {
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
        let lineC = (lineA ** 2) + (lineB ** 2);

        if (j != 0 && j != points.length - 1 && lineC < min ** 2) {
            continue;
        } else {
            refPoint = pos;
            temp.push(points[j]);
        }
    }

    points = temp.slice();

    return temp;
}

function refresh() {
    svgRect = svg.getClientRects()[0];
    svgCenter = { x: ((svgRect.width / 2) * (viewBox.width / svgRect.width)).toFixed(3), y: ((svgRect.height / 2) * (viewBox.height / svgRect.height)).toFixed(3) };
}