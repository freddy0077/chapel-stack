"use client";

import React from 'react';
import { calculateFinancialHealth } from '@/utils/financeHelpers';

interface FinancialHealthIndicatorProps {
  balance: number;
  monthlyExpenses: number;
}

export default function FinancialHealthIndicator({ 
  balance, 
  monthlyExpenses 
}: FinancialHealthIndicatorProps) {
  const { status, color, icon } = calculateFinancialHealth(balance, monthlyExpenses);

  return (
    <span 
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${color}`} 
      title={`Balance: ₵${balance.toLocaleString()} | Monthly Expenses: ₵${monthlyExpenses.toLocaleString()}`}
    >
      <span className="mr-1">{icon}</span>
      {status}
    </span>
  );
}
