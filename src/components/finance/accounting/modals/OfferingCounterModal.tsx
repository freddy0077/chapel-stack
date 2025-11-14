"use client";

import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { X, Calculator, Users, UserCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

const CREATE_OFFERING_BATCH = gql`
  mutation CreateOfferingBatch($input: CreateOfferingBatchInput!) {
    createOfferingBatch(input: $input) {
      id
      batchNumber
      totalAmount
    }
  }
`;

interface OfferingCounterModalProps {
  open: boolean;
  onClose: () => void;
  organisationId: string;
  branchId: string;
  userId: string;
  onSuccess: () => void;
}

export default function OfferingCounterModal({
  open,
  onClose,
  organisationId,
  branchId,
  userId,
  onSuccess,
}: OfferingCounterModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [serviceName, setServiceName] = useState("");
  const [counters, setCounters] = useState<string[]>([userId]);
  const [verifier, setVerifier] = useState("");
  const [offeringType, setOfferingType] = useState("general");
  const [denominations, setDenominations] = useState({
    "200": 0,
    "100": 0,
    "50": 0,
    "20": 0,
    "10": 0,
    "5": 0,
    "2": 0,
    "1": 0,
    coins: 0,
  });
  const [mobileMoneyAmount, setMobileMoneyAmount] = useState(0);
  const [bankTransferAmount, setBankTransferAmount] = useState(0);

  const [createBatch, { loading }] = useMutation(CREATE_OFFERING_BATCH);

  // TODO: Fetch real staff members from GraphQL
  // For now, just show current user
  const staffMembers = [
    { id: userId, name: "Me (Current User)" },
  ];

  const calculateCashTotal = () => {
    return Object.entries(denominations).reduce((total, [denom, count]) => {
      if (denom === "coins") return total + count;
      return total + parseInt(denom) * count;
    }, 0);
  };

  const cashTotal = calculateCashTotal();
  const grandTotal = cashTotal + mobileMoneyAmount + bankTransferAmount;

  const handleSubmit = async () => {
    // Validation
    if (!verifier) {
      toast({
        title: "Verifier Required",
        description: "Please select a verifier for this offering batch",
        variant: "destructive",
      });
      return;
    }

    if (counters.length === 0) {
      toast({
        title: "Counters Required",
        description: "Please select at least one counter",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBatch({
        variables: {
          input: {
            batchDate: new Date().toISOString(),
            serviceName,
            serviceId: undefined,
            offeringType: offeringType.toUpperCase(),
            cashAmount: cashTotal,
            mobileMoneyAmount,
            chequeAmount: bankTransferAmount,
            foreignCurrencyAmount: 0,
            cashDenominations: denominations,
            counters: counters,
            countedBy: counters,
            verifierId: verifier,
            status: "COUNTING",
            organisationId,
            branchId,
          },
        },
      });
      
      toast({
        title: "Success",
        description: "Offering batch submitted for verification",
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Error creating offering batch:", err);
      toast({
        title: "Error",
        description: "Failed to create offering batch",
        variant: "destructive",
      });
    }
  };

  const updateDenomination = (denom: string, value: string) => {
    setDenominations({
      ...denominations,
      [denom]: parseFloat(value) || 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Count Offering - Step {step} of 3
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="serviceName">Service Name *</Label>
                <Input
                  id="serviceName"
                  placeholder="e.g., Sunday 1st Service"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="offeringType">Offering Type *</Label>
                <Select value={offeringType} onValueChange={setOfferingType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Offering</SelectItem>
                    <SelectItem value="tithe">Tithe</SelectItem>
                    <SelectItem value="special">Special Offering</SelectItem>
                    <SelectItem value="building">Building Fund</SelectItem>
                    <SelectItem value="missions">Missions</SelectItem>
                    <SelectItem value="thanksgiving">Thanksgiving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                  <Users className="h-5 w-5" />
                  <span>Counter Team</span>
                </div>
                
                <div className="space-y-3">
                  {staffMembers.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 bg-white p-3 rounded-lg">
                      <Checkbox
                        id={`counter-${member.id}`}
                        checked={counters.includes(member.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setCounters([...counters, member.id]);
                          } else {
                            setCounters(counters.filter((id) => id !== member.id));
                          }
                        }}
                      />
                      <Label
                        htmlFor={`counter-${member.id}`}
                        className="flex-1 cursor-pointer"
                      >
                        {member.name}
                      </Label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-600">
                  Selected: {counters.length} counter(s)
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-2 text-green-700 font-semibold">
                  <UserCheck className="h-5 w-5" />
                  <span>Verifier *</span>
                </div>
                
                <Select value={verifier} onValueChange={setVerifier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select verifier..." />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-600">
                  The verifier will approve or reject this offering batch
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={() => setStep(2)}
              disabled={!serviceName || !verifier || counters.length === 0}
              className="w-full"
            >
              Continue to Cash Count
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Cash Denominations</h3>
                <div className="space-y-3">
                  {Object.entries(denominations).map(([denom, count]) => (
                    <div key={denom} className="flex items-center gap-4">
                      <Label className="w-24">
                        {denom === "coins" ? "Coins" : `GHS ${denom}`}
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        value={count || ""}
                        onChange={(e) => updateDenomination(denom, e.target.value)}
                        className="w-32"
                        placeholder="0"
                      />
                      <span className="text-sm text-muted-foreground w-32">
                        = GHS{" "}
                        {denom === "coins"
                          ? count.toFixed(2)
                          : (parseInt(denom) * count).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Total Cash:</span>
                    <span>GHS {cashTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="flex-1">
                Continue to Mobile Money
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Non-Cash Collections</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="momo">Total Mobile Money Amount</Label>
                    <Input
                      id="momo"
                      type="number"
                      min="0"
                      step="0.01"
                      value={mobileMoneyAmount || ""}
                      onChange={(e) =>
                        setMobileMoneyAmount(parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankTransfer">Total Bank Transfer Amount</Label>
                    <Input
                      id="bankTransfer"
                      type="number"
                      min="0"
                      step="0.01"
                      value={bankTransferAmount || ""}
                      onChange={(e) =>
                        setBankTransferAmount(parseFloat(e.target.value) || 0)
                      }
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">Bank transfers will be recorded as cheque/non-cash amounts for this batch.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{serviceName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cash:</span>
                    <span>GHS {cashTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mobile Money:</span>
                    <span>GHS {mobileMoneyAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bank Transfer:</span>
                    <span>GHS {bankTransferAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total:</span>
                    <span>GHS {grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1"
              >
                {loading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
