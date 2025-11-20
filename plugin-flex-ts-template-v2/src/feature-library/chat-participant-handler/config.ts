import { getFeatureFlags } from '../../utils/configuration';
import ChatParticipantHandlerConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.chat_participant_handler as ChatParticipantHandlerConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
