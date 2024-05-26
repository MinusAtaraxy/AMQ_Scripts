// ==UserScript==
// @name         AMQ BOT - idk
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      0.0.3
// @description  auto say rules/instuctions/links for the custom game pictionary
// @author       Ataraxy
// @match        https://animemusicquiz.com/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==


//these prevent scripts from loading before login???
// if (!window.setupDocumentDone) return;

// if (document.getElementById('startPage')) {
//     return
// }

if (typeof Listener === "undefined") return;
let loadInterval = setInterval(() => {
    if ($("#loadingScreen").hasClass("hidden")) {
        clearInterval(loadInterval);
        setup();
    }
}, 500);


//initialize variables
let isQueueOn = false
let urlLink = "_virett0a_";
let CurrentHost = "";
let roomsize = 0;
var PlayerQueue = []
let tempthing = "temp_placeholder"

//commands + chat
new Listener("Game Chat Message", (payload) => {
    processChatCommand(payload);
}).bindListener();
new Listener("game chat update", (payload) => {
    payload.messages.forEach(message => {
        processChatCommand(message);
    });
}).bindListener();

new Listener("New Player", function(payload){
    setTimeout(() => {
        //payload.name
        //if not guest
        //give rules

        if (payload.name.startsWith("Guest-")){
            //guests go away
            sendChatMessage("Hi @" + payload.name + " this is a custom game, if you're new to AMQ please leave and find another room for a better experience.")
        }
        else {
            //not guest
            sendChatMessage("Welcome @" + payload.name + " This is a custom gamemode, please be aware of the rules")
        }

        //debug//
        roomsize = getSizeofPlayers();

    },1);
}).bindListener();

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
            //not guest
            sendChatMessage("Welcome @" + payload.name + " This is a custom gamemode. Please understand the rules")
        }
        //debug//

    },1);
}).bindListener();

new Listener("Spectator Change To Player", function(){
    setTimeout(() => {
        //remind to remove list and mute sound
        let oldroomsize = roomsize
        roomsize = getSizeofPlayers();

        if (roomsize > oldroomsize){
            sendChatMessage("Pelase make sure you understand the rules. Mute your sound and turn off your list please.")
        }
        else {
            sendChatMessage("Remember to turn off your list and mute sound.")
        }

    },1);
}).bindListener();

let joinLobbyListener = new Listener("Join Game", (payload) => {
    setTimeout(() => {
        //clear + initialize all stuff
        //if quiz or if lobby
        roomsize = getSizeofPlayers();

        if (lobby.inLobby) {
            //current host
            // getHostChange();

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

        callChatGPTAPI("encourage everyone to have a great time playing")


    },1);
}).bindListener();

let quizOverListener = new Listener("quiz over", (data) => {
    setTimeout(() => {
        //"Please pass host to the next drawer" + queue?
        //dont forget to remove list
        callChatGPTAPI("please tell everyone that enjoyed a great game and had fun, encourage artists of their amazing art")

    },1);
}).bindListener();

 let answerResultsRigTracker = new Listener("answer results", (result) => {
        if (quiz.gameMode === "Ranked") {
            return;
        }
        callChatGPTAPI("pretend you can see the drawing, give some constructive feedback on what the drawing should be to hint the anime next time, the answer this round was the anime : " + result.songInfo.animeNames.english)
 }).bindListener();;

function getSizeofPlayers() {

    if (lobby.inLobby){
        return Object.values(lobby.players)[Object.values(lobby.players).length-1].gamePlayerId;
        }
    else {
        return Object.values(quiz.players)[Object.values(quiz.players).length-1].gamePlayerId;
    }


}


function processChatCommand(payload) {

    //    console.log(payload);
    //    gameChat.systemMessage("ok")
    if (payload.sender !== selfName && payload.message.includes("?")){
        callChatGPTAPI("user " + payload.sender + " asks: " + payload.message);
    }

}

/////functions/////

//send a message in chat
function sendChatMessage(message) {
    gameChat.$chatInputField.val(message);
    gameChat.sendMessage();
}

async function callChatGPTAPI(prompt) {
    const apiKey = '12310101'; // Replace with your actual API key
    const apiUrl = 'http://localhost:5000/v1/chat/completions';

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "assisstant",
                    content: `The AI is in a chat consisting of multiple users, the AI is here to answer questions. This chat room was created so the users can play a game of pictionary, messages will be labeled with the name of the current person who is asking a question. The AI must provide the following information when asked: The game is located at this url "https://magma.com/d/12MP66p5kG". The rules of the game must be followed as such: "1. turn off your list", "2. mute your sound", "3. guess the anime using drawings only".`
      },
            {
                role: "user",
                content: prompt
            }
        ],
        mode: "chat",
        instruction_template: "Alpaca",
        temperature: 0.7,
        character: "PictionaryBOT"
    }),
  });

    if (response.ok) {
        const data = await response.json();
        console.log(data.choices[0].message.content);
        if (data.choices[0].message.content.length > 150){
            let splits = splitString (150,data.choices[0].message.content)
            splits.forEach(sendChatMessage);
        }
        else{
            sendChatMessage(data.choices[0].message.content)
        }
    } else {
        console.error('Error calling ChatGPT API:', response.statusText);
    }
}

function splitString (n,str){
    let arr = str?.split(' ');
    let result=[]
    let subStr=arr[0]
    for(let i = 1; i < arr.length; i++){
        let word = arr[i]
        if(subStr.length + word.length + 1 <= n){
            subStr = subStr + ' ' + word
        }
        else{
            result.push(subStr);
            subStr = word
        }
    }
    if(subStr.length){result.push(subStr)}
    return result
}

/*
async function callChatGPTAPI(prompt) {
    GM_xmlhttpRequest({
        method: 'POST',
        url: 'http://localhost:5000/v1/chat/completions',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer 12310101`,
        },
        data:{
            "messages": [
                {
                    "role": "user",
                    "content": "Hello!"
                }
            ],
            "mode": "instruct",
            "instruction_template": "Alpaca"
        },
        onload: function(response) {
            console.log(response)
        },


    })

}
*/
