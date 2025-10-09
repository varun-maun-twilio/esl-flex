import * as Flex from '@twilio/flex-ui';
import { TaskHelper } from "@twilio/flex-ui";
import { FlexEvent } from '../../../../types/feature-loader';


export const eventName = FlexEvent.taskWrapup;
export const eventHook = async (_flex: typeof Flex, _manager: Flex.Manager, task: Flex.ITask) => {
    while(TaskHelper.isTaskAssignedToCurrentWorker(task) && 
               !TaskHelper.isCompleted(task) 
               &&  ((_manager.store.getState() as any)?.["wrapupSummaries"]?.[task.sid]?.summaryGenerationStatus!="Succeeded")){
        await new Promise(resolve => setTimeout(resolve, 1000));
        _flex.Actions.invokeAction("CompleteTask", { sid: task.sid });
      }
};