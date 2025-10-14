import React from 'react';
import { SideLink, Actions, Manager } from '@twilio/flex-ui';



interface OwnProps {
  activeView?: string;
  viewName: string;
}

const TaskSearchSideLink = (props: OwnProps) => {
  const AllStrings = Manager.getInstance().strings as any;

  function navigate() {
    Actions.invokeAction('NavigateToView', { viewName: props.viewName });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Directory"
      iconActive="Directory"
      isActive={props.activeView === props.viewName}
      onClick={navigate}
      key="task-search-side-link"
    >
      Task Search
    </SideLink>
  );
};

export default TaskSearchSideLink;
