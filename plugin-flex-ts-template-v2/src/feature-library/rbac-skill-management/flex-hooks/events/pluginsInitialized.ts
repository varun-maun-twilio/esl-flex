import * as Flex from '@twilio/flex-ui';

import { FlexEvent } from '../../../../types/feature-loader';

export const eventName = FlexEvent.pluginsInitialized;
export const eventHook = async function registerRbacForSkillManagementOnInit(
  flex: typeof Flex,
  manager: Flex.Manager,
) {
  if(manager.user.roles.indexOf("admin")==-1){
    flex.WorkerCanvas.Content.remove("skills");
    flex.WorkerCanvas.Content.remove("skills-title");
  }
};
