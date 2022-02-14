import * as fs from "fs"; 
import fetch from "node-fetch";
import axios from "axios";
class Event{
    constructor({ENDPOINT=null,POLLING_RATE=-1,DATA_ENDPOINT={type:'url',value:null},condition=null, OUTPUT_FILE='./Event_logs.txt'}={},event_type='standard'){
        // ENDPOINT: API enpoint to send POST data to, if null don't log or do anything
        // CONDITION: condition to be met using the response of the endpoint to determine whether or not the EVENT is triggered in the logs, if(null) always log
        // POLLING_RATE: how often the program should poll any device, if(-1) poll each time through loop: 
        // POST: data to send to the `endpoint` this would be something like the camera inputs, this will also be an endpoint, if(null) do nothing
        this.ENDPOINT = ENDPOINT; 
        this.POLLING_RATE = POLLING_RATE; 
        this.DATA_ENDPOINT = DATA_ENDPOINT; // data endpoint is an object : {type:url/data,value:data}
        this.CONDITION = condition; 
        this.OUTPUT_FILE = OUTPUT_FILE; 
        this.event_type = event_type; 
        this.count = 0; 
    }
    async poll(){
        console.log(this.DATA_ENDPOINT); 
        get(this.DATA_ENDPOINT.value, (val)=>post(val,'rand',(data)=>this.log(data))); 
    }

    log(str){
        try{
            fs.appendFileSync(this.OUTPUT_FILE,"\n"+str); 
        }catch(err){
            console.error(err); 
        }
    }
}


const get = async(url , callback)=>{
    axios.get(url).then(val=>callback(val.data)); 
}

const post = async(response, url, callback)=>{
    callback(JSON.stringify(response,null,4))
}

const gitEvent = new Event({
    ENDPOINT:'',
    DATA_ENDPOINT:{type:'url',value:'https://api.github.com/users/DawsonReschke'},
    condition: function(val){return true}
})
gitEvent.poll(); 
