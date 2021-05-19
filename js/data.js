'use strict';

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    timerInterval: 0,
    secsPassed: 0,
};
var gLevels = [
    {SIZE: 4, MINES: 2},
    {SIZE: 8, MINES: 12},
    {SIZE: 12, MINES: 30},
];
var gLevel = gLevels[1];
var gBoard = [];

const MINE = '💣'
const MARK = '🚩'