import Event from "./event_modules/Events.js";
import Event_Handler from "./event_modules/Event_Handlers.js";
import {convertJsonToJs , convertJsToJson} from "./event_modules/Conver_JSON_Object.js"
import * as fs from 'fs'
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const PATHS = require('./paths.json');
let EVENTS , EVENT_HANDLERS;
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
    EVENTS = EVENTS.map(val => convertJsonToJs(val));
    EVENTS = EVENTS.map(event=>new Event(event)); 
    return EVENTS; 
}
function GetEventHandlerList(file){
    let JSON_DATA = fs.readFileSync(file); 
    let {EVENT_HANDLERS} = JSON.parse(JSON_DATA);
    EVENT_HANDLERS = EVENT_HANDLERS.map(val=>convertJsonToJs(val)); 
    EVENT_HANDLERS = EVENT_HANDLERS.map(val=> new Event_Handler(val)); 
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
    console.log('\x1b[0m',"handling events now")
    const data = fs.readFileSync(PATHS.EVENT_LOGS)
    let EVENTS_DATA = []; 
    if(data.length > 0){
        EVENTS_DATA = JSON.parse(data).EVENTS
    }
    fs.writeFileSync(PATHS.EVENT_LOGS,''); 
    for(let i of EVENTS_DATA){
        for(let j of EVENT_HANDLERS){
            if(i.Event == j.EVENT_TYPE){
                if(j.CONDITION(i.response)) j.SCRIPT(i.response); 
                if(j.PREVENT_PROP) break; 
            }
        }
    } 
}
EVENTS = GetEventList(PATHS.EVENTS)
EVENT_HANDLERS = GetEventHandlerList(PATHS.EVENT_HANDLERS)
main();

