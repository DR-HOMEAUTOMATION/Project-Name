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
        OUTPUT_FILE='./Event_logs.json',
    }={},
        {
            POLL=async function(){
                // get -> post -> log
                if(this.POLLING_RATE - this.count <= 0 && ENDPOINT && DATA_ENDPOINT ){
                    const GETURL = this.DATA_ENDPOINT
                    const POSTURL = this.ENDPOINT
                    this.count = 0; 
                    await this.GET(GETURL,POSTURL,(out)=>this.POST(this.ENDPOINT,out,(data)=>this.LOG(this.OUTPUT_FILE,JSON.stringify(data,null,4))));
                }else{
                    this.count++; 
                }
            }, 
            GET=async function(GETURL,POSTURL,callback){
               await axios.get(GETURL).then(val=>callback(GETPARSER(val)))
            },
            POST=async function(POSTURL,PAYLOAD,callback){
                this.POST_TYPE_BODY ? await axios.post(POSTURL,PAYLOAD).then(val=>callback(POSTPARSER(val))):
                await axios.post(POSTURL + PAYLOAD).then(val=>callback(POSTPARSER(val)))
                
            },
            GETPARSER=(data)=>JSON.stringify(data.data),
            POSTPARSER=(data)=>JSON.stringify(data.data),
            LOG=function(file,val){
                let file_data = fs.readFileSync(this.OUTPUT_FILE,'utf-8')
                let arr = []; 
                if(file_data.length > 0){
                    let {EVENTS} = JSON.parse(file_data) 
                    arr = EVENTS; 
                }
                
                 
                arr.push({Event:this.EVENT_TYPE,response:val})
                fs.writeFileSync(file,`{"EVENTS":${JSON.stringify(arr,null,4)}}`)
                // fs.appendFileSync(file,JSON.stringify({Event:this.EVENT_TYPE,response:val},null,4)+',')
            }
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

const newE = new Event({
    ENDPOINT:'https://reqres.in/api/users',
    DATA_ENDPOINT:'https://reqres.in/api/users',
    OUTPUT_FILE:'C://Users//dawso//workspace//homeAuto//Project-Name//Project_Name//Event_logs.json'
})
newE.POLL(); 
export default Event; 