// ==UserScript==
// @name         AMQ Custom Games Rules
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      1.0
// @description  says rules in chat.
// @author       Ataraxy
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// ==/UserScript==

/*
1 - Pictionary
2 - Reverse Password
3 - Actually I don't know any more gamemodes

 if (command == "x") sendChatMessage("RULES for x mode");

*/

let commandListener = new Listener("Game Chat Message", (payload) => {
    if (payload.sender === selfName && payload.message.startsWith("/r")) {
        let args = payload.message.split(/\s+/);
        if (args[1] !== undefined) {
            //args[1].trim()); is the number
            let command = args[1].trim()
            if (command == "1"){
                sendChatMessage("!!This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
                sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
            };
            //add more rules

        }
        if (payload.sender === selfName && payload.message.startsWith("/list")) sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
        // add more stuff..?
        else {
           //do nothing
        }
    }
});



function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

commandListener.bindListener();
