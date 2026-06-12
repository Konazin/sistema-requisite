import { apiFetch } from "@/lib/api";

export type PartnerStatus = "ACTIVE" | "PENDING_REVIEW" | "INCOMPLETE" | "BLOCKED" | "ARCHIVED";

export type PartnerAddress = {
  zipCode?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  district?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

export type PartnerBankAccount = {
  bankName?: string | null;
  bankCode?: string | null;
  agency?: string | null;
  accountNumber?: string | null;
  accountDigit?: string | null;
  accountType?: string | null;
  holderName?: string | null;
  holderCpf?: string | null;
  pixKey?: string | null;
  pixKeyType?: string | null;
};

export type Partner = {
  id: string;
  fullName: string;
  email?: string | null;
  cpf: string;
  rg?: string | null;
  birthDate?: string | null;
  whatsapp?: string | null;
  status: PartnerStatus;
  notes?: string | null;
  address?: PartnerAddress | null;
  bankAccount?: PartnerBankAccount | null;
  createdAt: string;
  updatedAt?: string;
};

export type PartnerPayload = Omit<Partner, "id" | "createdAt" | "updatedAt">;

type PartnerListResponse = { partners: Partner[] };
type PartnerResponse = { partner: Partner };

export const partnersService = {
  list() {
    return apiFetch<PartnerListResponse>("/api/partners");
  },
  get(id: string) {
    return apiFetch<PartnerResponse>(`/api/partners/${id}`);
  },
  create(payload: PartnerPayload) {
    return apiFetch<PartnerResponse>("/api/partners", { method: "POST", body: payload });
  },
  update(id: string, payload: Partial<PartnerPayload>) {
    return apiFetch<PartnerResponse>(`/api/partners/${id}`, { method: "PATCH", body: payload });
  },
  archive(id: string) {
    return apiFetch<void>(`/api/partners/${id}`, { method: "DELETE" });
  }
};
