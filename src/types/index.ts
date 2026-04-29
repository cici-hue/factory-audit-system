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

// 可多选小点配置
export interface SubDetailItem {
  id: string;
  name: string;
}

export interface AuditItem {
  id: string;
  name: string;
  score: number;
  isKey: boolean;
  details: string[];
  comment: string;
  // 新的可多选配置
  subDetails?: SubDetailItem[];  // 可多选的小点列表
  detailScore?: number;          // 小点全选时的得分（主项勾选时）
  partialScore?: number;         // 小点部分选中时的得分
  useDetailScore?: boolean;      // 是否使用新的计分逻辑
  // 特殊反向计分（如模块8的尺寸测量：不选得满分，勾选得一半）
  reverseScoring?: boolean;      // true: 不选得满分，勾选得一半
}

export interface AuditResult {
  isChecked: boolean;
  details: string[];
  imagePath: string | null;
  // 新增：小点的勾选状态
  subDetailChecks?: { [subDetailId: string]: boolean };
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

// 工厂与供应商对应关系（新表结构）
export interface FactorySupplierRelation {
  id: number;
  fid?: string;  // 外部系统标识符
  factoryName: string;
  factoryAddress?: string;
  factoryContact?: string;
  factoryPhone?: string;
  supplierName: string;
  supplierContact?: string;
  supplierPhone?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 工厂信息（从对应关系表提取）
export interface Factory {
  id: number;  // 使用对应关系表的 id
  name: string;  // factoryName
  address?: string;
  contact?: string;
  phone?: string;
}

// 供应商信息（从对应关系表提取）
export interface Supplier {
  id: number;  // 使用对应关系表的 id
  name: string;  // supplierName
  contact?: string;
  phone?: string;
  fid?: string;  // 外部系统标识符
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
  supplierList: Supplier[];
  evaluations: EvaluationRecord[];
}

// 工厂类型
export type FactoryType = 'light-woven' | 'lingerie-swimwear' | 'flat-knit';

// 评估草稿类型
export interface AuditDraft {
  id: string;
  userId: string;
  selectedFactory: number | null;
  selectedSupplier: number | null;
  selectedCustomers: number[];
  evalDate: string;
  evalType: '常规审核' | '整改复查' | '随机抽查';
  orderNo: string;
  styleNo: string;
  productionStatus: string;
  selectedModules: string[];
  comments: string;
  currentAuditResults: { [key: string]: AuditResult };
  expandedModules: string[];
  expandedSubModules: string[];
  createdAt: string;
  updatedAt: string;
}
