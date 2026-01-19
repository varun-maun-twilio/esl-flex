import {Stack} from '@twilio-paste/core/stack';
import {Button} from '@twilio-paste/core/button';
import * as Flex from '@twilio/flex-ui';
import { TaskHelper, ConversationHelper, StateHelper,useFlexSelector } from "@twilio/flex-ui";
import { useEffect } from 'react';

interface MessageState{
    isReplyModeActive?:boolean;
}


interface Props {
    conversationSid?:string;
    conversation?:any;
    messageState?:MessageState;

}

  const delay = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


const EmailForwardBtn = (props: any) => {

    const isReplyModeActive = useFlexSelector((state) => state.flex.chat.conversationInput[props?.conversationSid||""].isReplyModeActive);

    useEffect(()=>{

    },[isReplyModeActive])


    const replyAll = async ()=>{

       // console.error(props);
        const toEmailAddresses = [];
        const ccEmailAddresses = [];

        if(props?.message?.source?.attributes?.direction=== 'outbound'){
            toEmailAddresses.push(... (props?.message?.source?.attributes?.to || []).map((a:string)=>{return {address:a}}));
            ccEmailAddresses.push(... (props?.message?.source?.attributes?.cc || []).map((a:string)=>{return {address:a}}));
        }
        else{
       
        const emailParticipants = props.recipientList|| [];
            for(let p of emailParticipants){
                if(p.level=="from"){
                    toEmailAddresses.push({address:p.address});
                }
                else if(p.level=="cc"){
                    ccEmailAddresses.push({address:p.address});
                } 
            }
       
        }
        
        

        const conversationPersistence = sessionStorage.getItem(props.conversationSid||"");
        //console.error(conversationPersistence);
        const convPersistedObj = JSON.parse(conversationPersistence||"{}");
        convPersistedObj.toParticipants = toEmailAddresses;
        convPersistedObj.ccParticipants = ccEmailAddresses;
        convPersistedObj.subject = `Re: ${props.message.source.subject}`;
        convPersistedObj.editMode = "Reply All";
        sessionStorage.setItem(props.conversationSid||"",JSON.stringify(convPersistedObj));
        sessionStorage.setItem(`${props.conversationSid}-editor`,JSON.stringify({
            editMode : "Reply All",
            historyHtml : props.message.bodyAttachment,
        }));
      
       
        


        Flex.Manager.getInstance().store.dispatch({
            type: "TOGGLE_REPLY_MODE",
            payload: true,
            meta: {
                conversationSid: props.conversationSid
            }
        });

        await delay(1500); 

        Flex.Actions.invokeAction("SetInputText", {
                body: `<hr style="display:inline-block;width:30%" /><blockquote style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">${props.message.bodyAttachment}</blockquote>`,
                conversationSid: props.conversationSid
        });
        
        
    }


    const reply = async ()=>{


        //console.error("replyProps",props);

     

        const toEmailAddresses = [];
   

        if(props?.message?.source?.attributes?.direction=== 'outbound'){
            toEmailAddresses.push(... (props?.message?.source?.attributes?.to || []).map((a:string)=>{return {address:a}}));
        }
        else{

        const emailParticipants = props.recipientList|| [];
            for(let p of emailParticipants){
                if(p.level=="from"){
                    toEmailAddresses.push({address:p.address});
                }
               
            }
        }
        
        //console.error("replyProps toEmailAddresses",toEmailAddresses);

        
        

        const conversationPersistence = sessionStorage.getItem(props.conversationSid||"");
        const convPersistedObj = JSON.parse(conversationPersistence||"{}");
        convPersistedObj.toParticipants = toEmailAddresses;
        convPersistedObj.ccParticipants = [];
        convPersistedObj.subject = `Re: ${props.message.source.subject}`;
        convPersistedObj.editMode = "Reply";
        sessionStorage.setItem(props.conversationSid||"",JSON.stringify(convPersistedObj));
        sessionStorage.setItem(`${props.conversationSid}-editor`,JSON.stringify({
            editMode : "Reply",
            historyHtml : props.message.bodyAttachment,
        }));
      
       
        


        Flex.Manager.getInstance().store.dispatch({
            type: "TOGGLE_REPLY_MODE",
            payload: true,
            meta: {
                conversationSid: props.conversationSid
            }
        });

        await delay(1500); 

        Flex.Actions.invokeAction("SetInputText", {
                body: `<hr style="display:inline-block;width:30%" /><blockquote style="margin:0px 0px 0px 0.8ex;border-left:1px solid rgb(204,204,204);padding-left:1ex">${props.message.bodyAttachment}</blockquote>`,
                conversationSid: props.conversationSid
        });
        
        
    }
    

    const forward = async ()=>{

       


        const conversationPersistence = sessionStorage.getItem(props.conversationSid||"");
        //console.error(conversationPersistence);
        const convPersistedObj = JSON.parse(conversationPersistence||"{}");
        convPersistedObj.toParticipants = [];
        convPersistedObj.ccParticipants = [];
        convPersistedObj.subject = `Fw: ${props.message.source.subject}`;
       
        sessionStorage.setItem(props.conversationSid||"",JSON.stringify(convPersistedObj));
        sessionStorage.setItem(`${props.conversationSid}-editor`,JSON.stringify({
            editMode : "Forward",
            historyHtml : props.message.bodyAttachment,
        }));

        /*

        let conversation = props?.conversation?.source;
        if(!conversation){
            return;
        }

        const allConversationParticipants = await conversation?.getParticipants() || [];
        for await (let p of allConversationParticipants) {
            if (p?.bindings?.email?.level == "to") {
                await conversation?.removeParticipant(p);
            }
            else if (p?.bindings?.email?.level == "cc") {
                await conversation?.removeParticipant(p);
            }
        }
        
       
        
        */
  
        Flex.Manager.getInstance().store.dispatch({
            type: "TOGGLE_REPLY_MODE",
            payload: true,
            meta: {
                conversationSid: props.conversationSid
            }
        });


    await delay(1500); 

    Flex.Actions.invokeAction("SetInputText", {
            body: props.message.bodyAttachment,
            conversationSid: props.conversationSid
    });

        
        
    }

if(isReplyModeActive){
    return null;
}

  return (
    <div className="custom-email-buttons" >
      <Stack orientation="horizontal" spacing="space60">
      <Button variant="primary" size="small" onClick={() => {replyAll()}}>
    Reply All
  </Button>
  <Button variant="secondary" size="small" onClick={() => {reply()}}>
    Reply
  </Button>
  <Button variant="secondary" size="small" onClick={() => {forward()}}>
    Forward
  </Button>
</Stack>
    </div>
  );
};

export default EmailForwardBtn;
