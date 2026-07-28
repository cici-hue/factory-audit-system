// Audit module data type
export interface AuditModule {
  id: string;
  name: string;
  nameEn?: string;                   // English name
  skippable?: boolean;              // Whether the whole module can be marked as not participating in scoring
  skippableLabel?: string;          // Module optional label
  skippableLabelEn?: string;        // English module optional label
  subModules: {
    [key: string]: {
      nameEn?: string;              // English sub-module name
      items: AuditItem[];
      optional?: boolean;           // Whether optional (e.g. needle inspection)
      optionalLabel?: string;       // Optional label (e.g. "No needle inspection required, not scored")
      optionalLabelEn?: string;     // English optional label
    };
  };
}

// Multi-select sub-detail config
export interface SubDetailItem {
  id: string;
  name: string;
  nameEn?: string;                  // English sub-detail name
}

export interface AuditItem {
  id: string;
  name: string;
  nameEn?: string;                  // English name
  score: number;
  isKey: boolean;
  details: string[];
  detailsEn?: string[];             // English details
  comment: string;
  commentEn?: string;               // English comment
  // Multi-select sub-details
  subDetails?: SubDetailItem[];     // Multi-select sub-details list
  detailScore?: number;             // Score when all sub-details are selected (when main item is checked)
  partialScore?: number;            // Score when sub-details are partially selected
  useDetailScore?: boolean;         // Whether to use new scoring logic
  // Special reverse scoring (e.g. measurement: not selected = full score, selected = half)
  reverseScoring?: boolean;         // true: not selected = full score, selected = half
  // Flat Knit specific
  guidance?: string;                // Guidance
  guidanceEn?: string;              // English guidance
  scoreOptions?: number[];          // Score options (e.g. [0.1, 0, -0.5])
  penaltyRule?: string;             // Penalty rule description
  penaltyRuleEn?: string;           // English penalty rule description
  penaltyItems?: string[];          // Other item IDs affected by this item
  penaltyOnZeroScore?: boolean;     // Whether to trigger penalty when 0 score is selected
}

export interface AuditResult {
  isChecked: boolean;
  details: string[];
  imagePath: string | null;
  // 新增：小点的勾选状态
  subDetailChecks?: { [subDetailId: string]: boolean };
  // 新增：打分项评论
  comment?: string;
  // Flat Knit 专用：选中的分数值
  selectedScore?: number;
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
  factoryType: FactoryType;
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
