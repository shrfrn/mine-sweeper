'use strict';

function init() {
    resetData();
    buildBoard();
    renderBoard();

    setFace(HAPPY_FACE);
    updateTime();
    updateLives();
    updateHints();
    updateSafeClicks();
    loadTopScores();
    showTopScore();

    gGame.isOn = true;

    // capture right click event on board only...
    var elBoard = document.querySelector('.board');
    elBoard.addEventListener("contextmenu", cellRightClicked);
}
function resetData() {
    gBoard = [];
    gClickStack = [];

    if (gGame.timerInterval) clearInterval(gGame.timerInterval);

    gGame = {
        isOn: false,
        isFirstGuess: true,
        shownCount: 0,
        markedCount: 0,
        timerInterval: 0,
        secsPassed: 0,
        safeClicks: SAFE_CLICKS,
        lives: LIVES,
        isBuildMode: false,
        mineCount: gLevel.MINES,
    };
    resetHints();
}
function buildBoard() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = [];
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                negMinesCnt: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };
        }
    }
}
function renderBoard() {

    var strHTML = '';

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gLevel.SIZE; j++) {
            strHTML += `\t<td id="cell-${i}-${j}" contextmenu="rClick(event, this)" onclick="cellClicked(this, ${i}, ${j})">`;

            if (!gBoard[i][j].isMine && gBoard[i][j].isMarked) {    // incorrectly marked cell
                strHTML = insertClass(strHTML, 'incorrectly-marked');
                strHTML += MARK;
            } else if (gBoard[i][j].isMine) {      // if game is lost and mines are now being rendered
                if (gBoard[i][j].isShown) strHTML = insertClass(strHTML, 'exploded');
                strHTML += MINE;
            } else if (gBoard[i][j].isMarked) {
                strHTML += MARK;
            } else if (!gGame.isFirstGuess) {
                if (gBoard[i][j].isShown) strHTML = insertClass(strHTML, 'td-shown');
                strHTML += gBoard[i][j].negMinesCnt;
            }
            strHTML += '</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elTableBody = document.querySelector('.board');
    elTableBody.innerHTML = strHTML;
    updateShown();
}
function generateMines(elCell, firstI, firstJ) {
    for (var mineCnt = 0; mineCnt < gLevel.MINES; mineCnt++) {
        while (true) {
            var i = getRandomInt(0, gLevel.SIZE - 1);
            var j = getRandomInt(0, gLevel.SIZE - 1);
            if (i === firstI && j === firstJ) continue;

            if (!gBoard[i][j].isMine) {
                gBoard[i][j].isMine = true;
                break;
            }
        }
    }
    gGame.isFirstGuess = false;

    setNegMinesCnt();
    cellClicked(elCell, firstI, firstJ);
}
function setNegMinesCnt() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) continue;
            updateNegMinesCnt(i, j);
        }
    }
}
function updateNegMinesCnt(row, col) {

    for (let i = row - 1; i <= row + 1; i++) {      // neighbor loop
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
                if (gBoard[i][j].isMine) {
                    gBoard[row][col].negMinesCnt++;
                }
            }
        }
    }
}
function cellClicked(elCell, i, j, type = '') {

    if (gGame.isBuildMode) return layMine(elCell, i, j);
    if (!gGame.isOn) return;
    if (gGame.isFirstGuess) return startGame(elCell, i, j);
    if (gHint.isHintDisplayed) return;  // don't respond to clicks while hint is displayed.
    if (gHint.isHintSelection) return showHint(i,j);

    if (event.altKey || type === AUTO_COMPLETE) {
        if (allNegsShown(i,j)) return;
        if (gBoard[i][j].isShown && countNegMinesAndMarks(i, j) >= gBoard[i][j].negMinesCnt) {
            expandShown(elCell, i, j)
            checkGameEnd();
            if(!gRedoing) registerClick(i, j, AUTO_COMPLETE);
        }
        return;
    }
    if (gBoard[i][j].isMarked) return;          // marked cells don't respond to clicks
    if (gBoard[i][j].isShown) return;          // re-clicking a shown cell

    if (!gRedoing) registerClick(i, j, GUESS);  // if not currently re-doing, register click in the click stack (for undo)

    if (gBoard[i][j].isMine) return explodeMine(elCell, i, j);

    if (!gBoard[i][j].negMinesCnt) expandShown(elCell, i, j);   // clicked a cell with no surrounding mines
    else revealCnt(elCell, i, j);

    checkGameEnd();
}
function cellRightClicked(ev) {

    if (!gGame.isOn || gGame.isFirstGuess) return;
    if (ev.target.nodeName === 'TD') {  // if right click is in a cell...

        var elCell = document.querySelector('#' + ev.target.id);
        var cellIdParts = ev.target.id.split('-');

        markCell(elCell, cellIdParts[1], cellIdParts[2]);
    }
    ev.preventDefault();
}
function startGame(elCell, i, j) {

    gGame.isOn = true;
    if (!gGame.isBuildMode)    generateMines(elCell, i, j);
    gGame.timerInterval = setInterval(updateTime, 1000);
}
function explodeMine(elCell, i, j) {

    if (!gRedoing) gGame.lives--;

    gGame.shownCount++
    showMine(elCell, i, j);
    updateLives();
    updateShown();
    if (!gGame.lives) lostGame(i, j);
}
function showMine(elCell, i, j) {
    gBoard[i][j].isShown = true;
    elCell.innerHTML = MINE;
    elCell.classList.toggle('exploded');
}
function revealCnt(elCell, i, j) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    updateShown();
    // if (gBoard[i][j].isMine) {
    //     explodeMine(elCell, i, j);
    // } else {
        elCell.innerHTML = gBoard[i][j].negMinesCnt;
        elCell.classList.add('td-shown');
    // }
}
function expandShown(elCell, row, col) {

    for (var i = row - 1; i <= row + 1; i++) {      // neighbor loop
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {

                if (gBoard[i][j].isShown || gBoard[i][j].isMarked) continue;

                var elNeg = document.querySelector(getCellId(i, j));
                revealCnt(elNeg, i, j);             // reveal neighbor

                if (gBoard[i][j].negMinesCnt === 0) expandShown(elNeg, i, j);   // if neighbor has no surrounding mines...
            }
        }
    }
    updateShown();
}
function lostGame(i, j) {

    renderBoard();

    var elCell = document.querySelector(getCellId(i, j));        // Mark the exploded mine
    elCell.classList.add('last-exploded');

    setFace(SAD_FACE);
    if (gGame.timerInterval) clearInterval(gGame.timerInterval);
}
function markCell(elCell, i, j) {
    // toggle the mark
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;;
        elCell.innerHTML = EMPTY;
        registerClick(i, j, MARK_OFF);    // register click in the click stack (for undo)
    } else {
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        elCell.innerHTML = MARK;
        registerClick(i, j, MARK_ON);    // register click in the click stack (for undo)
    }
    checkGameEnd();
}
function countNegMinesAndMarks(row, col) {
    var cnt = 0;
    for (var i = row - 1; i <= row + 1; i++) {      // neighbor loop
        for (var j = col - 1; j <= col + 1; j++) {
            if (i === row && j === col) continue;
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
                if (gBoard[i][j].isMine && gBoard[i][j].isShown || gBoard[i][j].isMarked) {
                    cnt++;
                }
            }
        }
    }
    return cnt;
}
function allNegsShown(row, col){
    for (var i = row - 1; i <= row + 1; i++) {      // neighbor loop
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
                if (i === row && j === col) continue;
                if (!gBoard[i][j].isShown && !gBoard[i][j].isMarked) {
                    return false;
                }
            }
        }
    }
    return true;
}
function checkGameEnd() {

    var totalCellCnt = gLevel.SIZE ** 2;
    var minesExploded = LIVES - gGame.lives;

    if (gGame.shownCount + gGame.markedCount === totalCellCnt &&    // all cells exposed
        gGame.markedCount + minesExploded > gGame.mineCount) {         // ...but mines are marked that don't exist...
        setFace(SAD_FACE);
        renderBoard();
        resetData();
    }
    if (gGame.markedCount + minesExploded === gGame.mineCount &&   // if the correct number of mines is marked
        totalCellCnt - gGame.markedCount - minesExploded === gGame.shownCount - minesExploded) {      // and all other cells are revealed
        setFace(WIN_FACE);
        updateTopScore();
        resetData();
    }
}