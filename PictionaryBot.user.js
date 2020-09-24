// ==UserScript==
// @name         AMQ BOT - Pictionary
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      1.5.9 beta
// @description  auto say rules/instuctions/links for the custom game pictionary
// @author       Ataraxy
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @updateURL    https://github.com/MinusAtaraxy/AMQ_Scripts/raw/master/PictionaryBot.user.js
// ==/UserScript==

if (!window.setupDocumentDone) return;

if (document.getElementById('startPage')) {
    return
}

let urlLink = "_virett0a_";
let roomsize = 0;
let CurrentHost = "";
let StepHostisStuck = true; //UwU what are you doing step-host?
var choosePlayer = []


let commandListener = new Listener("Game Chat Message", (payload) => {

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
//                 let temp = getSizeofPlayers();
//             console.log("roomsize = " + roomsize + " but is " + temp);
                if (args[1] == "initialize") initializechoosePlayers();
                console.log(choosePlayer);
            }
            break;
        case "/choose":
            ChooseRandomPlayer();
            break;
        case "/pass":
            for (let playerID in lobby.players) {
            if (lobby.players[playerID]._host) {
                if (payload.sender == lobby.players[playerID]._name){
                    choosePlayer[playerID].passcounter += 1;
                    break;
                }
            }
            }
            ChooseRandomPlayer(payload.sender);
            break;

//case "/":
//break;
        default:
            //do nothing
    }
    }else if (payload.message.search(/list/i)!==-1 && (payload.message.search(/remove/i) !==-1 || payload.message.search(/delete/i) !==-1 || payload.message.search(/disable/i) !==-1) && payload.message.search(/how/i)!==-1) {
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
        //create roblox account
        choosePlayer[newroomsize] = {};
            choosePlayer[newroomsize]._name = lobby.players[newroomsize]._name;
            if (choosePlayer[newroomsize].hostcounter == undefined) choosePlayer[newroomsize].hostcounter = 0;
            if (choosePlayer[newroomsize].passcounter == undefined) choosePlayer[newroomsize].passcounter = 0;
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
        //create roblox account
        choosePlayer[newroomsize] = {};
            choosePlayer[newroomsize]._name = lobby.players[newroomsize]._name;
            if (choosePlayer[newroomsize].hostcounter == undefined) choosePlayer[newroomsize].hostcounter = 0;
            if (choosePlayer[newroomsize].passcounter == undefined) choosePlayer[newroomsize].passcounter = 0;
    roomsize = newroomsize;
    }},100);

}).bindListener();

let hostPromotionListner = new Listener("Host Promotion", (payload) => {
    //debug
    console.log("host change from " + CurrentHost);
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
        //if it works...-_-
        for (let playerID in lobby.players) {
            if (lobby.players[playerID]._host) CurrentHost = lobby.players[playerID]._name;
            break;
        }
        //debug
        console.log(" to " + CurrentHost);
    }
}).bindListener();

let joinLobbyListener = new Listener("Join Game", (payload) => {
    setTimeout(() => {
        roomsize = getSizeofPlayers();
        //console.log("on join: " + roomsize); //debug

       initializechoosePlayers();

    },100);
    roomsize = 0;
    StepHostisStuck = true;
}).bindListener();

let quizReadyListener = new Listener("quiz ready", (data) => {
setTimeout(() => {
for (let playerID in quiz.players){
    if (quiz.players[playerID]._host){
        if (quiz.players[playerID]._name !== CurrentHost){
            CurrentHost = quiz.players[playerID]._name;
            break;
        }
    }
}
},1000);
}).bindListener();

let quizOverListener = new Listener("quiz over", (data) => {
setTimeout(() => {
for (let playerID in quiz.players){
    if (quiz.players[playerID]._host){
        if (quiz.players[playerID]._name !== CurrentHost){
            CurrentHost = quiz.players[playerID]._name;
            break;
        }
        else{
        choosePlayer[playerID].hostcounter += 1;
        }
    }
}
},100);
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

function initializechoosePlayers(){
//Initialize
        for (let playerID in lobby.players){
            choosePlayer[playerID] = {};
            choosePlayer[playerID]._name = lobby.players[playerID]._name;
            if (choosePlayer[playerID].hostcounter == undefined) choosePlayer[playerID].hostcounter = 0;
            if (choosePlayer[playerID].passcounter == undefined) choosePlayer[playerID].passcounter = 0;
        }
}

function ChooseRandomPlayer(PassedPlayer) {
    let array1 = [];
    for (let playerID in lobby.players) {
    array1.push(choosePlayer[playerID].hostcounter + choosePlayer[playerID].passcounter);
    }
    console.log("chooseRandom w/o: " + PassedPlayer); //debug
    console.log(array1); //debug
    let min = Math.min(...array1);
    let array2 = [];
    for (let playerID in lobby.players) {
    if (choosePlayer[playerID].hostcounter + choosePlayer[playerID].passcounter == min && choosePlayer[playerID]._name !== PassedPlayer) array2.push(choosePlayer[playerID]._name);
    }
    if (array2 == undefined) {
        for (let playerID in lobby.players) {
            if (choosePlayer[playerID].hostcounter + choosePlayer[playerID].passcounter > min && choosePlayer[playerID]._name !== PassedPlayer) array2.push(choosePlayer[playerID]._name);
        }
    }
    console.log(array2); //debug
    let index = Math.floor(Math.random() * array2.length);
    sendChatMessage("Please pass host to: " + array2[index] + ", who will be drawing next round.");
}

commandListener.bindListener();
