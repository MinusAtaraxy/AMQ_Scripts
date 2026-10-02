// ==UserScript==
// @name         AMQ Chat Timestamps
// @namespace    https://github.com/MinusAtaraxy
// @version      1.1+(2.0)
// @description  Adds timestamps to chat messages
// @author       TheJoseph98 (edited by Ataraxia)
// @match        https://animemusicquiz.com/*
// @grant        none
// ==/UserScript==

if (typeof Listener === "undefined") return;



let gameChatNode = document.getElementById("gcMessageContainer");


let gameChatObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (!mutation.addedNodes) return;

        for (let i = 0; i < mutation.addedNodes.length; i++) {
            let node = mutation.addedNodes[i];
            if ($(node).hasClass("gcTimestamp")) return;
            if ($(node).hasClass("ps__scrollbar-y-rail")) return;
            if ($(node).hasClass("ps__scrollbar-x-rail")) return;
            let d = new Date();
            let secs = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds();
            let mins = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
            let hours = d.getHours() < 10 ? "0" + d.getHours() : d.getHours();
            let timeFormat = hours + ":" + mins + ":" + secs;
            let songnumber = "";
            if (!lobby.inLobby){
                songnumber = $("#qpCurrentSongCount").text();
            }else{
                songnumber = "L"
            }

            if ($(node).find(".gcTeamMessageIcon").length === 1) {
                $(node).find(".gcTeamMessageIcon").after($(`<span class="gcTimestamp" style="opacity: 0.5;">` + songnumber +`</span>`));
                $(node).popover({
                    placement: "left",
                    content: timeFormat,
                    trigger: "hover",
                    container: "body",
                    animation: false
                });}
            else{
                $(node).prepend($(`<span class="gcTimestamp" style="opacity: 0.5;">` + songnumber +`</span>`)).popover({
                    placement: "left",
                    content: timeFormat,
                    trigger: "hover",
                    container: "body",
                    animation: false});
            }
            // scroll to bottom
            let chat = gameChat.$chatMessageContainer;
            let atBottom = chat.scrollTop() + chat.innerHeight() >= chat[0].scrollHeight - 25;
            if (atBottom) {
                chat.scrollTop(chat.prop("scrollHeight"));
            }
        }
    });
});



gameChatObserver.observe(gameChatNode, {
    childList: true,
    attributes: false,
    CharacterData: false
});
