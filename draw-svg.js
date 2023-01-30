const svg = document.getElementsByClassName('draw-area')[0]
const viewBox = {
    width: parseFloat(svg.getAttribute("viewBox").split(" ")[2]),
    height: parseFloat(svg.getAttribute("viewBox").split(" ")[3])
}
var svgRect = svg.getClientRects()[0]
var sx, sy, ex, ey, x, y
var clicked = false
document.body.onresize = function () {
    svgRect = svg.getClientRects()[0]
}
svg.onclick = function (e) {

}
svg.onmousedown = function (e) {
    clicked = true
    x = ((e.clientX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3)
    y = ((e.clientY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3)
    sx = x
    sy = y
    line = document.createElementNS("http://www.w3.org/2000/svg", "polyline")
    line.setAttribute("fill", "none")
    line.setAttribute("stroke", "white")
    line.setAttribute("stroke-width", "5")
    line.setAttribute("stroke-linecap", "round")
    line.setAttribute("points", `${x},${y}`)
    svg.appendChild(line)
}
svg.onmouseup = function (e) {
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
    let middle = points[parseInt(points.length / 2)]
    path.setAttribute("d", `M ${sx} ${sy} Q ${middle[0]} ${middle[1]} ${ex} ${ey}`)
    // for (let i = 1; i < points.length; i++) {
    //     let pos = points[i].split(",")
    //     let curX = (parseFloat(pos[0]) - 200).toFixed(3)
    //     let curY = parseFloat(pos[1]).toFixed(3)

    //     try {
    //         path.setAttribute("d", path.getAttribute("d") + ` Q ${curX} ${curY} ${curX} ${curY}`)
    //     } catch (error) {

    //     }

    svg.appendChild(path)
    // }
    // svg.removeChild(line)
}
svg.onmouseleave = function () { clicked = false }
svg.onmousemove = function (e) {
    if (!clicked) return
    x = ((e.clientX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3)
    y = ((e.clientY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3)
    line.setAttribute("points", line.getAttribute("points") + ` ${x},${y}`)
}

function cullPoints(points) {
    let temp = []
    let min = 10
    let refPoint = points[0]
    for (let j = 0; j < points.length; j++) {
        let pos = points[j]
        let sa = pos[0] - refPoint[0]
        let sb = pos[1] - refPoint[1]
        let sc = (sa * sa) + (sb * sb)
        if (j != 0 && j != points.length - 1 && sc < min * min) {
            continue
        } else {
            refPoint = pos.slice()
            temp.push(points[j])
        }
    }
    points = temp.slice()
    return temp
}