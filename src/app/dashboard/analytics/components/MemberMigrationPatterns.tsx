"use client";

import React, { useState } from 'react';
import {
  Card,
  Title,
  Text,
  BarChart,
  Subtitle,
  Grid,
  Col,
  Flex,
  AreaChart,
  DonutChart,
  Select,
  SelectItem,
  TabGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels
} from "@tremor/react";

// Mock migration data
const migrationData = [
  {
    quarter: "Q2 2024",
    "Main Campus → East Side": 12,
    "Main Campus → West End": 8,
    "Main Campus → South Chapel": 6,
    "East Side → Main Campus": 5,
    "East Side → West End": 3,
    "East Side → South Chapel": 2,
    "West End → Main Campus": 7,
    "West End → East Side": 2,
    "West End → South Chapel": 1,
    "South Chapel → Main Campus": 4,
    "South Chapel → East Side": 1,
    "South Chapel → West End": 2
  },
  {
    quarter: "Q3 2024",
    "Main Campus → East Side": 15,
    "Main Campus → West End": 10,
    "Main Campus → South Chapel": 8,
    "East Side → Main Campus": 6,
    "East Side → West End": 4,
    "East Side → South Chapel": 3,
    "West End → Main Campus": 8,
    "West End → East Side": 3,
    "West End → South Chapel": 2,
    "South Chapel → Main Campus": 5,
    "South Chapel → East Side": 2,
    "South Chapel → West End": 2
  },
  {
    quarter: "Q4 2024",
    "Main Campus → East Side": 18,
    "Main Campus → West End": 12,
    "Main Campus → South Chapel": 9,
    "East Side → Main Campus": 8,
    "East Side → West End": 5,
    "East Side → South Chapel": 4,
    "West End → Main Campus": 10,
    "West End → East Side": 4,
    "West End → South Chapel": 3,
    "South Chapel → Main Campus": 7,
    "South Chapel → East Side": 3,
    "South Chapel → West End": 3
  },
  {
    quarter: "Q1 2025",
    "Main Campus → East Side": 20,
    "Main Campus → West End": 14,
    "Main Campus → South Chapel": 10,
    "East Side → Main Campus": 9,
    "East Side → West End": 6,
    "East Side → South Chapel": 4,
    "West End → Main Campus": 11,
    "West End → East Side": 5,
    "West End → South Chapel": 3,
    "South Chapel → Main Campus": 8,
    "South Chapel → East Side": 3,
    "South Chapel → West End": 4
  }
];

// Recent migration data for current quarter
const latestMigrationData = [
  { 
    from: "Main Campus", 
    to: "East Side", 
    count: 20,
    reasonCategories: {
      "Relocated/Moved": 12,
      "Preferred Service Style": 5,
      "Closer to Home": 3
    }
  },
  { 
    from: "Main Campus", 
    to: "West End", 
    count: 14,
    reasonCategories: {
      "Relocated/Moved": 8,
      "Preferred Service Style": 4,
      "Closer to Home": 2
    }
  },
  { 
    from: "Main Campus", 
    to: "South Chapel", 
    count: 10,
    reasonCategories: {
      "Relocated/Moved": 6,
      "Preferred Service Style": 2,
      "Closer to Home": 2
    }
  },
  { 
    from: "East Side", 
    to: "Main Campus", 
    count: 9,
    reasonCategories: {
      "Relocated/Moved": 4,
      "Preferred Service Style": 3,
      "Program Offerings": 2
    }
  },
  { 
    from: "East Side", 
    to: "West End", 
    count: 6,
    reasonCategories: {
      "Relocated/Moved": 3,
      "Closer to Home": 3
    }
  },
  { 
    from: "East Side", 
    to: "South Chapel", 
    count: 4,
    reasonCategories: {
      "Relocated/Moved": 2,
      "Closer to Home": 1,
      "Program Offerings": 1
    }
  },
  { 
    from: "West End", 
    to: "Main Campus", 
    count: 11,
    reasonCategories: {
      "Relocated/Moved": 5,
      "Program Offerings": 4,
      "Preferred Service Style": 2
    }
  },
  { 
    from: "West End", 
    to: "East Side", 
    count: 5,
    reasonCategories: {
      "Relocated/Moved": 2,
      "Closer to Home": 3
    }
  },
  { 
    from: "West End", 
    to: "South Chapel", 
    count: 3,
    reasonCategories: {
      "Relocated/Moved": 2,
      "Preferred Service Style": 1
    }
  },
  { 
    from: "South Chapel", 
    to: "Main Campus", 
    count: 8,
    reasonCategories: {
      "Program Offerings": 4,
      "Preferred Service Style": 3,
      "Relocated/Moved": 1
    }
  },
  { 
    from: "South Chapel", 
    to: "East Side", 
    count: 3,
    reasonCategories: {
      "Relocated/Moved": 2,
      "Preferred Service Style": 1
    }
  },
  { 
    from: "South Chapel", 
    to: "West End", 
    count: 4,
    reasonCategories: {
      "Relocated/Moved": 2,
      "Closer to Home": 1,
      "Program Offerings": 1
    }
  }
];

// Migration reasons summary
const migrationReasonsSummary = [
  { reason: "Relocated/Moved", count: 49 },
  { reason: "Closer to Home", count: 15 },
  { reason: "Preferred Service Style", count: 21 },
  { reason: "Program Offerings", count: 12 }
];

// Branch names for selection
const branches = [
  { value: "all", name: "All Branches" },
  { value: "Main Campus", name: "Main Campus" },
  { value: "East Side", name: "East Side" },
  { value: "West End", name: "West End" },
  { value: "South Chapel", name: "South Chapel" }
];

// Helper function to format data for detailed branch view
const formatBranchMigrationData = (selectedBranch) => {
  if (selectedBranch === "all") {
    return latestMigrationData;
  }
  
  return latestMigrationData.filter(item => 
    item.from === selectedBranch || item.to === selectedBranch
  );
};

// Format net migration data
const calculateNetMigration = () => {
  const netMigration = {
    "Main Campus": 0,
    "East Side": 0,
    "West End": 0,
    "South Chapel": 0
  };
  
  latestMigrationData.forEach(migration => {
    netMigration[migration.from] -= migration.count;
    netMigration[migration.to] += migration.count;
  });
  
  return Object.entries(netMigration).map(([branch, value]) => ({
    branch,
    "Net Migration": value
  }));
};

export default function MemberMigrationPatterns() {
  const [selectedBranch, setSelectedBranch] = useState("all");
  const [selectedFromBranch, setSelectedFromBranch] = useState("Main Campus");
  
  // Get filtered data for selected branch
  const branchMigrationData = formatBranchMigrationData(selectedBranch);
  
  // Get migration reasons for selected origin branch
  const selectedBranchReasons = latestMigrationData
    .filter(item => item.from === selectedFromBranch)
    .reduce((acc, item) => {
      Object.entries(item.reasonCategories).forEach(([reason, count]) => {
        acc[reason] = (acc[reason] || 0) + count;
      });
      return acc;
    }, {});
    
  const reasonsChartData = Object.entries(selectedBranchReasons).map(([reason, count]) => ({
    reason,
    count
  }));
  
  return (
    <Card>
      <TabGroup>
        <div className="flex justify-between items-center">
          <div>
            <Title>Member Migration Patterns</Title>
            <Subtitle>
              Track and analyze member movement between branches
            </Subtitle>
          </div>
          <TabList variant="solid">
            <Tab>Trends</Tab>
            <Tab>Current Quarter</Tab>
            <Tab>Analysis</Tab>
          </TabList>
        </div>
        
        <TabPanels>
          {/* Historical Trends Tab */}
          <TabPanel>
            <Card className="mt-6">
              <Title>Quarterly Migration Trends</Title>
              <AreaChart
                className="mt-4 h-96"
                data={migrationData}
                index="quarter"
                categories={[
                  "Main Campus → East Side",
                  "Main Campus → West End",
                  "Main Campus → South Chapel",
                  "East Side → Main Campus",
                  "West End → Main Campus",
                  "South Chapel → Main Campus"
                ]}
                colors={["blue", "cyan", "indigo", "emerald", "amber", "rose"]}
                valueFormatter={(value) => `${value} members`}
                showLegend={true}
                showYAxis={true}
                showXAxis={true}
                showGridLines={true}
                startEndOnly={false}
                showAnimation={true}
                showTooltip={true}
              />
            </Card>
            
            <Card className="mt-6">
              <Title>Net Migration Impact by Branch</Title>
              <BarChart
                className="mt-4 h-72"
                data={calculateNetMigration()}
                index="branch"
                categories={["Net Migration"]}
                colors={["indigo"]}
                valueFormatter={(value) => `${value > 0 ? '+' : ''}${value} members`}
                showLegend={false}
                showAnimation={true}
              />
              <Text className="text-xs text-gray-500 mt-2">
                Positive values indicate net gain; negative values indicate net loss
              </Text>
            </Card>
          </TabPanel>
          
          {/* Current Quarter Details Tab */}
          <TabPanel>
            <Flex justifyContent="start" className="mt-6 mb-4">
              <Text>Filter by branch:</Text>
              <div className="max-w-xs ml-4">
                <Select 
                  value={selectedBranch} 
                  onValueChange={setSelectedBranch}
                >
                  {branches.map((branch) => (
                    <SelectItem key={branch.value} value={branch.value}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </Flex>
            
            <Card className="overflow-auto">
              <Title>Current Quarter Migration Details</Title>
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      From
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Member Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primary Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {branchMigrationData.map((migration, index) => {
                    // Find primary reason
                    const reasons = Object.entries(migration.reasonCategories);
                    const primaryReason = reasons.reduce((max, current) => 
                      current[1] > max[1] ? current : max, reasons[0]);
                    
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {migration.from}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {migration.to}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {migration.count}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {primaryReason[0]} ({primaryReason[1]})
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Card>
          </TabPanel>
          
          {/* Analysis Tab */}
          <TabPanel>
            <Grid numItems={1} numItemsLg={2} className="gap-6 mt-6">
              <Col>
                <Card>
                  <Title>Migration Reasons Overview</Title>
                  <DonutChart
                    className="mt-4 h-60"
                    data={migrationReasonsSummary}
                    category="count"
                    index="reason"
                    colors={["blue", "cyan", "indigo", "violet"]}
                    valueFormatter={(value) => `${value} members`}
                    showAnimation={true}
                  />
                </Card>
              </Col>
              
              <Col>
                <Card>
                  <Flex justifyContent="start" className="mb-4">
                    <Title>Reason for Leaving</Title>
                    <div className="max-w-xs ml-4">
                      <Select 
                        value={selectedFromBranch} 
                        onValueChange={setSelectedFromBranch}
                      >
                        {branches.slice(1).map((branch) => (
                          <SelectItem key={branch.value} value={branch.value}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </Flex>
                  <BarChart
                    className="mt-4 h-60"
                    data={reasonsChartData}
                    index="reason"
                    categories={["count"]}
                    colors={["indigo"]}
                    valueFormatter={(value) => `${value} members`}
                    showLegend={false}
                  />
                </Card>
              </Col>
            </Grid>
            
            <Card className="mt-6">
              <Title>Key Insights</Title>
              <div className="mt-4 space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                  <Text className="font-medium">Primary Migration Factor</Text>
                  <Text className="text-sm text-gray-600">
                    Relocation/moving is the dominant reason for branch changes, accounting for 
                    {' '}{Math.round((migrationReasonsSummary.find(r => r.reason === "Relocated/Moved").count / 
                    migrationReasonsSummary.reduce((sum, item) => sum + item.count, 0)) * 100)}% of all migrations.
                  </Text>
                </div>
                
                <div className="bg-green-50 p-4 rounded-md">
                  <Text className="font-medium">Service Style Preference</Text>
                  <Text className="text-sm text-gray-600">
                    Members moving to Main Campus often cite program offerings and service style preferences as key motivators, 
                    suggesting stronger central programs may help with retention at smaller branches.
                  </Text>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-md">
                  <Text className="font-medium">Geographic Distribution</Text>
                  <Text className="text-sm text-gray-600">
                    The "Closer to Home" factor represents {Math.round((migrationReasonsSummary.find(r => r.reason === "Closer to Home").count / 
                    migrationReasonsSummary.reduce((sum, item) => sum + item.count, 0)) * 100)}% of migrations, 
                    suggesting that establishing more locations in growing residential areas could benefit membership retention.
                  </Text>
                </div>
              </div>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
