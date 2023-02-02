const svg = document.getElementsByClassName('draw-area')[0]
const viewBox = {
    width: parseFloat(svg.getAttribute("viewBox").split(" ")[2]),
    height: parseFloat(svg.getAttribute("viewBox").split(" ")[3])
}

var svgRect = svg.getClientRects()[0]
var sx, sy, ex, ey, x, y
var clicked = false

document.body.onresize = function () { svgRect = svg.getClientRects()[0] }

svg.onclick = function (e) { }
svg.onmouseleave = function (e) { if (clicked) endLine(e) }

svg.onmousedown = startLine = function (e) {
    if (clicked) return

    clicked = true

    sx = x = ((e.clientX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3)
    sy = y = ((e.clientY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3)

    undoList = []
    clearList = []

    line = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
    line.setAttribute("fill", "none")
    line.setAttribute("stroke", "white")
    line.setAttribute("stroke-width", "5")
    line.setAttribute("stroke-linecap", "round")
    line.setAttribute("points", `${x},${y}`)
    svg.appendChild(line)
}

svg.onmouseup = endLine = function (e) {
    if (!clicked) return

    clicked = false

    ex = ((e.clientX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3)
    ey = ((e.clientY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3)


    let points = cullPoints(line.getAttribute("points").split(" ")
        .map((el) => el.split(",").map((el2) => parseFloat(el2))))

    line.setAttribute("points", points.join(" "))

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("fill", "none")
    path.setAttribute("stroke", "white")
    path.setAttribute("stroke-width", "5")
    path.setAttribute("stroke-linecap", "round")

    path.setAttribute("d", `M ${sx} ${sy} C ${points[1][0]} ${points[1][1]} ${points[2][0]} ${points[2][1]} ${points[3][0]} ${points[3][1]}`)
    for (let i = 4; i < points.length; i++) {
        let d = path.getAttribute("d")
        if (i % 3 == 0 || i == points.length - 1) path.setAttribute("d", d + ` S ${points[i - 1][0]} ${points[i - 1][1]} ${points[i][0]} ${points[i][1]}`)
    }
    svg.appendChild(path)
    svg.removeChild(line)
}

svg.onmousemove = drawLine = function (e) {
    if (!clicked) return

    x = ((e.clientX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3)
    y = ((e.clientY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3)

    line.setAttribute("points", line.getAttribute("points") + ` ${x},${y}`)
}

function cullPoints(points) {
    let temp = []
    let min = 30
    let refPoint = points[0]

    for (let j = 0; j < points.length; j++) {
        let pos = points[j]
        let lineA = pos[0] - refPoint[0]
        let lineB = pos[1] - refPoint[1]
        let lineC = (lineA * lineA) + (lineB * lineB)

        if (j != 0 && j != points.length - 1 && lineC < min * min) {
            continue
        } else {
            refPoint = pos
            temp.push(points[j])
        }
    }

    points = temp.slice()

    return temp
}