import * as Flex from '@twilio/flex-ui';

import { FlexComponent } from '../../../../types/feature-loader';
import TaskSearchSideLink from '../../custom-components/TaskSearchSideLink';

export const componentName = FlexComponent.SideNav;
export const componentHook = function addTaskSearchSideLink(flex: typeof Flex) {
    flex.SideNav.Content.add(<TaskSearchSideLink viewName="task-search" key="task-search-side-nav" />);  
};
