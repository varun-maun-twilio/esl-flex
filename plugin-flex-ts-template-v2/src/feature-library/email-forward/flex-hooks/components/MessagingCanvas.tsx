import * as Flex from '@twilio/flex-ui';

import EmailForwardBtn from '../../custom-components/EmailForwardBtn';
import { FlexComponent } from '../../../../types/feature-loader';
import "../styles/style.css";
import { useEffect } from 'react';

export const componentName = FlexComponent.MessagingCanvas;
export const componentHook = function addForwardBtnForEmailTasks(flex: typeof Flex, manager: Flex.Manager) {
  

  const CustomRecepients = (props:any) => {

    useEffect(()=>{
      console.error(props);
    },[]);

    if(props?.message?.source?.attributes?.to === undefined){
      return null;
    }

    return (<div className="custom-email-participants-block">
      {
      (props?.message?.source?.attributes?.from !== undefined && props?.message?.source?.attributes?.from.length>0) && 
        <p><b>From:</b> {props?.message?.source?.attributes?.from?.join()}</p>
      }
      {
      (props?.message?.source?.attributes?.to !== undefined && props?.message?.source?.attributes?.to.length>0) && 
        <p><b>To:</b> {props?.message?.source?.attributes?.to?.join()}</p>
      }
      {
      (props?.message?.source?.attributes?.cc !== undefined && props?.message?.source?.attributes?.cc.length>0) && 
        <p><b>cc:</b> {props?.message?.source?.attributes?.cc?.join()}</p>
      }
    </div>)
  }

  flex.EmailMessageItem.Content.add(<CustomRecepients key="custom-email-recepients" />, {
    sortOrder: -1,
  });

  flex.EmailMessageItem.Content.add(<EmailForwardBtn key="email-forward-btn" />, {
    sortOrder: 1,
  });

  const EmailEditorHeader = (props: any) => {
    const task = Flex.TaskHelper.getTaskFromConversationSid(props.conversationSid);
    if(task?.attributes?.direction === "outbound"){
      return null;
    }
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
