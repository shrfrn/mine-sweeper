'use strict';

function toggleBuildMode() {

    if (!gGame.isBuildMode) {               // if we're entering build mode
        resetData();
        buildBoard();
        clearBoardDisplay();
        gGame.isBuildMode = true;
        gGame.isFirstGuess = false;
        gGame.mineCount = 0;
    } else {                                // if we're exiting build mode
        if (!gGame.mineCount) {             // exiting Build mode without laying mines.
            gGame.isFirstGuess = true;
        } else {
            clearBoardDisplay();            // hide the mines
            startGame();
            setNegMinesCnt();
            gGame.isBuildMode = false;
            gGame.isOn = true;
        }
    }
    toggleBuildModeDisplay();
}
function layMine(elCell, i, j) {
    gBoard[i][j].isMine = true;
    elCell.innerHTML = MINE;
    gGame.mineCount++;
}
function toggleBuildModeDisplay() {
    var elBuildBtn = document.querySelector('.build-btn');
    elBuildBtn.classList.toggle('build-mode');
}