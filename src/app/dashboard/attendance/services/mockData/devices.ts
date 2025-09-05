// Mock device data for card scanning system
import { CardDevice } from "../../types";

export const mockDevices: CardDevice[] = [
  {
    id: "device_001",
    name: "Main Entrance Scanner",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    assignedEventId: "event_001", // Sunday Service
    deviceType: "wall-mounted",
    ipAddress: "192.168.1.101",
    firmwareVersion: "2.1.0",
    batteryLevel: 100, // Plugged in
  },
  {
    id: "device_002",
    name: "Side Entrance Scanner",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    assignedEventId: "event_001", // Sunday Service
    deviceType: "wall-mounted",
    ipAddress: "192.168.1.102",
    firmwareVersion: "2.1.0",
    batteryLevel: 100, // Plugged in
  },
  {
    id: "device_003",
    name: "Children's Area Kiosk",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    assignedEventId: "event_001", // Sunday Service
    deviceType: "kiosk",
    ipAddress: "192.168.1.103",
    firmwareVersion: "2.1.0",
    batteryLevel: 100, // Plugged in
  },
  {
    id: "device_004",
    name: "Fellowship Hall Scanner",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "offline",
    lastConnected: new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    deviceType: "wall-mounted",
    ipAddress: "192.168.1.104",
    firmwareVersion: "2.0.5",
    batteryLevel: 0, // Needs attention
  },
  {
    id: "device_005",
    name: "Admin Office Scanner",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    deviceType: "admin",
    ipAddress: "192.168.1.105",
    firmwareVersion: "2.1.0",
    batteryLevel: 100,
  },
  {
    id: "device_006",
    name: "Youth Room Scanner",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "maintenance",
    lastConnected: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    deviceType: "wall-mounted",
    ipAddress: "192.168.1.106",
    firmwareVersion: "2.0.5",
    batteryLevel: 80,
  },
  {
    id: "device_007",
    name: "Main Entrance Scanner",
    locationId: "loc_002",
    branchId: "branch_002",
    status: "online",
    lastConnected: new Date(),
    assignedEventId: "event_005", // Branch 2 Sunday Service
    deviceType: "wall-mounted",
    ipAddress: "192.168.2.101",
    firmwareVersion: "2.1.0",
    batteryLevel: 100,
  },
  {
    id: "device_008",
    name: "Mobile Scanner 1",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    deviceType: "mobile",
    firmwareVersion: "2.1.0",
    batteryLevel: 85,
  },
  {
    id: "device_009",
    name: "Special Events Kiosk",
    locationId: "loc_001",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    deviceType: "kiosk",
    ipAddress: "192.168.1.107",
    firmwareVersion: "2.1.0",
    batteryLevel: 100,
  },
  {
    id: "device_010",
    name: "Small Group Scanner",
    locationId: "loc_003",
    branchId: "branch_001",
    status: "online",
    lastConnected: new Date(),
    assignedEventId: "event_003", // Bible Study
    deviceType: "mobile",
    firmwareVersion: "2.1.0",
    batteryLevel: 72,
  },
];
