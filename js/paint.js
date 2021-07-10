"use strict";

const canv = document.querySelector('#canv');
canv.width = window.innerWidth - 60;
canv.height = 400;

let ctx = canv.getContext ('2d');
let startBackgroundColor = 'white';
ctx.fillStyle = startBackgroundColor;
ctx.fillRect(0, 0, canv.width, canv.height);

let drawColor = 'black';
let drawWidth = '3';
let drawing = false;
let brushNow = 'round';
let brushBlur = 0;

let restoreArray = [];
let index = -1;

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

let bluring = document.querySelector('.blur');
bluring.addEventListener('input', changeBlur);

canv.addEventListener('mousedown', start, false);
canv.addEventListener('mousemove', draw, false);

canv.addEventListener('mouseup', stop, false);
canv.addEventListener('mouseout', stop, false);

function start(e) {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop);
    e.preventDefault(); // посмотреть что это?
}


function draw(e) {
    if (drawing === true){
        ctx.lineTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawWidth;
        ctx.lineCap = brushNow;
        ctx.lineJoin = brushNow;
        ctx.shadowBlur = brushBlur;
        ctx.shadowColor = drawColor;

        // ctx.globalAlpha = '0.01';
        ctx.filter = 'blur(' + brushBlur/2 + 'px)';
        ctx.stroke ();
    }
}

function stop(e) {
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

function changeColor (e) {
    drawColor = e.target.style.background;
}

function changeChooseColor(e) {
    drawColor = e.target.value;
}

function changeSize(e) {
    drawWidth = e.target.value;
}

function clearCanvas () {
    ctx.fillStyle = startBackgroundColor;
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillRect(0, 0, canv.width, canv.height);
    restoreArray = [];
    index = -1;
}

function undoLast() {
    if (index <= 0) {
        clearCanvas()
    } else {
        index -= 1;
        restoreArray.pop();
        ctx.putImageData(restoreArray[index], 0, 0);
    }
}

 function brushRound() {
    brushNow = 'round';
 }

function brushSquare() {
    brushNow = 'square';
}

function changeBlur(e) {
    brushBlur = e.target.value;
}