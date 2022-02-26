import Event from "./event_modules/Events.js";
import Event_Handler from "./event_modules/Event_Handlers.js";
import {convertJsonToJs , convertJsToJson} from "./event_modules/Convert_JSON_Object.js"
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

// creates a new event and adds it to the 
function createEventAt(file,event){
    let file_data = fs.readFileSync(file,'utf-8')
    let arr = []; 
    if(file_data.length > 0){
        let {EVENTS} = JSON.parse(file_data) 
        arr = EVENTS; 
    }
    arr.unshift(convertJsToJson(event))
    fs.writeFileSync(file,`{"EVENTS":${JSON.stringify(arr,null,4)}}`)
}

//test Event & event handlers | the default `standard` evt_handler works fine
createEventAt(PATHS.EVENTS,new Event({
    ENDPOINT: "https://reqres.in/api/users",
    DATA_ENDPOINT: "https://reqres.in/api/users",
    POLLING_RATE:5000,
    POST_TYPE_BODY:true,
    GETPARSER: (res)=>{
        return res.data.data[0]
    },
    POSTPARSER:(res)=>{
        return res.data
    }
}))

EVENTS = GetEventList(PATHS.EVENTS)
EVENT_HANDLERS = GetEventHandlerList(PATHS.EVENT_HANDLERS)
main();



/*
    Home auto ex:
        camera endpoint : https://localhost:6969 | when you make a get request to this endpoint it returns an image ->
        facial recognition endpoint : https://localhost:1420 | when you make a post request, returns the value of the image recognition algo (persons name or something) ->
        Event:FR,response:dawson,date:10-10-10 || 
        call a new script and pass in these values 
*/