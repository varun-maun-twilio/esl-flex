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

const EmailForwardBtn = (props: Props) => {

    const isReplyModeActive = useFlexSelector((state) => state.flex.chat.conversationInput[props?.conversationSid||""].isReplyModeActive);

    useEffect(()=>{

    },[isReplyModeActive])


    const replyAll = async ()=>{

        let conversation = props.conversation?.source;
        console.error(conversation);

        if(conversation==null){
            return;
        }

        const toEmailAddresses = [];
        const ccEmailAddresses = [];

        const task = TaskHelper.getTaskFromConversationSid(props.conversationSid||"");
        if(task!=null){
        const conversationState = StateHelper.getConversationStateForTask(task);
        if(conversationState!=null){
        const conversationHelper = new ConversationHelper(conversationState);
        const lastMessageSid = conversationHelper.lastMessage?.source?.sid ||"";
        const emailParticipants = conversationHelper["conversation"].messageRecipients.get(lastMessageSid) || [];
            for(let p of emailParticipants){
                if(p.level=="from"){
                    toEmailAddresses.push({address:p.address});
                }
                else if(p.level=="cc"){
                    ccEmailAddresses.push({address:p.address});
                } 
            }
        }
        }

        
        

        const conversationPersistence = sessionStorage.getItem(props.conversationSid||"");
        console.error(conversationPersistence);
        const convPersistedObj = JSON.parse(conversationPersistence||"{}");
        convPersistedObj.toParticipants = toEmailAddresses;
        convPersistedObj.ccParticipants = ccEmailAddresses;
        sessionStorage.setItem(props.conversationSid||"",JSON.stringify(convPersistedObj));

      
       
        


        Flex.Manager.getInstance().store.dispatch({
            type: "TOGGLE_REPLY_MODE",
            payload: true,
            meta: {
                conversationSid: props.conversationSid
            }
        });
        
        
    }


    const reply = async ()=>{

        let conversation = props.conversation?.source;
        console.error(conversation);

        if(conversation==null){
            return;
        }

        const toEmailAddresses = [];
   

        const task = TaskHelper.getTaskFromConversationSid(props.conversationSid||"");
        if(task!=null){
        const conversationState = StateHelper.getConversationStateForTask(task);
        if(conversationState!=null){
        const conversationHelper = new ConversationHelper(conversationState);
        const lastMessageSid = conversationHelper.lastMessage?.source?.sid ||"";
        const emailParticipants = conversationHelper["conversation"].messageRecipients.get(lastMessageSid) || [];
            for(let p of emailParticipants){
                if(p.level=="from"){
                    toEmailAddresses.push({address:p.address});
                }
               
            }
        }
        }

        
        

        const conversationPersistence = sessionStorage.getItem(props.conversationSid||"");
        console.error(conversationPersistence);
        const convPersistedObj = JSON.parse(conversationPersistence||"{}");
        convPersistedObj.toParticipants = toEmailAddresses;
        convPersistedObj.ccParticipants = [];
        sessionStorage.setItem(props.conversationSid||"",JSON.stringify(convPersistedObj));

      
       
        


        Flex.Manager.getInstance().store.dispatch({
            type: "TOGGLE_REPLY_MODE",
            payload: true,
            meta: {
                conversationSid: props.conversationSid
            }
        });
        
        
    }
    

    const forward = async ()=>{

       


        const conversationPersistence = sessionStorage.getItem(props.conversationSid||"");
        console.error(conversationPersistence);
        const convPersistedObj = JSON.parse(conversationPersistence||"{}");
        convPersistedObj.toParticipants = [];
        convPersistedObj.ccParticipants = [];
        sessionStorage.setItem(props.conversationSid||"",JSON.stringify(convPersistedObj));

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

        
        
    }

if(isReplyModeActive){
    return null;
}

  return (
    <div style={{"order":2,paddingTop:"20px"}}>
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
