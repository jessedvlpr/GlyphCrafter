const svg = document.getElementsByClassName('draw-area')[0]
const viewBox = {
    width: parseFloat(svg.getAttribute("viewBox").split(" ")[2]),
    height: parseFloat(svg.getAttribute("viewBox").split(" ")[3])
}
console.log(viewBox.width)
var svgRect = svg.getClientRects()[0]
var sx, sy, x, y, line
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
    line = document.createElementNS("http://www.w3.org/2000/svg","polyline")
    line.setAttribute("fill", "none")
    line.setAttribute("stroke", "white")
    line.setAttribute("stroke-width", "5")
    line.setAttribute("stroke-linecap", "round")
    line.setAttribute("points", `${x},${y}`)
    svg.appendChild(line)
}
svg.onmouseup = function () {
    clicked = false
    line.setAttribute("points", cullPoints(line.getAttribute("points").split(" "), 2))

    
}
svg.onmouseleave = function () { clicked = false }
svg.onmousemove = function (e) {
    if (clicked) {
        x = ((e.clientX - svgRect.left) * (viewBox.width / svgRect.width)).toFixed(3)
        y = ((e.clientY - svgRect.top) * (viewBox.height / svgRect.height)).toFixed(3)
        line.setAttribute("points", line.getAttribute("points") + ` ${x},${y}`)
    }
}

function cullPoints(points, res){
    let temp = []
    for(let i = 0; i < res; i++){
        temp = []
        for(let j = 0; j < points.length; j++){
            if(j % 2 == 0){
                temp.push(points[j])
            }
        }
        points = temp.slice()
    }
    return temp.join(" ")
}