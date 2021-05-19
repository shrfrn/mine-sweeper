'use strict';

function init() {
    setFace(HAPPY_FACE);
    resetData();
    buildBoard();
    renderBoard();
}
function resetData() {
    gBoard = [];

    if (gGame.timerInterval) clearInterval(gGame.timerInterval);

    gGame = {
        isOn: true,
        isFirstGuess: true,
        shownCount: 0,
        markedCount: 0,
        timerInterval: 0,
        secsPassed: 0,
    };
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
    console.log(gBoard);
}
function renderBoard() {

    var strHTML = '';

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gLevel.SIZE; j++) {
            strHTML += `\t<td id="cell-${i}-${j}" onclick="cellClicked(this, ${i}, ${j})">`;
            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMine) {
                    strHTML += MINE;
                } else if (!gGame.isFirstGuess) {
                    strHTML += gBoard[i][j].negMinesCnt;
                }
            }
            strHTML += '</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elTableBody = document.querySelector('.board');
    elTableBody.innerHTML = strHTML;
    updateShown();
    updateTime();
}
function generateMines(elCell, firstI, firstJ) {
    for (var mineCnt = 0; mineCnt < gLevel.MINES; mineCnt++) {
        while (true) {
            var i = getRandomInt(0, gLevel.SIZE - 1);
            var j = getRandomInt(0, gLevel.SIZE - 1);
            if (i === firstI && j === firstJ) continue;

            if (!gBoard[i][j].isMine) {
                gBoard[i][j].isMine = true;
                console.log(mineCnt, i, j);
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
            updateNegMinesCnt(i, j);
        }
    }
}
function updateNegMinesCnt(row, col) {
    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
                if (gBoard[i][j].isMine) {
                    gBoard[row][col].negMinesCnt++;
                }
            }
        }
    }
}
function cellClicked(elCell, i, j) {
    // console.log("Clicked", i, j);
    // console.log(gBoard[i][j]);
    // console.log(event);

    if (!gGame.isOn) return;
    if (gGame.isFirstGuess) return startGame(elCell, i, j);
    if (event.altKey) {
        return markCell(elCell, i, j);
    }
    if (gBoard[i][j].isMarked) return;
    if (gBoard[i][j].isMine) return explodeMine(elCell, i, j);

    if (!gBoard[i][j].negMinesCnt) expandShown(elCell, i, j);
    else revealCnt(elCell, i, j);

    checkWin();
}
function startGame(elCell, i, j) {
    generateMines(elCell, i, j);
    gGame.timerInterval = setInterval(updateTime, 1000);
}
function explodeMine(elCell, i, j) {
    lostGame(i, j);
}
function revealCnt(elCell, i, j) {
    gBoard[i][j].isShown = true;
    gGame.shownCount++;
    updateShown();
    elCell.innerHTML = gBoard[i][j].negMinesCnt;
}
function expandShown(elCell, row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
                var elNeg = document.querySelector(getCellId(i, j));
                if (gBoard[i][j].isShown) continue;
                gBoard[i][j].isShown = true;
                gGame.shownCount++;
                elNeg.innerHTML = gBoard[i][j].negMinesCnt;
            }
        }
    }
    updateShown();
}
function lostGame(i, j) {
    revealAllMines();

    // Mark the exploded mine
    var elCell = document.querySelector(getCellId(i, j));
    elCell.classList.add('exploded');

    setFace(SAD_FACE);
    resetData();
}
function revealAllMines() {
    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            if (gBoard[i][j].isMine) gBoard[i][j].isShown = true;
        }
    }
    renderBoard();
}
function setLevel(level) {
    gLevel = gLevels[level];
    init();
}
function markCell(elCell, i, j) {
    if (gBoard[i][j].isMarked) {
        gBoard[i][j].isMarked = false;
        gGame.markedCount--;;
        elCell.innerHTML = EMPTY;
    } else {
        gBoard[i][j].isMarked = true;
        gGame.markedCount++;
        elCell.innerHTML = MARK;
    }
    checkWin();
}
function checkWin() {
    if (gLevel.MINES === gGame.markedCount && gLevel.SIZE ** 2 - gGame.markedCount === gGame.shownCount) {
        setFace(WIN_FACE);
        resetData();
    }
}