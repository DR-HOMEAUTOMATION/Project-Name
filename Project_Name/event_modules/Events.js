import * as fs from 'fs'
import axios from 'axios';
import { createRequire } from "module";
import * as Child_Process from 'child_process'
const require = createRequire(import.meta.url);
const PATHS = require('../paths.json');
class Event{
    constructor
    (
        { // default values 
        EVENT_TYPE='standard',  // custom endpoint type : used for dynamic event handling
        ENDPOINT=null,  // where to pass the data to 
        POST_TYPE_BODY=false, // pass the data in as a body or as params
        POLLING_RATE=-1,    // how often to reach for these endpoints
        DATA_ENDPOINT=null, // where to get the data 
        OUTPUT_FILE=PATHS.EVENT_LOGS, // where to post events
        CONDITION = function (val){return true}, // if the event should be posted
        POLL= async function(){
             // get <- post <- log
            if(this.POLLING_RATE - this.count <= 0 && this.ENDPOINT && this.DATA_ENDPOINT ){
                const GETURL = this.DATA_ENDPOINT
                const POSTURL = this.ENDPOINT
                this.count = 0; 
               await this.GET(GETURL,POSTURL,(out)=>this.POST(this.ENDPOINT,out,(data)=>this.LOG(this.OUTPUT_FILE,JSON.stringify(data,null,4))))
            }else{
                this.count++; 
            }
        }, 
        GET=async function(GETURL,POSTURL,callback){
           await this.axios.get(GETURL)
           .then(val=>{
               callback(this.GETPARSER(val))
            })
        },
        POST=async function(POSTURL,PAYLOAD,callback){
            console.log('postURL')
            console.log(POSTURL)
            console.log('PAYLOAD')
            console.log(PAYLOAD)
            this.POST_TYPE_BODY ? await this.axios.post(POSTURL,PAYLOAD).then(val=>callback(this.POSTPARSER(val))):
            await this.axios.post(POSTURL + PAYLOAD).then(val=>callback(this.POSTPARSER(val)))
        },
        GETPARSER=function(data){JSON.stringify(data.data)},
        POSTPARSER=function(data){JSON.stringify(data.data)},
        LOG=function(file,val){
            if(this.CONDITION(val)){
                console.log('logging');
                console.log(val)
                let file_data = this.fs.readFileSync(this.OUTPUT_FILE,'utf-8')
                let arr = []; 
                if(file_data.length > 0){
                    let {EVENTS} = JSON.parse(file_data) 
                    arr = EVENTS; 
                }
                arr.push({Event:this.EVENT_TYPE,response:val,date:new Date()})
                this.fs.writeFileSync(file,`{"EVENTS":${JSON.stringify(arr,null,4)}}`)
            }
        }
    }={}
    ){        
        this.Child_Process = Child_Process
        this.axios = axios
        this.fs = fs; 
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
        this.GETPARSER = GETPARSER
        this.POSTPARSER = POSTPARSER
        this.count = 0
    }
}
export default Event; 