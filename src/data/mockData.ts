import { Factory, EvaluationRecord, Supplier } from '../types';

export const factories: Factory[] = [
  { id: 1, name: '深圳XX服装厂' },
  { id: 2, name: '广州XX制衣厂' },
  { id: 3, name: '东莞XX纺织有限公司' },
  { id: 4, name: '佛山XX服饰厂' },
];

export const suppliers: Supplier[] = [
  { id: 1, name: '深圳供应商', contact: '张三', phone: '13800138001' },
  { id: 2, name: '广州供应商', contact: '李四', phone: '13900139001' },
  { id: 3, name: '东莞供应商', contact: '王五', phone: '13700137001' },
];

export const customers: { id: number; name: string }[] = [
  { id: 1, name: '客户A' },
  { id: 2, name: '客户B' },
  { id: 3, name: '客户C' },
  { id: 4, name: '客户D' },
  { id: 5, name: '客户E' },
];

// 模拟历史评估数据
export const mockEvaluations: EvaluationRecord[] = [
  {
    id: '1',
    factoryId: 1,
    factoryName: '深圳XX服装厂',
    evaluator: '张三',
    evaluatorId: 'zhangsan',
    evalDate: '2024-01-15',
    evalType: '常规审核',
    selectedModules: ['纸样、样衣制作', '面辅料品质控制', '裁剪品质控制', '缝制工艺品质控制', '后道品质控制'],
    overallPercent: 85.3,
    results: {
      'p1_1': { isChecked: true, details: [], imagePath: null },
      'p1_2': { isChecked: true, details: [], imagePath: null },
      'p1_3': { isChecked: true, details: [], imagePath: null },
      'p1_4': { isChecked: true, details: [], imagePath: null },
      'p1_5': { isChecked: true, details: [], imagePath: null },
      'm1_1': { isChecked: true, details: [], imagePath: null },
      'm1_2': { isChecked: true, details: [], imagePath: null },
      'm3_2': { isChecked: true, details: [], imagePath: null },
    },
    comments: '工厂整体管理较好，但面辅料仓库需要加强标识管理。',
    createdAt: '2024-01-15 10:30:00',
    updatedAt: '2024-01-15 10:30:00',
  },
  {
    id: '2',
    factoryId: 2,
    factoryName: '广州XX制衣厂',
    evaluator: '李四',
    evaluatorId: 'lisi',
    evalDate: '2024-02-20',
    evalType: '整改复查',
    selectedModules: ['面辅料品质控制', '缝制工艺品质控制', '后道品质控制'],
    overallPercent: 72.5,
    results: {
      'm3_2': { isChecked: false, details: ['500m以下未全检'], imagePath: null },
      'm5_1': { isChecked: false, details: [], imagePath: null },
      's4_1': { isChecked: true, details: [], imagePath: null },
      'f4_2': { isChecked: true, details: [], imagePath: null },
    },
    comments: '上次问题已部分改进，但仍需加强面料检验环节。',
    createdAt: '2024-02-20 14:00:00',
    updatedAt: '2024-02-20 14:00:00',
  },
  {
    id: '3',
    factoryId: 1,
    factoryName: '深圳XX服装厂',
    evaluator: '王五',
    evaluatorId: 'wangwu',
    evalDate: '2024-03-10',
    evalType: '常规审核',
    selectedModules: ['纸样、样衣制作', '面辅料品质控制', '产前会议控制', '裁剪品质控制', '缝制工艺品质控制', '后道品质控制', '质量部门品质控制', '其他评分'],
    overallPercent: 91.5,
    results: {
      'p1_1': { isChecked: true, details: [], imagePath: null },
      'p1_5': { isChecked: true, details: [], imagePath: null },
      'm3_2': { isChecked: true, details: [], imagePath: null },
      'm5_1': { isChecked: true, details: [], imagePath: null },
      'm5_2': { isChecked: true, details: [], imagePath: null },
      'm9_1': { isChecked: true, details: [], imagePath: null },
      'c4_1': { isChecked: true, details: [], imagePath: null },
      's2_1': { isChecked: true, details: [], imagePath: null },
    },
    comments: '本次评估表现优秀，建议继续保持并推广优秀经验。',
    createdAt: '2024-03-10 09:00:00',
    updatedAt: '2024-03-10 09:00:00',
  },
];
