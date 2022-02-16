const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
const parseFunctionParams = (f) => f.toString().split('(')[1].split(')')[0].split(',')
const parseFunctionBody = (f) => f.toString().substring(f.toString().indexOf('{')+1,f.toString().lastIndexOf('}'))

function convertJsonToJs(obj){
    /*
         JSON object function -> "functionName" : {"function":{"args":"a,b,c","body":"return a+b+c"}}
         JavaScript object function -> functionName = (a,b,c) => {return a+b+c}
    */
   //loop through all of the key:value pairs and find -> convert all with the value {"function" : {"args":"","body":""}
   let temp = {}
   for(let i of Object.entries(obj)){
    try{
        if(i[1] != null){
            if(i[0].length > 0 && i[1].function){
                if(i[1].function.args &&  i[1]!=null && i[1].function.body) {
                    let parseFunction = i[1].function.isAsync ? new AsyncFunction(...i[1].function.args,i[1].function.body) : new Function(i[1].function.args,i[1].function.body)
                    temp[i[0]] = parseFunction
                }else{
                    console.log("something went wrong");
                }
            }else{
                temp[i[0]] = i[1]
            }
        }
    }catch(err){
        console.log(`JSON file format ERROR : ${err}`)
    }

   }
   return temp;
}

function convertJsToJson(obj){
    let temp = {}; 
    for(let i of Object.keys(obj)){
        if(typeof obj[i] == "function"){
            const args = parseFunctionParams(obj[i])
            const body = parseFunctionBody(obj[i])
            const isAsync = obj[i].toString().includes('async')
            temp[i] = {"function":{args,body,isAsync}}
        }else{
            temp[i] = obj[i]
        }
    }
    return temp; 
}

export{
    convertJsonToJs,
    convertJsToJson
} 
