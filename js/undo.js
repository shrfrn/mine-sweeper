'use strict';

const GUESS = 'Guess';
const MARK_ON = 'Mark';
const MARK_OFF = 'Unmark';
const AUTO_COMPLETE = 'Auto complete'

var gRedoing = false;
var gClickStack = [];

function registerClick(i, j, type) {
    gClickStack.push({ i: i, j: j, type: type });
    console.log(gClickStack);
}
function undo() {
    
    if (gClickStack.length <= 1)   return;      // can't undo first move or before game started.
    if (gHint.isHintDisplayed || gHint.isHintSelection) return;     // can't undo while in hint mode.
    if (gGame.isBuildMode)  return; // can't undo while in build mode.

    clearBoardDisplay();                        // reset display.

    gGame.shownCount = 0;      // should change to a function which counts the shown cells becaues 1st click may have expanded                 
    gGame.markedCount = 0;


    var lastClick = gClickStack.pop();           // remove last click from undo stack.

    gBoard[lastClick.i][lastClick.j].isShown = false;
    gRedoing = true;

    for (let i = 0; i < gClickStack.length; i++) {
        
        var elCell = document.querySelector(getCellId(gClickStack[i].i, gClickStack[i].j));

        switch (gClickStack[i].type) {
            case AUTO_COMPLETE:
                cellClicked(elCell, gClickStack[i].i, gClickStack[i].j, AUTO_COMPLETE);
            case GUESS:
                cellClicked(elCell, gClickStack[i].i, gClickStack[i].j);
                break;
            case MARK_ON:
            case MARK_OFF:
                restoreMark(elCell, gClickStack[i].i, gClickStack[i].j, gClickStack[i].type);
                break;
        }
    }
    gRedoing = false;
    // renderBoard();
}
function restoreMark(elCell, i, j, type) {
    // toggle the mark
    if (type === MARK_ON) {
        gBoard[i][j].isMarked = true;
        // gBoard[i][j].isShown = true;
        gGame.markedCount++;
        elCell.innerHTML = MARK;
    } else {
        gBoard[i][j].isMarked = false;
        // gBoard[i][j].isShown = false;
        gGame.markedCount--;;
        elCell.innerHTML = EMPTY;
    }
}
