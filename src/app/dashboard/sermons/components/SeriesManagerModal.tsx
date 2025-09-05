"use client";

import React, { useState } from "react";
import {
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useGetSeries,
  useCreateSeries,
  useUpdateSeries,
  useDeleteSeries,
  SeriesEntity,
} from "@/graphql/hooks/useSermon";
import { useAuth } from "@/contexts/AuthContextEnhanced";

interface SeriesManagerModalProps {
  open: boolean;
  onClose: () => void;
}

interface SeriesFormData {
  title: string;
  description: string;
  artworkUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export function SeriesManagerModal({ open, onClose }: SeriesManagerModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingSeries, setEditingSeries] = useState<SeriesEntity | null>(null);
  const [formData, setFormData] = useState<SeriesFormData>({
    title: "",
    description: "",
    artworkUrl: "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  const {
    data: seriesData,
    loading: seriesLoading,
    refetch: refetchSeries,
  } = useGetSeries();
  const [createSeries, { loading: createLoading }] = useCreateSeries();
  const [updateSeries, { loading: updateLoading }] = useUpdateSeries();
  const [deleteSeries, { loading: deleteLoading }] = useDeleteSeries();
  const { state } = useAuth();
  const user = state.user;

  const mutationLoading = createLoading || updateLoading || deleteLoading;
  const series = seriesData?.series || [];

  const handleAddSeries = () => {
    setEditingSeries(null);
    setFormData({
      title: "",
      description: "",
      artworkUrl: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setShowForm(true);
  };

  const handleEditSeries = (seriesItem: SeriesEntity) => {
    setEditingSeries(seriesItem);
    setFormData({
      title: seriesItem.title || "",
      description: seriesItem.description || "",
      artworkUrl: seriesItem.artworkUrl || "",
      startDate: seriesItem.startDate
        ? new Date(seriesItem.startDate).toISOString().split("T")[0]
        : "",
      endDate: seriesItem.endDate
        ? new Date(seriesItem.endDate).toISOString().split("T")[0]
        : "",
      isActive: seriesItem.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDeleteSeries = async (seriesItem: SeriesEntity) => {
    if (
      window.confirm(`Are you sure you want to delete "${seriesItem.title}"?`)
    ) {
      try {
        await deleteSeries({ variables: { id: seriesItem.id } });
        await refetchSeries();
      } catch (error) {
        console.error("Error deleting series:", error);
        alert("Failed to delete series. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get branchId from user context
      const branchId = user?.userBranches?.[0]?.branch?.id;
      if (!branchId) {
        alert("Branch ID is required but not found. Please contact support.");
        return;
      }

      if (editingSeries) {
        await updateSeries({
          variables: {
            updateSeriesInput: {
              id: editingSeries.id,
              title: formData.title,
              description: formData.description || undefined,
              artworkUrl: formData.artworkUrl || undefined,
              startDate: formData.startDate
                ? new Date(formData.startDate).toISOString()
                : undefined,
              endDate: formData.endDate
                ? new Date(formData.endDate).toISOString()
                : undefined,
            },
          },
        });
      } else {
        await createSeries({
          variables: {
            createSeriesInput: {
              title: formData.title,
              description: formData.description || undefined,
              artworkUrl: formData.artworkUrl || undefined,
              startDate: formData.startDate
                ? new Date(formData.startDate).toISOString()
                : undefined,
              endDate: formData.endDate
                ? new Date(formData.endDate).toISOString()
                : undefined,
              branchId: branchId,
            },
          },
        });
      }

      await refetchSeries();
      setShowForm(false);
      setEditingSeries(null);
    } catch (error) {
      console.error("Error saving series:", error);
      alert("Failed to save series. Please try again.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Manage Series</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showForm ? (
            <>
              {/* Header with Add Button */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Series ({series.length})
                </h3>
                <Button
                  onClick={handleAddSeries}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Series
                </Button>
              </div>

              {/* Series List */}
              {seriesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : series.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpenIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    No series found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Get started by adding your first sermon series.
                  </p>
                  <Button
                    onClick={handleAddSeries}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add First Series
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {series.map((seriesItem) => (
                    <Card
                      key={seriesItem.id}
                      className="p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            {seriesItem.artworkUrl ? (
                              <img
                                src={seriesItem.artworkUrl}
                                alt={seriesItem.title}
                                className="w-full h-full rounded-xl object-cover"
                              />
                            ) : (
                              <BookOpenIcon className="w-8 h-8 text-white" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {seriesItem.title}
                              </h4>
                              <Badge
                                variant={
                                  seriesItem.isActive ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {seriesItem.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            {seriesItem.description && (
                              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {seriesItem.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              {seriesItem.startDate && (
                                <div className="flex items-center gap-1">
                                  <CalendarDaysIcon className="w-3 h-3" />
                                  <span>
                                    Started {formatDate(seriesItem.startDate)}
                                  </span>
                                </div>
                              )}
                              {seriesItem.endDate && (
                                <div className="flex items-center gap-1">
                                  <CalendarDaysIcon className="w-3 h-3" />
                                  <span>
                                    Ends {formatDate(seriesItem.endDate)}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => handleEditSeries(seriesItem)}
                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSeries(seriesItem)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Series Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editingSeries ? "Edit Series" : "Add New Series"}
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Back to List
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Series Title *
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter series title (e.g., Faith & Hope, Christmas Series)"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    required
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Start Date
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    End Date
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Artwork URL */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="artworkUrl"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Artwork Image URL
                  </label>
                  <input
                    id="artworkUrl"
                    name="artworkUrl"
                    type="url"
                    value={formData.artworkUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/series-artwork.jpg"
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter series description..."
                  rows={4}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-3">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active Series
                </label>
                <p className="text-xs text-gray-500">
                  Active series appear in sermon creation forms
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutationLoading}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-indigo-300 font-medium transition-colors"
                >
                  {mutationLoading
                    ? "Saving..."
                    : editingSeries
                      ? "Update Series"
                      : "Create Series"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
