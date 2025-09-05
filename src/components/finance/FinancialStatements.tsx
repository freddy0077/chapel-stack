"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { FINANCIAL_STATEMENTS_QUERY } from "@/graphql/queries/financialStatements";
import { useAuth } from "@/contexts/AuthContextEnhanced";
import {
  DocumentTextIcon,
  PrinterIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  ScaleIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";
import { useOrganisationBranch } from "@/hooks/useOrganisationBranch";

interface FinancialStatementsProps {
  organisationId: string;
  branchId?: string;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

type StatementType =
  | "INCOME_STATEMENT"
  | "BALANCE_SHEET"
  | "CASH_FLOW_STATEMENT"
  | "STATEMENT_OF_NET_ASSETS";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(value);
};

const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const handleQuickRange = (
  range: string,
  setSelectedDateRange: (dateRange: { startDate: Date; endDate: Date }) => void,
) => {
  const today = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (range) {
    case "thisMonth":
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      break;
    case "lastMonth":
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    case "thisYear":
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
      break;
    case "lastYear":
      startDate = new Date(today.getFullYear() - 1, 0, 1);
      endDate = new Date(today.getFullYear() - 1, 11, 31);
      break;
    default:
      return;
  }

  setSelectedDateRange({ startDate, endDate });
};

const StatementRow: React.FC<{
  label: string;
  amount: number;
  isSubtotal?: boolean;
  isTotal?: boolean;
  indent?: boolean;
  previousAmount?: number;
}> = ({
  label,
  amount,
  isSubtotal = false,
  isTotal = false,
  indent = false,
  previousAmount,
}) => {
  const variance =
    previousAmount !== undefined ? amount - previousAmount : undefined;
  const variancePercent =
    previousAmount !== undefined && previousAmount !== 0
      ? ((amount - previousAmount) / Math.abs(previousAmount)) * 100
      : undefined;

  return (
    <tr
      className={`${isTotal ? "border-t-2 border-gray-300 font-bold" : ""} ${isSubtotal ? "font-semibold" : ""}`}
    >
      <td className={`py-2 px-4 ${indent ? "pl-8" : ""}`}>{label}</td>
      <td className="py-2 px-4 text-right">{formatCurrency(amount)}</td>
      {previousAmount !== undefined && (
        <>
          <td className="py-2 px-4 text-right">
            {formatCurrency(previousAmount)}
          </td>
          <td className="py-2 px-4 text-right">
            {variance !== undefined && (
              <span
                className={variance >= 0 ? "text-green-600" : "text-red-600"}
              >
                {formatCurrency(variance)}
              </span>
            )}
          </td>
          <td className="py-2 px-4 text-right">
            {variancePercent !== undefined && (
              <span
                className={
                  variancePercent >= 0 ? "text-green-600" : "text-red-600"
                }
              >
                {variancePercent.toFixed(1)}%
              </span>
            )}
          </td>
        </>
      )}
    </tr>
  );
};

const FinancialStatements: React.FC<FinancialStatementsProps> = ({
  organisationId,
  branchId,
  dateRange,
}) => {
  const [activeStatementType, setActiveStatementType] =
    useState<StatementType>("INCOME_STATEMENT");

  const { user } = useAuth();

  // Determine effective branch ID (super admin can see all branches)
  const effectiveBranchId = user?.roles?.includes("SUPER_ADMIN")
    ? branchId
    : branchId;

  // State for date range selection
  const [selectedDateRange, setSelectedDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().getFullYear(), 0, 1), // Start of current year
    endDate: new Date(), // Today
  });

  // Construct the GraphQL input
  const financialStatementsInput = useMemo(() => {
    if (!organisationId) return null;

    return {
      organisationId,
      branchId: effectiveBranchId,
      dateRange: {
        startDate: selectedDateRange.startDate.toISOString(),
        endDate: selectedDateRange.endDate.toISOString(),
      },
      statementType: activeStatementType,
      includeComparative: true,
    };
  }, [
    organisationId,
    effectiveBranchId,
    selectedDateRange,
    activeStatementType,
  ]);

  console.log(
    "FinancialStatements - Input constructed:",
    financialStatementsInput,
  );
  console.log(
    "FinancialStatements - dateRange object:",
    financialStatementsInput?.dateRange,
  );

  const { data, loading, error, refetch } = useQuery(
    FINANCIAL_STATEMENTS_QUERY,
    {
      variables: { input: financialStatementsInput },
      skip: !financialStatementsInput,
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        console.log("FinancialStatements - GraphQL Response:", data);
      },
      onError: (error) => {
        console.log("FinancialStatements - GraphQL Error:", error);
      },
    },
  );

  const financialStatements = data?.financialStatements;

  const statementTypes = [
    {
      type: "INCOME_STATEMENT" as StatementType,
      label: "Income Statement",
      icon: DocumentIcon,
      description: "Revenue and expenses overview",
    },
    {
      type: "BALANCE_SHEET" as StatementType,
      label: "Balance Sheet",
      icon: ScaleIcon,
      description: "Assets, liabilities, and net assets",
    },
    {
      type: "CASH_FLOW_STATEMENT" as StatementType,
      label: "Cash Flow Statement",
      icon: InformationCircleIcon,
      description: "Cash inflows and outflows",
    },
    {
      type: "STATEMENT_OF_NET_ASSETS" as StatementType,
      label: "Net Assets Statement",
      icon: DocumentArrowDownIcon,
      description: "Restricted and unrestricted assets",
    },
  ];

  const renderLineItems = (items: any[], showComparative: boolean = false) => {
    return items.map((item, index) => (
      <React.Fragment key={index}>
        <StatementRow
          label={item.description}
          amount={item.currentPeriod}
          previousAmount={showComparative ? item.previousPeriod : undefined}
          isSubtotal={item.category !== item.description}
        />
        {item.subItems &&
          item.subItems.map((subItem, subIndex) => (
            <StatementRow
              key={`${index}-${subIndex}`}
              label={subItem.description}
              amount={subItem.currentPeriod}
              previousAmount={
                showComparative ? subItem.previousPeriod : undefined
              }
              indent={true}
            />
          ))}
      </React.Fragment>
    ));
  };

  const renderIncomeStatement = () => {
    if (!financialStatements?.incomeStatement) return null;

    const { incomeStatement } = financialStatements;
    const showComparative = !!incomeStatement.previousTotalRevenue;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Income Statement
          </h3>
          <p className="text-sm text-gray-600">For the period</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Period
                </th>
                {showComparative && (
                  <>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Previous Period
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance
                    </th>
                    <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Variance %
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Revenue Section */}
              <tr className="bg-blue-50">
                <td className="py-3 px-4 font-semibold text-blue-900">
                  REVENUE
                </td>
                <td className="py-3 px-4"></td>
                {showComparative && <td className="py-3 px-4"></td>}
                {showComparative && <td className="py-3 px-4"></td>}
                {showComparative && <td className="py-3 px-4"></td>}
              </tr>
              {renderLineItems(incomeStatement.revenue, showComparative)}
              <StatementRow
                label="Total Revenue"
                amount={incomeStatement.totalRevenue}
                previousAmount={
                  showComparative
                    ? incomeStatement.previousTotalRevenue
                    : undefined
                }
                isSubtotal={true}
              />

              {/* Expenses Section */}
              <tr className="bg-red-50">
                <td className="py-3 px-4 font-semibold text-red-900">
                  EXPENSES
                </td>
                <td className="py-3 px-4"></td>
                {showComparative && <td className="py-3 px-4"></td>}
                {showComparative && <td className="py-3 px-4"></td>}
                {showComparative && <td className="py-3 px-4"></td>}
              </tr>
              {renderLineItems(incomeStatement.expenses, showComparative)}
              <StatementRow
                label="Total Expenses"
                amount={incomeStatement.totalExpenses}
                previousAmount={
                  showComparative
                    ? incomeStatement.previousTotalExpenses
                    : undefined
                }
                isSubtotal={true}
              />

              {/* Net Income */}
              <StatementRow
                label="Net Income"
                amount={incomeStatement.netIncome}
                previousAmount={
                  showComparative
                    ? incomeStatement.previousNetIncome
                    : undefined
                }
                isTotal={true}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderBalanceSheet = () => {
    if (!financialStatements?.balanceSheet) return null;

    const { balanceSheet } = financialStatements;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Balance Sheet</h3>
          <p className="text-sm text-gray-600">As of</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Assets Section */}
              <tr className="bg-green-50">
                <td className="py-3 px-4 font-semibold text-green-900">
                  ASSETS
                </td>
                <td className="py-3 px-4"></td>
              </tr>
              {renderLineItems(balanceSheet.assets)}
              <StatementRow
                label="Total Assets"
                amount={balanceSheet.totalAssets}
                isSubtotal={true}
              />

              {/* Liabilities Section */}
              {balanceSheet.liabilities.length > 0 && (
                <>
                  <tr className="bg-red-50">
                    <td className="py-3 px-4 font-semibold text-red-900">
                      LIABILITIES
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  {renderLineItems(balanceSheet.liabilities)}
                  <StatementRow
                    label="Total Liabilities"
                    amount={balanceSheet.totalLiabilities}
                    isSubtotal={true}
                  />
                </>
              )}

              {/* Net Assets Section */}
              <tr className="bg-blue-50">
                <td className="py-3 px-4 font-semibold text-blue-900">
                  NET ASSETS
                </td>
                <td className="py-3 px-4"></td>
              </tr>
              {renderLineItems(balanceSheet.netAssets)}
              <StatementRow
                label="Total Net Assets"
                amount={balanceSheet.totalNetAssets}
                isTotal={true}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCashFlowStatement = () => {
    if (!financialStatements?.cashFlowStatement) return null;

    const { cashFlowStatement } = financialStatements;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Cash Flow Statement
          </h3>
          <p className="text-sm text-gray-600">For the period</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Operating Activities */}
              <tr className="bg-blue-50">
                <td className="py-3 px-4 font-semibold text-blue-900">
                  OPERATING ACTIVITIES
                </td>
                <td className="py-3 px-4"></td>
              </tr>
              {renderLineItems(cashFlowStatement.operatingActivities)}
              <StatementRow
                label="Net Cash from Operating Activities"
                amount={cashFlowStatement.netCashFromOperating}
                isSubtotal={true}
              />

              {/* Investing Activities */}
              {cashFlowStatement.investingActivities.length > 0 && (
                <>
                  <tr className="bg-green-50">
                    <td className="py-3 px-4 font-semibold text-green-900">
                      INVESTING ACTIVITIES
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  {renderLineItems(cashFlowStatement.investingActivities)}
                  <StatementRow
                    label="Net Cash from Investing Activities"
                    amount={cashFlowStatement.netCashFromInvesting}
                    isSubtotal={true}
                  />
                </>
              )}

              {/* Financing Activities */}
              {cashFlowStatement.financingActivities.length > 0 && (
                <>
                  <tr className="bg-purple-50">
                    <td className="py-3 px-4 font-semibold text-purple-900">
                      FINANCING ACTIVITIES
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  {renderLineItems(cashFlowStatement.financingActivities)}
                  <StatementRow
                    label="Net Cash from Financing Activities"
                    amount={cashFlowStatement.netCashFromFinancing}
                    isSubtotal={true}
                  />
                </>
              )}

              {/* Net Change in Cash */}
              <StatementRow
                label="Net Change in Cash"
                amount={cashFlowStatement.netChangeInCash}
                isTotal={true}
              />
              <StatementRow
                label="Beginning Cash Balance"
                amount={cashFlowStatement.beginningCashBalance}
              />
              <StatementRow
                label="Ending Cash Balance"
                amount={cashFlowStatement.endingCashBalance}
                isTotal={true}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderNetAssetsStatement = () => {
    if (!financialStatements?.statementOfNetAssets) return null;

    const { statementOfNetAssets } = financialStatements;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Statement of Net Assets
          </h3>
          <p className="text-sm text-gray-600">For the period</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Unrestricted Assets */}
              <tr className="bg-green-50">
                <td className="py-3 px-4 font-semibold text-green-900">
                  UNRESTRICTED NET ASSETS
                </td>
                <td className="py-3 px-4"></td>
              </tr>
              {renderLineItems(statementOfNetAssets.unrestricted)}
              <StatementRow
                label="Total Unrestricted"
                amount={statementOfNetAssets.totalUnrestricted}
                isSubtotal={true}
              />

              {/* Temporarily Restricted Assets */}
              {statementOfNetAssets.temporarilyRestricted.length > 0 && (
                <>
                  <tr className="bg-yellow-50">
                    <td className="py-3 px-4 font-semibold text-yellow-900">
                      TEMPORARILY RESTRICTED NET ASSETS
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  {renderLineItems(statementOfNetAssets.temporarilyRestricted)}
                  <StatementRow
                    label="Total Temporarily Restricted"
                    amount={statementOfNetAssets.totalTemporarilyRestricted}
                    isSubtotal={true}
                  />
                </>
              )}

              {/* Permanently Restricted Assets */}
              {statementOfNetAssets.permanentlyRestricted.length > 0 && (
                <>
                  <tr className="bg-red-50">
                    <td className="py-3 px-4 font-semibold text-red-900">
                      PERMANENTLY RESTRICTED NET ASSETS
                    </td>
                    <td className="py-3 px-4"></td>
                  </tr>
                  {renderLineItems(statementOfNetAssets.permanentlyRestricted)}
                  <StatementRow
                    label="Total Permanently Restricted"
                    amount={statementOfNetAssets.totalPermanentlyRestricted}
                    isSubtotal={true}
                  />
                </>
              )}

              {/* Total Net Assets */}
              <StatementRow
                label="Total Net Assets"
                amount={statementOfNetAssets.totalNetAssets}
                isTotal={true}
              />
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCurrentStatement = () => {
    switch (activeStatementType) {
      case "INCOME_STATEMENT":
        return renderIncomeStatement();
      case "BALANCE_SHEET":
        return renderBalanceSheet();
      case "CASH_FLOW_STATEMENT":
        return renderCashFlowStatement();
      case "STATEMENT_OF_NET_ASSETS":
        return renderNetAssetsStatement();
      default:
        return null;
    }
  };

  const handleExport = (format: "pdf" | "excel" | "csv") => {
    if (!financialStatements) return;

    const statementData = getExportData();
    const fileName = `financial-statements-${activeStatementType.toLowerCase()}-${formatDateForDisplay(selectedDateRange.startDate)}-to-${formatDateForDisplay(selectedDateRange.endDate)}`;

    if (format === "pdf") {
      exportToPDF(statementData, fileName);
    } else if (format === "excel") {
      exportToExcel(statementData, fileName);
    } else if (format === "csv") {
      exportToCSV(statementData, fileName);
    }
  };

  const getExportData = () => {
    if (!financialStatements) return [];

    const data: any[] = [];

    if (
      activeStatementType === "INCOME_STATEMENT" &&
      financialStatements.incomeStatement
    ) {
      const stmt = financialStatements.incomeStatement;

      // Add header info
      data.push(["Income Statement"]);
      data.push([
        `Period: ${formatDateForDisplay(selectedDateRange.startDate)} - ${formatDateForDisplay(selectedDateRange.endDate)}`,
      ]);
      data.push([""]);

      // Add revenue section
      data.push(["REVENUE"]);
      stmt.revenue.forEach((item) => {
        data.push([item.description, formatCurrency(item.currentPeriod)]);
      });
      data.push(["Total Revenue", formatCurrency(stmt.totalRevenue)]);
      data.push([""]);

      // Add expenses section
      data.push(["EXPENSES"]);
      stmt.expenses.forEach((item) => {
        data.push([item.description, formatCurrency(item.currentPeriod)]);
      });
      data.push(["Total Expenses", formatCurrency(stmt.totalExpenses)]);
      data.push([""]);

      // Add net income
      data.push(["NET INCOME", formatCurrency(stmt.netIncome)]);
    }

    // Add similar logic for other statement types
    if (
      activeStatementType === "BALANCE_SHEET" &&
      financialStatements.balanceSheet
    ) {
      const stmt = financialStatements.balanceSheet;

      data.push(["Balance Sheet"]);
      data.push([`As of: ${formatDateForDisplay(selectedDateRange.endDate)}`]);
      data.push([""]);

      data.push(["ASSETS"]);
      stmt.assets.forEach((item) => {
        data.push([item.description, formatCurrency(item.currentPeriod)]);
      });
      data.push(["Total Assets", formatCurrency(stmt.totalAssets)]);
      data.push([""]);

      data.push(["LIABILITIES"]);
      stmt.liabilities.forEach((item) => {
        data.push([item.description, formatCurrency(item.currentPeriod)]);
      });
      data.push(["Total Liabilities", formatCurrency(stmt.totalLiabilities)]);
      data.push([""]);

      data.push(["NET ASSETS", formatCurrency(stmt.totalNetAssets)]);
    }

    return data;
  };

  const exportToPDF = (data: any[], fileName: string) => {
    // For now, export as HTML that can be printed to PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${data[0][0]}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #333; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f5f5f5; font-weight: bold; }
          .total { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <h1>${data[0][0]}</h1>
        <p>${data[1][0]}</p>
        <table>
          <thead>
            <tr><th>Description</th><th>Amount</th></tr>
          </thead>
          <tbody>
            ${data
              .slice(3)
              .filter((row) => row.length > 0 && row[0] !== "")
              .map(
                (row) =>
                  `<tr class="${row[0].includes("Total") || row[0].includes("NET") ? "total" : ""}">
                <td>${row[0]}</td>
                <td>${row[1] || ""}</td>
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.html`;
    a.click();
    URL.revokeObjectURL(url);

    // Also open in new window for printing to PDF
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.print();
      }, 500);
    }
  };

  const exportToExcel = (data: any[], fileName: string) => {
    // Create a simple HTML table that Excel can import
    const htmlContent = `
      <table>
        ${data
          .map(
            (row) =>
              `<tr>${row.map((cell: any) => `<td>${cell || ""}</td>`).join("")}</tr>`,
          )
          .join("")}
      </table>
    `;

    const blob = new Blob([htmlContent], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = (data: any[], fileName: string) => {
    const csvContent = data
      .map((row) =>
        row
          .map(
            (cell: any) => `"${(cell || "").toString().replace(/"/g, '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-red-600">
          <h3 className="text-lg font-medium mb-2">
            Error Loading Financial Statements
          </h3>
          <p className="text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Date Range Picker */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Financial Statements
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Period: {formatDateForDisplay(selectedDateRange.startDate)} -{" "}
              {formatDateForDisplay(selectedDateRange.endDate)}
            </p>
          </div>

          {/* Date Range Controls */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Quick Range Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleQuickRange("thisMonth", setSelectedDateRange)
                }
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                This Month
              </button>
              <button
                onClick={() =>
                  handleQuickRange("lastMonth", setSelectedDateRange)
                }
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Last Month
              </button>
              <button
                onClick={() =>
                  handleQuickRange("thisYear", setSelectedDateRange)
                }
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                This Year
              </button>
              <button
                onClick={() =>
                  handleQuickRange("lastYear", setSelectedDateRange)
                }
                className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
              >
                Last Year
              </button>
            </div>

            {/* Manual Date Inputs */}
            <div className="flex gap-2">
              <input
                type="date"
                value={selectedDateRange.startDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setSelectedDateRange((prev) => ({
                    ...prev,
                    startDate: new Date(e.target.value),
                  }))
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500 self-center">to</span>
              <input
                type="date"
                value={selectedDateRange.endDate.toISOString().split("T")[0]}
                onChange={(e) =>
                  setSelectedDateRange((prev) => ({
                    ...prev,
                    endDate: new Date(e.target.value),
                  }))
                }
                className="px-3 py-1 text-xs border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statement Type Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Select Statement Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statementTypes.map((statement) => {
            const Icon = statement.icon;
            return (
              <button
                key={statement.type}
                onClick={() => setActiveStatementType(statement.type)}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  activeStatementType === statement.type
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-8 w-8 mx-auto mb-2" />
                <div className="text-sm font-medium">{statement.label}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {statement.description}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Current Statement */}
      {renderCurrentStatement()}

      {/* Export Buttons */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            Generated:{" "}
            {new Date(financialStatements.generatedAt).toLocaleString()}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 mr-2">Export:</span>
            <button
              onClick={() => handleExport("pdf")}
              className="inline-flex items-center px-3 py-1 text-xs bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <DocumentIcon className="h-3 w-3 mr-1" />
              PDF
            </button>
            <button
              onClick={() => handleExport("excel")}
              className="inline-flex items-center px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              <TableCellsIcon className="h-3 w-3 mr-1" />
              Excel
            </button>
            <button
              onClick={() => handleExport("csv")}
              className="inline-flex items-center px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
              CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <PrinterIcon className="h-3 w-3 mr-1" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatements;
