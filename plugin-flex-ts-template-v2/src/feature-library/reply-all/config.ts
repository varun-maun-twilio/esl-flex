import { getFeatureFlags } from '../../utils/configuration';
import ReplyAllConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.reply_all as ReplyAllConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
