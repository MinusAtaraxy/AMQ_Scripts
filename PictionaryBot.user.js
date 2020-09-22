// ==UserScript==
// @name         AMQ BOT - Pictionary
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      1.5.7 beta
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

let urlLink = "_virett0a_";
let roomsize = 0;
let StepHostisStuck = true; //UwU what are you doing step-host?



let commandListener = new Listener("Game Chat Message", (payload) => {
/*    if (payload.message.startsWith("/rules") || payload.message.startsWith("/help")) {

        sendChatMessage("𝗧𝗵𝗶𝘀 𝗶𝘀 𝗮 𝗰𝘂𝘀𝘁𝗼𝗺 𝗴𝗮𝗺𝗲𝗺𝗼𝗱𝗲!! Please 𝗿𝗲𝗺𝗼𝘃𝗲 𝘆𝗼𝘂𝗿 𝗹𝗶𝘀𝘁 and 𝗺𝘂𝘁𝗲 your sound, then guess the anime based on drawings.");
        sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
    }
    else if (payload.message.startsWith("/list")) {
        sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    }
    else if (payload.message.startsWith("/link")) {
        sendChatMessage("https://aggie.io/" + urlLink);
    }
    else if (payload.message.startsWith("/relink")) {
        let args = payload.message.split(/\s+/);
        if (args[1] !== undefined) urlLink = args[1].trim();
        sendChatMessage("new link: https://aggie.io/" + urlLink);
    }
    else if (payload.message.startsWith("/host")) {
        if (lobby.isHost) {
            lobby.promoteHost(payload.sender);
            //debug
            console.log(payload.sender + "is host");
        }
    }
    else if (payload.message.search(/list/i)!==-1 && payload.message.search(/remove/i)!==-1&& payload.message.search(/how/i)!==-1) {
        sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    }

    else {
        //do nothing
    }
*/
    // is else-if better than Switch? guess I'll never know...

    if (payload.message.startsWith("/")) {
    let args = payload.message.split(/\s+/);
    switch(args[0].toLowerCase()){
        case "/rules":
            sendChatMessage("This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
        sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
            break;
        case "/help":
            sendChatMessage("commands are: /rules, /link, /list and more.");
            sendChatMessage("Current gamemode rules: https://pastebin.com/HjSySq6e"); //kek implying this can be used for more than one gamemode
            break;
        case "/list":
            sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
            break;
        case "/link":
            sendChatMessage("https://aggie.io/" + urlLink);
            break;
        case "/relink":
            if (args[1] !== undefined) urlLink = args[1].trim();
            sendChatMessage("new link: https://aggie.io/" + urlLink);
            break;
        case "/host":
            if (lobby.isHost) {
                lobby.promoteHost(payload.sender);
                //debug
                console.log(payload.sender + "is host");
            }
            break;
        case "/debug":
            if(payload.sender === selfName || payload.sender === "Ataraxia"){
                let temp = getSizeofPlayers();
            console.log("roomsize = " + roomsize + " but is " + temp);
            }
            break;
        case "/random": //do later....
            break;

//case "/":
//break;
        default:
            //do nothing
    }
    }else if (payload.message.search(/list/i)!==-1 && payload.message.search(/remove/i)!==-1&& payload.message.search(/how/i)!==-1) {
        sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    }
    //anti afk
document.getElementById("mainContainer").click();
});

new Listener("New Player", function(payload){
    setTimeout(() => {
    let newroomsize = getSizeofPlayers();
    if (newroomsize > roomsize){
    sendChatMessage("Welcome to Pictionary!");
    sendChatMessage("!!This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
    sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
    roomsize = newroomsize;
    }},100);
}).bindListener();

new Listener("New Spectator", function (payload) {
	sendChatMessage("Welcome to Pictionary! View drawing here: https://aggie.io/" + urlLink);

}).bindListener();

new Listener("Spectator Change To Player", function(){
        setTimeout(() => {
    let newroomsize = getSizeofPlayers();
    if (newroomsize > roomsize){
    setTimeout(sendChatMessage("Don't forget to turn off list and sound ;)"), 10000);
    roomsize = newroomsize;
    }},100);

}).bindListener();

let hostPromotionListner = new Listener("Host Promotion", (payload) => {
    //debug
    console.log("host change");
    setTimeout(() => {
	if (lobby.isHost) {
        for (let playerID in lobby.players) {
            if (lobby.players[playerID]._name !== selfName) lobby.promoteHost(lobby.players[playerID]._name);
        }
        //add autopicker?
    };},1);
    //check if still host
    if (lobby.isHost) {
        if (StepHostisStuck) {
            var hostremind = setInterval(function(){
                if (lobby.isHost) {sendChatMessage("type /host to receive host")};
            }, 13000);
            StepHostisStuck = false;
        };}
    else{
        clearInterval(hostremind);
        StepHostisStuck = true;
    }
}).bindListener();

let joinLobbyListener = new Listener("Join Game", (payload) => {
    setTimeout(() => {
        roomsize = getSizeofPlayers();
        console.log("on join: " + roomsize); //debug
    },100);
    roomsize = 0;
    StepHostisStuck = true;
}).bindListener();

function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

function getSizeofPlayers() {
let roomsizetest = [];
    if (lobby.inLobby){
    for (let playerID in lobby.players) {
    roomsizetest.push(playerID)
    }}
    else {
      for (let playerID in quiz.players) {
    roomsizetest.push(playerID)
    }
    }
    console.log("roomsize = " + roomsize + " new is: " + roomsizetest[roomsizetest.length-1]); //debug
    return roomsizetest[roomsizetest.length-1];
}

commandListener.bindListener();
