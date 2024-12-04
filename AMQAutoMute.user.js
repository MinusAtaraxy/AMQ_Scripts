// ==UserScript==
// @name         AMQ Auto Mute
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      0.0000002
// @description  auto mute for pictionary and image ref
// @author       Ataraxia
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://gist.githubusercontent.com/arantius/3123124/raw/grant-none-shim.js

// ==/UserScript==
if (typeof Listener === "undefined") return;

let ismute = false;

let lastvolume = "0.5";

let imageLink = []
for(let i = 0; i < 4; i++){
    imageLink[i] = document.createElement('a')
    imageLink[i].target = '_blank'
    imageLink[i].className = "removeMe"
}

(function() {


    if(lobby.inLobby || lobby.isSpectator || quiz.gameMode === "Ranked") return;
    $("#qpOptionContainerHider")
           .append($(`<div id="qpAutoMuteContainer"></div>`)
        .append($(`<div id="qpAutoMuteSection"></div>`)
                .append($(`<div class="customCheckbox"></div>`)
                        .append($(`<input id="slMute" type="checkbox">`)
                                .click(function () {
        toggleAutomute();
    })
                               )
                        .append(`<label for="slMute"><i class="fa fa-check" aria-hidden="true"></i></label>`)
                       )
                .append(`</div><p>Mute</p><div>`)
)
               );



})();



// let commandListener = new Listener("Game Chat Message", (payload) => {
//     if (payload.sender === selfName && payload.message.startsWith("/unmute")) {
//         ismute = false;
//     }
//     else if (payload.sender === selfName && payload.message.startsWith("/mute")) {
//         ismute = true;
//     }

// }).bindListener();


let answerResultsListener = new Listener("answer results", (result) => {
     if (ismute && !quiz.isHost) {
         setTimeout(() => { UnmuteSound(); }, 1);
     }
}).bindListener();

let playNextSongListener = new Listener("play next song", payload => {
    if (ismute && !quiz.isHost) {
        setTimeout(() => { MuteSound(); }, 1);
    }
        if (ismute && quiz.isHost) {
            setTimeout(() => { toggleImageLinks(); }, 1);

    }
	    if(!ismute){
     for(let i = 0; i < 4; i++){
         $(".removeMe")[0].parentNode.removeChild($(".removeMe")[0])
     }
    }
}).bindListener();

function MuteSound(){
    lastvolume = volumeController.volume;
    volumeController.volume = "0";
    volumeController.adjustVolume();
}

function UnmuteSound(){
    volumeController.volume = lastvolume;
    volumeController.adjustVolume();
}

function toggleAutomute(){
ismute = !ismute;
}

function toggleImageLinks(){
            for(let i = 0; i < 4; i++){
            let formattedQuery = $(".qpMultipleChoiceEntryText")[i].innerHTML
            imageLink[i].href = `https://www.google.com/search?tbm=isch&q=${formattedQuery}`
            imageLink[i].textContent = formattedQuery
            $(".qpMultipleChoiceEntryText")[i].parentNode.insertBefore(imageLink[i], $(".qpMultipleChoiceEntryText")[i])
            }
}


GM_addStyle(`

#qpAutoMuteContainer{
	position: absolute;
	z-index: 1;
	top: 0;
	left: 0;
	height: 120%;
	width: 60px;
    transform: translateY(100%) translateX(300%);
}

#qpAutoMuteSection {
	height: 100%;
	line-height: 1;
	padding-top: 7px;


	border-bottom-right-radius: 10px;
	border-bottom-left-radius: 10px;
	text-align: center;
	overflow: hidden;
display: none;

	background-color: #424242;
	-webkit-box-shadow: 0 0 5px rgb(0, 0, 0);
	box-shadow: 0 0 5px rgb(0, 0, 0);
	pointer-events: initial;
}

#qpAutoMuteContainer:hover #qpAutoMuteSection {
    display: block;
}

`);
