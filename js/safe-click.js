'use strict';

const SAFE_CLICKS = 3;

var gSafeCell = null;
var gTimeOutHandler = 0;

function updateSafeClicks(){

    var elBtn = document.querySelector('.safe-click-btn');
    elBtn.innerHTML = 'Safe Clicks: ' + gGame.safeClicks;
}
function safeClick(){

    if (!gGame.safeClicks) return;  // no more safe guesses...
    if (gGame.isFirstGuess) return; // first guess is inherently safe. no meed to waist...
    if (gHint.isHintDisplayed || gHint.isHintSelection) return;     // can't show safe click while in hint mode.
    if (gGame.isBuildMode)  return; // can't show safe click while in build mode.


    findRandEmptyCell();
    if (!gSafeCell) return;

    gGame.safeClicks--;
    updateSafeClicks();

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
    if (!emptyCells.length) return;             // no empty cells - this shouldn't happen. game should have ended
    
    var idx = getRandomInt(0, emptyCells.length - 1);
    gSafeCell = document.querySelector(getCellId(emptyCells[idx].i, emptyCells[idx].j));
}
function hideSafeCell(){

    gSafeCell.classList.toggle('safe-cell');
    gSafeCell = null
    gTimeOutHandler = 0;
}