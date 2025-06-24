"use client";

import React, { useState } from 'react';
import {
  Card,
  Title,
  Text,
  BarChart,
  Subtitle,
  Flex,
  TabGroup,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Select,
  SelectItem,
  Grid
} from "@tremor/react";

// Mock branch performance data
const branchPerformanceData = [
  {
    branchName: "Main Campus",
    attendance: 1250,
    attendanceGrowth: 5.2,
    giving: 78500,
    givingGrowth: 7.8,
    volunteerRate: 18.5,
    discipleship: 65.2,
    firstTimeVisitors: 45,
    retention: 92.5,
    benchmark: 100
  },
  {
    branchName: "East Side",
    attendance: 520,
    attendanceGrowth: 8.3,
    giving: 35750,
    givingGrowth: 12.4,
    volunteerRate: 22.0,
    discipleship: 71.5,
    firstTimeVisitors: 28,
    retention: 88.7,
    benchmark: 100
  },
  {
    branchName: "West End",
    attendance: 430,
    attendanceGrowth: 3.5,
    giving: 28900,
    givingGrowth: 4.2,
    volunteerRate: 15.8,
    discipleship: 58.3,
    firstTimeVisitors: 18,
    retention: 86.2,
    benchmark: 100
  },
  {
    branchName: "South Chapel",
    attendance: 305,
    attendanceGrowth: 12.6,
    giving: 21300,
    givingGrowth: 15.3,
    volunteerRate: 25.5,
    discipleship: 75.8,
    firstTimeVisitors: 22,
    retention: 91.3,
    benchmark: 100
  }
];

// Prepare data for percentage comparisons (normalized to Main Campus as 100%)
const getComparisonData = (metricKey) => {
  const mainCampusValue = branchPerformanceData.find(b => b.branchName === "Main Campus")[metricKey];
  
  return branchPerformanceData.map(branch => ({
    branchName: branch.branchName,
    [metricKey]: branch[metricKey],
    percentageOfMainCampus: (branch[metricKey] / mainCampusValue) * 100
  }));
};

// Prepare data for growth metrics
const getGrowthComparisonData = () => {
  return branchPerformanceData.map(branch => ({
    branchName: branch.branchName,
    "Attendance Growth": branch.attendanceGrowth,
    "Giving Growth": branch.givingGrowth
  }));
};

// Prepare data for KPI metrics
const getKpiComparisonData = () => {
  return branchPerformanceData.map(branch => ({
    branchName: branch.branchName,
    "Volunteer Rate": branch.volunteerRate,
    "Retention Rate": branch.retention,
    "Discipleship Engagement": branch.discipleship,
  }));
};

// Metrics definitions for select dropdown
const metrics = [
  { value: "attendance", name: "Attendance" },
  { value: "giving", name: "Total Giving" },
  { value: "volunteerRate", name: "Volunteer Rate" },
  { value: "firstTimeVisitors", name: "First-time Visitors" },
  { value: "retention", name: "Member Retention" }
];

export default function BranchPerformanceComparison() {
  const [selectedMetric, setSelectedMetric] = useState("attendance");
  
  // Get the appropriate data based on selected metric
  const comparisonData = getComparisonData(selectedMetric);
  
  // Custom formatter for metrics
  const valueFormatter = (value) => {
    switch (selectedMetric) {
      case "attendance":
        return `${value.toLocaleString()} people`;
      case "giving":
        return `$${value.toLocaleString()}`;
      case "volunteerRate":
      case "retention":
        return `${value.toFixed(1)}%`;
      case "firstTimeVisitors":
        return `${value} visitors`;
      default:
        return value.toString();
    }
  };

  return (
    <Card>
      <TabGroup>
        <div className="flex justify-between items-center">
          <div>
            <Title>Branch Performance Metrics</Title>
            <Subtitle>
              Compare key metrics across all branches
            </Subtitle>
          </div>
          <TabList variant="solid" defaultValue="1">
            <Tab value="1">Single Metric</Tab>
            <Tab value="2">Growth</Tab>
            <Tab value="3">Key Indicators</Tab>
          </TabList>
        </div>
        
        <TabPanels>
          {/* Single Metric Comparison Tab */}
          <TabPanel>
            <div className="mt-6">
              <Flex justifyContent="start" className="mb-4">
                <Text>Select metric for comparison:</Text>
                <div className="max-w-xs ml-4">
                  <Select 
                    value={selectedMetric} 
                    onValueChange={setSelectedMetric}
                  >
                    {metrics.map((metric) => (
                      <SelectItem key={metric.value} value={metric.value}>
                        {metric.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </Flex>
              
              <Grid numItems={1} className="gap-6 mt-6">
                <Card>
                  <Title>Raw Values</Title>
                  <BarChart
                    className="mt-4 h-60"
                    data={comparisonData}
                    index="branchName"
                    categories={[selectedMetric]}
                    colors={["indigo"]}
                    valueFormatter={valueFormatter}
                    yAxisWidth={80}
                    showLegend={false}
                  />
                </Card>
                
                <Card>
                  <Title>% of Main Campus (Benchmark)</Title>
                  <BarChart
                    className="mt-4 h-60"
                    data={comparisonData}
                    index="branchName"
                    categories={["percentageOfMainCampus"]}
                    colors={["emerald"]}
                    valueFormatter={(value) => `${value.toFixed(1)}%`}
                    yAxisWidth={60}
                    showLegend={false}
                  />
                </Card>
              </Grid>
            </div>
          </TabPanel>
          
          {/* Growth Comparison Tab */}
          <TabPanel>
            <Card className="mt-6">
              <Title>Year-over-Year Growth Comparison</Title>
              <BarChart
                className="mt-4 h-80"
                data={getGrowthComparisonData()}
                index="branchName"
                categories={["Attendance Growth", "Giving Growth"]}
                colors={["blue", "green"]}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                yAxisWidth={60}
                showLegend={true}
              />
            </Card>
          </TabPanel>
          
          {/* Key Performance Indicators Tab */}
          <TabPanel>
            <Card className="mt-6">
              <Title>Key Performance Indicators</Title>
              <BarChart
                className="mt-4 h-80"
                data={getKpiComparisonData()}
                index="branchName"
                categories={["Volunteer Rate", "Retention Rate", "Discipleship Engagement"]}
                colors={["amber", "indigo", "rose"]}
                valueFormatter={(value) => `${value.toFixed(1)}%`}
                yAxisWidth={60}
                showLegend={true}
                stack={false}
              />
            </Card>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
