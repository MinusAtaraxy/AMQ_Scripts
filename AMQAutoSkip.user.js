// ==UserScript==
// @name         AMQ Auto-Skip
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      0.1 + 0.2 (Not)
// @description  afk auto skip
// @author       Ataraxia
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js


// ==/UserScript==

//IDEK WTF I AM DOING AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA

    if (document.getElementById('startPage')) {
        return
    }
let doSkip = false;

(function() {


    if(lobby.inLobby || lobby.isSpectator || quiz.gameMode === "Ranked") return;
    $("#qpSkipContainer")
           .append($(`<div id="qpAutoSkipContainer"></div>`)
        .append($(`<div id="qpAutoSkipSection" class="qpSkipSection"></div>`)
                .append($(`<div class="customCheckbox"></div>`)
                        .append($(`<input id="slAFK" type="checkbox">`)
                                .click(function () {
        toggleAutoSkip();
    })
                               )
                        .append(`<label for="slAFKp"><i class="fa fa-check" aria-hidden="true"></i></label>`)
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
#qpAutoSkipContainer {
    overflow: hidden;
	width: 150px;
	z-index: -1;
	position: absolute;
	height: 100%;
	pointer-events: none;

}

#qpAutoSkipSection {
	float: left;
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
	text-align: center;
	width: 114px;
	padding-left: 30px;
	overflow: hidden;
	transform: translateX(-110%);
	transition: transform 0.5s ease-out;
	background-color: #424242;
	-webkit-box-shadow: 0 0 5px rgb(0, 0, 0);
	box-shadow: 0 0 5px rgb(0, 0, 0);
	pointer-events: initial;
}

#qpSkipContainer:hover #qpAutoSkipSection {
	 z-index: 10;

}

#qpAutoSkipSection > p {
	padding-left: 18px;
}

`);
