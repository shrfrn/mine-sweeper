'use strict';

const GUESS = 'Guess';
const MARK_ON = 'Mark';
const MARK_OFF = 'Unmark';
// const EXPLODE = 'Explode';

var gRedoing = false;
var gClickStack = [];

function registerClick(i, j, type) {
    gClickStack.push({ i: i, j: j, type: type });
    console.log(gClickStack);
}
function undo() {
    
    if (gClickStack.length <= 1)   return;      // can't undo first move or before game started.

    clearBoardDisplay();                        // reset display.

    gGame.shownCount = 0;      // should change to a function which counts the shown cells becaues 1st click may have expanded                 
    gGame.markedCount = 0;


    var lastClick = gClickStack.pop();           // remove last click from undo stack.

    gBoard[lastClick.i][lastClick.j].isShown = false;
    gRedoing = true;

    for (let i = 0; i < gClickStack.length; i++) {
        
        var elCell = document.querySelector(getCellId(gClickStack[i].i, gClickStack[i].j));

        switch (gClickStack[i].type) {
            case GUESS:
                cellClicked(elCell, gClickStack[i].i, gClickStack[i].j)
                break;
            case MARK_ON:
            case MARK_OFF:
                restoreMark(elCell, gClickStack[i].i, gClickStack[i].j, gClickStack[i].type)
                break;
        }
    }
    gRedoing = false;
    // renderBoard();
}
function clearBoardDisplay(){

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            var elCell = document.querySelector(getCellId(i, j));
            elCell.innerHTML = '';
            elCell.classList.remove('td-shown', 'exploded');
            gBoard[i][j].isShown = false;
            gBoard[i][j].isMarked = false;
        }
    }
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
