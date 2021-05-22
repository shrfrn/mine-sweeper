'use strict';

const HINTS = 3;

var gHint = {
    hints: HINTS,
    isHintSelection: false,
    isHintDisplayed: false,
    hintI: -1,
    hintJ: -1,   
};

function resetHints(){
    gHint.hints = HINTS;
    gHint.isHintSelection = false;
    gHint.isHintDisplayed = false;
    gHint.hintI = -1;
    gHint.hintJ = -1;
}
function selectHintCell(){
    gHint.isHintSelection = true;
}
function showHint(row, col){

    gHint.hintI = row;
    gHint.hintJ = col;

    gHint.isHintSelection = false;
    gHint.isHintDisplayed = true;

    for (var i = row - 1; i <= row + 1; i++) {      // neighbor loop
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {

                if (gBoard[i][j].isShown || gBoard[i][j].isMarked) continue;
                var elNeg = document.querySelector(getCellId(i, j));
                elNeg.innerHTML = (gBoard[i][j].isMine) ? MINE : gBoard[i][j].negMinesCnt;
                elNeg.classList.toggle('td-hint');
            }
        }
    }

    setTimeout(hideHint, 1000);
}
function hideHint(){

    for (var i = gHint.hintI - 1; i <= gHint.hintI + 1; i++) {      // neighbor loop
        for (var j = gHint.hintJ - 1; j <= gHint.hintJ + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {

                if (gBoard[i][j].isShown || gBoard[i][j].isMarked) continue;
                var elNeg = document.querySelector(getCellId(i, j));
                elNeg.innerHTML = EMPTY;
                elNeg.classList.toggle('td-hint');
            }
        }
    }

    gHint.hintI = -1;
    gHint.hintJ = -1;
    gHint.isHintDisplayed = false;
}