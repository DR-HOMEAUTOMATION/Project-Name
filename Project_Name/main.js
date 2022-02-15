import Event from "./event_modules/Events.js";
import Event_Handler from "./event_modules/Event_Handlers.js";
import * as fs from 'fs'
const STANDARD_EVENT_HANDLER = new Event_Handler({EVENT_TYPE:'STANDARD',SCRIPT:(data)=>console.log(`Event Triggered!`)})
const STANDARD_EVENT = new Event({POLLING_RATE:1000,ENDPOINT:'https://reqres.in/api/users',DATA_ENDPOINT:'https://reqres.in/api/users',OUTPUT_FILE:'C://Users//dawso//workspace//homeAuto//Project-Name//Project_Name//Event_logs.json'})
const EVENT_HANDLERS = [STANDARD_EVENT_HANDLER]; 
const EVENTS = [STANDARD_EVENT,{...STANDARD_EVENT},{...STANDARD_EVENT},{...STANDARD_EVENT},{...STANDARD_EVENT}]
function main() {
        setInterval(readFile,5000); 
        /*
            BUG:
                The time between queries is inconsistant even with a specified delay period, this probably has to do with the async nature of the function within 
                `setInterval` (2). I will investigate a solution.
        */
            setInterval(async ()=>{ 
                for(let i of EVENTS){
                    i.POLL(); 
                }
            },1);
}


function readFile(){ // Check if EVENTS exist if so, deal with them, then create Events 
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
main(); 