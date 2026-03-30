import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Factory, EvaluationRecord, AuditResult, Supplier, Customer } from '../types';
import { factoryService, evaluationService, userService, supplierService, customerService } from '../lib/database';
import { factories as defaultFactories, suppliers as defaultSuppliers, mockEvaluations } from '../data/mockData';

interface AppContextType {
  // 认证状态
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;

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

// 模拟用户数据
const mockUsers: { [key: string]: { password: string; name: string; role: 'admin' | 'sadmin' | 'user' } } = {
  'admin': { password: 'admin123', name: '管理员', role: 'admin' },
  'sadmin': { password: 'sadmin123', name: '高级管理员', role: 'sadmin' },
  'zhangsan': { password: 'zhangsan123', name: '张三', role: 'user' },
  'lisi': { password: 'lisi123', name: '李四', role: 'user' },
  'wangwu': { password: 'wangwu123', name: '王五', role: 'user' },
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

  // 从Supabase加载数据
  const syncData = async () => {
    console.log('开始同步数据...');
    setIsLoading(true);
    setError(null);
    try {
      console.log('当前时间:', new Date().toISOString());
      
      // 并行加载所有数据，任何一个失败都应该抛出错误
      const [factories, suppliers, customers, users, evals] = await Promise.all([
        factoryService.getFactories(),
        supplierService.getSuppliers(),
        customerService.getCustomers(),
        userService.getUsers(),
        evaluationService.getEvaluations()
      ]);

      console.log('同步数据完成:', {
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
      
      console.log('数据更新完成');
    } catch (error) {
      console.error('同步数据失败:', error);
      setError(error instanceof Error ? error.message : '同步数据失败，请检查网络连接和Supabase配置');
      // 不抛出错误，这样用户就可以看到错误信息，而不是被强制登出
    } finally {
      setIsLoading(false);
      console.log('同步数据操作完成');
    }
  };

  // 初始化加载
  useEffect(() => {
    console.log('开始初始化加载...');
    
    // 先从localStorage恢复登录状态
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      console.log('从localStorage恢复登录状态:', parsedUser);
    }

    // 同步Supabase数据
    console.log('调用syncData函数...');
    syncData().then(() => {
      console.log('syncData函数执行完成');
    }).catch((error) => {
      console.error('初始化同步数据失败:', error);
      // 当同步数据失败时，不重置登录状态，这样用户就可以看到错误信息
      // 可以在这里添加错误提示，例如使用toast.error
    });
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // 尝试Supabase登录
      const supabaseUser = await userService.login(username, password);
      if (supabaseUser) {
        setUser(supabaseUser);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(supabaseUser));
        await syncData(); // 登录后同步数据
        return true;
      }
    } catch (error) {
      console.error('Supabase登录失败:', error);
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
      console.error('添加工厂失败:', error);
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
      console.error('更新工厂失败:', error);
    }
  };

  const deleteFactory = async (id: number) => {
    try {
      await factoryService.deleteFactory(id);
      setFactoryList(factoryList.filter(f => f.id !== id));
    } catch (error) {
      console.error('删除工厂失败:', error);
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
      console.error('添加供应商失败:', error);
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
      console.error('更新供应商失败:', error);
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
      console.error('删除供应商失败:', error);
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
      console.error('添加客户失败:', error);
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
      console.error('更新客户失败:', error);
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
      console.error('删除客户失败:', error);
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
      console.error('添加用户失败:', error);
    }
  };

  const updateUser = async (id: string, updates: Partial<User>) => {
    try {
      const ok = await userService.updateUser(id, updates);
      if (ok) {
        await syncData();
      }
    } catch (error) {
      console.error('更新用户失败:', error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const ok = await userService.deleteUser(id);
      if (ok) {
        await syncData();
      }
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const addEvaluation = async (evaluation: Omit<EvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EvaluationRecord | null> => {
    try {
      console.log('开始添加评估记录:', evaluation);
      const newEvaluation = await evaluationService.createEvaluation(evaluation);
      console.log('创建评估结果:', newEvaluation);
      if (newEvaluation) {
        setEvaluations([newEvaluation, ...evaluations]);
        return newEvaluation;
      }
      console.error('创建评估记录返回 null');
      return null;
    } catch (error) {
      console.error('添加评估记录异常:', error);
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
      console.error('更新评估记录失败:', error);
      return null;
    }
  };

  const deleteEvaluation = async (id: string) => {
    try {
      await evaluationService.deleteEvaluation(id);
      setEvaluations(evaluations.filter(e => e.id !== id));
    } catch (error) {
      console.error('删除评估记录失败:', error);
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
