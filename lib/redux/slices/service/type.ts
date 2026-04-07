export interface ServicePlan {
  _id?: string;
  id: string;
  subServiceId: string;
  name: string;
  category?: string;
  ourPrice: number;
  network?: string;
  serviceType: string;
  validity?: string;
  planKind?: "fixed" | "variable";
  active: boolean;
  easyaccessId?: string;
  autopilotId?: string;
  remitaId?: string;
}

export interface SubService {
  _id: string;
  serviceId: string;
  name: string;
  code: string;
  provider: string;
  status: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  servicePlans: ServicePlan[]; // Add this
}

export interface Service {
  _id: string;
  name: string;
  type: "airtime" | "data" | "electricity" | "cable" | "exam" | "cabletv" | "exampin";
  description?: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  subServices: SubService[];
}
