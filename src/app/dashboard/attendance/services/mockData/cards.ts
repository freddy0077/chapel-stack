// Mock card data for demo purposes
import { MemberCard } from "../../types";

export const mockCards: MemberCard[] = [
  {
    id: "card_001",
    memberId: "mem_001",
    cardNumber: "RFID1234567",
    issueDate: new Date("2024-01-15"),
    status: "active",
    lastUsed: new Date("2025-04-06"), // Last Sunday
    cardType: "rfid",
    assignedBy: "admin_001",
  },
  {
    id: "card_002",
    memberId: "mem_002",
    cardNumber: "RFID1234568",
    issueDate: new Date("2024-01-15"),
    status: "active",
    lastUsed: new Date("2025-04-06"), // Last Sunday
    cardType: "rfid",
    assignedBy: "admin_001",
  },
  {
    id: "card_003",
    memberId: "mem_004",
    cardNumber: "RFID1234569",
    issueDate: new Date("2024-01-20"),
    status: "active",
    lastUsed: new Date("2025-04-06"), // Last Sunday
    cardType: "rfid",
    assignedBy: "admin_001",
  },
  {
    id: "card_004",
    memberId: "mem_005",
    cardNumber: "RFID1234570",
    issueDate: new Date("2024-01-20"),
    status: "active",
    lastUsed: new Date("2025-04-06"), // Last Sunday
    cardType: "rfid",
    assignedBy: "admin_001",
  },
  {
    id: "card_005",
    memberId: "mem_006",
    cardNumber: "RFID1234571",
    issueDate: new Date("2024-01-25"),
    status: "active",
    lastUsed: new Date("2025-03-23"), // Last attendance
    cardType: "rfid",
    assignedBy: "admin_001",
  },
  {
    id: "card_006",
    memberId: "mem_007",
    cardNumber: "NFC0987654",
    issueDate: new Date("2024-02-15"),
    status: "active",
    lastUsed: new Date("2025-04-06"), // Last Sunday
    cardType: "nfc",
    assignedBy: "admin_002",
    notes: "Member preferred NFC card for phone compatibility",
  },
  {
    id: "card_007",
    memberId: "mem_009",
    cardNumber: "RFID1234572",
    issueDate: new Date("2023-06-01"),
    status: "inactive",
    lastUsed: new Date("2024-12-25"), // Christmas - not used since
    cardType: "rfid",
    assignedBy: "admin_001",
  },
  {
    id: "card_008",
    memberId: "mem_010",
    cardNumber: "NFC0987655",
    issueDate: new Date("2022-11-25"),
    status: "active",
    lastUsed: new Date("2025-04-06"), // Last Sunday
    cardType: "nfc",
    assignedBy: "admin_002",
  },
  {
    id: "card_009",
    memberId: "mem_001",
    cardNumber: "RFID1234573",
    issueDate: new Date("2023-05-10"),
    status: "lost",
    lastUsed: new Date("2023-11-12"),
    cardType: "rfid",
    assignedBy: "admin_001",
    notes: "Reported lost on 2023-11-15, replaced with card_001",
  },
  {
    id: "card_010",
    memberId: "mem_003",
    cardNumber: "QR3456789",
    issueDate: new Date("2024-03-01"),
    status: "inactive",
    cardType: "qr",
    assignedBy: "admin_001",
    notes:
      "Temporary QR code issued but not currently used - child uses family check-in",
  },
];
