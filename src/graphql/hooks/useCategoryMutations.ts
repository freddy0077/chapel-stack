import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY, UPDATE_CATEGORY, REMOVE_CATEGORY } from '../mutations/categoryMutations';
import { GET_CATEGORIES } from '../queries/sermonQueries';

export const useCategoryMutations = () => {
  const [createCategory, { loading: isCreating }] = useMutation(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const [updateCategory, { loading: isUpdating }] = useMutation(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  const [removeCategory, { loading: isDeleting }] = useMutation(REMOVE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES }],
  });

  return {
    createCategory,
    updateCategory,
    removeCategory,
    isCreating,
    isUpdating,
    isDeleting,
    isSaving: isCreating || isUpdating,
  };
};
