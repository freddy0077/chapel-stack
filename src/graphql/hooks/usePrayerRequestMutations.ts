import { useMutation } from '@apollo/client';
import { CREATE_PRAYER_REQUEST, UPDATE_PRAYER_REQUEST, REMOVE_PRAYER_REQUEST } from '../mutations/prayer-requests';

export function usePrayerRequestMutations() {
  const [createPrayerRequest, createState] = useMutation(CREATE_PRAYER_REQUEST);
  const [updatePrayerRequest, updateState] = useMutation(UPDATE_PRAYER_REQUEST);
  const [removePrayerRequest, removeState] = useMutation(REMOVE_PRAYER_REQUEST);

  return {
    createPrayerRequest,
    updatePrayerRequest,
    removePrayerRequest,
    createState,
    updateState,
    removeState,
  };
}
