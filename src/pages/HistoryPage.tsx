import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { EvaluationRecord } from '../types';
import {
  Brain,
  Building2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  Edit,
  FileText,
  Filter,
  Search,
  Trash2,
  User,
} from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from '../utils/pdfGenerator';
import { generateAISummaryPDF, generateAISummary } from '../utils/aiSummaryGenerator';

interface HistoryPageProps {
  onEdit: (record: EvaluationRecord) => void;
}

export default function HistoryPage({ onEdit }: HistoryPageProps) {
  const { user, evaluations, factoryList, getEvaluationsByUser, deleteEvaluation } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFactory, setFilterFactory] = useState<number | 'all'>('all');
  const [filterType, setFilterType] = useState<'all' | '常规审核' | '整改复查'>('all');
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);

  // 根据权限过滤评估记录
  const filteredEvaluations = useMemo(() => {
    let filtered = getEvaluationsByUser(user?.id || '', user?.role || 'user');

    // 搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        (e) =>
          e.factoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.evaluator.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.comments.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 工厂过滤
    if (filterFactory !== 'all') {
      filtered = filtered.filter((e) => e.factoryId === filterFactory);
    }

    // 类型过滤
    if (filterType !== 'all') {
      filtered = filtered.filter((e) => e.evalType === filterType);
    }

    // 按日期倒序
    return filtered.sort(
      (a, b) => new Date(b.evalDate).getTime() - new Date(a.evalDate).getTime()
    );
  }, [user, evaluations, searchTerm, filterFactory, filterType]);

  // 处理编辑
  const handleEdit = (record: EvaluationRecord) => {
    onEdit(record);
  };

  // 处理删除
  const handleDelete = (id: string) => {
    if (confirm('确定要删除这条评估记录吗？')) {
      deleteEvaluation(id);
      toast.success('记录已删除');
    }
  };

  // 切换展开状态
  const toggleExpand = (id: string) => {
    setExpandedRecord(expandedRecord === id ? null : id);
  };

  // 生成PDF报告
  const handleDownloadPDF = (record: EvaluationRecord) => {
    let lastEvaluation: EvaluationRecord | undefined;
    
    // 如果是整改复查，需要获取上次评估记录
    if (record.evalType === '整改复查' && record.factoryId) {
      // 获取该工厂的所有评估记录
      const factoryEvals = evaluations.filter(e => e.factoryId === record.factoryId);
      
      // 按日期排序，找到记录日期之前的最近一次评估
      const sortedEvals = [...factoryEvals].sort((a, b) => 
        new Date(b.evalDate).getTime() - new Date(a.evalDate).getTime()
      );
      
      // 找到当前记录之前的最近一次评估
      const currentIndex = sortedEvals.findIndex(e => e.id === record.id);
      if (currentIndex >= 0 && currentIndex < sortedEvals.length - 1) {
        // 当前记录之后的下一个记录就是上次评估记录
        lastEvaluation = sortedEvals[currentIndex + 1];
      }
      
      console.log('历史记录PDF生成调试:', {
        recordId: record.id,
        recordDate: record.evalDate,
        factoryEvalsCount: factoryEvals.length,
        sortedEvals: sortedEvals.map(e => ({id: e.id, date: e.evalDate, type: e.evalType})),
        currentIndex,
        lastEvaluation: lastEvaluation ? {id: lastEvaluation.id, date: lastEvaluation.evalDate, type: lastEvaluation.evalType} : null
      });
    }
    
    generatePDF(record, lastEvaluation);
    toast.success('PDF报告已下载');
  };

  // 生成AI总结报告
  const handleAISummary = async (record: EvaluationRecord) => {
    const toastId = toast.loading('AI正在分析评估数据，时间较长，请耐心等待...');
    
    try {
      // 调用AI总结生成
      const aiSummary = await generateAISummary(record);
      
      // 关闭loading toast
      toast.dismiss(toastId);
      
      // 生成PDF报告
      generateAISummaryPDF(record, aiSummary);
      
      toast.success('AI总结报告已生成');
    } catch (error) {
      console.error('AI总结生成失败:', error);
      // 关闭loading toast
      toast.dismiss(toastId);
      const errorMessage = error instanceof Error ? error.message : 'AI总结生成失败，请稍后重试';
      toast.error(`AI分析失败：${errorMessage}`);
    }
  };

  // 获取得分等级颜色
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    if (score >= 50) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">历史记录</h1>
        <p className="text-slate-500 mt-1">查看和管理所有评估记录</p>
      </div>

      {/* 搜索和过滤 */}
      <div className="bg-white rounded-2xl shadow-sm border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="搜索工厂、评估员、评论..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 工厂过滤 */}
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-400" />
            <select
              value={filterFactory}
              onChange={(e) => setFilterFactory(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部工厂</option>
              {factoryList.map((factory) => (
                <option key={factory.id} value={factory.id}>{factory.name}</option>
              ))}
            </select>
          </div>

          {/* 类型过滤 */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | '常规审核' | '整改复查')}
              className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">全部类型</option>
              <option value="常规审核">常规审核</option>
              <option value="整改复查">整改复查</option>
            </select>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="mt-4 pt-4 border-t flex items-center justify-between">
          <span className="text-sm text-slate-500">
            共找到 <span className="font-semibold text-slate-900">{filteredEvaluations.length}</span> 条记录
          </span>
        </div>
      </div>

      {/* 记录列表 */}
      <div className="space-y-4">
        {filteredEvaluations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">暂无评估记录</p>
          </div>
        ) : (
          filteredEvaluations.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl shadow-sm border overflow-hidden"
            >
              {/* 记录头部 */}
              <button
                onClick={() => toggleExpand(record.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Calendar className="w-4 h-4" />
                    <span>{record.evalDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 font-medium">
                    <Building2 className="w-4 h-4" />
                    <span>{record.factoryName}</span>
                  </div>
                  {record.supplierName && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-sm">供应商: {record.supplierName}</span>
                    </div>
                  )}
                  {(record.customerName || record.customerNames) && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="text-sm">客户: {record.customerNames?.join(', ') || record.customerName}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-slate-500">
                    <User className="w-4 h-4" />
                    <span>{record.evaluator}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      record.evalType === '常规审核'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-purple-50 text-purple-700'
                    }`}
                  >
                    {record.evalType}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-4 py-2 rounded-xl font-semibold ${getScoreColor(
                      record.overallPercent
                    )}`}
                  >
                    {record.overallPercent.toFixed(2)}%
                  </div>
                  {expandedRecord === record.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* 记录详情 */}
              {expandedRecord === record.id && (
                <div className="px-6 pb-6 border-t">
                  <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 评估模块 */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">评估模块</h4>
                      <div className="flex flex-wrap gap-2">
                        {record.selectedModules.map((mod) => (
                          <span
                            key={mod}
                            className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                          >
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* 评估意见 */}
                    <div>
                      <h4 className="text-sm font-medium text-slate-700 mb-2">评估意见</h4>
                      <p className="text-slate-600">{record.comments || '无'}</p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <button
                      onClick={() => handleDownloadPDF(record)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      下载报告
                    </button>
                    {/* 只有管理员或自己的记录才能编辑/删除 */}
                    {(user?.role === 'admin' || user?.role === 'sadmin' || record.evaluatorId === user?.id) && (
                      <>
                        <button
                          onClick={() => handleEdit(record)}
                          className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleAISummary(record)}
                      className="flex flex-col items-center gap-1 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        <span>AI总结</span>
                      </div>
                      <span className="text-[10px] text-purple-500/70">该内容由AI生成，请谨慎参考</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
