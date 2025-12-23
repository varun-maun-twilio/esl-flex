import * as Flex from '@twilio/flex-ui';
import { ConversationHelper, StateHelper } from "@twilio/flex-ui";
import { TaskHelper } from "@twilio/flex-ui";
import { FlexActionEvent, FlexAction } from '../../../../types/feature-loader';

export const actionEvent = FlexActionEvent.after;
export const actionName = FlexAction.AcceptTask;



export const actionHook = function handleAcceptTaskToRegisterConversationListeners(flex: typeof Flex, _manager: Flex.Manager) {
  flex.Actions.addListener(`${actionEvent}${actionName}`, async (payload, abortFunction) => {



    const task = payload.task;
    if (task.taskChannelUniqueName !== "chat") {
      return;
    }


    const delay = (ms: number) => {
      return new Promise(resolve => setTimeout(resolve, ms));
    }


    await delay(5000); //wait for conversation to be ready


    const conversationSid = TaskHelper.getTaskConversationSid(task);
    const conversationToBeChecked = await _manager.conversationsClient.getConversationBySid(conversationSid);
    if (conversationToBeChecked) {
      const convParticipantCount = await conversationToBeChecked.getParticipantsCount();
      console.error("CHAT-PARTICIPANT-HANDLER: Accept Task Participant Count ", convParticipantCount);
      if (convParticipantCount == 1) {
        flex.Actions.invokeAction("WrapupTask", { task });

      }
    }

  });
};