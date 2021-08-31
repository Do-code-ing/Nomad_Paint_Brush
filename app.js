'use strict';

const undoList = [];
let redoList = [];

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const paintBtn = document.getElementById("jsPaint")
const fillBtn = document.getElementById("jsFill");
const eraserBtn = document.getElementById("jsEraser");
const saveBtn = document.getElementById("jsSave");
const undoBtn = document.getElementById("jsUndo");
const redoBtn = document.getElementById("jsRedo");
const clearBtn = document.getElementById("jsClear");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;
const WHITE = "white";
const BUTTON_CLICK_COLOR = "deepskyblue";

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = WHITE;
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 2.5;

paintBtn.style.backgroundColor = BUTTON_CLICK_COLOR;

let painting = false;
let filling = false;

function stopPainting() {
    painting = false;
}

function memorizeImage() {
    const currentImage = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    undoList.push(currentImage);
    redoList = [];
}

function startPainting() {
    painting = true;
    memorizeImage();
}

function onMouseMove(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    if (!painting) {
        ctx.beginPath();
        ctx.moveTo(x, y);
    } else if (painting && !filling) {
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

function handlePaintBtnClick() {
    filling = false;
    ctx.restore();
    canvas.style.cursor = "url(img/cursor.cur) 8 8, default";
    paintBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
    eraserBtn.style.backgroundColor = WHITE;
    fillBtn.style.backgroundColor = WHITE;
}

function handleEraserBtnClick() {
    filling = false;
    ctx.save();
    ctx.strokeStyle = WHITE;
    canvas.style.cursor = "url(img/eraser.cur) 14 14, default";
    paintBtn.style.backgroundColor = WHITE;
    eraserBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
    fillBtn.style.backgroundColor = WHITE;
}

function handlefillBtnClick() {
    filling = true;
    canvas.style.cursor = "url(img/paintbucket.cur) 4 4, default";
    paintBtn.style.backgroundColor = WHITE;
    eraserBtn.style.backgroundColor = WHITE;
    fillBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
}

function handleCanvasFilling() {
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
    if (undoList.length) {
        const currentImage = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const data = undoList.pop();
        redoList.push(currentImage);
        ctx.putImageData(data, 0, 0);
    }
}

function handleRedoClick() {
    if (redoList.length) {
        const currentImage = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        const data = redoList.pop();
        undoList.push(currentImage);
        ctx.putImageData(data, 0, 0);
    }
}

function handleClearClick() {
    memorizeImage();
    ctx.save();
    ctx.fillStyle = WHITE;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    ctx.restore();
}

if (canvas) {
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", startPainting);
    canvas.addEventListener("mouseup", stopPainting);
    canvas.addEventListener("mouseleave", stopPainting);
    canvas.addEventListener("mousedown", handleCanvasFilling);
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

if (paintBtn) {
    paintBtn.addEventListener("click", handlePaintBtnClick);
}

if (eraserBtn) {
    eraserBtn.addEventListener("click", handleEraserBtnClick);
}

if (fillBtn) {
    fillBtn.addEventListener("click", handlefillBtnClick);
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

if (clearBtn) {
    clearBtn.addEventListener("click", handleClearClick);
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