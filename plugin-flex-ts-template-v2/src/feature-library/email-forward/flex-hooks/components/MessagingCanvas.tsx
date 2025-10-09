import * as Flex from '@twilio/flex-ui';

import EmailForwardBtn from '../../custom-components/EmailForwardBtn';
import { FlexComponent } from '../../../../types/feature-loader';
import "../styles/style.css";

export const componentName = FlexComponent.MessagingCanvas;
export const componentHook = function addForwardBtnForEmailTasks(flex: typeof Flex, manager: Flex.Manager) {
  

  flex.MessageList.Content.add(<EmailForwardBtn key="email-forward-btn" />, {
    sortOrder: -1,
  });
};
