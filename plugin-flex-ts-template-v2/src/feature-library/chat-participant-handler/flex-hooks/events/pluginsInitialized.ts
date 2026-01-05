import * as Flex from '@twilio/flex-ui';
import { ConversationHelper, StateHelper } from "@twilio/flex-ui";
import { TaskHelper } from "@twilio/flex-ui";
import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = async function registerRbacForSkillManagementOnInit(
  flex: typeof Flex,
  manager: Flex.Manager,
) {



  manager.conversationsClient.addListener("participantLeft",async (participant)=>{
    const conversationSid = participant.conversation.sid;
    const task = TaskHelper.getTaskFromConversationSid(conversationSid);
    if(task && task.taskChannelUniqueName=="chat"){

         const conversationToBeChecked = await manager.conversationsClient.getConversationBySid(conversationSid);
     
       const convParticipantCount = await conversationToBeChecked.getParticipantsCount();

      if (convParticipantCount == 1) {
        flex.Actions.invokeAction("WrapupTask", { task });

      }

   
  }
  
  })

  //Check all chat tasks to check if particpants have left

  const chatBasedTasks = Array.from(await manager?.workerClient?.reservations?.values() || []).map(s => s.task).filter(t => t.taskChannelUniqueName == "chat")

  if (chatBasedTasks != null && chatBasedTasks.length > 0) {


    for (let cTask of chatBasedTasks) {

      const conversationToBeChecked = await manager.conversationsClient.getConversationBySid(cTask.attributes.conversationSid);
      if (conversationToBeChecked) {
        const convParticipantCount = await conversationToBeChecked.getParticipantsCount();
        if (convParticipantCount == 1) {
          const task = TaskHelper.getTaskFromConversationSid(conversationToBeChecked.sid);
          
            flex.Actions.invokeAction("WrapupTask", { task });
          
        }

        
            
      }
    }
  }



};


