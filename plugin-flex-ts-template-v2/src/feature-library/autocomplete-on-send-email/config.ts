import { getFeatureFlags } from '../../utils/configuration';
import AutocompleteOnSendEmailConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.autocomplete_on_send_email as AutocompleteOnSendEmailConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
