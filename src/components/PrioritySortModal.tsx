import React, { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown, AlertCircle, GripVertical } from 'lucide-react';
import { AuditItem, AuditResult, FailedItemPriority, AuditModule } from '../types';
import { lightWovenModules, lingerieSwimwearModules } from '../data/factoryModules';

interface FailedItem {
  itemId: string;
  item: AuditItem;
  result: AuditResult;
  moduleName: string;
  subModuleName: string;
}

// 获取所有模块
const allModules: AuditModule[] = [...lightWovenModules, ...lingerieSwimwearModules];

// 创建 item ID 到模块信息的映射
const itemIdToModuleMap = new Map<string, { item: AuditItem; moduleName: string; subModuleName: string }>();
allModules.forEach(module => {
  Object.entries(module.subModules).forEach(([subModuleName, subModule]) => {
    subModule.items.forEach(item => {
      itemIdToModuleMap.set(item.id, { item, moduleName: module.name, subModuleName });
    });
  });
});

interface PrioritySortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (priorities: FailedItemPriority[]) => void;
  results: { [key: string]: AuditResult };
}

export function PrioritySortModal({ isOpen, onClose, onConfirm, results }: PrioritySortModalProps) {
  const [items, setItems] = useState<FailedItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 提取不合格项
  useEffect(() => {
    if (!isOpen) return;

    const failedItems: FailedItem[] = [];
    
    // 只遍历 results 中实际有数据的项，而不是所有模块
    Object.entries(results).forEach(([itemId, result]) => {
      if (result && !result.isChecked) {
        const moduleInfo = itemIdToModuleMap.get(itemId);
        if (moduleInfo) {
          failedItems.push({
            itemId,
            item: moduleInfo.item,
            result,
            moduleName: moduleInfo.moduleName,
            subModuleName: moduleInfo.subModuleName
          });
        }
      }
    });

    // 按分值降序排序（分值高的在前）作为初始排序
    failedItems.sort((a, b) => b.item.score - a.item.score);
    
    setItems(failedItems);
  }, [isOpen, results]);

  // 上移
  const moveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
    setItems(newItems);
  };

  // 下移
  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
    setItems(newItems);
  };

  // 置顶
  const moveToTop = (index: number) => {
    if (index === 0) return;
    const newItems = [...items];
    const item = newItems.splice(index, 1)[0];
    newItems.unshift(item);
    setItems(newItems);
  };

  // 置底
  const moveToBottom = (index: number) => {
    if (index === items.length - 1) return;
    const newItems = [...items];
    const item = newItems.splice(index, 1)[0];
    newItems.push(item);
    setItems(newItems);
  };

  // 按分值自动排序
  const sortByScore = () => {
    const newItems = [...items];
    newItems.sort((a, b) => b.item.score - a.item.score);
    setItems(newItems);
  };

  // 确认
  const handleConfirm = () => {
    const priorities: FailedItemPriority[] = items.map((item, index) => ({
      itemId: item.itemId,
      priority: index + 1,
      isUrgent: index < 10 // 前10项为急需
    }));
    onConfirm(priorities);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-900">不合格项优先级排序</h2>
            <p className="text-sm text-gray-500 mt-1">
              请调整整改优先级，前 <span className="text-red-600 font-semibold">10项</span> 将归为"急需整改项"
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 工具栏 */}
        <div className="px-6 py-3 bg-gray-50 border-b flex items-center gap-4">
          <span className="text-sm text-gray-600">
            共 <span className="font-semibold">{items.length}</span> 项不合格
          </span>
          <div className="flex-1"></div>
          <button
            onClick={sortByScore}
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            按分值自动排序
          </button>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {items.map((item, index) => (
              <div
                key={item.itemId}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                  index < 10
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {/* 序号 */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  index < 10
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>

                {/* 拖拽图标 */}
                <div className="flex-shrink-0 text-gray-400 cursor-move">
                  <GripVertical className="w-5 h-5" />
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {item.moduleName} - {item.subModuleName}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      index < 10
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {index < 10 ? '急需' : '一般'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">
                    {item.item.name}
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>分值: {item.item.score}分</span>
                    {item.result.details && item.result.details.length > 0 && (
                      <span className="truncate">
                        详情: {item.result.details.join(', ')}
                      </span>
                    )}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveToTop(index)}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30"
                    title="置顶"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30"
                    title="上移"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === items.length - 1}
                    className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30"
                    title="下移"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveToBottom(index)}
                    disabled={index === items.length - 1}
                    className="p-1.5 hover:bg-white rounded transition-colors disabled:opacity-30"
                    title="置底"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>没有不合格项需要排序</p>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            前10项为"急需整改项"，其余为"一般整改项"
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              onClick={handleConfirm}
              disabled={items.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              保存并生成报告
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
