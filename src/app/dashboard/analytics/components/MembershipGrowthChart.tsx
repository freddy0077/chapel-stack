"use client";

import React from 'react';
import {
  Card,
  Title,
  LineChart,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@tremor/react";

// Chart data for total membership
const membershipData = [
  {
    date: "Jan 2024",
    "Main Campus": 3820,
    "East Side": 1240,
    "West End": 950,
    "South Chapel": 685,
  },
  {
    date: "Feb 2024",
    "Main Campus": 3845,
    "East Side": 1256,
    "West End": 965,
    "South Chapel": 692,
  },
  {
    date: "Mar 2024",
    "Main Campus": 3870,
    "East Side": 1275,
    "West End": 978,
    "South Chapel": 701,
  },
  {
    date: "Apr 2024",
    "Main Campus": 3905,
    "East Side": 1302,
    "West End": 985,
    "South Chapel": 710,
  },
  {
    date: "May 2024",
    "Main Campus": 3925,
    "East Side": 1320,
    "West End": 1005,
    "South Chapel": 718,
  },
  {
    date: "Jun 2024",
    "Main Campus": 3960,
    "East Side": 1340,
    "West End": 1015,
    "South Chapel": 722,
  },
  {
    date: "Jul 2024",
    "Main Campus": 3990,
    "East Side": 1355,
    "West End": 1025,
    "South Chapel": 730,
  },
  {
    date: "Aug 2024",
    "Main Campus": 4025,
    "East Side": 1380,
    "West End": 1040,
    "South Chapel": 738,
  },
  {
    date: "Sep 2024",
    "Main Campus": 4050,
    "East Side": 1402,
    "West End": 1055,
    "South Chapel": 745,
  },
  {
    date: "Oct 2024",
    "Main Campus": 4085,
    "East Side": 1420,
    "West End": 1070,
    "South Chapel": 752,
  },
  {
    date: "Nov 2024",
    "Main Campus": 4105,
    "East Side": 1435,
    "West End": 1080,
    "South Chapel": 758,
  },
  {
    date: "Dec 2024",
    "Main Campus": 4130,
    "East Side": 1450,
    "West End": 1095,
    "South Chapel": 765,
  },
  {
    date: "Jan 2025",
    "Main Campus": 4160,
    "East Side": 1475,
    "West End": 1110,
    "South Chapel": 772,
  },
  {
    date: "Feb 2025",
    "Main Campus": 4180,
    "East Side": 1495,
    "West End": 1120,
    "South Chapel": 780,
  },
  {
    date: "Mar 2025",
    "Main Campus": 4210,
    "East Side": 1515,
    "West End": 1135,
    "South Chapel": 788,
  },
  {
    date: "Apr 2025",
    "Main Campus": 4235,
    "East Side": 1535,
    "West End": 1150,
    "South Chapel": 795,
  },
];

// Chart data for new members (growth)
const newMembersData = [
  {
    date: "Jan 2024",
    "Main Campus": 25,
    "East Side": 15,
    "West End": 12,
    "South Chapel": 8,
  },
  {
    date: "Feb 2024",
    "Main Campus": 28,
    "East Side": 16,
    "West End": 15,
    "South Chapel": 7,
  },
  {
    date: "Mar 2024",
    "Main Campus": 32,
    "East Side": 19,
    "West End": 13,
    "South Chapel": 9,
  },
  {
    date: "Apr 2024",
    "Main Campus": 35,
    "East Side": 27,
    "West End": 7,
    "South Chapel": 9,
  },
  {
    date: "May 2024",
    "Main Campus": 20,
    "East Side": 18,
    "West End": 20,
    "South Chapel": 8,
  },
  {
    date: "Jun 2024",
    "Main Campus": 35,
    "East Side": 20,
    "West End": 10,
    "South Chapel": 4,
  },
  {
    date: "Jul 2024",
    "Main Campus": 30,
    "East Side": 15,
    "West End": 10,
    "South Chapel": 8,
  },
  {
    date: "Aug 2024",
    "Main Campus": 35,
    "East Side": 25,
    "West End": 15,
    "South Chapel": 8,
  },
  {
    date: "Sep 2024",
    "Main Campus": 25,
    "East Side": 22,
    "West End": 15,
    "South Chapel": 7,
  },
  {
    date: "Oct 2024",
    "Main Campus": 35,
    "East Side": 18,
    "West End": 15,
    "South Chapel": 7,
  },
  {
    date: "Nov 2024",
    "Main Campus": 20,
    "East Side": 15,
    "West End": 10,
    "South Chapel": 6,
  },
  {
    date: "Dec 2024",
    "Main Campus": 25,
    "East Side": 15,
    "West End": 15,
    "South Chapel": 7,
  },
  {
    date: "Jan 2025",
    "Main Campus": 30,
    "East Side": 25,
    "West End": 15,
    "South Chapel": 7,
  },
  {
    date: "Feb 2025",
    "Main Campus": 20,
    "East Side": 20,
    "West End": 10,
    "South Chapel": 8,
  },
  {
    date: "Mar 2025",
    "Main Campus": 30,
    "East Side": 20,
    "West End": 15,
    "South Chapel": 8,
  },
  {
    date: "Apr 2025",
    "Main Campus": 25,
    "East Side": 20,
    "West End": 15,
    "South Chapel": 7,
  },
];

// Chart data for retention rate
const retentionData = [
  {
    date: "Jan 2024",
    "Main Campus": 95.2,
    "East Side": 93.8,
    "West End": 92.5,
    "South Chapel": 94.0,
  },
  {
    date: "Feb 2024",
    "Main Campus": 95.5,
    "East Side": 93.5,
    "West End": 92.8,
    "South Chapel": 94.2,
  },
  {
    date: "Mar 2024",
    "Main Campus": 95.0,
    "East Side": 94.0,
    "West End": 93.0,
    "South Chapel": 94.5,
  },
  {
    date: "Apr 2024",
    "Main Campus": 95.2,
    "East Side": 94.5,
    "West End": 92.5,
    "South Chapel": 94.8,
  },
  {
    date: "May 2024",
    "Main Campus": 95.5,
    "East Side": 94.8,
    "West End": 93.2,
    "South Chapel": 95.0,
  },
  {
    date: "Jun 2024",
    "Main Campus": 95.8,
    "East Side": 95.0,
    "West End": 93.5,
    "South Chapel": 95.3,
  },
  {
    date: "Jul 2024",
    "Main Campus": 96.0,
    "East Side": 94.8,
    "West End": 93.8,
    "South Chapel": 95.5,
  },
  {
    date: "Aug 2024",
    "Main Campus": 96.2,
    "East Side": 95.2,
    "West End": 94.0,
    "South Chapel": 95.5,
  },
  {
    date: "Sep 2024",
    "Main Campus": 96.0,
    "East Side": 95.0,
    "West End": 94.3,
    "South Chapel": 95.2,
  },
  {
    date: "Oct 2024",
    "Main Campus": 95.8,
    "East Side": 95.3,
    "West End": 94.5,
    "South Chapel": 95.0,
  },
  {
    date: "Nov 2024",
    "Main Campus": 95.5,
    "East Side": 95.5,
    "West End": 94.8,
    "South Chapel": 94.8,
  },
  {
    date: "Dec 2024",
    "Main Campus": 95.8,
    "East Side": 95.8,
    "West End": 95.0,
    "South Chapel": 95.0,
  },
  {
    date: "Jan 2025",
    "Main Campus": 96.0,
    "East Side": 96.0,
    "West End": 95.2,
    "South Chapel": 95.2,
  },
  {
    date: "Feb 2025",
    "Main Campus": 96.2,
    "East Side": 96.2,
    "West End": 95.5,
    "South Chapel": 95.5,
  },
  {
    date: "Mar 2025",
    "Main Campus": 96.5,
    "East Side": 96.0,
    "West End": 95.8,
    "South Chapel": 95.8,
  },
  {
    date: "Apr 2025",
    "Main Campus": 96.8,
    "East Side": 96.2,
    "West End": 96.0,
    "South Chapel": 96.0,
  },
];

// Chart colors for branches
const chartColors = {
  "Main Campus": "indigo",
  "East Side": "emerald",
  "West End": "amber",
  "South Chapel": "rose",
};

export default function MembershipGrowthChart() {
  return (
    <Card>
      <TabGroup>
        <div className="flex justify-between items-center">
          <Title>Membership Growth Trends</Title>
          <TabList variant="solid">
            <Tab>Total Members</Tab>
            <Tab>New Members</Tab>
            <Tab>Retention Rate</Tab>
          </TabList>
        </div>
        <TabPanels>
          <TabPanel>
            <LineChart
              className="mt-6 h-80"
              data={membershipData}
              index="date"
              categories={["Main Campus", "East Side", "West End", "South Chapel"]}
              colors={["indigo", "emerald", "amber", "rose"]}
              valueFormatter={(number) => `${number.toLocaleString()} members`}
              yAxisWidth={60}
              showLegend={true}
            />
          </TabPanel>
          <TabPanel>
            <LineChart
              className="mt-6 h-80"
              data={newMembersData}
              index="date"
              categories={["Main Campus", "East Side", "West End", "South Chapel"]}
              colors={["indigo", "emerald", "amber", "rose"]}
              valueFormatter={(number) => `${number.toLocaleString()} new members`}
              yAxisWidth={60}
              showLegend={true}
            />
          </TabPanel>
          <TabPanel>
            <LineChart
              className="mt-6 h-80"
              data={retentionData}
              index="date"
              categories={["Main Campus", "East Side", "West End", "South Chapel"]}
              colors={["indigo", "emerald", "amber", "rose"]}
              valueFormatter={(number) => `${number.toFixed(1)}%`}
              yAxisWidth={60}
              showLegend={true}
            />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </Card>
  );
}
