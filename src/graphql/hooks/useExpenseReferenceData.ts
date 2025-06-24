import { useState, useEffect } from "react";

// Mock data for expense reference data
const mockExpenseCategories = [
  { id: "1", name: "Facilities & Maintenance" },
  { id: "2", name: "Utilities" },
  { id: "3", name: "Staff Salaries" },
  { id: "4", name: "Office Supplies" },
  { id: "5", name: "Ministry Programs" },
  { id: "6", name: "Worship & Media" },
  { id: "7", name: "Youth Ministry" },
  { id: "8", name: "Children's Ministry" },
  { id: "9", name: "Missions & Outreach" },
  { id: "10", name: "Events" },
  { id: "11", name: "Insurance" },
  { id: "12", name: "Equipment" },
  { id: "13", name: "Professional Services" },
  { id: "14", name: "Benevolence" },
  { id: "15", name: "Education & Training" },
  { id: "16", name: "Travel & Transportation" },
];

const mockPaymentMethods = [
  { id: "1", name: "Cash" },
  { id: "2", name: "Check" },
  { id: "3", name: "Credit Card" },
  { id: "4", name: "Bank Transfer" },
  { id: "5", name: "Electronic Payment" },
  { id: "6", name: "Debit Card" },
  { id: "7", name: "Church Account" },
];

const mockDepartments = [
  { id: "1", name: "Administration" },
  { id: "2", name: "Worship" },
  { id: "3", name: "Children's Ministry" },
  { id: "4", name: "Youth Ministry" },
  { id: "5", name: "Adult Ministry" },
  { id: "6", name: "Outreach" },
  { id: "7", name: "Missions" },
  { id: "8", name: "Facilities" },
  { id: "9", name: "Media & Technology" },
  { id: "10", name: "Education" },
  { id: "11", name: "Pastoral" },
  { id: "12", name: "Community Service" },
  { id: "13", name: "Events" },
];

export function useExpenseReferenceData(branchId?: string) {
  // Simulate loading
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<typeof mockExpenseCategories>([]);
  const [paymentMethods, setPaymentMethods] = useState<typeof mockPaymentMethods>([]);
  const [departments, setDepartments] = useState<typeof mockDepartments>([]);

  useEffect(() => {
    setLoading(true);
    // Simulate async fetch
    const timeout = setTimeout(() => {
      setCategories(mockExpenseCategories);
      setPaymentMethods(mockPaymentMethods);
      setDepartments(mockDepartments);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [branchId]);

  return {
    categories,
    paymentMethods,
    departments,
    loading,
    error: null,
  };
}
