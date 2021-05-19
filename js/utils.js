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
