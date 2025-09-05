"use client";

import React, { useState } from "react";
import {
  Card,
  Title,
  Text,
  BarChart,
  DonutChart,
  TabGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Select,
  SelectItem,
  Grid,
  Flex,
  Subtitle,
  Legend,
  Color,
} from "@tremor/react";

// Mock ministry data
const ministryData = [
  {
    name: "Worship Team",
    mainCampus: 45,
    eastSide: 18,
    westEnd: 15,
    southChapel: 12,
    participationRate: 2.1,
    growthRate: 8.5,
  },
  {
    name: "Children's Ministry",
    mainCampus: 72,
    eastSide: 35,
    westEnd: 28,
    southChapel: 24,
    participationRate: 3.7,
    growthRate: 12.3,
  },
  {
    name: "Youth Group",
    mainCampus: 68,
    eastSide: 32,
    westEnd: 25,
    southChapel: 22,
    participationRate: 3.4,
    growthRate: 6.8,
  },
  {
    name: "Adult Bible Study",
    mainCampus: 120,
    eastSide: 58,
    westEnd: 45,
    southChapel: 38,
    participationRate: 6.1,
    growthRate: 3.2,
  },
  {
    name: "Outreach & Missions",
    mainCampus: 85,
    eastSide: 42,
    westEnd: 30,
    southChapel: 25,
    participationRate: 4.2,
    growthRate: 15.7,
  },
  {
    name: "Prayer Team",
    mainCampus: 52,
    eastSide: 24,
    westEnd: 18,
    southChapel: 15,
    participationRate: 2.5,
    growthRate: 7.2,
  },
  {
    name: "Hospitality",
    mainCampus: 65,
    eastSide: 32,
    westEnd: 27,
    southChapel: 22,
    participationRate: 3.4,
    growthRate: 9.5,
  },
  {
    name: "Seniors Group",
    mainCampus: 42,
    eastSide: 18,
    westEnd: 15,
    southChapel: 10,
    participationRate: 2.0,
    growthRate: 1.8,
  },
];

// Branches for selection
const branches = [
  { value: "all", name: "All Branches" },
  { value: "mainCampus", name: "Main Campus" },
  { value: "eastSide", name: "East Side" },
  { value: "westEnd", name: "West End" },
  { value: "southChapel", name: "South Chapel" },
];

// Format data for cross-branch comparison
const formatEngagementByMinistry = () => {
  return ministryData.map((ministry) => ({
    ministry: ministry.name,
    "Main Campus": ministry.mainCampus,
    "East Side": ministry.eastSide,
    "West End": ministry.westEnd,
    "South Chapel": ministry.southChapel,
  }));
};

// Format data for ministry participation rate
const formatParticipationRate = () => {
  return ministryData.map((ministry) => ({
    ministry: ministry.name,
    "Participation Rate": ministry.participationRate,
    "Growth Rate": ministry.growthRate,
  }));
};

// Format total engagement by branch
const formatEngagementByBranch = () => {
  const branchTotals = ministryData.reduce((acc, ministry) => {
    return {
      "Main Campus": (acc["Main Campus"] || 0) + ministry.mainCampus,
      "East Side": (acc["East Side"] || 0) + ministry.eastSide,
      "West End": (acc["West End"] || 0) + ministry.westEnd,
      "South Chapel": (acc["South Chapel"] || 0) + ministry.southChapel,
    };
  }, {});

  return Object.entries(branchTotals).map(([branch, value]) => ({
    branch,
    value,
  }));
};

export default function MinistryEngagementTracker() {
  const [selectedBranch, setSelectedBranch] = useState("all");

  return (
    <Card>
      <TabGroup>
        <div className="flex justify-between items-center">
          <div>
            <Title>Ministry Engagement Analytics</Title>
            <Subtitle>
              Track participation across ministries and branches
            </Subtitle>
          </div>
          <TabList variant="solid">
            <Tab>Cross-Branch</Tab>
            <Tab>Ministry Details</Tab>
            <Tab>Performance</Tab>
          </TabList>
        </div>

        <TabPanels>
          {/* Cross-Branch Comparison Tab */}
          <TabPanel>
            <Flex justifyContent="start" className="mt-4 mb-2">
              <Text>View ministries across all branches</Text>
            </Flex>
            <Card>
              <Title>Volunteer Participation by Ministry and Branch</Title>
              <BarChart
                className="mt-4 h-96"
                data={formatEngagementByMinistry()}
                index="ministry"
                categories={[
                  "Main Campus",
                  "East Side",
                  "West End",
                  "South Chapel",
                ]}
                colors={["indigo", "emerald", "amber", "rose"]}
                valueFormatter={(value) => `${value} volunteers`}
                stack={true}
                yAxisWidth={60}
                showLegend={true}
              />
            </Card>
            <div className="mt-6">
              <Card>
                <Title>Total Ministry Volunteers by Branch</Title>
                <DonutChart
                  className="mt-4 h-80"
                  data={formatEngagementByBranch()}
                  category="value"
                  index="branch"
                  colors={["indigo", "emerald", "amber", "rose"]}
                  valueFormatter={(value) => `${value} volunteers`}
                  showLabel={true}
                  showAnimation={true}
                  showTooltip={true}
                  label="Total Volunteers"
                />
              </Card>
            </div>
          </TabPanel>

          {/* Ministry Details Tab */}
          <TabPanel>
            <Flex justifyContent="start" className="mt-4 mb-2">
              <Text>Select branch:</Text>
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
            <Grid numItems={1} className="gap-6">
              <Card className="overflow-auto">
                <Title>Ministry Participation Details</Title>
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ministry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {selectedBranch === "all"
                          ? "All Branches"
                          : branches.find((b) => b.value === selectedBranch)
                              ?.name}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Participation %
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Growth (YoY)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ministryData.map((ministry, index) => {
                      let total = 0;
                      if (selectedBranch === "all") {
                        total =
                          ministry.mainCampus +
                          ministry.eastSide +
                          ministry.westEnd +
                          ministry.southChapel;
                      } else if (selectedBranch === "mainCampus") {
                        total = ministry.mainCampus;
                      } else if (selectedBranch === "eastSide") {
                        total = ministry.eastSide;
                      } else if (selectedBranch === "westEnd") {
                        total = ministry.westEnd;
                      } else if (selectedBranch === "southChapel") {
                        total = ministry.southChapel;
                      }

                      return (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {ministry.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {total} volunteers
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ministry.participationRate.toFixed(1)}%
                          </td>
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${ministry.growthRate > 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {ministry.growthRate > 0 ? "+" : ""}
                            {ministry.growthRate.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
            </Grid>
          </TabPanel>

          {/* Performance Tab */}
          <TabPanel>
            <Card className="mt-4">
              <Title>Ministry Growth and Participation Performance</Title>
              <BarChart
                className="mt-4 h-80"
                data={formatParticipationRate()}
                index="ministry"
                categories={["Participation Rate", "Growth Rate"]}
                colors={["blue", "green"]}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                yAxisWidth={60}
                showLegend={true}
              />
              <Text className="text-xs text-gray-500 mt-4">
                Participation Rate = % of total church membership involved in
                the ministry
              </Text>
              <Text className="text-xs text-gray-500">
                Growth Rate = Year-over-year volunteer increase
              </Text>
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
