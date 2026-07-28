import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Factory, EvaluationRecord, AuditResult, Supplier, Customer, FactoryType } from '../types';
import { factoryService, evaluationService, userService, supplierService, customerService } from '../lib/database';
import { factories as defaultFactories, suppliers as defaultSuppliers, mockEvaluations } from '../data/mockData';
import { t } from '../i18n/translations';

interface AppContextType {
  // 认证状态
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string, factoryType: FactoryType) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;

  // 工厂类型
  factoryType: FactoryType;
  setFactoryType: (type: FactoryType) => void;

  // 语言
  language: 'zh' | 'en';
  setLanguage: (lang: 'zh' | 'en') => void;

  // 工厂数据
  factoryList: Factory[];
  setFactoryList: (factories: Factory[]) => void;
  addFactory: (factory: Factory) => Promise<void>;
  updateFactory: (id: number, factory: Factory) => Promise<void>;
  deleteFactory: (id: number) => Promise<void>;

  // 供应商数据
  supplierList: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
  updateSupplier: (id: number, supplier: Partial<Supplier>) => Promise<void>;
  deleteSupplier: (id: number) => Promise<void>;

  // 客户数据
  customerList: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => Promise<void>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;

  // 用户（评估人员）维护 - 仅 sadmin 使用
  userList: User[];
  addUser: (user: { username: string; password: string; name: string; role: 'admin' | 'sadmin' | 'user' }) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  // 评估数据
  evaluations: EvaluationRecord[];
  addEvaluation: (evaluation: Omit<EvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEvaluation: (id: string, evaluation: Partial<EvaluationRecord>) => Promise<void>;
  deleteEvaluation: (id: string) => Promise<void>;
  getEvaluationsByUser: (userId: string, role: string) => EvaluationRecord[];
  getEvaluationsByFactory: (factoryId: number) => EvaluationRecord[];

  // 当前评估会话
  currentAuditResults: { [key: string]: AuditResult };
  setCurrentAuditResults: (results: { [key: string]: AuditResult }) => void;
  clearCurrentAuditResults: () => void;

  // 编辑模式
  isEditMode: boolean;
  editingRecord: EvaluationRecord | null;
  setEditMode: (isEdit: boolean, record?: EvaluationRecord | null) => void;

  // 数据同步
  syncData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// 模拟用户数据（中文）
const mockUsersZh: { [key: string]: { password: string; name: string; role: 'admin' | 'sadmin' | 'user' } } = {
  'admin': { password: 'admin123', name: '管理员', role: 'admin' },
  'sadmin': { password: 'sadmin123', name: '高级管理员', role: 'sadmin' },
  'zhangsan': { password: 'zhangsan123', name: '张三', role: 'user' },
  'lisi': { password: 'lisi123', name: '李四', role: 'user' },
  'wangwu': { password: 'wangwu123', name: '王五', role: 'user' },
};

// 模拟用户数据（英文）
const mockUsersEn: { [key: string]: { password: string; name: string; role: 'admin' | 'sadmin' | 'user' } } = {
  'admin': { password: 'admin123', name: 'Admin', role: 'admin' },
  'sadmin': { password: 'sadmin123', name: 'Super Admin', role: 'sadmin' },
  'zhangsan': { password: 'zhangsan123', name: 'Zhang San', role: 'user' },
  'lisi': { password: 'lisi123', name: 'Li Si', role: 'user' },
  'wangwu': { password: 'wangwu123', name: 'Wang Wu', role: 'user' },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const enableMockFallback = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [factoryList, setFactoryList] = useState<Factory[]>([]);
  const [supplierList, setSupplierList] = useState<Supplier[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [userList, setUserList] = useState<User[]>([]);
  const [evaluations, setEvaluations] = useState<EvaluationRecord[]>([]);
  const [currentAuditResults, setCurrentAuditResults] = useState<{ [key: string]: AuditResult }>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRecord, setEditingRecord] = useState<EvaluationRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 工厂类型状态
  const [factoryType, setFactoryType] = useState<FactoryType>(() => {
    const saved = localStorage.getItem('factoryType');
    return (saved as FactoryType) || 'light-woven';
  });

  // 语言状态
  const [language, setLanguage] = useState<'zh' | 'en'>(() => {
    const saved = localStorage.getItem('language');
    return (saved as 'zh' | 'en') || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // 从Supabase加载数据
  const syncData = async () => {
    console.log(language === 'zh' ? '开始同步数据...' : 'Starting data sync...');
    setIsLoading(true);
    setError(null);
    try {
      console.log(language === 'zh' ? '当前时间:' : 'Current time:', new Date().toISOString());

      // 并行加载所有数据，任何一个失败都应该抛出错误
      const [factories, suppliers, customers, users, evals] = await Promise.all([
        factoryService.getFactories(),
        supplierService.getSuppliers(),
        customerService.getCustomers(),
        userService.getUsers(),
        evaluationService.getEvaluations()
      ]);

      console.log(language === 'zh' ? '同步数据完成:' : 'Data sync complete:', {
        factories: factories.length,
        suppliers: suppliers.length,
        customers: customers.length,
        users: users.length,
        evals: evals.length
      });

      // 直接使用Supabase返回的数据，不使用默认数据作为回退
      setFactoryList(factories);
      setSupplierList(suppliers);
      setCustomerList(customers);
      // 只有 sadmin 才需要用户列表；其他角色清空避免误用
      setUserList(user?.role === 'sadmin' ? users : []);
      setEvaluations(evals);

      console.log(language === 'zh' ? '数据更新完成' : 'Data update complete');
    } catch (error) {
      console.error(language === 'zh' ? '同步数据失败:' : 'Sync data failed:', error);
      setError(error instanceof Error ? error.message : t(language, 'common.syncDataFailed'));
      // 不抛出错误，这样用户就可以看到错误信息，而不是被强制登出
    } finally {
      setIsLoading(false);
      console.log(language === 'zh' ? '同步数据操作完成' : 'Data sync operation complete');
    }
  };

  // 初始化加载
  useEffect(() => {
    console.log(language === 'zh' ? '开始初始化加载...' : 'Starting initial load...');

    // 先从localStorage恢复登录状态
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      console.log(language === 'zh' ? '从localStorage恢复登录状态:' : 'Restored login state from localStorage:', parsedUser);
    }

    // 同步Supabase数据
    console.log(language === 'zh' ? '调用syncData函数...' : 'Calling syncData function...');
    syncData().then(() => {
      console.log(language === 'zh' ? 'syncData函数执行完成' : 'syncData function complete');
    }).catch((error) => {
      console.error(language === 'zh' ? '初始化同步数据失败:' : 'Initial data sync failed:', error);
      // 当同步数据失败时，不重置登录状态，这样用户就可以看到错误信息
      // 可以在这里添加错误提示，例如使用toast.error
    });
  }, []);

  const login = async (username: string, password: string, selectedFactoryType: FactoryType): Promise<boolean> => {
    try {
      // 尝试Supabase登录
      const supabaseUser = await userService.login(username, password);
      if (supabaseUser) {
        setUser(supabaseUser);
        setIsLoggedIn(true);
        setFactoryType(selectedFactoryType);
        localStorage.setItem('user', JSON.stringify(supabaseUser));
        localStorage.setItem('factoryType', selectedFactoryType);
        await syncData(); // 登录后同步数据
        return true;
      }
    } catch (error) {
      console.error(language === 'zh' ? 'Supabase登录失败:' : 'Supabase login failed:', error);
      throw error;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentAuditResults({});
    setIsEditMode(false);
    setEditingRecord(null);
    localStorage.removeItem('user');
    localStorage.removeItem('factoryType');
  };

  const addFactory = async (factory: Factory) => {
    try {
      const newFactory = await factoryService.createFactory({
        name: factory.name,
        address: factory.address,
        contact: factory.contact,
        phone: factory.phone,
        createdBy: user?.id
      });
      if (newFactory) {
        setFactoryList([...factoryList, newFactory]);
      }
    } catch (error) {
      console.error(language === 'zh' ? '添加工厂失败:' : 'Add factory failed:', error);
    }
  };

  const updateFactory = async (id: number, factory: Factory) => {
    try {
      await factoryService.updateFactory(id, {
        name: factory.name,
        address: factory.address,
        contact: factory.contact,
        phone: factory.phone
      });
      setFactoryList(factoryList.map(f => f.id === id ? factory : f));
    } catch (error) {
      console.error(language === 'zh' ? '更新工厂失败:' : 'Update factory failed:', error);
    }
  };

  const deleteFactory = async (id: number) => {
    try {
      await factoryService.deleteFactory(id);
      setFactoryList(factoryList.filter(f => f.id !== id));
    } catch (error) {
      console.error(language === 'zh' ? '删除工厂失败:' : 'Delete factory failed:', error);
    }
  };

  const addSupplier = async (supplier: Omit<Supplier, 'id'>) => {
    try {
      const created = await supplierService.createSupplier(supplier);
      if (created) {
        setSupplierList([...supplierList, created]);
        await syncData(); // 同步数据，确保显示最新的供应商列表
      }
    } catch (error) {
      console.error(language === 'zh' ? '添加供应商失败:' : 'Add supplier failed:', error);
      throw error;
    }
  };

  const updateSupplier = async (id: number, supplier: Partial<Supplier>) => {
    try {
      const ok = await supplierService.updateSupplier(id, supplier);
      if (ok) {
        setSupplierList(supplierList.map(s => (s.id === id ? { ...s, ...supplier } : s)));
        await syncData(); // 同步数据，确保显示最新的供应商列表
      }
    } catch (error) {
      console.error(language === 'zh' ? '更新供应商失败:' : 'Update supplier failed:', error);
      throw error;
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      const ok = await supplierService.deleteSupplier(id);
      if (ok) {
        setSupplierList(supplierList.filter(s => s.id !== id));
        await syncData(); // 同步数据，确保显示最新的供应商列表
      }
    } catch (error) {
      console.error(language === 'zh' ? '删除供应商失败:' : 'Delete supplier failed:', error);
      throw error;
    }
  };

  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const result = await customerService.createCustomer(customer);
      if (result) {
        setCustomerList([...customerList, result]);
        await syncData();
      }
    } catch (error) {
      console.error(language === 'zh' ? '添加客户失败:' : 'Add customer failed:', error);
      throw error;
    }
  };

  const updateCustomer = async (id: number, customer: Partial<Customer>) => {
    try {
      const ok = await customerService.updateCustomer(id, customer);
      if (ok) {
        setCustomerList(customerList.map(c => c.id === id ? { ...c, ...customer } : c));
        await syncData();
      }
    } catch (error) {
      console.error(language === 'zh' ? '更新客户失败:' : 'Update customer failed:', error);
      throw error;
    }
  };

  const deleteCustomer = async (id: number) => {
    try {
      const ok = await customerService.deleteCustomer(id);
      if (ok) {
        setCustomerList(customerList.filter(c => c.id !== id));
        await syncData();
      }
    } catch (error) {
      console.error(language === 'zh' ? '删除客户失败:' : 'Delete customer failed:', error);
      throw error;
    }
  };

  const addUser = async (newUser: { username: string; password: string; name: string; role: 'admin' | 'sadmin' | 'user' }) => {
    try {
      const ok = await userService.createUser(newUser);
      if (ok) {
        await syncData();
      }
    } catch (error) {
      console.error(language === 'zh' ? '添加用户失败:' : 'Add user failed:', error);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const ok = await userService.updateUser(id, updates);
      if (ok) {
        await syncData();
      }
    } catch (error) {
      console.error(language === 'zh' ? '更新用户失败:' : 'Update user failed:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const ok = await userService.deleteUser(id);
      if (ok) {
        await syncData();
      }
    } catch (error) {
      console.error(language === 'zh' ? '删除用户失败:' : 'Delete user failed:', error);
    }
  };

  const addEvaluation = async (evaluation: Omit<EvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EvaluationRecord | null> => {
    try {
      console.log(language === 'zh' ? '开始添加评估记录:' : 'Start adding evaluation record:', evaluation);
      const newEvaluation = await evaluationService.createEvaluation(evaluation);
      console.log(language === 'zh' ? '创建评估结果:' : 'Create evaluation result:', newEvaluation);
      if (newEvaluation) {
        setEvaluations([newEvaluation, ...evaluations]);
        return newEvaluation;
      }
      console.error(language === 'zh' ? '创建评估记录返回 null' : 'Create evaluation returned null');
      return null;
    } catch (error) {
      console.error(language === 'zh' ? '添加评估记录异常:' : 'Add evaluation error:', error);
      return null;
    }
  };

  const updateEvaluation = async (id: string, evaluation: Partial<EvaluationRecord>): Promise<EvaluationRecord | null> => {
    try {
      const success = await evaluationService.updateEvaluation(id, evaluation);
      if (success) {
        const updatedEvaluations = evaluations.map(e =>
          e.id === id ? { ...e, ...evaluation, updatedAt: new Date().toISOString() } : e
        );
        setEvaluations(updatedEvaluations);
        return updatedEvaluations.find(e => e.id === id) || null;
      }
      return null;
    } catch (error) {
      console.error(language === 'zh' ? '更新评估记录失败:' : 'Update evaluation failed:', error);
      return null;
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      await evaluationService.deleteEvaluation(id);
      setEvaluations(evaluations.filter(e => e.id !== id));
    } catch (error) {
      console.error(language === 'zh' ? '删除评估记录失败:' : 'Delete evaluation failed:', error);
    }
  };

  const getEvaluationsByUser = (userId: string, role: string): EvaluationRecord[] => {
    // 所有用户都可以看到所有评估记录
    return evaluations;
  };

  const getEvaluationsByFactory = (factoryId: number): EvaluationRecord[] => {
    return evaluations.filter(e => e.factoryId === factoryId);
  };

  const clearCurrentAuditResults = () => {
    setCurrentAuditResults({});
  };

  const setEditMode = (isEdit: boolean, record?: EvaluationRecord | null) => {
    setIsEditMode(isEdit);
    setEditingRecord(record || null);
    if (record) {
      setCurrentAuditResults(record.results);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        user,
        login,
        logout,
        isLoading,
        error,
        setError,
        factoryType,
        setFactoryType,
        language,
        setLanguage,
        factoryList,
        setFactoryList,
        addFactory,
        updateFactory,
        deleteFactory,
        supplierList,
        addSupplier,
        updateSupplier,
        deleteSupplier,
        customerList,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        userList,
        addUser,
        updateUser,
        deleteUser,
        evaluations,
        addEvaluation,
        updateEvaluation,
        deleteEvaluation,
        getEvaluationsByUser,
        getEvaluationsByFactory,
        currentAuditResults,
        setCurrentAuditResults,
        clearCurrentAuditResults,
        isEditMode,
        editingRecord,
        setEditMode,
        syncData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
