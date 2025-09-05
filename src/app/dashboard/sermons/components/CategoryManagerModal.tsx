import React, { useState, useMemo } from "react";
import {
  X,
  AlertCircle,
  Search,
  Tag,
  Calendar,
  Database,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/graphql/hooks/useSermon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryManagerModalProps {
  open: boolean;
  onClose: () => void;
}

interface CategoryFormData {
  name: string;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  open,
  onClose,
}) => {
  const { data: categoriesData, loading, error } = useCategories();
  const [createCategory] = useCreateCategory();
  const [updateCategory] = useUpdateCategory();
  const [deleteCategory] = useDeleteCategory();

  const [searchTerm, setSearchTerm] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>({ name: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = categoriesData?.categories || [];

  // Filter categories based on search term
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const handleCreateNew = () => {
    setFormData({ name: "" });
    setIsCreating(true);
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setFormData({
      name: category.name,
    });
    setEditingCategory(category);
    setIsCreating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory({
          variables: {
            updateCategoryInput: {
              id: editingCategory.id,
              name: formData.name.trim(),
            },
          },
        });
      } else {
        // Create new category
        await createCategory({
          variables: {
            createCategoryInput: {
              name: formData.name.trim(),
            },
          },
        });
      }

      // Reset form
      setFormData({ name: "" });
      setIsCreating(false);
      setEditingCategory(null);
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      await deleteCategory({
        variables: { id: categoryId },
      });
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "" });
    setIsCreating(false);
    setEditingCategory(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Category Management
              </h2>
              <p className="text-sm text-gray-600">
                Create, edit, and manage sermon categories
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleCreateNew}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Category
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(85vh-120px)] overflow-y-auto">
          {/* Create/Edit Form */}
          {(isCreating || editingCategory) && (
            <Card className="p-4 mb-6 border-purple-200 bg-purple-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter category name"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={isSubmitting || !formData.name.trim()}
                  >
                    {isSubmitting
                      ? "Saving..."
                      : editingCategory
                        ? "Update"
                        : "Create"}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Statistics */}
          <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredCategories.length} of {categories.length} categories
                {searchTerm && ` matching "${searchTerm}"`}
              </span>
            </div>
          </div>

          {/* Categories List */}
          {loading && (
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading categories...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading categories
                  </h3>
                  <p className="text-sm text-red-600 mt-1">
                    {error.message || "An unexpected error occurred"}
                  </p>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && filteredCategories.length === 0 && (
            <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
              <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "No categories found" : "No categories yet"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? `No categories match "${searchTerm}". Try a different search term.`
                  : "Get started by creating your first sermon category."}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleCreateNew}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Category
                </Button>
              )}
            </div>
          )}

          {!loading && !error && filteredCategories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <Card
                  key={category.id}
                  className="p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="w-4 h-4 text-purple-600" />
                        <h3 className="font-medium text-gray-900">
                          {category.name}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            Created{" "}
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {category.updatedAt !== category.createdAt && (
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Updated{" "}
                              {new Date(
                                category.updatedAt,
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Categories help organize and filter sermons for better discovery
          </div>
          <Button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
