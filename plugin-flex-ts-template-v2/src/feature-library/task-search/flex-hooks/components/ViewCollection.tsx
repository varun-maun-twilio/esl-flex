import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import TaskSearchView from '../../custom-components/TaskSearchView';

export const componentName = FlexComponent.ViewCollection;
export const componentHook = function addEmailSearchView(flex: typeof Flex) {
  
  flex.ViewCollection.Content.add(
    <flex.View name="task-search" key="task-search">
      <TaskSearchView key="task-search-view-content" />
    </flex.View>,
  );
  
};
