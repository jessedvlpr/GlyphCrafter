const canvas = document.getElementsByClassName('draw-area')[0]
var ctx = canvas.getContext("2d")
var canvasRect = canvas.getBoundingClientRect()
var sx, sy, x, y
var clicked = false
ctx.lineWidth = 8
document.body.onresize = function () {
    canvasRect = canvas.getBoundingClientRect()
}
canvas.onclick = function (e) {
    
}
canvas.onmousedown = function (e) {
    clicked = true
    x = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width)
    y = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height)
    sx = x
    sy = y
    ctx.moveTo(x, y)
}
canvas.onmouseup = function () {
    clicked = false
}
canvas.onmouseleave = function () { clicked = false }
canvas.onmousemove = function (e) {
    if (clicked) {
        x = (e.clientX - canvasRect.left) * (canvas.width / canvasRect.width)
        y = (e.clientY - canvasRect.top) * (canvas.height / canvasRect.height)
        ctx.lineTo(x, y)
        ctx.stroke()
    }
}