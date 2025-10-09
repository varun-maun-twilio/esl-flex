import * as Flex from '@twilio/flex-ui';
import { WorkersDataTable, ColumnDefinition } from '@twilio/flex-ui';
import NewOutboundEmailTaskCanvas from "../../custom-components/NewOutboundEmailTaskCanvas"
import { isFeatureEnabled } from '../../config';


export const componentHook = function replaceOutboundEmailForm(flex: typeof Flex, manager: Flex.Manager) {
  if (!isFeatureEnabled() ) return;

  flex.NewTaskCanvas.Content.replace(<NewOutboundEmailTaskCanvas key="esl-outbound-email-form" />,{
      if:(task)=>{console.error(task);return true}
  })

  flex.Notifications.registeredNotifications.delete("SendEmailFailed");

};
