export interface InvestmentType {
  title: string;
  description: string;
  route: string;
  icon: string;
}

export interface Investment {
  principalAmount: string;
  currency: string;
  tenure: string;
  startDate: string;
  maturityDate: string;
  totalPayouts: string;
  status?: string;
}
