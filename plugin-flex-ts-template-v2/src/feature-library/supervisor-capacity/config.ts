import { getFeatureFlags, getLoadedFeatures } from '../../utils/configuration';
import SupervisorCapacityConfig from './types/ServiceConfiguration';
import { Manager } from '@twilio/flex-ui';
const { enabled = false, rules } = (getFeatureFlags()?.features?.supervisor_capacity as SupervisorCapacityConfig) || {};

export const isFeatureEnabled = () => {

  if(Manager.getInstance().user.roles.indexOf("admin")==-1){
    return false;
  }

  return enabled;
};

export const getRules = () => {
  return rules;
};

export const isWorkerCanvasTabsEnabled = () => {
  return getLoadedFeatures().includes('worker-canvas-tabs');
};
