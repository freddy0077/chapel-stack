export enum MinistryType {
  WORSHIP = "WORSHIP",
  OUTREACH = "OUTREACH",
  EDUCATION = "EDUCATION",
  PRAYER = "PRAYER",
  YOUTH = "YOUTH",
  CHILDREN = "CHILDREN",
  MISSIONS = "MISSIONS",
  ADMINISTRATION = "ADMINISTRATION",
  OTHER = "OTHER",
}

export interface MinistryMember {
  id: string;
  memberId: string;
  role: string;
  status: string;
}

export interface Ministry {
  id: string;
  name: string;
  type?: MinistryType;
  status?: string;
  branchId?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
  members?: MinistryMember[];
  subMinistries?: { id: string; name: string }[];
  parent?: { id: string; name: string };
}
