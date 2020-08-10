// ==UserScript==
// @name         AMQ Auto-Skip
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      0.1+0.01+0.4
// @description  afk auto skip
// @author       Ataraxia
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js

// ==/UserScript==

//IDEK WTF I AM DOING

    if (document.getElementById('startPage')) {
        return
    }
let doSkip = false;

(function() {


    if(lobby.inLobby || lobby.isSpectator || quiz.gameMode === "Ranked") return;
    $("#qpAnswerInputContainer")
           .append($(`<div id="qpAutoSkipContainer"></div>`)
        .append($(`<div id="qpAutoSkipSection"></div>`)
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

GM_addStyle(`

#qpAutoSkipContainer{
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	height: 100%;
	width: 60px;
    transform: translateX(-100%);
}

#qpAutoSkipSection {
	height: 100%;
	line-height: 1;
	padding-top: 7px;


	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	text-align: center;
	overflow: hidden;
display: none;

	background-color: #424242;
	-webkit-box-shadow: 0 0 5px rgb(0, 0, 0);
	box-shadow: 0 0 5px rgb(0, 0, 0);
	pointer-events: initial;
}

#qpAutoSkipContainer:hover #qpAutoSkipSection {
    display: block;
}

`);
