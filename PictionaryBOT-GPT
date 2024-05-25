// ==UserScript==
// @name         AMQ BOT - idk
// @namespace    https://github.com/MinusAtaraxy/AMQ_Scripts
// @version      0.0.1
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


function processChatCommand(payload) {

    //    console.log(payload);
    //    gameChat.systemMessage("ok")
    if (payload.sender !== selfName){
        callChatGPTAPI(payload);
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
                    role: "user",
                    content: `The AI is in charge of moderating the chatroom consisting of multiple users. This chatroom was created so the users can play a game of pictionary. The AI must provide the following information when asked: The url to play the game is at "https://magma.com/d/12MP66p5kG". The rules of the game must be followed as such: "1. turn off your list", "2. mute your sound", "3. guess the anime using drawings only".`
      },
            {
                role: "user",
                content: prompt.message
            }
        ],
//         functions: [
//             {name: "get_gamemode_rules",
//              description: "provide the rules for the gamemode if someone asks",
//              parameters: {
//                  type: "object",
//                  properties: {
//                      rules:{
//                          type: "string",
//                          description: "1. turn off your list, 2. mute your sound, 3. guess the anime using drawings only",
//                      },
//                  },
//                  required: ["rules"]
//              }
//             }
//         ],
        mode: "chat",
        instruction_template: "Alpaca",
        temperature: 0.7,
        user: prompt.sender,
        character: "PictionaryBOT"
    }),
  });

    if (response.ok) {
        const data = await response.json();
        console.log(data.choices[0].message.content);
        sendChatMessage(data.choices[0].message.content)
    } else {
        console.error('Error calling ChatGPT API:', response.statusText);
    }
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
