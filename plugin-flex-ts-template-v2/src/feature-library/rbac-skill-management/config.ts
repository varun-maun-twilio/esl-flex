import { getFeatureFlags } from '../../utils/configuration';
import RbacSkillManagementConfig from './types/ServiceConfiguration';

const { enabled = false } = (getFeatureFlags()?.features?.rbac_skill_management as RbacSkillManagementConfig) || {};

export const isFeatureEnabled = () => {
  return enabled;
};
