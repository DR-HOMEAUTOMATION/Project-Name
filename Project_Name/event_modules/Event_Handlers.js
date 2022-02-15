// Event handlers should read `Event_logs.json` in order to determine what methods/scripts to run. 

// the script will have access to the child_process for executing alternate files/scripts 
class Event_Handler{
    constructor({EVENT_TYPE='standard',PREVENT_PROP=false,CONDITION=(val)=>true,SCRIPT=function(data){console.log(`Event Detected: ${data}`)}}){
        this.EVENT_TYPE = EVENT_TYPE;this.CONDITION = CONDITION;this.SCRIPT = SCRIPT; 
    }
    check(EVENT){
        if(EVENT.Event == this.EVENT_TYPE && this.CONDITION(EVENT.response)) this.SCRIPT(EVENT); 
    }
}

export default Event_Handler; 