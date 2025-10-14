import { getFeatureFlags } from '../../utils/configuration';
import EmailSearchConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.task_search as EmailSearchConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
