// 评估模块数据类型
export interface AuditModule {
  id: string;
  name: string;
  subModules: {
    [key: string]: {
      items: AuditItem[];
    };
  };
}

export interface AuditItem {
  id: string;
  name: string;
  score: number;
  isKey: boolean;
  details: string[];
  comment: string;
}

export interface AuditResult {
  isChecked: boolean;
  details: string[];
  imagePath: string | null;
}

// 不合格项优先级
export interface FailedItemPriority {
  itemId: string;           // 评估项ID
  priority: number;         // 优先级序号（1,2,3...）
  isUrgent: boolean;        // 是否急需（前10项为true）
}

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
  orderNo?: string;
  styleNo?: string;
  productionStatus?: string;
  selectedModules: string[];
  overallPercent: number;
  results: { [key: string]: AuditResult };
  comments: string;
  createdAt: string;
  updatedAt: string;
  // 不合格项优先级排序
  failedItemsPriority?: FailedItemPriority[];
  /**
   * 数据库存储需要的字段（UI 侧通常不直接使用）
   * - result: evaluations.result (pass/fail/pending)
   * - notes: evaluations.notes（本项目用 comments 映射到 notes）
   */
  result?: 'pass' | 'fail' | 'pending';
  notes?: string;
}

export interface Factory {
  id: number;
  name: string;
  address?: string;
  contact?: string;
  phone?: string;
  createdBy?: string;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'sadmin' | 'user';
  username?: string;
  password?: string;
}

export interface AppState {
  isLoggedIn: boolean;
  user: User | null;
  factories: Factory[];
  evaluations: EvaluationRecord[];
}

export interface Supplier {
  id: number;
  name: string;
  contact?: string;
  phone?: string;
}
