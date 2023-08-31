saveButton = document.getElementById("save")
loadButton = document.getElementById("load")
undoButton = document.getElementById("undo")
redoButton = document.getElementById("redo")
clearButton = document.getElementById("clear")

undoList = []
clearList = []

saveButton.onclick = function saveSVG() {
    let text = svg.outerHTML
    const file = new Blob([text], { type: 'svg' })
    saveButton.href = URL.createObjectURL(file)
    saveButton.download = "glyph.svg"
}

loadButton.onclick = function () { }

undoButton.onclick = function undoSVG() {
    if (clearList.length > 0) {
        clearList.forEach(el => { svg.appendChild(el) })
        clearList = []
        return
    }
    if (!(svg.childNodes.length > 0)) return
    let lastChild = svg.childNodes[svg.childNodes.length - 1]
    undoList.push(lastChild)
    lastChild.remove()
}

redoButton.onclick = function redoSVG() {
    if (!(undoList.length > 0)) return
    svg.appendChild(undoList.pop())
}

clearButton.onclick = function clearSVG() {
    clearList = Array.from(svg.childNodes)
    undoList = []
    svg.innerHTML = ""
}