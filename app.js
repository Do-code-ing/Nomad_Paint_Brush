const undoList = [];
let redoList = [];

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const mode = document.getElementById("jsMode");
const saveBtn = document.getElementById("jsSave");
const undoBtn = document.getElementById("jsUndo");
const redoBtn = document.getElementById("jsRedo");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 720;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function startPainting() {
    painting = true;
    const currentImage = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    undoList.push(currentImage);
    redoList = [];
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else {
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}

function handleColorClick(event) {
    const color = event.target.style.backgroundColor;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
}

function hanldeRangeChange(event) {
    ctx.lineWidth = event.target.value;
}

function handleModeClick() {
    if (filling === true) {
        filling = false;
        mode.innerText = "Fill";
    } else {
        filling = true;
        mode.innerText = "Paint";
    }
}

function handleCanvasClick() {
    if (filling) {
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    }
}

function handleCM(event) {
    event.preventDefault();
}

function handleSaveClick() {
    const image = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = image;
    link.download = "PaintJS";
    link.click();
}

function handleUndoClick() {
    const currentImage = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    const data = undoList.pop();
    redoList.push(currentImage);
    ctx.putImageData(data, 0, 0);
}

function handleRedoClick() {
    if (redoList.length) {
        const currentImage = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const data = redoList.pop();
        undoList.push(currentImage);
        ctx.putImageData(data, 0, 0);
    }
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("mousedown", handleCanvasClick);
    canvas.addEventListener("contextmenu", handleCM);
}

if (colors) {
    Array.from(colors).forEach((color) => {
        color.addEventListener("click", handleColorClick);
    });
}

if (range) {
    range.addEventListener("input", hanldeRangeChange);
}

if (mode) {
    mode.addEventListener("click", handleModeClick);
}

if (saveBtn) {
    saveBtn.addEventListener("click", handleSaveClick);
}

if (undoBtn) {
    undoBtn.addEventListener("click", handleUndoClick);
}

if (redoBtn) {
    redoBtn.addEventListener("click", handleRedoClick);
}

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey) {
        if (event.code === "KeyZ") {
            handleUndoClick();
        } else if (event.code === "KeyY") {
            handleRedoClick();
        }
    }
});