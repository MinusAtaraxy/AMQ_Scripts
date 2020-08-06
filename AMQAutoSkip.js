// ==UserScript==
// @name         AMQ Auto-Skip
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      0.1+0.01
// @description  afk auto skip
// @author       Ataraxia
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js

// ==/UserScript==

//IDEK WTF I AM DOING

    if (document.getElementById('startPage')) {
        return
    }
let doSkip = false;

(function() {


    if(lobby.inLobby || lobby.isSpectator || quiz.gameMode === "Ranked") return;
    $("#qpAnswerInputContainer")
           .append($(`<div class ="" id="qpSkipContainer" style="transform: translateX(-100%);
	transition: transform 0.5s ease-out;width: 60px;"></div>`)
        .append($(`<div class="qpSkipSection" style="

	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	text-align: center;
	overflow: hidden;


	background-color: #424242;
	-webkit-box-shadow: 0 0 5px rgb(0, 0, 0);
	box-shadow: 0 0 5px rgb(0, 0, 0);
	pointer-events: initial;"></div>`)
                .append($(`<div class="customCheckbox"></div>`)
                        .append($(`<input id="slAFKSkip" type="checkbox">`)
                                .click(function () {
        toggleAutoSkip();
    })
                               )
                        .append(`<label for="slAFKSkip"><i class="fa fa-check" aria-hidden="true"></i></label>`)
                       )
                .append(`</div><p>AFK</p><div>`)
)
               );



})();
let playNextSongListener = new Listener("play next song", payload => {
    if(doSkip) AutoSkip();
});

playNextSongListener.bindListener();

function toggleAutoSkip() {
doSkip = !doSkip;
    quiz.skipClicked();
    //debug
if(doSkip) gameChat.systemMessage("skip on!");
}

function AutoSkip(){
setTimeout(() => { quiz.skipClicked(); }, 100);

        gameChat.systemMessage("skipped!!");
}
