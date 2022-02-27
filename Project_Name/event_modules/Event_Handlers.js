// the script will have access to the child_process for executing alternate files/scripts 
class Event_Handler{
    constructor(
        {   // default values
            EVENT_TYPE='standard',
            PREVENT_PROP=(val)=>false,
            CONDITION=(val)=>true,
            SCRIPT=function(data){
                console.log(`Event Detected: ${data}`)
            }
        })
        {
        this.EVENT_TYPE = EVENT_TYPE;
        this.CONDITION = CONDITION;
        this.SCRIPT = SCRIPT; 
        this.PREVENT_PROP = PREVENT_PROP
    }
    check(EVENT){
        if(EVENT.Event == this.EVENT_TYPE && this.CONDITION(EVENT.response)){
            this.SCRIPT(EVENT)
            return this.PREVENT_PROP(EVENT); // returns true when you want to prevent propagation, customizable method...
        }
        return false; 
    }
}

export default Event_Handler; 