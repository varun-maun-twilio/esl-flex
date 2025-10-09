import { getFeatureFlags } from '../../utils/configuration';
import OutboundEmailFromSelectorConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.outbound_email_from_selector as OutboundEmailFromSelectorConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
