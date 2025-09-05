import { useMutation } from "@apollo/client";
import {
  CREATE_SPEAKER,
  UPDATE_SPEAKER,
  REMOVE_SPEAKER,
} from "../mutations/speakerMutations";
import { GET_SPEAKERS } from "../queries/speakerQueries";

export const useSpeakerMutations = () => {
  const [createSpeaker, { loading: isCreating }] = useMutation(CREATE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
  });

  const [updateSpeaker, { loading: isUpdating }] = useMutation(UPDATE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
  });

  const [removeSpeaker, { loading: isDeleting }] = useMutation(REMOVE_SPEAKER, {
    refetchQueries: [{ query: GET_SPEAKERS }],
  });

  return {
    createSpeaker,
    updateSpeaker,
    removeSpeaker,
    isCreating,
    isUpdating,
    isDeleting,
    isSaving: isCreating || isUpdating,
  };
};
