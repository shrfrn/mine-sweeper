'use strict';

function init() {
    buildBoard();
    renderBoard();
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
    gBoard[2][3].isMine = true;
    gBoard[1][1].isMine = true;
    gBoard[2][2].isMine = true;
    gBoard[5][4].isMine = true;
    gBoard[2][5].isMine = true;
    gBoard[4][1].isMine = true;
    console.table(gBoard);
    console.log(gBoard);
}
function renderBoard() {

    var strHTML = '';

    setNegMinesCnt();

    console.log(gBoard);

    for (var i = 0; i < gLevel.SIZE; i++) {
        strHTML += '<tr>\n';
        for (var j = 0; j < gLevel.SIZE; j++) {
            strHTML += `\t<td id="cell-${i}-${j}" onclick="cellClicked(this, ${i}, ${j})">`;
            if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMine) {
                    strHTML += MINE;
                } else if (gBoard[i][j].negMinesCnt) {
                    strHTML += gBoard[i][j].negMinesCnt;
                }
            }
            strHTML += '</td>\n';
        }
        strHTML += '</tr>\n';
    }

    var elTable = document.querySelector('.board');
    elTable.innerHTML = strHTML;
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
    console.log("Clicked", i, j);
    console.log(gBoard[i][j]);
    if (gBoard[i][j].isMine) return explodeMine(elCell, i, j);
    if (!gBoard[i][j].negMinesCnt) return expandShown(elCell, i, j);
    if (gBoard[i][j].negMinesCnt) return revealCnt(elCell, i, j);
}
function explodeMine(elCell, i, j) {
    gBoard[i][j].isShown = true;
    elCell.innerHTML = MINE;
}
function revealCnt(elCell, i, j) {
    gBoard[i][j].isShown = true;
    elCell.innerHTML = gBoard[i][j].negMinesCnt;
}
function expandShown(elCell, row, col) {
    for (var i = row - 1; i <= row + 1; i++) {
        for (var j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < gLevel.SIZE && j >= 0 && j < gLevel.SIZE) {
                var elNeg = document.querySelector(getCellId(i,j));
                gBoard[i][j].isShown = true;
                elNeg.innerHTML = gBoard[i][j].negMinesCnt;
            }
        }
    }
}