import type { GuaranteeStatus } from 'types/guarantees';

export interface Relative {
  kocId: string;
  fullName: string;
  mobile: string;
  section: string;
  committee: string | null;
  area?: string | null;
  department?: string | null;
  team?: string | null;
  type?: string;
  color?: string;
  isGuarantee?: boolean;
  guaranteeStatus?: GuaranteeStatus | null;
  relationship?: string;
}
