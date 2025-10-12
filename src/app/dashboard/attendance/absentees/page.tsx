'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ABSENTEES } from '@/graphql/queries/absenteeQueries';
import { SEND_ABSENTEE_MESSAGE } from '@/graphql/mutations/absenteeMutations';
import { useOrganisationBranch } from '@/hooks/useOrganisationBranch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Users,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  Phone,
  Mail,
  UserMinus,
  Send,
  CheckCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import AbsenteeMessageModal from './components/AbsenteeMessageModal';
import AbsenteeFilters from './components/AbsenteeFilters';

interface Absentee {
  member: {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    phoneNumber: string | null;
    profileImageUrl?: string | null;
  };
  lastAttendance?: string;
  consecutiveAbsences: number;
  isRegularAttender: boolean;
  attendanceRate: number;
}

export default function AbsenteesPage() {
  const { organisationId, branchId } = useOrganisationBranch();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    regularAttendersOnly: false,
    minConsecutiveAbsences: 1,
  });

  const { data, loading, refetch } = useQuery(GET_ABSENTEES, {
    variables: {
      organisationId,
      branchId,
      eventId: selectedEvent,
      attendanceSessionId: selectedSession,
      filters,
    },
    skip: !organisationId || !branchId,
  });

  const absentees: Absentee[] = data?.getAbsentees || [];

  // Filter by search query
  const filteredAbsentees = absentees.filter((absentee) => {
    const fullName = `${absentee.member.firstName} ${absentee.member.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const handleSelectAll = () => {
    if (selectedMembers.length === filteredAbsentees.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredAbsentees.map((a) => a.member.id));
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
                <UserMinus className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Absentee Follow-up</h1>
                <p className="text-blue-100">
                  Reach out to members who missed recent events or services
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{filteredAbsentees.length}</div>
              <div className="text-blue-100">Absentees</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Absentees</p>
                  <p className="text-2xl font-bold">{absentees.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Selected</p>
                  <p className="text-2xl font-bold">{selectedMembers.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Regular Attenders</p>
                  <p className="text-2xl font-bold">
                    {absentees.filter((a) => a.isRegularAttender).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Multi-Week</p>
                  <p className="text-2xl font-bold">
                    {absentees.filter((a) => a.consecutiveAbsences >= 2).length}
                  </p>
                </div>
                <UserMinus className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex gap-2 items-center flex-1 w-full md:w-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search members..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={showFilters ? 'bg-blue-50 border-blue-300' : ''}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSelectAll}
                  disabled={filteredAbsentees.length === 0}
                >
                  {selectedMembers.length === filteredAbsentees.length
                    ? 'Deselect All'
                    : 'Select All'}
                </Button>
                <Button
                  onClick={() => setShowMessageModal(true)}
                  disabled={selectedMembers.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Message {selectedMembers.length} Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <AbsenteeFilters
              filters={filters}
              onChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          )}
        </AnimatePresence>

        {/* Absentee List */}
        <div className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading absentees...</p>
              </CardContent>
            </Card>
          ) : filteredAbsentees.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <UserMinus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No absentees found
                </h3>
                <p className="text-gray-600">
                  {searchQuery
                    ? 'Try adjusting your search or filters'
                    : 'All members attended this event!'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredAbsentees.map((absentee, index) => (
              <motion.div
                key={absentee.member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`hover:shadow-lg transition-all cursor-pointer ${
                    selectedMembers.includes(absentee.member.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : ''
                  }`}
                  onClick={() => handleSelectMember(absentee.member.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedMembers.includes(absentee.member.id)}
                        onCheckedChange={() =>
                          handleSelectMember(absentee.member.id)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {absentee.member.firstName} {absentee.member.lastName}
                          </h3>
                          {absentee.isRegularAttender && (
                            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                              Regular Attender
                            </Badge>
                          )}
                          {absentee.consecutiveAbsences >= 3 && (
                            <Badge variant="destructive">
                              {absentee.consecutiveAbsences} weeks absent
                            </Badge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>Last attended: {formatDate(absentee.lastAttendance)}</span>
                          </div>
                          {absentee.member.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{absentee.member.email}</span>
                            </div>
                          )}
                          {absentee.member.phoneNumber && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{absentee.member.phoneNumber}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-4">
                          <div className="text-sm">
                            <span className="text-gray-600">Attendance Rate: </span>
                            <span className="font-semibold">
                              {Math.round(absentee.attendanceRate * 100)}%
                            </span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full"
                              style={{ width: `${absentee.attendanceRate * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {absentee.member.phoneNumber && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`tel:${absentee.member.phoneNumber}`);
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {absentee.member.email && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`mailto:${absentee.member.email}`);
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Message Modal */}
        <AbsenteeMessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          selectedMembers={filteredAbsentees.filter((a) =>
            selectedMembers.includes(a.member.id),
          )}
          onSuccess={() => {
            setShowMessageModal(false);
            setSelectedMembers([]);
            toast.success('Messages sent successfully!');
          }}
        />
      </div>
    </div>
  );
}
