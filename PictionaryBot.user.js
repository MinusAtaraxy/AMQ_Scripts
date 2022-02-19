// ==UserScript==
// @name         AMQ BOT - Pictionary
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      1.9.94 - Newer
// @description  auto say rules/instuctions/links for the custom game pictionary
// @author       Ataraxy
// @match        https://animemusicquiz.com/*
// @grant        none
// @require      https://raw.githubusercontent.com/TheJoseph98/AMQ-Scripts/master/common/amqScriptInfo.js
// @require      https://github.com/MinusAtaraxy/AMQ_Scripts/raw/master/Common/whitelist.user.js
// @updateURL    https://github.com/MinusAtaraxy/AMQ_Scripts/raw/master/PictionaryBot.user.js
// ==/UserScript==

/*TO DO
- ****QUEUE****
- anti-spam
- guest/new player (<20) kicker
- list checker???
- ping joined people

*/

//these prevent scripts from loading before login???
if (!window.setupDocumentDone) return;

if (document.getElementById('startPage')) {
    return
}


//initialize variables
let isQueueOn = false
let urlLink = "_virett0a_";
let CurrentHost = "";
let roomsize = 0;
var PlayerQueue = []
let tempthing = "temp_placeholder"

//commands + chat
let commandListener = new Listener("game chat update", (payload) => {
    //link, rules, queue, list commands
    if (payload.messages[0].message.startsWith("/")) {
        //split command + arguments
        let args = payload.messages[0].message.split(/\s+/);

        //switch statement for different commands
        switch(args[0].toLowerCase()){
                //gives rules of gamemode
            case "/rules":
                sendChatMessage("This is a custom gamemode!! Please remove your list and mute your sound, then guess the anime based on drawings.");
                sendChatMessage("Full Rules: https://pastebin.com/HjSySq6e");
                break;

                //gives avaliable commands
            case "/help":
                sendChatMessage("commands are: /rules, /link, /list and /queue - WIP");
                sendChatMessage("Gamemode rules: https://pastebin.com/HjSySq6e");
                break;

                //how to remove a list instructions
            case "/list":
                sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
                break;

                //gives aggie link
            case "/link":
                sendChatMessage("https://aggie.io/" + urlLink);
                break;

                //edits current link (just in case)
            case "/relink":
                if (args[1] !== undefined) urlLink = args[1].trim();
                sendChatMessage("new link: https://aggie.io/" + urlLink);
                break;
                //edits current link (just in case)
            case "/queue":
                //adds current player to queue

                if (args[1] == undefined){
                    if (isQueueOn){
                        tempthing = checkQueue()
                        if (tempthing){
                            tempthing = PlayerQueue.push(payload.sender);
                            sendChatMessage("you are " + tempthing + " in line.");
                        }
                    }
                }
                else{
                    if (args[1] == "toggle")isQueueOn = !isQueueOn;
                    if (isQueueOn) sendChatMessage("Queueing enabled: type /queue to queue up in a queue");
                    if (!isQueueOn) sendChatMessage("Queueing disabled");
                }

                break;
            case "/skip":
                //skips current queued player
                if(inLobby && isQueueOn){
                    tempthing = PlayerQueue.shift()
                    sendChatMessage("Player " + tempthing + " skipped.");
                }
                break;


                /////////DEBUG STUFF///////////////
                //just in case bot becomes host
            case "/host":
                if (lobby.isHost || quiz.isHost) {
                    lobby.promoteHost(payload.messages[0].sender);
                }
                break;
            case "/reset":
                if (payload.sender == "Ataraxia" || payload.messages[0].sender == selfName){
                    if (lobby.isHost) {
                        roomsize = getSizeofPlayers();
                        PlayerQueue = [];

                        if (lobby.inLobby) {
                            //current host
                            getHostChange();

                            //queue player list probably
                        }
                    }
                }
                break;

            default: //do nothing
        }

    }
    //not a command: search in chat for key words ie "how to remove list" (may take lots of resources)
    else if (payload.messages[0].message.search(/list/i)!==-1 && (payload.messages[0].message.search(/remove/i) !==-1 || payload.messages[0].message.search(/delete/i) !==-1 || payload.messages[0].message.search(/disable/i) !==-1) && payload.messages[0].message.search(/how/i)!==-1) {
        sendChatMessage("To remove list: Settings > Anime List > Delete your username > Press 'Update'");
    }
    //aggie tutorial?
    else if ((payload.messages[0].message.search(/drawing/i)!==-1 || payload.messages[0].message.search(/all/i)!==-1 || payload.messages[0].message.search(/canvas/i)!==-1) && (payload.messages[0].message.search(/remove/i) !==-1 || payload.messages[0].message.search(/delete/i) !==-1 || payload.messages[0].message.search(/clear/i) !==-1) && (payload.messages[0].message.search(/how/i)!==-1 || payload.messages[0].message.search(/where/i)!==-1)) {
        sendChatMessage("click this button after each drawing: https://i.imgur.com/cs9dvuX.png");
    }
    //anti afk
    document.getElementById("mainContainer").click();


}).bindListener();

//detect players join message
new Listener("New Player", function(payload){
    setTimeout(() => {
        //payload.name
        //if not guest
        //give rules

        //queue stuff*

        let oldroomsize = roomsize
        roomsize = getSizeofPlayers();

        if (payload.name.startsWith("Guest-")){
            //guests go away
            sendChatMessage("Hi @" + payload.name + " this is a custom game, if you're new to AMQ please leave and find another room for a better experience.")
        }
        else {
            //not guest
             if (whitelist.includes(payload.name)) {
            //nothing
            }
            else{
            sendChatMessage("Welcome @" + payload.name + " This is a custom gamemode. PLEASE READ RULES: https://pastebin.com/HjSySq6e")
            }
        }

        roomsize = getSizeofPlayers();
        //debug//

    },1);
}).bindListener();

//detect players spectate message
new Listener("New Spectator", function (payload) {
    setTimeout(() => {
        //payload.name, payload.gamePlayerId
        //if guest say it's custom game mode
        //otherwise give rules/commands
        if (payload.name.startsWith("Guest-")){
            //guests go away
            sendChatMessage("Hi @" + payload.name + " this is a custom game, if you're new to AMQ please leave and find another room for a better experience. ")
        }
        else {
             if (whitelist.includes(payload.name)) {
            //nothing
            }
            else{
            //not guest
            sendChatMessage("Welcome @" + payload.name + " This is a custom gamemode. PLEASE READ RULES: https://pastebin.com/HjSySq6e and type /link to see drawing.")
            }
        }
        //debug//

    },1);
}).bindListener();

//detect joining from spectator
new Listener("Spectator Change To Player", function(){
    setTimeout(() => {
        //remind to remove list and mute sound
        let oldroomsize = roomsize
        roomsize = getSizeofPlayers();

        if (roomsize > oldroomsize){
            sendChatMessage("Please make sure you understand the rules. Mute your sound and turn off your list please.")
        }
        else {
            sendChatMessage("Remember to turn off your list and mute sound.")
        }

    },1);
}).bindListener();

//change of host
let hostPromotionListner = new Listener("Host Promotion", (payload) => {
    setTimeout(() => {
        //record host change for future reasons
        //if bot becomes host then panik

        if (lobby.isHost) {
            for (let playerID in lobby.players) {
                if (lobby.players[playerID]._name !== selfName) {
                    lobby.promoteHost(lobby.players[playerID]._name);
                    break;
                }
            }
        }

        getHostChange();
        //add autopicker?


    },1);
}).bindListener();

//when the bot joins a lobby
let joinLobbyListener = new Listener("Join Game", (payload) => {
    setTimeout(() => {
        //clear + initialize all stuff
        //if quiz or if lobby
        roomsize = getSizeofPlayers();

        if (lobby.inLobby) {
            //current host
            getHostChange();

            //queue player list probably
        } else {
            //shouldnt join in game but w/e

        }

    },1);
}).bindListener();

//when a game is started
let quizReadyListener = new Listener("quiz ready", (data) => {
    setTimeout(() => {
        //give drawing link
        //queue?

        sendChatMessage("Guessers remember to mute :mute:");
        sendChatMessage("View drawing here: https://aggie.io/" + urlLink);


    },1);
}).bindListener();

//when a game is finished (in any way)
let quizOverListener = new Listener("quiz over", (data) => {
    setTimeout(() => {
        //"Please pass host to the next drawer" + queue?
        //dont forget to remove list
        if (PlayerQueue.length > 1 && isQueueOn){
            tempthing = PlayerQueue.shift();
            sendChatMessage("Please past host to the next drawer: " + tempthing + ". Dont forget to remove your list again.");
        }
        tempthing = Object.values(quiz.players).length
        if (tempthing   > 4 && isQueueOn) sendChatMessage("You can type /queue to reserve a spot");

    },1);
}).bindListener();

//after every song get the results
let answerResultsListener = new Listener("answer results", (result) => {
//list checker T-T


}).bindListener();

/////functions/////

//send a message in chat
function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

function getHostChange() {
    if (lobby.inLobby){
        for (let playerID in lobby.players) {
            if (lobby.players[playerID]._host)
            {
                CurrentHost = lobby.players[playerID]._name;
                break;
            }
        }
    }
    else {
        console.log("host change error");
    }
}


//***replace with Object.values(something)
function getSizeofPlayers() {

    if (lobby.inLobby){
        return Object.values(lobby.players)[Object.values(lobby.players).length-1].gamePlayerId;
        }
    else {
        return Object.values(quiz.players)[Object.values(quiz.players).length-1].gamePlayerId;
    }


}

function checkQueue(name) {
    if (lobby.inLobby){
        for (let playerID in lobby.players) {
            if (lobby.players[playerID]._name = name) return false;
            return true;
        }}
    else {
        for (let playerID in quiz.players) {
            if (quiz.players[playerID]._name = name) return false;
            return true;
        }
    }
}
