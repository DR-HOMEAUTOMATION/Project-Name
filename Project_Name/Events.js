import * as fs from 'fs'
import axios from 'axios';
class Event{
    constructor
    (
        {EVENT_TYPE='STANDARD',
        ENDPOINT=null,
        POST_TYPE_BODY=true,
        POLLING_RATE=-1,
        DATA_ENDPOINT=null,
        CONDITION=null,
        OUTPUT_FILE='./Event_logs.txt',
    }={},
        {
            POLL=async function(){
                // get -> post -> log
                if(this.POLLING_RATE - this.count <= 0 && ENDPOINT && DATA_ENDPOINT ){
                    const GETURL = this.DATA_ENDPOINT
                    const POSTURL = this.ENDPOINT
                    await this.GET(GETURL,POSTURL,(out)=>this.POST(this.ENDPOINT,out,(data)=>this.LOG(this.OUTPUT_FILE,JSON.stringify(data,null,4))));
                }else{
                    this.count++; 
                }
            }, 
            GET=async function(GETURL,POSTURL,callback){
               await axios.get(GETURL).then(val=>callback(JSON.stringify(val.data,null,4)))
            },
            POST=async function(POSTURL,PAYLOAD,callback){
                this.POST_TYPE_BODY ? await axios.post(POSTURL,PAYLOAD).then(val=>callback(val.data)):
                await axios.post(POSTURL + PAYLOAD).then(val=>callback(val.data))
                
            },
            LOG=function(file,val){fs.appendFileSync(file,`Event:${this.EVENT_TYPE}, Respone:${val}`)}
        }={}
    ){
        this.EVENT_TYPE = EVENT_TYPE
        this.ENDPOINT = ENDPOINT
        this.POST_TYPE_BODY = POST_TYPE_BODY
        this.POLLING_RATE = POLLING_RATE
        this.DATA_ENDPOINT = DATA_ENDPOINT
        this.CONDITION = CONDITION
        this.OUTPUT_FILE = OUTPUT_FILE
        this.POLL = POLL
        this.GET = GET
        this.POST = POST
        this.LOG = LOG
        this.count = 0
    }
}

module.exports = Event;
