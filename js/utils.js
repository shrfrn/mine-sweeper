'use strict';

function getCellId(i, j){
    return `#cell-${i}-${j}`;
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}
function updateTime(){
    var elSecDisplay = document.querySelector('.seconds');
    elSecDisplay.innerHTML = gGame.secsPassed++;
}
function updateShown(){
    var elSecDisplay = document.querySelector('.shown');
    // elSecDisplay.innerHTML = gGame.shownCount - (LIVES - gGame.lives);
    elSecDisplay.innerHTML = gGame.shownCount;
}
function updateLives(){
    var elLivesDisplay = document.querySelector('.lives');
    elLivesDisplay.innerHTML = gGame.lives;
}
function setFace(face){
    var startBtn = document.querySelector('.start-button');
    startBtn.innerHTML = face;
}
function setLevel(level) {
    gLevel = gLevels[level];
    init();
}
function insertClass(strHTML, className){
    return strHTML.substring(0, strHTML.length - 1) + ` class="${className}"` + strHTML.substring(strHTML.length - 1);
}