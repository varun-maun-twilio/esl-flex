import * as Flex from '@twilio/flex-ui';
import { TaskHelper } from "@twilio/flex-ui";
import { TaskChannels } from "@twilio/flex-ui";
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';
import SendEmailService from "../../utils/SendEmailService";
import logger from '../../../../utils/logger';

export const actionEvent = FlexActionEvent.before;
export const actionName = FlexAction.SendMessage;
export const actionHook = function cancelDefaultSendEmail(flex: typeof Flex, _manager: Flex.Manager) {
    flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {

        console.error(payload);


        const { conversationSid, htmlBody, subject, attachedFiles } = payload;
        //Check if this is an email task
        if (!conversationSid || !htmlBody || TaskChannels.getForConversation(conversationSid).name != 'chat-email') {
            return;
        }

        const task: any = TaskHelper.getTaskFromConversationSid(conversationSid) as any;
        const conversation = _manager.store.getState().flex.chat.conversations[conversationSid].source;

        if (conversation == null) {
            return;
        }

        console.error("conversation",conversation);

        abortFunction();

        //Remove all participants from email and add them to conversation attributes
        const allConversationParticipants = await conversation?.getParticipants() || [];
        const toParticipantList = [];
        const ccParticipantList = [];
        for await (let p of allConversationParticipants) {
            console.error(p);
            if (p?.bindings?.email?.level == "to") {
                toParticipantList.push(p?.bindings?.email?.address);
                await conversation?.removeParticipant(p);
            }
            else if (p?.bindings?.email?.level == "cc") {
                ccParticipantList.push(p?.bindings?.email?.address);
                await conversation?.removeParticipant(p);
            }
        }

        console.error(toParticipantList, ccParticipantList);

        const prevConversationAttributesJSON = await conversation?.getAttributes();
        const prevConvAttributes = JSON.parse(JSON.stringify(prevConversationAttributesJSON || {}));
        console.error("prevConvAttributes",prevConvAttributes);
        const newConvAttributes = {
            ...(prevConvAttributes || {}),
            to: [
                ...(prevConvAttributes?.to || []),
                ...toParticipantList
            ],
            cc: [
                ...(prevConvAttributes?.cc || []),
                ...ccParticipantList
            ],
        }
        console.error("newConvAttributes",newConvAttributes);
        await conversation.updateAttributes(newConvAttributes);


        //Upload attachments and create message
        console.error("attachedFiles", attachedFiles);
        const newMessageBuilder = conversation?.prepareMessage()
            .setSubject(subject)
            .setEmailBody("text/html", { contentType: "text/html", media: `${htmlBody}` })
            .setEmailBody("text/plain", { contentType: "text/plain", media: htmlBody });
        for (const file of attachedFiles) {
            const fileData = new FormData();
            fileData.set(file.name, file, file.name);
            newMessageBuilder.addMedia(fileData);
        }
        const messageIndex = await newMessageBuilder.build().send();

        if (messageIndex == null) {
            return;
        }

        const allConversationMessages = await conversation.getMessages(1, messageIndex, "backwards");
        const lastMessage = Array.from(allConversationMessages.items)[0];
        const lastMessageSid= lastMessage.sid;

       
        //Extract From
        let from = "ESL";
        const projectedAddress = 
        conversation?.bindings?.email?.projected_address; 
        if(projectedAddress!=null){
            from = ((projectedAddress.split("@")[0].indexOf("+") 
            > -1) ? projectedAddress.split("@")[0].split("+").slice(0, 
            -1).join("+") : projectedAddress.split("@")[0]) + "@" + 
            projectedAddress.split("@")[1];
        }
        

        try{

        //Call API to send message via SMTP
        await SendEmailService.sendEmail({
            from: from,
            to: toParticipantList.join(","),
            cc:ccParticipantList.join(","),
            conversationSid,
            body: htmlBody,
            subject: subject,
            conversationMessageSid:lastMessageSid
        })

    }catch(e){
        console.error(e);
    }


       

        //Close the Editor

        _manager.store.dispatch({
            type: "TOGGLE_REPLY_MODE",
            payload: false,
            meta: {
                conversationSid: conversationSid
            }
        });

        sessionStorage.removeItem(conversationSid);


        //Wrapup Task
        const {sid:taskSid} = task;
        flex.Actions.invokeAction("WrapupTask", { sid: taskSid });
        

    });
};