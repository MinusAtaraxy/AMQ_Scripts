// ==UserScript==
// @name         AMQ BOT - Pictionary
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      1.0
// @description  auto say rules/instuctions/links for the custom game pictionary
// @author       Ataraxy
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// ==/UserScript==

if (!window.setupDocumentDone) return;

if (document.getElementById('startPage')) {
    return
}

let urlLink = "https://aggie.io/_virett0a_";

(function() {
    $("#footerMenuBarBackground")
        .append($(`<div  id="qpCommandsContainer" style="position: absolute;
	width: 108px;
	bottom: 45px;
	right: 110px;
	font-size: 18px;
	transform: translateX(-300%);"></div>`)
                   .append($(`<div id="qpCommnandsSection"></div>`)
                .append($(`<div class="customCheckbox"></div>`)
                        .append($(`<input id="slRules" type="checkbox">`)
                                .click(function () {
        sendChatMessage("!!This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
        sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");;
    })
                               )
                        .append(`<label for="slRules"><i class="fa fa-check" aria-hidden="true"></i></label>`)
                       )
                .append(`</div><p>Rules</p><div>`)
                           //
                           .append($(`<div class="customCheckbox"></div>`)
                        .append($(`<input id="slList" type="checkbox">`)
                                .click(function () {
sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    })
                               )
                        .append(`<label for="slList"><i class="fa fa-check" aria-hidden="true"></i></label>`)
                       )
                .append(`</div><p>List</p><div>`)
                           //
                           .append($(`<div class="customCheckbox"></div>`)
                        .append($(`<input id="slLink" type="checkbox">`)
                                .click(function () {
sendChatMessage("Picture Link Here:" + urlLink);
    })
                               )
                        .append(`<label for="slLink"><i class="fa fa-check" aria-hidden="true"></i></label>`)
                       )
                .append(`</div><p>Link</p><div>`)
               )
                  );


})();




let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.message.startsWith("/rules")) {

        sendChatMessage("!!This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
        sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
    }
    else if (payload.message.startsWith("/list")) {
        sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    }
    else if (payload.message.startsWith("/link")) {
        sendChatMessage(urlLink);
    }
    else if (payload.message.startsWith("/relink")) {
        let args = payload.message.split(/\s+/);
        if (args[1] !== undefined) urlLink = args[1].trim();
    }
    else if (payload.message.search(/list/i)!==-1 && payload.message.search(/remove/i)!==-1&& payload.message.search(/how/i)!==-1) {
        sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    }

    else {
        //do nothing
    }

});

new Listener("New Player", function(){
    sendChatMessage("Welcome to Pictionary!");
    sendChatMessage("!!This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
    sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
}).bindListener();

new Listener("New Spectator", function (spectator) {
	sendChatMessage("Welcome to Pictionary! View drawing here:" + urlLink);
}).bindListener();

new Listener("Spectator Change To Player", function(){
    setTimeout(sendChatMessage("Don't forget to turn off list and sound ;)"), 5000);
}).bindListener();


function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

commandListener.bindListener();
