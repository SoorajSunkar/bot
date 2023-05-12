// Import the TelegramBot library
const TelegramBot = require('node-telegram-bot-api');

// Create a new bot with your bot token
const bot = new TelegramBot('6103447361:AAEUlqFKQ_tTSVkFLlMFCkZEi-ggU36n2ew', { polling: true });
const fs = require('fs');



function writeData(obj){
  let fileData = fs.readFileSync('markup','utf-8');
  console.log(fileData);


  fileData = JSON.parse(fileData);
  if(fileData.length==0){
      console.log('h')
      let arr = new Array();
      arr.push(obj);
      fileData.push(arr)
      // break;
  }
  else{
      if(fileData[fileData.length-1].length==1){
          console.log('yes')
          fileData[fileData.length-1].push(obj)
      }
      else{
          let arr = new Array();
          arr.push(obj);
          fileData.push(arr);
      }
  }

  fs.writeFileSync('markup',JSON.stringify(fileData));
}


const keyboardForAdmin = {
  inline_keyboard: [
    [
      { text: 'Add new to menu', callback_data: 'add' },
      { text:  'Edit menu', callback_data: 'edit' }
    ],
    [
      {text:'remove menu',callback_data:'remove'}
    ]
  ]
};



function keyboardMaker(){
    let data  = fs.readFileSync('markup','utf-8');
    // const keyboard = {
    //   inline_keyboard:JSON.parse(data)  
    // }
    return JSON.parse(data);
}





let messageId; // to remove buttons after click

let adminChecker = true;



bot.on('message',(msg)=>{
      let chatId = msg.chat.id;
      console.log(msg.text);
      console.log(adminChecker);
      if(msg.text==='admin77'){
        adminChecker = false;
        bot.sendMessage(chatId,"**welcome to bot setting, Gosen",{
          reply_markup:keyboardForAdmin 
        }) 
      }

      else if(msg.text=='/more'){
        let keyboard = keyboardMaker();
        console.log(keyboard)
        let a = bot.sendMessage(chatId,'*GoSen Diamonds ရောင်းရေမှ ကြိုးဆိုးပါသည်*',{
          reply_markup:{
            inline_keyboard:keyboard
          
          }
        })
        
      }

      else if(adminChecker){
        console.log(msg.text)
        let keyboard = keyboardMaker();
        let a = bot.sendMessage(chatId,'GoSen Diamonds ရောင်းရေမှ ကြိုးဆိုးပါသည်',{
          reply_markup:{
            inline_keyboard:keyboard
          }
        })

        a.then((val)=>{
            messageId = val.message_id;
            
        })
      
      }
})




// listeing button clicks
async function main(){
bot.on('callback_query',async (msg)=>{

      let data = msg.data;
      let chatId = msg.message.chat.id



      if(data=='add'){
            let key;
            let value;
            adminChecker = false;
            function dataInputer(){
              return  new Promise((res,rej)=>{
                
                let a = bot.sendMessage(chatId,'key တစ်ခုအား ဖြည့်လိုက်ပါ',{
                  reply_markup:{
                    force_reply:true
                  }
                })
                a.then((val)=>{
                  bot.onReplyToMessage(chatId,val.message_id,(reply)=>{
                      console.log('inside')
                      key = reply.text;
                      console.log(key)
                      adminChecker = true;
                      let b = bot.sendMessage(chatId,"value တစ်ခုအား ဖြည့်လိုက်ပါ",{
                        reply_markup:{
                          force_reply:true
                        }
                      });
                      b.then((val)=>{
                          adminChecker  = false;
                          bot.onReplyToMessage(chatId,val.message_id,(reply)=>{
                            console.log(reply);
                            value = reply.text;
                            adminChecker = true;  
                            if(reply.photo!=undefined){
                                console.log('yes its img');
                                console.log(reply.photo[0].file_id)
                                if(reply.caption!=undefined){
                                  console.log('with caption')
                                  let img = {
                                  img:reply.photo[0].file_id,caption:reply.caption
                                  }
                                  img = JSON.stringify(img);
                                  console.log(img)
                                  res({button:{text:key,callback_data:key},data:img})
                                }
                                else{
                                  console.log('with no caption')
                                  let img = {
                                    img:reply.photo[2].file_id
                                  }
                                  img = JSON.stringify(img);
                                  console.log(img)
                                  res({button:{text:key,callback_data:key},data:img})
                                }

                            }
                            else if(key!=undefined && value!=undefined){
                              res({button:{text:key,callback_data:key},data:value})

                            }
                            else{
                                rej('error');
                            }
                          })
                      })
                    })
                    
                    

                })

              })
            }

            let input = dataInputer();
            input.then((val)=>{
                console.log(val);
                writeData(val.button);
                writeDataToDataFile(val.button.callback_data,val.data)
            }).catch((err)=>{
                console.log(err)
                bot.sendMessage(chatId,"Fail to make new menu")
            })
          }
      else if(data=='remove'){
              adminChecker =false;
              // data formater statt here
              function dataFormater(){
                let data = fs.readFileSync('markup','utf-8');
                data = JSON.parse(data);
            
                for(let a =0;a<data.length;a++){
                    if(data[a].length<2){
                        if(data[a+1]!=undefined){
                            data[a].push(data[a+1][0]);
                            data[a+1].splice(0,1);
                            if(data[a+1].length==0){
                                data.splice(a+1,1)
                            }
                            
                        }
                    }
                }

                fs.writeFileSync('markup',JSON.stringify(data))
              }
              // data formater end here
                let fileData = fs.readFileSync('markup','utf-8');
                fileData = JSON.parse(fileData);

                function printingDataToUser(){
                  return new Promise((res,rej)=>{
                    for(let a =0;a<fileData.length;a++){
                      for(let b =0;b<fileData[a].length;b++){
                        let send =  bot.sendMessage(chatId,fileData[a][b].text);
                        
                      }
                    }
                    res('done')
                  })
                }  
                let send = printingDataToUser();
                send.then((val)=>{
                  setTimeout(() => {
                    let reply = bot.sendMessage(chatId,'copy and past one key',{
                      reply_markup:{
                        force_reply:true
                      }
                    })

                    reply.then((val)=>{
                      let autoReply = bot.onReplyToMessage(chatId,val.message_id,(reply)=>{
                        adminChecker = true;
                        remover(chatId,reply.text);
                      })
                    })

                  },1500);
                })
               
            dataFormater(); 
            
            // print all key from file

      
      }
      else if(data=='edit'){
        let dataKey = fs.readFileSync('markup','utf-8');
        let mainData = fs.readFileSync('data','utf-8');
        dataKey = JSON.parse(dataKey);
        mainData = JSON.parse(mainData);
        let keyFound = false;
        let value;
        adminChecker = false;
        let promise = new Promise((res,rej)=>{
          for(let a =0;a<dataKey.length;a++){
            for(let b =0;b<dataKey[a].length;b++){
              // console.log(dataKey[a][b].text);
              bot.sendMessage(chatId,dataKey[a][b].text);
            }
          }
          res('done');
        })
      
        promise.then((val)=>{
          setTimeout(()=>{
            let send = bot.sendMessage(chatId,'copy and past the key',{
              reply_markup:{
                force_reply:true
              }
            })

            send.then((val)=>{
              bot.onReplyToMessage(chatId,val.message_id,(reply)=>{
                let sendPromise = new Promise((res,rej)=>{
                  for(let a = 0;a<dataKey.length;a++){
                    for(let b = 0;b<dataKey[a].length;b++){
                      if(dataKey[a][b].text==reply.text){
                        keyFound = true;
                        res(reply.text);
                      }
                    }
                  }
                  if(keyFound ==false){
                    rej('err')
                  }
                })
                sendPromise.then((val)=>{
                  console.log(val);
                  let key  = val
                  let newValue = bot.sendMessage(chatId,'Enter the new value',{
                    reply_markup:{
                      force_reply:true
                    }
                  })

                  newValue.then((val)=>{
                    bot.onReplyToMessage(chatId,val.message_id,(reply)=>{
                      // console.log("the rply is" ,reply.text);
                      try{
                        let isObj = JSON.parse(mainData.data[key]);
                        if(typeof isObj ==='object'){
                          bot.sendMessage(chatId,'cannot edit message with image');
                          adminChecker = true;
                        }
                      }
                      catch(err){
                        mainData.data[key] = reply.text;
                        fs.writeFileSync('data',JSON.stringify(mainData));
                        adminChecker = true;
                      }
                    })
                  })

                }).catch((err)=>{
                  bot.sendMessage(chatId,'Key not found');
                })
              })
            })

          },1000)
        })
      }

      else{
        try{
          printDataToClient(chatId,data)
        }
        catch(err){
          let data = JSON.parse(data);
          data = Buffer.from(data).toString('base64');
          await bot.sendMessage(chatId,data);
          bot.sendMessage(chatId,'ပိုမို သိရှိရန် /more')
          
        }
        
      }


})


}

setInterval(()=>{
    adminChecker = true;
    console.log('true')
},1000*120)

main();



function writeDataToDataFile(key,value){
    let obj = fs.readFileSync('data','utf-8');
    obj = JSON.parse(obj);
    obj.data[key] = value;
    obj = JSON.stringify(obj);
    fs.writeFileSync('data',obj)
}

// writeDataToDataFile("3",'4')

function printDataToClient(chatId,val){ // for main menu
  let obj = fs.readFileSync('data','utf-8');
  obj = JSON.parse(obj);

  try{
    let gdata = obj.data[val];
    gdata = JSON.parse(gdata);
    if(gdata.caption!=undefined){
      bot.sendPhoto(chatId,gdata.img,{
        caption:gdata.caption
      })
    }
    else if(gdata.caption==undefined){
      bot.sendPhoto(chatId,gdata.img)
    }

  }
  catch(err){
    bot.sendMessage(chatId,obj.data[val])
  }
}


function remover(chatId,value){
  let dataKey = fs.readFileSync('markup','utf-8');
  let mainData = fs.readFileSync('data','utf-8');
  let keyFound = false;
  dataKey = JSON.parse(dataKey);
  for(let a =0;a<dataKey.length;a++){
    for(let b = 0;b<dataKey[a].length;b++){
      if(dataKey[a][b].text==value){
        if(b ==0){
          dataKey[a].shift();
          console.log('got1');
          keyFound  =true;
          break;
        }
        else{
          dataKey[a].pop();
          console.log('got2');
          keyFound  =true;
          break;
        }
      }
      else{
        console.log('not got');
      }
    }
  }
  if(keyFound){
    mainData = JSON.parse(mainData);
    delete mainData.data[value];
    // bot.sendMessage(chatId,'Removing is done!');
    console.log(mainData)
    // console.log(dataKey);
    fs.writeFileSync('markup',JSON.stringify(dataKey))
    fs.writeFileSync('data',JSON.stringify(mainData))
  }

}

function edit(chatId,val,changeVal){

}

edit(3,3,3);





// printDataToClient(3,"t");








