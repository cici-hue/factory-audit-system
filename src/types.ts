// 用户类型
export interface User {
  id: string;
  username?: string;
  name: string;
  role: 'admin' | 'sadmin' | 'user';
  password?: string;
}

// 工厂类型
export interface Factory {
  id: number;
  name: string;
  address?: string;
  contact?: string;
  phone?: string;
  createdBy?: string;
}

// 供应商类型
export interface Supplier {
  id: number;
  name: string;
  code?: string;
  contact?: string;
  phone?: string;
  address?: string;
  category?: string;
}

// 客户类型
export interface Customer {
  id: number;
  name: string;
  contact?: string;
  phone?: string;
  address?: string;
}

// 审计结果项
export interface AuditResult {
  isChecked: boolean;
  details: string[];
  imagePath?: string | null;
}

// 评估记录类型
export interface EvaluationRecord {
  id: string;
  factoryId: number;
  factoryName: string;
  evaluator: string;
  evaluatorId: string;
  evalDate: string;
  evalType: '常规审核' | '整改复查' | '随机抽查';
  supplierId?: number;
  supplierName?: string;
  customerId?: number;
  customerName?: string;
  customerIds?: number[];
  customerNames?: string[];
  orderNo?: string;
  styleNo?: string;
  productionStatus?: string;
  selectedModules: string[];
  overallPercent: number;
  results: { [key: string]: AuditResult };
  comments: string;
  result?: 'pending' | 'pass' | 'fail';
  createdAt: string;
  updatedAt: string;
}
