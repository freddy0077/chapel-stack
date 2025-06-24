// Define message template type
export type MessageTemplate = {
  id: string;
  name: string;
  subject: string;
  content: string;
};

// Define file attachment type
export type FileAttachment = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
};

// Define message history type
export type MessageHistory = {
  id: string;
  date: string;
  subject: string;
  content: string;
  type: "email" | "sms";
  status: "sent" | "delivered" | "read" | "failed";
};

// Define recipient type
export type Recipient = {
  id: string;
  name: string;
  email: string;
  phone?: string;
};

export type MessageTab = "compose" | "templates" | "history" | "preview";
export type MessageType = "email" | "sms";
export type TextFormat = "bold" | "italic" | "bullet";
export type RecipientType = "to" | "cc" | "bcc";
