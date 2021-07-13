"use strict"

const canv = document.querySelector('#canv');
canv.width = window.innerWidth - 60;
canv.height = 500;

let ctx = canv.getContext ('2d');
let startBackgroundColor = 'white';
ctx.fillStyle = startBackgroundColor;
ctx.fillRect(0, 0, canv.width, canv.height);

let drawColor = 'black';
let drawWidth = '3';
let drawing = false;
let brushNow = 'round';
let brushBlur = 0;
let choosedTool = 'brush';
let startX;
let startY;

let restoreArray = [];
let index = -1;

let start = e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop);
    startX = e.clientX - canv.offsetLeft;
    startY = e.clientY - canv.offsetTop;
    draw(e);
    e.preventDefault();
}

let draw = e => {
    if (drawing === true){
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawWidth;
        ctx.lineCap = brushNow;
        ctx.lineJoin = brushNow;
        ctx.filter = `blur(${brushBlur/2}px)`;
        if (choosedTool === 'brush'){
            ctx.lineTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop);
            ctx.stroke ();
        } else if (choosedTool === 'draw square'){
            ctx.beginPath();
            ctx.lineTo(startX, startY);
            ctx.lineTo(startX, e.clientY - canv.offsetTop);
            ctx.lineTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop);
            ctx.lineTo(e.clientX - canv.offsetLeft, startY);
            ctx.lineTo(startX, startY);
            ctx.closePath();
        }
    }
}

let stop = e => {
    if (drawing){
        ctx.stroke();
        ctx.closePath();
        drawing = false;
    }
    e.preventDefault();

    if (e.type !== 'mouseout'){
        restoreArray.push(ctx.getImageData(0, 0, canv.width, canv.height));
        index += 1;
    }
}

let changeColor = e => drawColor = e.target.style.background;

let changeChooseColor = e => drawColor = e.target.value;

let changeSize = e => drawWidth = e.target.value;


let clearCanvas = () => {
    ctx.fillStyle = startBackgroundColor;
    ctx.filter = `blur(0px)`;
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillRect(0, 0, canv.width, canv.height);
    restoreArray = [];
    index = -1;
}

let undoLast = () => {
    if (index <= 0) {
        clearCanvas()
    } else {
        index -= 1;
        restoreArray.pop();
        ctx.putImageData(restoreArray[index], 0, 0);
    }
}

let brushRound = () => {
    brushNow = 'round';
    choosedTool = 'brush';
 }

let brushSquare = () => {
    brushNow = 'square';
    choosedTool = 'brush';
}

let changeBlur = e => brushBlur = e.target.value;

let drawSquareFunction = () => choosedTool = 'draw square';

let switchColor = document.querySelectorAll('.color-field');
for (let i = 0; i < switchColor.length; i++){
    switchColor[i].addEventListener('click', changeColor);
}

let brushR = document.querySelector('.brush-round');
brushR.addEventListener('click', brushRound);

let brushS = document.querySelector('.brush-square');
brushS.addEventListener('click', brushSquare);

let inputColor = document.querySelector('.color-picker');
inputColor.addEventListener('input', changeChooseColor);

let inputSize = document.querySelector('.pen-size');
inputSize.addEventListener('input', changeSize);

let cleaner = document.querySelector('.clear');
cleaner.addEventListener('click', clearCanvas);

let undo = document.querySelector('.undo');
undo.addEventListener('click', undoLast);

//ластик
// let eraserButton = document.querySelector('.eraser');
// eraserButton.addEventListener('click', eraserFunction);

let drawSquare = document.querySelector('.draw-square');
drawSquare.addEventListener('click', drawSquareFunction);

let bluring = document.querySelector('.blur');
bluring.addEventListener('input', changeBlur);

canv.addEventListener('mousedown', start, false);
canv.addEventListener('mousemove', draw, false);
canv.addEventListener('touchstart', start, false);
canv.addEventListener('touchmove', draw, false);

canv.addEventListener('mouseup', stop, false);
canv.addEventListener('mouseout', stop, false);
canv.addEventListener('touchend', stop, false);