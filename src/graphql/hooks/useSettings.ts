import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SETTINGS,
  GET_SETTING_BY_ID,
  GET_SETTING_BY_KEY,
} from '../queries/settingsQueries';
import {
  CREATE_BRANCH_SETTING,
  UPDATE_SETTING,
  REMOVE_SETTING,
} from '../mutations/settingsMutations';

export function useSettings(branchId?: string) {
  return useQuery(GET_SETTINGS, {
    variables: branchId ? { branchId } : {},
    fetchPolicy: 'cache-and-network',
  });
}

export function useSettingById(id: string) {
  return useQuery(GET_SETTING_BY_ID, {
    variables: { id },
    skip: !id,
  });
}

export function useSettingByKey(key: string, branchId?: string) {
  return useQuery(GET_SETTING_BY_KEY, {
    variables: branchId ? { key, branchId } : { key },
    skip: !key,
  });
}

export function useCreateBranchSetting() {
  return useMutation(CREATE_BRANCH_SETTING);
}

export function useUpdateSetting() {
  return useMutation(UPDATE_SETTING);
}

export function useRemoveSetting() {
  return useMutation(REMOVE_SETTING);
}
