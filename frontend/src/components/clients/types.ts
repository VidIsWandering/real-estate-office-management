export type ClientCategory = "owner" | "customer";

export type ClientStatus = "Active" | "Inactive";

export interface ClientItem {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: ClientCategory;
  assignedStaff: string;
  status: ClientStatus;
  joinDate: string;
  referralSource?: string;
  requirement?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  clientType: ClientCategory;
  referralSource: string;
  requirement: string;
}
