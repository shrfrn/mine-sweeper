'use strict';

function loadTopScores(){
    gLevels[0].topScore = localStorage.getItem("Best4x4")
    gLevels[1].topScore = localStorage.getItem("Best8x8")
    gLevels[2].topScore = localStorage.getItem("Best12x12")

    showTopScore();
}
function updateTopScore(){

    if (gGame.secsPassed < gLevel.topScore){
        switch (gLevel.SIZE) {
            case 4:
                localStorage.setItem("Best4x4", gGame.secsPassed);
                break;
            case 8:
                localStorage.setItem("Best8x8", gGame.secsPassed);
                break;
            case 12:
                localStorage.setItem("Best12x12", gGame.secsPassed);
                break;
        }
        var elTopScore = document.querySelector('.top-score');   
        elTopScore.classList.add('new-record');
        elTopScore.innerHTML = `New Record: ${gGame.secsPassed} Seconds!!!`;
    }
}
function showTopScore(){

    var elTopScore = document.querySelector('.top-score');

    if (!gLevel.topScore) elTopScore.innerHTML = 'No Score Yet... Be the First!';
    else                  elTopScore.innerHTML = 'Top Score: ' + gLevel.topScore;
}
