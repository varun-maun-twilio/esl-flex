import * as Flex from '@twilio/flex-ui';

import EmailForwardBtn from '../../custom-components/EmailForwardBtn';
import { FlexComponent } from '../../../../types/feature-loader';
import "../styles/style.css";

export const componentName = FlexComponent.MessagingCanvas;
export const componentHook = function addForwardBtnForEmailTasks(flex: typeof Flex, manager: Flex.Manager) {
  

  flex.EmailMessageItem.Content.add(<EmailForwardBtn key="email-forward-btn" />, {
    sortOrder: 1,
  });

  const EmailEditorHeader = (props: any) => {

    return (<div id="emailEditorHeader">{JSON.parse(sessionStorage.getItem(props.conversationSid+"-editor")||"{}").editMode || "Reply"} <button onClick={()=>{
      console.error(props);
      sessionStorage.removeItem(props.conversationSid+"-editor");
      Flex.Manager.getInstance().store.dispatch({
        type: "TOGGLE_REPLY_MODE",
        payload: false,
        meta: {
            conversationSid: props.conversationSid
        }
    });
      
    }}>Close</button></div>);
  }

  flex.EmailEditor.Content.add(<EmailEditorHeader key="headerX" />,{
    sortOrder: -1,
  })

};
