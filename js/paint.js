"use strict"

//основное поле и его начальные данные
const canv = document.querySelector('#canv');
canv.width = window.innerWidth - 60;
canv.height = 500;

//контекст и его начальные стили
const ctx = canv.getContext ('2d');
const startBackgroundColor = 'white';
ctx.fillStyle = startBackgroundColor;
ctx.fillRect(0, 0, canv.width, canv.height);

//основные переменные с начальными параметрами
let drawColor = 'black';
let drawWidth = '3';
let drawing = false;
let brushNow = 'round';
let brushBlur = 0;
let choosedTool = 'brush';
let brushOpacity = 1;
let startX;
let startY;

let restoreArray = [];
let index = -1;

//функция начала рисования
const start = e => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canv.offsetLeft, e.clientY - canv.offsetTop);
    startX = e.clientX - canv.offsetLeft;
    startY = e.clientY - canv.offsetTop;
    draw(e);
    e.preventDefault();
}

//функция рисования
const draw = e => {
    if (drawing === true){
        ctx.filter = `blur(${brushBlur/2}px)`;
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = drawWidth;
        ctx.globalAlpha = brushOpacity;
        ctx.lineCap = brushNow;
        ctx.lineJoin = brushNow;
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
        } else if (choosedTool === 'draw circle'){
            ctx.beginPath();
            ctx.arc(startX, startY, Math.sqrt((startX - (e.clientX - canv.offsetLeft))**2 + (startY - (e.clientY - canv.offsetTop))**2), 0, Math.PI * 2, false);
            ctx.closePath();
        }
    }
}

//функция остановки рисования
const stop = e => {
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

//функции сменить цвет
const changeColor = e => drawColor = e.target.style.background;

const changeChooseColor = e => drawColor = e.target.value;

//функции изменить размер
const changeSize = e => drawWidth = e.target.value;

//функция регулировки прозрачности
const changeOpacity = e => brushOpacity = (100 - e.target.value)/100;

//функция очистки всего
const clearCanvas = () => {
    ctx.fillStyle = startBackgroundColor;
    ctx.filter = `blur(0px)`;
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canv.width, canv.height);
    ctx.fillRect(0, 0, canv.width, canv.height);
    restoreArray = [];
    index = -1;
}

//функция возврата к предыдущему
const undoLast = () => {
    if (index <= 0) {
        clearCanvas()
    } else {
        index -= 1;
        restoreArray.pop();
        ctx.putImageData(restoreArray[index], 0, 0);
    }
}

//функция круглой кисти
const brushRound = () => {
    brushNow = 'round';
    choosedTool = 'brush';
 }

//функция квадратной кисти
const brushSquare = () => {
    brushNow = 'square';
    choosedTool = 'brush';
}

//функция изменения размытия
const changeBlur = e => brushBlur = e.target.value;

//функция рисования квадрата
const drawSquareFunction = () => choosedTool = 'draw square';

//функция рисования круга
const drawCircle = () => choosedTool = 'draw circle';

//присваивание функций к кнопкам
const switchColor = document.querySelectorAll('.color-field');
for (let i = 0; i < switchColor.length; i++){
    switchColor[i].addEventListener('click', changeColor);
}

const brushR = document.querySelector('.brush-round');
brushR.addEventListener('click', brushRound);

const brushS = document.querySelector('.brush-square');
brushS.addEventListener('click', brushSquare);

const inputColor = document.querySelector('.color-picker');
inputColor.addEventListener('input', changeChooseColor);

const inputSize = document.querySelector('.pen-size');
inputSize.addEventListener('input', changeSize);

const cleaner = document.querySelector('.clear');
cleaner.addEventListener('click', clearCanvas);

const undo = document.querySelector('.undo');
undo.addEventListener('click', undoLast);

const circle = document.querySelector('.draw-circle');
circle.addEventListener('click', drawCircle);

const opacity = document.querySelector('.opacity');
opacity.addEventListener('input', changeOpacity);

//ластик
// let eraserButton = document.querySelector('.eraser');
// eraserButton.addEventListener('click', eraserFunction);

const drawSquare = document.querySelector('.draw-square');
drawSquare.addEventListener('click', drawSquareFunction);

const bluring = document.querySelector('.blur');
bluring.addEventListener('input', changeBlur);

canv.addEventListener('mousedown', start, false);
canv.addEventListener('mousemove', draw, false);
canv.addEventListener('touchstart', start, false);
canv.addEventListener('touchmove', draw, false);

canv.addEventListener('mouseup', stop, false);
canv.addEventListener('mouseout', stop, false);
canv.addEventListener('touchend', stop, false);