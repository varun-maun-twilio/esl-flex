import * as Flex from '@twilio/flex-ui';
import { Worker } from 'types/task-router';
import { Conversation } from '@twilio/conversations';

import { FlexJsClient, ConversationEvent } from '../../../../../types/feature-loader';


export const clientName = FlexJsClient.conversationsClient;
export const eventName = ConversationEvent.conversationJoined;
// when an agent joins a channel for the first time this announces
// them in the chat channel
export const jsClientHook = function autocompleteTaskOnClientLeaving(
  flex: typeof Flex,
  manager: Flex.Manager,
  conversation: Conversation,
) {
    const task = Flex.TaskHelper.getTaskFromConversationSid(conversation.sid);
    if(task && Flex.TaskHelper.isCBMTask(task) && task.taskChannelUniqueName!=="email"){
        conversation.on("participantLeft",async (participant)=>{
            const newP = await conversation.getParticipants();
              if(newP.length==1 && newP[0].identity === manager.conversationsClient.user.identity){
                  flex.Actions.invokeAction("WrapupTask", { sid: task.sid });
              }
        })
    }


 


};