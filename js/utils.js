'use strict';

function isFirstGuess(){
    return gGame.shownCount === 0;
}
function getCellId(i, j){
    return `#cell-${i}-${j}`;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function updateTime(){
    var elSecDisplay = document.querySelector('.sec-display');
    elSecDisplay.innerHTML = gGame.secsPassed++;
}
function updateShown(){
    var elSecDisplay = document.querySelector('.shown-display');
    elSecDisplay.innerHTML = gGame.shownCount;
}
function setFace(face){
    var startBtn = document.querySelector('.start-button');
    startBtn.innerHTML = face;
}