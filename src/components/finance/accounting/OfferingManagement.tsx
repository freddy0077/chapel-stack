"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, List, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import OfferingCounterModal from "./modals/OfferingCounterModal";
import OfferingBatchList from "./OfferingBatchList";

interface OfferingManagementProps {
  organisationId: string;
  branchId: string;
  userId: string;
}

export default function OfferingManagement({
  organisationId,
  branchId,
  userId,
}: OfferingManagementProps) {
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [activeTab, setActiveTab] = useState("batches");
  const [refreshFlag, setRefreshFlag] = useState(0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Offering Management</h2>
          <p className="text-muted-foreground">
            Count, verify, and manage offering collections
          </p>
        </div>
        <Button onClick={() => setShowCounterModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Count Offering
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="batches">
            <List className="h-4 w-4 mr-2" />
            All Batches
          </TabsTrigger>
          <TabsTrigger value="counter">
            <Calculator className="h-4 w-4 mr-2" />
            Quick Count
          </TabsTrigger>
        </TabsList>

        <TabsContent value="batches" className="mt-6">
          <OfferingBatchList
            key={refreshFlag}
            organisationId={organisationId}
            branchId={branchId}
            userId={userId}
          />
        </TabsContent>

        <TabsContent value="counter" className="mt-6">
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Quick Offering Counter</h3>
            <p className="text-muted-foreground mb-4">
              Count offerings quickly without leaving this page
            </p>
            <Button onClick={() => setShowCounterModal(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start Counting
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Offering Counter Modal */}
      <OfferingCounterModal
        open={showCounterModal}
        onClose={() => setShowCounterModal(false)}
        organisationId={organisationId}
        branchId={branchId}
        userId={userId}
        onSuccess={() => {
          setShowCounterModal(false);
          setActiveTab("batches");
          setRefreshFlag((v) => v + 1);
        }}
      />
    </div>
  );
}
