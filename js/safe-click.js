'use strict';

var gSafeCell = null;
var gTimeOutHandler = 0;

function updateSafeClickBtn(){

    var elBtn = document.querySelector('.safe-click-btn');
    elBtn.innerHTML = 'Safe Clicks: ' + gGame.safeClicks;
}
function safeClick(){

    if (gGame.isFirstGuess) return; // first guess is inherently safe. no meed to waist...
    if (!gGame.safeClicks) return;  // no more safe guesses...

    findRandEmptyCell();
    if (!gSafeCell) return;

    gGame.safeClicks--;
    updateSafeClickBtn();

    gSafeCell.classList.toggle('safe-cell');
    gTimeOutHandler = setTimeout(hideSafeCell, 2000);
}
function findRandEmptyCell(){

    var emptyCells = [];
    
    for (let i = 0; i < gBoard.length; i++) {   // scan board for empty unshown cells and push them into an array.
        for (let j = 0; j < gBoard[i].length; j++) {
            if (!gBoard[i][j].isMine && !gBoard[i][j].isMark && !gBoard[i][j].isShown) {
                emptyCells.push({i: i, j: j});
            }
        }
    }
    if (!emptyCells.length) return;             // no empty cells
    
    var idx = getRandomInt(0, emptyCells.length - 1);
    gSafeCell = document.querySelector(getCellId(emptyCells[idx].i, emptyCells[idx].j));
}
function hideSafeCell(){

    gSafeCell.classList.toggle('safe-cell');
    gSafeCell = null
    gTimeOutHandler = 0;
}