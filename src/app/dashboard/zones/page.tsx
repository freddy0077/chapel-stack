'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ZONES, GET_ZONE_STATS } from '@/graphql/queries/zoneQueries';
import { CREATE_ZONE, UPDATE_ZONE, DELETE_ZONE } from '@/graphql/mutations/zoneMutations';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MapPin,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Phone,
  Mail,
  User,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import ZoneFormModal from './components/ZoneFormModal';
import DeleteConfirmModal from '@/components/ui/delete-confirm-modal';

interface Zone {
  id: string;
  name: string;
  description?: string;
  location?: string;
  leaderName?: string;
  leaderPhone?: string;
  leaderEmail?: string;
  status: string;
  _count?: {
    members: number;
  };
}

export default function ZonesPage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<Zone | null>(null);

  const { data, loading, refetch } = useQuery(GET_ZONES, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const { data: statsData } = useQuery(GET_ZONE_STATS, {
    variables: { organisationId, branchId },
    skip: !organisationId,
  });

  const [createZone] = useMutation(CREATE_ZONE, {
    onCompleted: () => {
      toast.success('Zone created successfully!');
      refetch();
      setShowFormModal(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create zone');
    },
  });

  const [updateZone] = useMutation(UPDATE_ZONE, {
    refetchQueries: [
      {
        query: GET_ZONES,
        variables: { organisationId, branchId },
      },
      {
        query: GET_ZONE_STATS,
        variables: { organisationId, branchId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => {
      toast.success('Zone updated successfully!');
      setShowFormModal(false);
      setSelectedZone(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update zone');
    },
  });

  const [deleteZone] = useMutation(DELETE_ZONE, {
    onCompleted: () => {
      toast.success('Zone deleted successfully!');
      refetch();
      setShowDeleteModal(false);
      setSelectedZone(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete zone');
    },
  });

  const zones: Zone[] = data?.zones || [];

  const filteredZones = zones.filter((zone) =>
    zone.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateZone = (input: any) => {
    const { status, ...createInput } = input; // Remove status from create input
    createZone({
      variables: {
        input: {
          ...createInput,
          organisationId,
          branchId,
        },
      },
    });
  };

  const handleUpdateZone = (input: any) => {
    if (!selectedZone) return;
    // Keep status in update (unlike create), but ensure all fields are included
    updateZone({
      variables: {
        id: selectedZone.id,
        input: {
          name: input.name,
          description: input.description,
          location: input.location,
          leaderName: input.leaderName,
          leaderPhone: input.leaderPhone,
          leaderEmail: input.leaderEmail,
          status: input.status,
        },
      },
    });
  };

  const handleDeleteZone = () => {
    if (!selectedZone) return;
    deleteZone({
      variables: { id: selectedZone.id },
    });
  };

  const handleEdit = (zone: Zone) => {
    setSelectedZone(zone);
    setShowFormModal(true);
  };

  const handleDelete = (zone: Zone) => {
    setSelectedZone(zone);
    setShowDeleteModal(true);
  };

  const stats = statsData?.zoneStats || {
    totalZones: 0,
    activeZones: 0,
    totalMembers: 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
                <MapPin className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Zones & Communities</h1>
                <p className="text-blue-100">
                  Organize members by geographical location or community
                </p>
              </div>
            </div>
            <Button
              onClick={() => {
                setSelectedZone(null);
                setShowFormModal(true);
              }}
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Zone
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Zones</p>
                  <p className="text-2xl font-bold">{stats.totalZones}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Zones</p>
                  <p className="text-2xl font-bold">{stats.activeZones}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold">{stats.totalMembers}</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search zones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Zones List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading zones...</p>
              </CardContent>
            </Card>
          ) : filteredZones.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No zones found
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search'
                    : 'Get started by creating your first zone'}
                </p>
                {!searchQuery && (
                  <Button
                    onClick={() => {
                      setSelectedZone(null);
                      setShowFormModal(true);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Zone
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredZones.map((zone, index) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{zone.name}</CardTitle>
                        <Badge
                          variant={zone.status === 'ACTIVE' ? 'default' : 'secondary'}
                          className={
                            zone.status === 'ACTIVE'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }
                        >
                          {zone.status}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(zone)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(zone)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {zone.description && (
                      <p className="text-sm text-gray-600">{zone.description}</p>
                    )}

                    {zone.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{zone.location}</span>
                      </div>
                    )}

                    {zone.leaderName && (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{zone.leaderName}</span>
                        </div>
                        {zone.leaderPhone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{zone.leaderPhone}</span>
                          </div>
                        )}
                        {zone.leaderEmail && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4" />
                            <span>{zone.leaderEmail}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{zone._count?.members || 0} members</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Form Modal */}
        <ZoneFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setSelectedZone(null);
          }}
          onSubmit={selectedZone ? handleUpdateZone : handleCreateZone}
          zone={selectedZone}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedZone(null);
          }}
          onConfirm={handleDeleteZone}
          title="Delete Zone"
          message={`Are you sure you want to delete "${selectedZone?.name}"? This action cannot be undone.`}
        />
      </div>
    </div>
  );
}
