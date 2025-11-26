import * as Flex from '@twilio/flex-ui';
import { ConversationHelper, StateHelper } from "@twilio/flex-ui";

import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.AcceptTask;
export const actionHook = function handleAcceptTaskToRegisterConversationListeners(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {

    

    const task = payload.task;
    if(task.taskChannelUniqueName!=="chat"){
        return;
    }
    const conversationState = StateHelper.getConversationStateForTask(task);
    if(conversationState){
        const conversationHelper = new ConversationHelper(conversationState);
        const isCustomerOnline = conversationHelper.isCustomerOnline;
        if(!isCustomerOnline){
          flex.Actions.invokeAction("WrapupTask", { task });
        }
    }
   


 
   
    
  });
};