export interface LoanType {
  title: string;
  amount: string;
  description: string;
  route: string;
}

export interface ActiveLoan {
  type: string;
  dueDate: string;
  dueAmount: string;
  totalAmount: string;
  route: string;
}
