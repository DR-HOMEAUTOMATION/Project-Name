import Event from "./event_modules/Events.js";
import Event_Handler from "./event_modules/Event_Handlers.js";
import * as fs from 'fs'
let EVENTS , EVENT_HANDLERS;
let ENV = new Event({
    "POLLING_RATE":5000,"ENDPOINT":"https://reqres.in/api/users",
    "DATA_ENDPOINT":"https://reqres.in/api/users",
    "OUTPUT_FILE":"C://Users//dawso//workspace//homeAuto//Project-Name//Project_Name//Event_logs.json"
    })
async function main() {
    let POLL_TIMER,EVENT_HANDLER_TIMER; 
    POLL_TIMER = EVENT_HANDLER_TIMER = performance.now(); 
        while(1){
            let now = performance.now(); 
            if(now - POLL_TIMER >= 1){POLL_TIMER = now; await POLL_EVENTS(EVENTS)}
            if(now - EVENT_HANDLER_TIMER >= 5000){EVENT_HANDLER_TIMER = now;HANDLE_EVENTS()} 
        }
}


function GetEventList(file){
    let JSON_DATA = fs.readFileSync(file); 
    let {EVENTS} = JSON.parse(JSON_DATA);
    EVENTS = EVENTS.map(event=>new Event(event)); 
    return EVENTS; 
}
function GetEventHandlerList(file){
    let JSON_DATA = fs.readFileSync(file); 
    let {EVENT_HANDLERS} = JSON.parse(JSON_DATA);
    return EVENT_HANDLERS; 
}

// POLL each event by calling EVENT.POLL(), see './event_modules/Events.js' for more information 
async function POLL_EVENTS(EVENT_LIST){
    for(let i of EVENT_LIST){
        await i.POLL(); 
    }
}


// CHECK if events exist, if so handle them using the array of event handlers. 
function HANDLE_EVENTS(){
    const data = fs.readFileSync('./Event_logs.json')
    let EVENTS_DATA = []; 
    if(data.length > 0){
        EVENTS_DATA = JSON.parse(data).EVENTS
    }
    fs.writeFileSync('./Event_logs.json',''); 
    for(let i of EVENTS_DATA){
        for(let j of EVENT_HANDLERS){
            if(i.Event == j.EVENT_TYPE){
                if(j.CONDITION(i.response)) j.SCRIPT(i.response); 
                if(j.PREVENT_PROP) break; 
            }
        }
    } 
}

// main();
const DataPath = 'C://Users//dawso//workspace//homeAuto//Project-Name//Project_Name//event_modules//public//'
EVENTS = GetEventList(DataPath + 'Events.json')
EVENT_HANDLERS = GetEventHandlerList(DataPath + 'Event_Handlers.json')
console.log(EVENTS)
console.log(EVENT_HANDLERS)