import { getFeatureFlags } from '../../utils/configuration';
import EmailForwardConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.email_forward as EmailForwardConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
