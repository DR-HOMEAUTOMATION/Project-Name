// Event handlers should read `Event_logs.json` in order to determine what methods/scripts to run. 

// the script will have access to the child_process for executing alternate files/scripts 
class Event_Handler{
    constructor({EVENT_TYPE='standard',PREVENT_PROP=false,CONDITION=(val)=>true,SCRIPT=function(){console.log('event triggered')}}){
        this.EVENT_TYPE = EVENT_TYPE;this.CONDITION = CONDITION;this.SCRIPT = SCRIPT; 
    }
    check(type,value){
        if(type == this.EVENT_TYPE && this.CONDITION(value)) this.SCRIPT(); 
    }
}

export default Event_Handler; 