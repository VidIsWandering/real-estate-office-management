import type { StaffRole, StaffStatus } from "@/lib/api";

export interface CreateStaffFormData {
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  assigned_area: string;
  role: StaffRole;
  status: StaffStatus;
}

export interface UpdateStaffFormData {
  full_name: string;
  email: string;
  phone_number: string;
  address: string;
  assigned_area: string;
  role: StaffRole;
  status: StaffStatus;
}
