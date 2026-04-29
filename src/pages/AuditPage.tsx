import { useState, useEffect, useMemo, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getAuditModules, getTotalScore } from '../data/factoryModules';
import { AuditResult, Customer, FailedItemPriority } from '../types';
import {
  CheckCircle2,
  XCircle,
  Camera,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Save,
  FileText,
  RotateCcw,
  Download,
  CheckSquare,
} from 'lucide-react';
import { toast } from 'sonner';
import { generatePDF } from '../utils/pdfGenerator';
import { PrioritySortModal } from '../components/PrioritySortModal';
import { draftService, factorySupplierService } from '../lib/database';
import { uploadTempImage, moveTempImages } from '../lib/supabase';
import { Supplier } from '../types';

export default function AuditPage() {
  const {
    user,
    factoryType,
    factoryList,
    supplierList,
    customerList,
    addEvaluation,
    updateEvaluation,
    currentAuditResults,
    setCurrentAuditResults,
    clearCurrentAuditResults,
    isEditMode,
    editingRecord,
    setEditMode,
    getEvaluationsByFactory,
  } = useApp();

  // 根据工厂类型获取评估模块和总分
  const auditModules = useMemo(() => getAuditModules(factoryType), [factoryType]);
  const TOTAL_SCORE = useMemo(() => getTotalScore(factoryType), [factoryType]);

  // 表单状态
  const [selectedFactory, setSelectedFactory] = useState<number | null>(null);
  const [factorySearch, setFactorySearch] = useState('');
  const [isFactoryDropdownOpen, setIsFactoryDropdownOpen] = useState(false);
  const [evalDate, setEvalDate] = useState(new Date().toISOString().split('T')[0]);
  const [evalType, setEvalType] = useState<'常规审核' | '整改复查' | '随机抽查'>('常规审核');
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const [factorySuppliers, setFactorySuppliers] = useState<Supplier[]>([]); // 当前工厂关联的供应商
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [orderNo, setOrderNo] = useState('');
  const [styleNo, setStyleNo] = useState('');
  const [productionStatus, setProductionStatus] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [comments, setComments] = useState('');
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [expandedSubModules, setExpandedSubModules] = useState<Set<string>>(new Set());
  const [customers] = useState<Customer[]>(customerList);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  // 整改复查相关
  const [lastEvaluation, setLastEvaluation] = useState<any>(null);
  const [onlyShowLastFailed, setOnlyShowLastFailed] = useState(false);

  // 优先级排序相关
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [pendingEvaluation, setPendingEvaluation] = useState<any>(null);
  const [failedItemsPriority, setFailedItemsPriority] = useState<FailedItemPriority[]>([]);

  // 自动保存相关
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [hasAutoSaveData, setHasAutoSaveData] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // 图片上传临时ID（用于评估保存前的图片存储）
  const [tempEvaluationId] = useState(() => crypto.randomUUID());

  // 初始化
  useEffect(() => {
    if (isEditMode && editingRecord) {
      setSelectedFactory(editingRecord.factoryId);
      setEvalDate(editingRecord.evalDate);
      setEvalType(editingRecord.evalType);
      setSelectedSupplier(editingRecord.supplierId || null);
      setSelectedCustomers(editingRecord.customerId ? [editingRecord.customerId] : []);
      setOrderNo(editingRecord.orderNo || '');
      setStyleNo(editingRecord.styleNo || '');
      setProductionStatus(editingRecord.productionStatus || '');
      setSelectedModules(editingRecord.selectedModules);
      setComments(editingRecord.comments);
      setCurrentAuditResults(editingRecord.results);

      // 展开所有模块
      const allModules = new Set<string>();
      const allSubModules = new Set<string>();
      auditModules.forEach(mod => {
        if (editingRecord.selectedModules.includes(mod.name)) {
          allModules.add(mod.id);
          Object.keys(mod.subModules).forEach(sub => {
            allSubModules.add(`${mod.id}-${sub}`);
          });
        }
      });
      setExpandedModules(allModules);
      setExpandedSubModules(allSubModules);
    } else {
      // 检查数据库中是否有自动保存的进度
      const checkDraft = async () => {
        if (!user?.id) {
          resetToDefaultState();
          return;
        }
        
        try {
          const draft = await draftService.getDraft(user.id);
          if (draft) {
            setHasAutoSaveData(true);
            if (draft.updatedAt) {
              setLastSavedTime(new Date(draft.updatedAt));
            }
            // 不自动恢复，让用户选择是否恢复
          } else {
            resetToDefaultState();
          }
        } catch (error) {
          console.error('检查草稿失败:', error);
          resetToDefaultState();
        }
      };
      
      checkDraft();
    }
  }, [isEditMode, editingRecord, supplierList, user?.id]);

  // 重置为默认状态
  const resetToDefaultState = () => {
    clearCurrentAuditResults();
    setSelectedModules(auditModules.map(m => m.name));
    setExpandedModules(new Set(auditModules.map(m => m.id)));
    auditModules.forEach(mod => {
      Object.keys(mod.subModules).forEach(sub => {
        expandedSubModules.add(`${mod.id}-${sub}`);
      });
    });
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.customer-dropdown-container')) {
        setIsCustomerDropdownOpen(false);
      }
      if (!target.closest('.factory-dropdown-container')) {
        setIsFactoryDropdownOpen(false);
      }
      if (!target.closest('.supplier-dropdown-container')) {
        setIsSupplierDropdownOpen(false);
      }
    };

    if (isCustomerDropdownOpen || isFactoryDropdownOpen || isSupplierDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCustomerDropdownOpen, isFactoryDropdownOpen, isSupplierDropdownOpen]);

  // 整改复查时获取上次评估
  useEffect(() => {
    if (evalType === '整改复查' && selectedFactory) {
      const pastEvals = getEvaluationsByFactory(selectedFactory);
      console.log('selectedFactory:', selectedFactory);
      console.log('pastEvals:', pastEvals);
      if (pastEvals.length > 0) {
        // 获取所有评估记录，按日期排序
        const sorted = [...pastEvals].sort((a, b) =>
          new Date(b.evalDate).getTime() - new Date(a.evalDate).getTime()
        );
        // 找到最近一次有 results 的评估记录（不限制评估类型）
        const lastEvalWithResults = sorted.find(e => e.results && Object.keys(e.results).length > 0);
        console.log('sorted:', sorted);
        console.log('sorted.length:', sorted.length);
        sorted.forEach((e, index) => {
          console.log(`sorted[${index}].id:`, e.id, 'evalDate:', e.evalDate, 'evalType:', e.evalType, 'results keys:', Object.keys(e.results || {}).length);
        });
        console.log('lastEvalWithResults:', lastEvalWithResults);
        console.log('lastEvalWithResults.results:', lastEvalWithResults?.results);
        setLastEvaluation(lastEvalWithResults || sorted[0]);
      } else {
        setLastEvaluation(null);
      }
    } else {
      setLastEvaluation(null);
    }
  }, [evalType, selectedFactory]);

  // 工厂选择变化时，获取关联的供应商
  useEffect(() => {
    const loadFactorySuppliers = async () => {
      if (!selectedFactory) {
        setFactorySuppliers([]);
        setSelectedSupplier(null);
        return;
      }

      // 获取选中的工厂名称
      const factory = factoryList.find(f => f.id === selectedFactory);
      if (!factory) {
        setFactorySuppliers([]);
        return;
      }

      setIsLoadingSuppliers(true);
      try {
        const suppliers = await factorySupplierService.getSuppliersByFactory(factory.name);
        setFactorySuppliers(suppliers);
        // 如果当前选中的供应商不在新工厂的供应商列表中，清空选择
        if (selectedSupplier && !suppliers.find(s => s.id === selectedSupplier)) {
          setSelectedSupplier(null);
        }
      } catch (error) {
        console.error('加载工厂关联供应商失败:', error);
        toast.error('加载供应商列表失败');
        setFactorySuppliers([]);
      } finally {
        setIsLoadingSuppliers(false);
      }
    };

    loadFactorySuppliers();
  }, [selectedFactory, factoryList, selectedSupplier, setSelectedSupplier]);

  // 监听评估类型变化，重置模块选择
  useEffect(() => {
    if (!isEditMode) {
      if (evalType === '常规审核') {
        // 常规审核默认全选
        setSelectedModules(auditModules.map(m => m.name));
        setExpandedModules(new Set(auditModules.map(m => m.id)));
      } else if (evalType === '随机抽查') {
        // 随机抽查默认清空，让用户手动选择
        setSelectedModules([]);
        setExpandedModules(new Set());
      } else if (evalType === '整改复查') {
         // 整改复查自动选中所有包含不合格项目的模块
         const failedModules = auditModules
           .filter(mod => lastFailedModuleIds.has(mod.id))
           .map(mod => mod.name);
         setSelectedModules(failedModules);
         setExpandedModules(new Set(failedModules.map(name => 
           auditModules.find(m => m.name === name)?.id || ''
         ).filter(Boolean)));
       }
      setOnlyShowLastFailed(false);
      clearCurrentAuditResults();
    }
  }, [evalType, isEditMode]);

  // 切换模块选中状态
  const toggleModuleSelection = (moduleName: string) => {
    setSelectedModules(prev => {
      if (prev.includes(moduleName)) {
        return prev.filter(m => m !== moduleName);
      } else {
        return [...prev, moduleName];
      }
    });
  };

  // 保存进度到数据库
  const saveProgress = useCallback(async () => {
    if (isEditMode || isRestoring) return;
    if (!user?.id) {
      toast.error('请先登录');
      return;
    }

    // 保存评估结果，包括图片数据
    const resultsWithImages: { [key: string]: AuditResult } = {};
    Object.entries(currentAuditResults).forEach(([key, result]) => {
      resultsWithImages[key] = {
        isChecked: result.isChecked,
        details: result.details || [],
        imagePath: result.imagePath || null, // 保存图片路径
      };
    });

    const draftData = {
      userId: user.id,
      selectedFactory,
      selectedSupplier,
      selectedCustomers,
      evalDate,
      evalType,
      orderNo,
      styleNo,
      productionStatus,
      selectedModules,
      comments,
      currentAuditResults: resultsWithImages,
      expandedModules: Array.from(expandedModules),
      expandedSubModules: Array.from(expandedSubModules),
    };

    try {
      const saved = await draftService.saveDraft(draftData);
      if (saved) {
        setLastSavedTime(new Date());
        setHasAutoSaveData(true);
        toast.success('进度已保存到数据库', { duration: 1500 });
      } else {
        toast.error('保存进度失败');
      }
    } catch (error) {
      console.error('保存进度失败:', error);
      toast.error('保存进度失败，请检查网络连接');
    }
  }, [
    selectedFactory,
    selectedSupplier,
    selectedCustomers,
    evalDate,
    evalType,
    orderNo,
    styleNo,
    productionStatus,
    selectedModules,
    comments,
    currentAuditResults,
    expandedModules,
    expandedSubModules,
    user?.id,
    isEditMode,
    isRestoring,
  ]);

  // 恢复进度
  const restoreProgress = useCallback(async () => {
    if (!user?.id) {
      toast.error('请先登录');
      return false;
    }

    try {
      setIsRestoring(true);
      const draft = await draftService.getDraft(user.id);
      
      if (!draft) {
        setIsRestoring(false);
        return false;
      }

      // 恢复所有状态
      if (draft.selectedFactory !== undefined && draft.selectedFactory !== null) setSelectedFactory(draft.selectedFactory);
      if (draft.selectedSupplier !== undefined && draft.selectedSupplier !== null) setSelectedSupplier(draft.selectedSupplier);
      if (draft.selectedCustomers !== undefined && draft.selectedCustomers !== null) setSelectedCustomers(draft.selectedCustomers);
      if (draft.evalDate) setEvalDate(draft.evalDate);
      if (draft.evalType) setEvalType(draft.evalType);
      if (draft.orderNo !== undefined && draft.orderNo !== null) setOrderNo(draft.orderNo);
      if (draft.styleNo !== undefined && draft.styleNo !== null) setStyleNo(draft.styleNo);
      if (draft.productionStatus !== undefined && draft.productionStatus !== null) setProductionStatus(draft.productionStatus);
      if (draft.selectedModules) setSelectedModules(draft.selectedModules);
      if (draft.comments !== undefined && draft.comments !== null) setComments(draft.comments);
      if (draft.currentAuditResults) setCurrentAuditResults(draft.currentAuditResults);
      if (draft.expandedModules) setExpandedModules(new Set(draft.expandedModules));
      if (draft.expandedSubModules) setExpandedSubModules(new Set(draft.expandedSubModules));

      if (draft.updatedAt) {
        setLastSavedTime(new Date(draft.updatedAt));
      }

      setHasAutoSaveData(true);
      setIsRestoring(false);

      toast.success('已恢复上次评估进度');
      return true;
    } catch (error) {
      console.error('恢复进度失败:', error);
      setIsRestoring(false);
      toast.error('恢复进度失败，请检查网络连接');
      return false;
    }
  }, [user?.id, setCurrentAuditResults]);

  // 清除保存的进度
  const clearSavedProgress = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      await draftService.deleteDraft(user.id);
      setLastSavedTime(null);
      setHasAutoSaveData(false);
    } catch (error) {
      console.error('清除进度失败:', error);
    }
  }, [user?.id]);

  // 计算当前得分（支持新的可多选计分逻辑）
  const { currentScore, percentage, moduleScores } = useMemo(() => {
    let score = 0;
    const modScores: { [key: string]: number } = {};

    auditModules.forEach(mod => {
      if (!selectedModules.includes(mod.name)) return;
      let modScore = 0;

      Object.values(mod.subModules).forEach(subMod => {
        subMod.items.forEach(item => {
          const result = currentAuditResults[item.id];
          if (!result) return;

          // 使用新的可多选计分逻辑
          if (item.useDetailScore && item.subDetails && item.subDetails.length > 0) {
            // 如果主项被勾选，直接得满分
            if (result.isChecked) {
              modScore += item.detailScore || item.score;
              score += item.detailScore || item.score;
            } else {
              // 主项未勾选，根据小点勾选情况计分
              const subDetailChecks = result.subDetailChecks || {};
              const checkedCount = item.subDetails.filter(sub => subDetailChecks[sub.id]).length;
              const totalCount = item.subDetails.length;

              // 尺寸测量项特殊处理
              const isSizeMeasurement = item.id === 'fi2_6' || item.id === 'pfi2_6';
              if (isSizeMeasurement) {
                // 尺寸测量项：勾选小点=有遗漏=一半分，不勾选=0分
                if (checkedCount > 0) {
                  modScore += item.partialScore || (item.score / 2);
                  score += item.partialScore || (item.score / 2);
                }
              } else {
                // 普通可多选项
                if (checkedCount === totalCount) {
                  // 全选：得满分
                  modScore += item.detailScore || item.score;
                  score += item.detailScore || item.score;
                } else if (checkedCount > 0) {
                  // 部分选择：得一半分
                  modScore += item.partialScore || (item.score / 2);
                  score += item.partialScore || (item.score / 2);
                }
              }
              // 全不选：不得分
            }
          } else if (item.reverseScoring && item.subDetails) {
            // 反向计分（如模块8的尺寸测量）：不选得满分，勾选得一半
            const subDetailChecks = result.subDetailChecks || {};
            const checkedCount = item.subDetails.filter(sub => subDetailChecks[sub.id]).length;
            
            if (checkedCount === 0) {
              // 全不选：得满分
              modScore += item.detailScore || item.score;
              score += item.detailScore || item.score;
            } else {
              // 有任何勾选：得一半分
              modScore += item.partialScore || (item.score / 2);
              score += item.partialScore || (item.score / 2);
            }
          } else {
            // 普通计分逻辑
            if (result.isChecked) {
              modScore += item.score;
              score += item.score;
            }
          }
        });
      });

      modScores[mod.name] = modScore;
    });

    // 如果是整改复查，使用累加式得分计算
    let finalPercentage = (score / TOTAL_SCORE) * 100;
    
    if (evalType === '整改复查' && lastEvaluation) {
      // 累加得分：上次得分 + 本次整改复查得分
      const lastScore = (lastEvaluation.overallPercent / 100) * TOTAL_SCORE;
      const currentRectificationScore = score;
      const accumulatedScore = lastScore + currentRectificationScore;
      finalPercentage = (accumulatedScore / TOTAL_SCORE) * 100;
      console.log('整改复查累加得分计算:', {
        lastScore,
        currentRectificationScore,
        accumulatedScore,
        finalPercentage
      });
    }

    return {
      currentScore: score,
      percentage: finalPercentage,
      moduleScores: modScores,
    };
  }, [currentAuditResults, selectedModules, auditModules, TOTAL_SCORE, evalType, lastEvaluation]);

  // 处理复选框变更（主项）
  const handleCheckChange = (itemId: string, checked: boolean, item?: any) => {
    const currentResult = currentAuditResults[itemId] || {
      isChecked: false,
      details: [],
      imagePath: null,
      subDetailChecks: {},
    };

    // 如果主项被勾选且有可多选小点，自动全选所有小点
    // 但尺寸测量项除外（fi2_6, pfi2_6），勾选主项表示全部合格，小点应保持不选
    let newSubDetailChecks = currentResult.subDetailChecks || {};
    if (checked && item?.useDetailScore && item?.subDetails) {
      // 尺寸测量项特殊处理：勾选主项=全部合格，不自动勾选小点
      const isSizeMeasurement = item.id === 'fi2_6' || item.id === 'pfi2_6';
      if (!isSizeMeasurement) {
        newSubDetailChecks = {};
        item.subDetails.forEach((sub: any) => {
          newSubDetailChecks[sub.id] = true;
        });
      }
    }

    setCurrentAuditResults({
      ...currentAuditResults,
      [itemId]: {
        ...currentResult,
        isChecked: checked,
        subDetailChecks: newSubDetailChecks,
      },
    });
  };

  // 处理小点勾选变更
  const handleSubDetailChange = (itemId: string, subDetailId: string, checked: boolean) => {
    const currentResult = currentAuditResults[itemId] || {
      isChecked: false,
      details: [],
      imagePath: null,
      subDetailChecks: {},
    };

    const newSubDetailChecks = {
      ...currentResult.subDetailChecks,
      [subDetailId]: checked,
    };

    setCurrentAuditResults({
      ...currentAuditResults,
      [itemId]: {
        ...currentResult,
        subDetailChecks: newSubDetailChecks,
      },
    });
  };

  // 处理详情选择
  const handleDetailsChange = (itemId: string, details: string[]) => {
    setCurrentAuditResults({
      ...currentAuditResults,
      [itemId]: {
        ...currentAuditResults[itemId],
        details,
      },
    });
  };

  // 处理评论输入
  const handleCommentChange = (itemId: string, comment: string) => {
    setCurrentAuditResults({
      ...currentAuditResults,
      [itemId]: {
        ...currentAuditResults[itemId],
        comment,
      },
    });
  };

  // 生成临时文件夹名称（工厂_评估人_日期）
  const getTempFolderName = useCallback(() => {
    const factory = factoryList.find(f => f.id === selectedFactory);
    const factoryName = factory?.name || '未知工厂';
    const evaluatorName = user?.name || user?.username || '未知用户';
    const dateStr = evalDate || new Date().toISOString().split('T')[0];
    return `${factoryName}_${evaluatorName}_${dateStr}`;
  }, [selectedFactory, factoryList, user, evalDate]);

  // 处理图片上传（上传到 Supabase Storage）
  const handleImageUpload = async (itemId: string, file: File) => {
    try {
      // 显示上传中提示
      toast.loading('正在上传图片...', { id: `upload-${itemId}` });

      // 生成文件夹名称
      const folderName = getTempFolderName();
      console.log('使用文件夹名称:', folderName);

      // 上传到 Storage（使用临时文件夹）
      const imageUrl = await uploadTempImage(file, folderName, itemId);

      if (imageUrl) {
        setCurrentAuditResults({
          ...currentAuditResults,
          [itemId]: {
            ...currentAuditResults[itemId],
            imagePath: imageUrl,
          },
        });
        toast.success('图片上传成功', { id: `upload-${itemId}` });
      } else {
        toast.error('图片上传失败', { id: `upload-${itemId}` });
      }
    } catch (error) {
      console.error('上传图片失败:', error);
      toast.error('图片上传失败', { id: `upload-${itemId}` });
    }
  };

  // 删除图片
  const handleDeleteImage = (itemId: string) => {
    setCurrentAuditResults({
      ...currentAuditResults,
      [itemId]: {
        ...currentAuditResults[itemId],
        imagePath: null,
      },
    });
  };

  // 切换模块展开状态
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  // 切换子模块展开状态
  const toggleSubModule = (moduleId: string, subModuleName: string) => {
    const key = `${moduleId}-${subModuleName}`;
    const newExpanded = new Set(expandedSubModules);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSubModules(newExpanded);
  };

  // 全选/清空
  const handleSelectAll = () => {
    const newResults: { [key: string]: AuditResult } = {};
    auditModules.forEach(mod => {
      if (!selectedModules.includes(mod.name)) return;
      Object.values(mod.subModules).forEach(subMod => {
        subMod.items.forEach(item => {
          newResults[item.id] = { isChecked: true, details: [], imagePath: null };
        });
      });
    });
    setCurrentAuditResults(newResults);
  };

  const handleClearAll = () => {
    const newResults: { [key: string]: AuditResult } = {};
    auditModules.forEach(mod => {
      if (!selectedModules.includes(mod.name)) return;
      Object.values(mod.subModules).forEach(subMod => {
        subMod.items.forEach(item => {
          newResults[item.id] = { isChecked: false, details: [], imagePath: null };
        });
      });
    });
    setCurrentAuditResults(newResults);
  };

  // 检查是否有不合格项
  const hasFailedItems = useMemo(() => {
    return Object.values(currentAuditResults).some(r => !r.isChecked);
  }, [currentAuditResults]);

  // 保存评估
  const handleSave = async () => {
    const factory = factoryList.find(f => f.id === selectedFactory);
    if (!factory) {
      toast.error('请选择工厂');
      return;
    }

    // 验证选择供应商
    const supplier = supplierList.find(s => s.id === selectedSupplier);
    if (!supplier) {
      toast.error('请选择供应商');
      return;
    }

    // 验证至少选择一个模块
    if (selectedModules.length === 0) {
      toast.error('请至少选择一个评估模块');
      return;
    }

    const evaluation = {
      factoryId: selectedFactory,
      factoryName: factory.name,
      evaluator: user?.name || '',
      evaluatorId: user?.id || '',
      evalDate,
      evalType,
      supplierId: selectedSupplier || undefined,
      supplierName: supplierList.find(s => s.id === selectedSupplier)?.name || undefined,
      customerId: selectedCustomers.length > 0 ? selectedCustomers[0] : undefined,
      customerName: selectedCustomers.length > 0 ? customers.find(c => c.id === selectedCustomers[0])?.name : undefined,
      customerIds: selectedCustomers.length > 0 ? selectedCustomers : undefined,
      customerNames: selectedCustomers.length > 0 ? selectedCustomers.map(id => customers.find(c => c.id === id)?.name).filter(Boolean) as string[] : undefined,
      orderNo: orderNo.trim() || undefined,
      styleNo: styleNo.trim() || undefined,
      productionStatus: productionStatus.trim() || undefined,
      selectedModules,
      overallPercent: percentage,
      results: currentAuditResults,
      comments,
      // Supabase 表需要的字段（写入时会用到）
      result: 'pending' as const,
    };

    // 如果有不合格项，先弹出优先级排序弹窗
    if (hasFailedItems) {
      setPendingEvaluation(evaluation);
      setShowPriorityModal(true);
      return;
    }

    // 没有不合格项，直接保存
    await saveEvaluation(evaluation, []);
  };

  // 保存评估（带优先级）
  const saveEvaluation = async (evaluation: any, priorities: FailedItemPriority[]) => {
    console.log('saveEvaluation 被调用:', { evaluation, priorities });
    
    // 收集所有图片URL
    const imageUrls: string[] = [];
    Object.values(currentAuditResults).forEach(result => {
      if (result.imagePath && result.imagePath.startsWith('http')) {
        imageUrls.push(result.imagePath);
      }
    });
    
    const evaluationWithPriority = {
      ...evaluation,
      failedItemsPriority: priorities.length > 0 ? priorities : undefined
    };
    console.log('准备保存的评估数据:', evaluationWithPriority);

    let savedRecord;
    if (isEditMode && editingRecord) {
      console.log('更新模式，记录ID:', editingRecord.id);
      savedRecord = await updateEvaluation(editingRecord.id, evaluationWithPriority);
      if (savedRecord) {
        toast.success('评估报告已更新');
        setEditMode(false);
        clearCurrentAuditResults();
      } else {
        console.error('更新评估失败');
        toast.error('保存失败');
        return;
      }
    } else {
      console.log('新增模式');
      savedRecord = await addEvaluation(evaluationWithPriority);
      console.log('addEvaluation 返回:', savedRecord);
      if (savedRecord) {
        toast.success('评估报告已保存');
        clearCurrentAuditResults();
      } else {
        console.error('新增评估失败');
        toast.error('保存失败');
        return;
      }
    }

    // 移动临时图片到正式文件夹
    if (imageUrls.length > 0 && savedRecord) {
      const tempFolderName = getTempFolderName();
      const finalFolderName = `${tempFolderName}_${savedRecord.id.substring(0, 8)}`;
      const evalId = savedRecord.id.substring(0, 8);
      const evaluatorName = user?.name || user?.username || '未知用户';
      console.log('开始移动临时图片到正式文件夹:', { tempFolderName, finalFolderName, evalId, evaluatorName });
      const movedUrls = await moveTempImages(tempFolderName, finalFolderName, evalId, evaluatorName, imageUrls);
      console.log('图片移动完成:', movedUrls);
      
      // 更新评估记录中的图片URL
      if (savedRecord.results) {
        Object.keys(savedRecord.results).forEach(key => {
          const oldUrl = savedRecord.results[key].imagePath;
          if (oldUrl) {
            const newUrl = movedUrls.find(url => url.includes(key));
            if (newUrl) {
              savedRecord.results[key].imagePath = newUrl;
            }
          }
        });
      }
    }

    // 生成并下载PDF
    await generatePDF(savedRecord, evalType === '整改复查' ? lastEvaluation : undefined);
    toast.success('PDF报告已生成并下载');

    // 重置表单
    setComments('');
    setFailedItemsPriority([]);
    setPendingEvaluation(null);

    // 清除自动保存的进度
    clearSavedProgress();

    // 重置基础信息
    setSelectedFactory(null);
    setSelectedSupplier(null);
    setSelectedCustomers([]);
    setOrderNo('');
    setStyleNo('');
    setProductionStatus('');
    setEvalDate(new Date().toISOString().split('T')[0]);
    setEvalType('常规审核');
  };

  // 处理优先级排序确认
  const handlePriorityConfirm = (priorities: FailedItemPriority[]) => {
    console.log('优先级排序确认:', priorities);
    setFailedItemsPriority(priorities);
    setShowPriorityModal(false);
    if (pendingEvaluation) {
      console.log('开始保存评估:', pendingEvaluation);
      saveEvaluation(pendingEvaluation, priorities);
    } else {
      console.error('pendingEvaluation 为空');
      toast.error('保存失败：评估数据丢失');
    }
  };

  // 取消优先级排序
  const handlePriorityCancel = () => {
    setShowPriorityModal(false);
    setPendingEvaluation(null);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditMode(false);
    clearCurrentAuditResults();
    setComments('');
  };

  // 获取上次评估状态
  const getLastStatus = (itemId: string): string => {
    if (!lastEvaluation) return '';
    const r = lastEvaluation.results?.[itemId];
    if (!r) return '';
    return r.isChecked ? '上次合格' : '上次不合格';
  };

  const lastFailedItemIds = useMemo(() => {
    if (evalType !== '整改复查' || !lastEvaluation?.results) return new Set<string>();
    const s = new Set<string>();
    Object.entries(lastEvaluation.results).forEach(([itemId, r]: any) => {
      if (r && (r.isChecked === false || (!r.isChecked && r.details && r.details.length > 0))) s.add(itemId);
    });
    console.log('lastFailedItemIds:', s);
    console.log('lastFailedItemIds size:', s.size);
    return s;
  }, [evalType, lastEvaluation]);

  const lastFailedModuleIds = useMemo(() => {
    if (lastFailedItemIds.size === 0) return new Set<string>();
    const modIds = new Set<string>();
    auditModules.forEach((mod) => {
      let hasFail = false;
      Object.values(mod.subModules).forEach((sub) => {
        sub.items.forEach((item) => {
          if (lastFailedItemIds.has(item.id)) hasFail = true;
        });
      });
      if (hasFail) modIds.add(mod.id);
    });
    console.log('lastFailedModuleIds:', modIds);
    return modIds;
  }, [lastFailedItemIds]);

  const moduleTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    auditModules.forEach((mod) => {
      let total = 0;
      Object.values(mod.subModules).forEach((sub) => {
        sub.items.forEach((item) => {
          total += item.score;
        });
      });
      totals[mod.name] = total;
    });
    return totals;
  }, []);

  const modulePercentages = useMemo(() => {
    const perc: Record<string, number> = {};
    Object.entries(moduleScores).forEach(([name, score]) => {
      const total = moduleTotals[name] || 0;
      perc[name] = total > 0 ? (score / total) * 100 : 0;
    });
    return perc;
  }, [moduleScores, moduleTotals]);

  return (
    <div className="space-y-6">
      {/* 编辑模式提示 */}
      {isEditMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800">
            <RotateCcw className="w-5 h-5" />
            <span>正在编辑历史记录：{editingRecord?.evalDate}</span>
          </div>
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors"
          >
            取消编辑
          </button>
        </div>
      )}

      {/* 恢复进度提示 */}
      {!isEditMode && hasAutoSaveData && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-800">
            <Save className="w-5 h-5" />
            <span>
              检测到未完成的评估进度
              {lastSavedTime && (
                <span className="text-blue-600 ml-1">
                  (上次保存：{lastSavedTime.toLocaleString()})
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                await clearSavedProgress();
                resetToDefaultState();
                toast.success('已清除保存的进度');
              }}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded-lg transition-colors"
            >
              放弃进度
            </button>
            <button
              onClick={restoreProgress}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              恢复进度
            </button>
          </div>
        </div>
      )}

      {/* 基础配置 */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">欢迎回来，评估员！</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative factory-dropdown-container">
            <label className="block text-sm font-medium text-slate-700 mb-1">评估工厂 <span className="text-red-500">*</span></label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFactoryDropdownOpen(!isFactoryDropdownOpen)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between text-left"
              >
                <span className={selectedFactory === null ? 'text-slate-400' : 'text-slate-700'}>
                  {selectedFactory === null ? '请选择工厂' : factoryList.find(f => f.id === selectedFactory)?.name}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isFactoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFactoryDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-lg max-h-[300px] overflow-hidden">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="搜索工厂..."
                      value={factorySearch}
                      onChange={(e) => setFactorySearch(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {factoryList
                      .filter(f => f.name.toLowerCase().includes(factorySearch.toLowerCase()))
                      .map(factory => (
                        <button
                          key={factory.id}
                          type="button"
                          onClick={() => {
                            setSelectedFactory(factory.id);
                            setIsFactoryDropdownOpen(false);
                            setFactorySearch('');
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${selectedFactory === factory.id ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}
                        >
                          {factory.name}
                        </button>
                      ))}
                    {factoryList.filter(f => f.name.toLowerCase().includes(factorySearch.toLowerCase())).length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400 text-center">未找到匹配的工厂</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="relative supplier-dropdown-container">
            <label className="block text-sm font-medium text-slate-700 mb-1">供应商 <span className="text-red-500">*</span></label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  if (!selectedFactory) {
                    toast.info('请先选择工厂');
                    return;
                  }
                  if (factorySuppliers.length === 0) {
                    toast.info('该工厂暂无关联供应商');
                    return;
                  }
                  setIsSupplierDropdownOpen(!isSupplierDropdownOpen);
                }}
                disabled={!selectedFactory || isLoadingSuppliers}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between text-left ${(!selectedFactory || factorySuppliers.length === 0) ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <span className={selectedSupplier === null ? 'text-slate-400' : 'text-slate-700'}>
                  {!selectedFactory 
                    ? '请先选择工厂' 
                    : isLoadingSuppliers 
                      ? '加载中...'
                      : factorySuppliers.length === 0
                        ? '该工厂暂无关联供应商'
                        : selectedSupplier === null 
                          ? `请选择供应商 (${factorySuppliers.length}个)` 
                          : factorySuppliers.find(s => s.id === selectedSupplier)?.name}
                </span>
                {isLoadingSuppliers ? (
                  <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin" />
                ) : (
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isSupplierDropdownOpen ? 'rotate-180' : ''}`} />
                )}
              </button>
              {isSupplierDropdownOpen && factorySuppliers.length > 0 && (
                <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-lg max-h-[300px] overflow-hidden">
                  <div className="p-2 border-b">
                    <input
                      type="text"
                      placeholder="搜索供应商..."
                      value={supplierSearch}
                      onChange={(e) => setSupplierSearch(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {factorySuppliers
                      .filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase()))
                      .map(supplier => (
                        <button
                          key={supplier.id}
                          type="button"
                          onClick={() => {
                            setSelectedSupplier(supplier.id);
                            setIsSupplierDropdownOpen(false);
                            setSupplierSearch('');
                          }}
                          className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${selectedSupplier === supplier.id ? 'bg-blue-50 text-blue-600' : 'text-slate-700'}`}
                        >
                          {supplier.name}
                        </button>
                      ))}
                    {factorySuppliers.filter(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase())).length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400 text-center">未找到匹配的供应商</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="customer-dropdown-container">
            <label className="block text-sm font-medium text-slate-700 mb-2">客户</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white flex items-center justify-between"
              >
                <span className={selectedCustomers.length === 0 ? 'text-slate-400' : 'text-slate-700'}>
                  {selectedCustomers.length === 0 ? '请选择客户' : `${selectedCustomers.length} 个客户已选择`}
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isCustomerDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {isCustomerDropdownOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border rounded-xl shadow-lg max-h-[250px] overflow-y-auto">
                  <div className="p-3 border-b">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="select-all-customers"
                        checked={selectedCustomers.length === customers.length && customers.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers(customers.map(c => c.id));
                          } else {
                            setSelectedCustomers([]);
                          }
                        }}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="select-all-customers" className="text-sm text-slate-700 cursor-pointer select-none">
                        全选
                      </label>
                    </div>
                  </div>
                  <div className="p-2">
                    {customers.map(c => (
                      <div key={c.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded">
                        <input
                          type="checkbox"
                          id={`customer-${c.id}`}
                          checked={selectedCustomers.includes(c.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCustomers([...selectedCustomers, c.id]);
                            } else {
                              setSelectedCustomers(selectedCustomers.filter(id => id !== c.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`customer-${c.id}`} className="text-sm text-slate-700 cursor-pointer select-none">
                          {c.name}
                        </label>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 border-t bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setIsCustomerDropdownOpen(false)}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                    >
                      确定
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">评估日期</label>
            <input
              type="date"
              value={evalDate}
              onChange={(e) => setEvalDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">审核性质</label>
            <select
              value={evalType}
              onChange={(e) => setEvalType(e.target.value as '常规审核' | '整改复查' | '随机抽查')}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="常规审核">常规审核</option>
              <option value="整改复查">整改复查</option>
              <option value="随机抽查">随机抽查</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">评估人员</label>
            <input
              type="text"
              value={user?.name || ''}
              disabled
              className="w-full px-4 py-2 border rounded-xl bg-slate-50 text-slate-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">订单号</label>
            <input
              type="text"
              value={orderNo}
              onChange={(e) => setOrderNo(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入订单号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">款号</label>
            <input
              type="text"
              value={styleNo}
              onChange={(e) => setStyleNo(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入款号"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">生产状态</label>
            <input
              type="text"
              value={productionStatus}
              onChange={(e) => setProductionStatus(e.target.value)}
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="请输入生产状态"
            />
          </div>
        </div>

        {/* 整改复查提示 */}
        {evalType === '整改复查' && lastEvaluation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-blue-800">
              上次评估日期：{lastEvaluation.evalDate}，得分率：{lastEvaluation.overallPercent.toFixed(2)}%
            </p>
          </div>
        )}

        {/* 整改复查/随机抽查-模块选择 */}
        {(evalType === '整改复查' || evalType === '随机抽查') && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-slate-700">
                {evalType === '整改复查' ? '请选择需要复查的模块（可多选）' : '请选择抽查的模块（可多选）'}
              </span>

              {evalType === '整改复查' && (
                <label className="ml-auto flex items-center gap-2 text-sm text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyShowLastFailed}
                    onChange={(e) => setOnlyShowLastFailed(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  只显示上次不合格模块
                </label>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {auditModules
                .filter((mod) => {
                  if (evalType !== '整改复查') return true;
                  if (!onlyShowLastFailed) return true;
                  return lastFailedModuleIds.has(mod.id);
                })
                .map(mod => (
                <label
                  key={mod.id}
                  className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-colors ${
                    selectedModules.includes(mod.name)
                      ? 'bg-blue-50 border-2 border-blue-300'
                      : 'bg-slate-50 border-2 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(mod.name)}
                    onChange={() => toggleModuleSelection(mod.name)}
                    className="hidden"
                  />
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    selectedModules.includes(mod.name) ? 'bg-blue-600' : 'bg-slate-300'
                  }`}>
                    {selectedModules.includes(mod.name) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{mod.name}</span>
                </label>
              ))}
            </div>
            {selectedModules.length === 0 && (
              <p className="mt-3 text-sm text-amber-600">请至少选择一个模块进行复查</p>
            )}
          </div>
        )}
      </div>

      {/* 操作按钮 */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
          >
            全选
          </button>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
          >
            清空
          </button>
          {!isEditMode && (
            <>
              <div className="w-px h-6 bg-slate-300 mx-2" />
              <button
                onClick={saveProgress}
                disabled={isRestoring}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                保存进度
              </button>
              {lastSavedTime && (
                <span className="text-sm text-slate-500 ml-2">
                  上次保存：{lastSavedTime.toLocaleTimeString()}
                </span>
              )}
            </>
          )}
        </div>
        <div className="text-lg font-semibold">
          总得分率：<span className="text-blue-600">{percentage.toFixed(2)}%</span>
        </div>
      </div>

      {/* 评估模块列表 */}
      <div className="space-y-4">
        {auditModules
          .filter(mod => selectedModules.includes(mod.name))
          .filter((mod) => {
            if (evalType !== '整改复查') return true;
            if (!onlyShowLastFailed) return true;
            return lastFailedModuleIds.has(mod.id);
          })
          .map(module => (
            <div key={module.id} className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              {/* 模块标题 */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold">{module.name}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg">
                    {(modulePercentages[module.name] ?? 0).toFixed(1)}%
                  </span>
                </div>
                {expandedModules.has(module.id) ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* 子模块列表 */}
              {expandedModules.has(module.id) && (
                <div className="divide-y">
                  {Object.entries(module.subModules)
                    .filter(([subModuleName, subModule]) => {
                      if (evalType !== '整改复查' || !onlyShowLastFailed) return true;
                      return subModule.items.some((it) => lastFailedItemIds.has(it.id));
                    })
                    .map(([subModuleName, subModule]) => {
                    const subModuleKey = `${module.id}-${subModuleName}`;
                    const debugInfo: string[] = [];
                    const subModuleScore = subModule.items.reduce((sum, item) => {
                      const result = currentAuditResults[item.id];
                      if (!result) return sum;

                      // 使用新的可多选计分逻辑
                      if (item.useDetailScore && item.subDetails && item.subDetails.length > 0) {
                        let itemScore = 0;
                        // 如果主项被勾选，直接得满分
                        if (result.isChecked) {
                          itemScore = item.detailScore || item.score;
                          if (item.id === 'fi2_6' || item.id === 'pfi2_6') {
                            debugInfo.push(`${item.id}: checked=${result.isChecked}, score=${itemScore}`);
                          }
                          return sum + itemScore;
                        }
                        // 主项未勾选，根据小点勾选情况计分
                        const subDetailChecks = result.subDetailChecks || {};
                        const checkedCount = item.subDetails.filter(sub => subDetailChecks[sub.id]).length;
                        const totalCount = item.subDetails.length;

                        // 尺寸测量项特殊处理：勾选小点表示有遗漏，给一半分
                        const isSizeMeasurement = item.id === 'fi2_6' || item.id === 'pfi2_6';
                        if (isSizeMeasurement) {
                          // 尺寸测量项：勾选小点=有遗漏=一半分，不勾选=0分
                          if (checkedCount > 0) {
                            itemScore = item.partialScore || (item.score / 2);
                          }
                        } else {
                          // 普通可多选项：全选=满分，部分选=一半分
                          if (checkedCount === totalCount) {
                            itemScore = item.detailScore || item.score;
                          } else if (checkedCount > 0) {
                            itemScore = item.partialScore || (item.score / 2);
                          }
                        }
                        if (item.id === 'fi2_6' || item.id === 'pfi2_6') {
                          debugInfo.push(`${item.id}: checked=${result.isChecked}, subChecked=${checkedCount}, score=${itemScore}`);
                        }
                        return sum + itemScore;
                      } else if (item.reverseScoring && item.subDetails) {
                        // 反向计分（如模块8的尺寸测量）：不选得满分，勾选得一半
                        const subDetailChecks = result.subDetailChecks || {};
                        const checkedCount = item.subDetails.filter(sub => subDetailChecks[sub.id]).length;

                        if (checkedCount === 0) {
                          // 全不选：得满分
                          return sum + (item.detailScore || item.score);
                        } else {
                          // 有任何勾选：得一半分
                          return sum + (item.partialScore || (item.score / 2));
                        }
                      } else {
                        // 普通计分逻辑
                        return sum + (result.isChecked ? item.score : 0);
                      }
                    }, 0);
                    const subModuleTotal = subModule.items.reduce((sum, item) => sum + item.score, 0);
                    const subModulePercent = subModuleTotal > 0 ? (subModuleScore / subModuleTotal) * 100 : 0;
                    if (debugInfo.length > 0) {
                      console.log(`${subModuleName}: score=${subModuleScore}, total=${subModuleTotal}, percent=${subModulePercent.toFixed(1)}%`, debugInfo);
                    }

                    return (
                      <div key={subModuleKey}>
                        <button
                          onClick={() => toggleSubModule(module.id, subModuleName)}
                          className="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{subModuleName}</span>
                            <span className="text-sm text-slate-500">
                              ({subModulePercent.toFixed(1)}%)
                            </span>
                          </div>
                          {expandedSubModules.has(subModuleKey) ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </button>

                        {expandedSubModules.has(subModuleKey) && (
                          <div className="px-6 pb-4 space-y-3">
                            {subModule.items
                              .filter((item) => {
                                if (evalType !== '整改复查' || !onlyShowLastFailed) return true;
                                return lastFailedItemIds.has(item.id);
                              })
                              .map(item => {
                              const result = currentAuditResults[item.id] || {
                                isChecked: false,
                                details: [],
                                imagePath: null,
                              };
                              const lastStatus = getLastStatus(item.id);

                              return (
                                <div
                                  key={item.id}
                                  className={`p-4 rounded-xl border-2 transition-colors ${
                                    result.isChecked
                                      ? 'border-green-200 bg-green-50/50'
                                      : 'border-slate-100'
                                  }`}
                                >
                                  <div className="flex items-start gap-4">
                                    {/* 复选框 */}
                                    <div className="flex-shrink-0 pt-1">
                                      <input
                                        type="checkbox"
                                        checked={result.isChecked}
                                        onChange={(e) => handleCheckChange(item.id, e.target.checked, item)}
                                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                      />
                                    </div>

                                    {/* 评分项内容 */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className={item.isKey || item.score >= 2 ? 'text-orange-600 font-medium' : ''}>
                                          {item.name}
                                        </span>
                                        {(item.isKey || item.score >= 2) && (
                                          <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                                            关键项
                                          </span>
                                        )}
                                        {lastStatus && lastStatus !== '' && (
                                          <span
                                            className={`text-xs ${
                                              lastStatus.includes('合格')
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                            }`}
                                          >
                                            | {lastStatus}
                                          </span>
                                        )}
                                      </div>

                                      {/* 新的可多选小点逻辑（排除反向计分项） */}
                                      {item.useDetailScore && !item.reverseScoring && item.subDetails && item.subDetails.length > 0 && (
                                        <div className="mt-2">
                                          {/* 主项未勾选时，显示小点供选择 */}
                                          {!result.isChecked && (
                                            <div className="flex flex-wrap gap-2">
                                              {item.subDetails.map((subDetail) => (
                                                <label
                                                  key={subDetail.id}
                                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                                                    (result.subDetailChecks || {})[subDetail.id]
                                                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                                      : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                                  }`}
                                                >
                                                  <input
                                                    type="checkbox"
                                                    checked={(result.subDetailChecks || {})[subDetail.id] || false}
                                                    onChange={(e) => handleSubDetailChange(item.id, subDetail.id, e.target.checked)}
                                                    className="hidden"
                                                  />
                                                  {subDetail.name}
                                                </label>
                                              ))}
                                            </div>
                                          )}
                                          {/* 主项勾选时，显示提示 */}
                                          {result.isChecked && (
                                            <div className="mt-1 text-sm text-green-600">
                                              {item.id === 'fi2_6' || item.id === 'pfi2_6' ? '✓ 全部合格' : '✓ 已全部满足'}
                                            </div>
                                          )}
                                        </div>
                                      )}

                                      {/* 反向计分逻辑（如模块8尺寸测量） */}
                                      {item.reverseScoring && item.subDetails && item.subDetails.length > 0 && (
                                        <div className="mt-2">
                                          <div className="flex flex-wrap gap-2">
                                            {item.subDetails.map((subDetail) => (
                                              <label
                                                key={subDetail.id}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                                                  (result.subDetailChecks || {})[subDetail.id]
                                                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                                }`}
                                              >
                                                <input
                                                  type="checkbox"
                                                  checked={(result.subDetailChecks || {})[subDetail.id] || false}
                                                  onChange={(e) => handleSubDetailChange(item.id, subDetail.id, e.target.checked)}
                                                  className="hidden"
                                                />
                                                {subDetail.name}
                                              </label>
                                            ))}
                                          </div>
                                          <div className="mt-1 text-xs text-slate-500">
                                            {item.comment}
                                          </div>
                                        </div>
                                      )}

                                      {/* 原有详情选择（仅Light Woven兼容） */}
                                      {!result.isChecked && !item.useDetailScore && !item.reverseScoring && item.details.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                          {item.details.map((detail) => (
                                            <label
                                              key={detail}
                                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                                                (result.details || []).includes(detail)
                                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                                  : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                                              }`}
                                            >
                                              <input
                                                type="checkbox"
                                                checked={(result.details || []).includes(detail)}
                                                onChange={(e) => {
                                                  const currentDetails = result.details || [];
                                                  const newDetails = e.target.checked
                                                    ? [...currentDetails, detail]
                                                    : currentDetails.filter((d) => d !== detail);
                                                  handleDetailsChange(item.id, newDetails);
                                                }}
                                                className="hidden"
                                              />
                                              {detail}
                                            </label>
                                          ))}
                                        </div>
                                      )}

                                      {/* 未通过时显示评论输入框 */}
                                      {!result.isChecked && (
                                        <div className="mt-3">
                                          <label className="block text-sm font-medium text-slate-700 mb-1">
                                            评论：
                                          </label>
                                          <textarea
                                            value={result.comment || ''}
                                            onChange={(e) => handleCommentChange(item.id, e.target.value)}
                                            placeholder="请输入评论..."
                                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px]"
                                          />
                                        </div>
                                      )}


                                    </div>

                                    {/* 拍照上传 - 只有不合格时才显示 */}
                                    {!result.isChecked && (
                                      <div className="flex-shrink-0">
                                        <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                                          <Camera className="w-4 h-4" />
                                          <span className="text-sm">拍照</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (file) handleImageUpload(item.id, file);
                                            }}
                                          />
                                        </label>
                                      </div>
                                    )}

                                    {/* 图片预览 */}
                                    {result.imagePath && (
                                      <div className="flex-shrink-0 relative">
                                        <img
                                          src={result.imagePath}
                                          alt="证据"
                                          className="w-16 h-16 object-cover rounded-lg"
                                        />
                                        <button
                                          onClick={() => handleDeleteImage(item.id)}
                                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                                        >
                                          ×
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
      </div>

      {/* 评估汇总 */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold mb-4">评估汇总</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">综合评估意见</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="请输入综合评估意见..."
              rows={4}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="text-sm text-slate-500 mb-1">得分率</div>
              <div className="text-3xl font-bold text-blue-600">
                {percentage.toFixed(2)}%
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              保存并生成报告
            </button>
          </div>
        </div>
      </div>

      {/* 优先级排序弹窗 */}
      <PrioritySortModal
        isOpen={showPriorityModal}
        onClose={handlePriorityCancel}
        onConfirm={handlePriorityConfirm}
        results={currentAuditResults}
      />
    </div>
  );
}
