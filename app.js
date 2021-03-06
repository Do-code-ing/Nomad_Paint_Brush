"use strict";

const undoList = [];
let redoList = [];

const canvas = document.getElementById("jsCanvas");
const ctx = canvas.getContext("2d");
const currentColor = document.getElementById("cur_color");
const currentColorText = currentColor.querySelector("p");
const colorsDiv = document.getElementById("jsColors");
const colorPickerForm = document.getElementById("color_picker_form");
const colorPickerFront = document.getElementById("color_picker_front");
const colorPicker = document.getElementById("color_picker");
const colorPickerBtn = document.getElementById("color_picker_btn");
const colors = document.getElementsByClassName("jsColor");
const range = document.getElementById("jsRange");
const curRange = document.getElementById("cur_range");
const paintBtn = document.getElementById("jsPaint");
const fillBtn = document.getElementById("jsFill");
const eraserBtn = document.getElementById("jsEraser");
const textBtn = document.getElementById("jsText");
const undoBtn = document.getElementById("jsUndo");
const redoBtn = document.getElementById("jsRedo");
const clearBtn = document.getElementById("jsClear");
const saveBtn = document.getElementById("jsSave");
const textInput = document.getElementById("text_input");
const fontSelect = document.getElementById("font_family");
const fontSizeInput = document.getElementById("font_size");

const INITIAL_COLOR = "#2c2c2c";
const CANVAS_SIZE = 700;
const WHITE = "#ffffff";
const BUTTON_CLICK_COLOR = "deepskyblue";
const fontFamily = [
  "굴림",
  "굴림체",
  "궁서",
  "궁서체",
  "돋움",
  "돋움체",
  "바탕",
  "바탕체",
  "휴먼엽서체",
  "Andale Mono",
  "Arial",
  "Arial Black",
  "Arial Narrow",
  "Bookman Old Style",
  "Comic Sans MS",
  "Copperlate Gothic",
  "Courier",
  "Courier NEW",
  "Fiexedsys",
  "Georgia",
  "Impact",
  "Lucida Console",
  "Marlett",
  "MS Gothic",
  "MS Hei",
  "MS Outlook",
  "MS Sans Serif",
  "MS Serif",
  "MT Extra",
  "Symbol",
  "Tahoma",
  "Times New Roman",
  "Verdana",
  "Verdana Italic",
  "Webdings",
  "WingDings",
];

let currentFont = "MS Sans Serif";
let fontSize = 20;

let painting = false;
let erasing = false;
let filling = false;
let textList = [];
let typing = false;

canvas.width = CANVAS_SIZE;
canvas.height = CANVAS_SIZE;

ctx.fillStyle = WHITE;
ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
ctx.strokeStyle = INITIAL_COLOR;
ctx.fillStyle = INITIAL_COLOR;
ctx.lineWidth = 5;
ctx.font = `${fontSize}px ${currentFont}`;

paintBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
currentColor.style.backgroundColor = INITIAL_COLOR;
currentColorText.style.color = "#d3d3d3";

fontFamily.forEach((font) => {
  const option = document.createElement("option");
  option.value = font;
  option.innerText = font;
  fontSelect.appendChild(option);
  if (font === "MS Sans Serif") {
    option.selected = true;
  }
});

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
  } else if (painting && !filling && !typing) {
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}

function paintText(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  let i = 0;
  if (typing) {
    textList.forEach((text) => {
      ctx.fillText(text, x, y + i);
      i += fontSize;
    });
  }
}

function rgbToComplementary(color) {
  if (color[0] === "r") {
    const rgb = color.split(" ");
    const r = 255 - parseInt(rgb[0].slice(4, -1));
    const g = 255 - parseInt(rgb[1].slice(0, -1));
    const b = 255 - parseInt(rgb[2].slice(0, -1));
    return [r, g, b];
  } else {
    const r = 255 - color.slice(1, 3);
    const g = 255 - color.slice(3, 5);
    const b = 255 - color.slice(5, 7);
    return [r, g, b];
  }
}

function rgbToHexComplementary(color) {
  let [r, g, b] = rgbToComplementary(color);
  r = r.toString(16).padStart(2, "0");
  g = g.toString(16).padStart(2, "0");
  b = b.toString(16).padStart(2, "0");
  const hexRgb = `#${r}${g}${b}`;
  return hexRgb;
}

function handleColorClick(event) {
  if (erasing) {
    return;
  }
  const color = event.target.style.backgroundColor;
  const fontColor = rgbToHexComplementary(color);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  currentColor.style.backgroundColor = color;
  currentColorText.style.color = fontColor;
}

function hanldeRangeChange(event) {
  const value = Number(event.target.value).toFixed(1);
  ctx.lineWidth = value;
  curRange.value = value;
}

function handleRangeTextChange(event) {
  let value = Number(event.target.value).toFixed(1);
  if (value > 10) {
    value = 10.0;
  } else if (value < 0.1) {
    value = 0.1;
  }
  ctx.lineWidth = value;
  range.value = value;
  curRange.value = value;
}

function handlePaintBtnClick() {
  filling = false;
  erasing = false;
  typing = false;
  ctx.restore();
  canvas.style.cursor = "url(img/cursor.cur) 5 5, default";
  paintBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
  eraserBtn.style.backgroundColor = WHITE;
  fillBtn.style.backgroundColor = WHITE;
  textBtn.style.backgroundColor = WHITE;
}

function handleEraserBtnClick() {
  filling = false;
  erasing = true;
  typing = false;
  ctx.save();
  ctx.strokeStyle = WHITE;
  canvas.style.cursor = "url(img/eraser.cur) 14 14, default";
  paintBtn.style.backgroundColor = WHITE;
  eraserBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
  fillBtn.style.backgroundColor = WHITE;
  textBtn.style.backgroundColor = WHITE;
}

function handlefillBtnClick() {
  filling = true;
  erasing = false;
  typing = false;
  canvas.style.cursor = "url(img/paintbucket.cur) 4 4, default";
  paintBtn.style.backgroundColor = WHITE;
  eraserBtn.style.backgroundColor = WHITE;
  fillBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
  textBtn.style.backgroundColor = WHITE;
}

function handleTextBtnClick() {
  filling = false;
  erasing = false;
  typing = true;
  canvas.style.cursor = "text";
  paintBtn.style.backgroundColor = WHITE;
  eraserBtn.style.backgroundColor = WHITE;
  fillBtn.style.backgroundColor = WHITE;
  textBtn.style.backgroundColor = BUTTON_CLICK_COLOR;
}

function handleTextChange() {
  const texts = textInput.value;
  textList = texts.split("\n");
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

function handleColorDelete(event) {
  if (colorsDiv.childElementCount < 37) {
    colorPickerBtn.value = "add";
    colorPickerBtn.style.fontSize = "15px";
    colorPickerBtn.style.backgroundColor = "white";
    colorPickerBtn.style.color = "black";
  }

  const index = parseInt(event.target.id);
  for (let i = 9; i < colorsDiv.childElementCount; i++) {
    if (parseInt(colorsDiv.children[i].id) === index) {
      colorsDiv.children[i].remove();
      return;
    }
  }
}

function handleColorPickerSubmit(event) {
  event.preventDefault();
  if (colorsDiv.childElementCount === 36) {
    return;
  }
  if (colorsDiv.childElementCount === 35) {
    colorPickerBtn.value = "FULL";
    colorPickerBtn.style.fontSize = "13px";
    colorPickerBtn.style.backgroundColor = "salmon";
    colorPickerBtn.style.color = "white";
  }
  const newColorDiv = document.createElement("div");
  const newColor = document.createElement("div");
  const deleteBtn = document.createElement("div");
  const color = colorPicker.value;
  newColorDiv.classList.add("new_color");
  newColorDiv.id = `${colorsDiv.childElementCount - 9}_color`;
  deleteBtn.innerText = "❌";
  deleteBtn.classList.add("new_color_delete_btn");
  deleteBtn.id = `${colorsDiv.childElementCount - 9}_btn`;
  deleteBtn.addEventListener("click", handleColorDelete);
  newColor.classList.add("controls_color");
  newColor.classList.add("jsColor");
  newColor.style.backgroundColor = color;
  newColor.addEventListener("click", handleColorClick);
  newColorDiv.appendChild(deleteBtn);
  newColorDiv.appendChild(newColor);
  colorsDiv.appendChild(newColorDiv);
}

if (canvas) {
  canvas.addEventListener("mousemove", onMouseMove);
  canvas.addEventListener("mousedown", startPainting);
  canvas.addEventListener("mouseup", stopPainting);
  canvas.addEventListener("mouseleave", stopPainting);
  canvas.addEventListener("mousedown", handleCanvasFilling);
  canvas.addEventListener("mousedown", paintText);
  canvas.addEventListener("contextmenu", handleCM);
}

if (colorPickerFront) {
  colorPickerFront.addEventListener("click", () => {
    colorPicker.click();
  });
}

if (colorPicker) {
  colorPicker.addEventListener("input", () => {
    const p = colorPickerFront.querySelector("p");
    const color = colorPicker.value;
    colorPickerFront.style.backgroundColor = color;
    p.style.color = rgbToHexComplementary(color);
  });
}

if (colorPickerForm) {
  colorPickerForm.addEventListener("submit", handleColorPickerSubmit);
}

if (colors) {
  Array.from(colors).forEach((color) => {
    color.addEventListener("click", handleColorClick);
  });
}

if (range) {
  range.addEventListener("input", hanldeRangeChange);
}

if (curRange) {
  curRange.addEventListener("change", handleRangeTextChange);
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

if (textBtn) {
  textBtn.addEventListener("click", handleTextBtnClick);
}

if (textInput) {
  textInput.addEventListener("input", handleTextChange);
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

if (saveBtn) {
  saveBtn.addEventListener("click", handleSaveClick);
}

if (fontSelect) {
  fontSelect.addEventListener("input", () => {
    const newFont = fontSelect.options[fontSelect.selectedIndex].text;
    currentFont = newFont;
    ctx.font = `${fontSize}px ${currentFont}`;
  });
}

if (fontSizeInput) {
  fontSizeInput.addEventListener("input", () => {
    let newSize = fontSizeInput.value;
    if (newSize < 0.1) {
      newSize = 0.1;
    }
    fontSize = parseInt(newSize);
    ctx.font = `${fontSize}px ${currentFont}`;
  });
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
