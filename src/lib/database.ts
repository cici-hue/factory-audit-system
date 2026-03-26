import { supabase, supabaseUrl } from './supabase';
import { User, Factory, EvaluationRecord, AuditResult, Supplier, Customer } from '../types';

type DbEvalType = 'initial' | 'followup' | 'random';
type UiEvalType = EvaluationRecord['evalType'];

function toDbEvalType(ui: UiEvalType): DbEvalType {
  if (ui === '常规审核') return 'initial';
  if (ui === '整改复查') return 'followup';
  return 'random';
}

function fromDbEvalType(db: DbEvalType | string): UiEvalType {
  if (db === 'followup') return '整改复查';
  if (db === 'random') return '随机抽查';
  return '常规审核';
}

// 用户服务
export const userService = {
  // 获取所有用户
  async getUsers(): Promise<User[]> {
    console.log('开始获取用户数据...');
    console.log('Supabase实例:', !!supabase);
    console.log('Supabase URL:', supabaseUrl);
    
    try {
      console.log('开始查询users表...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at');

      console.log('Supabase响应:', { data, error });

      if (error) {
        console.error('获取用户失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);
        console.error('错误提示:', error.hint);
        throw new Error(`获取用户失败: ${error.message} (代码: ${error.code})`);
      }

      console.log('获取到用户数据:', data);
      console.log('用户数据长度:', data.length);

      return data.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        username: user.username
      }));
    } catch (error) {
      console.error('获取用户时发生异常:', error);
      throw error;
    }
  },

  // 用户登录
  async login(username: string, password: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error || !data) {
      console.error('登录失败:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      role: data.role,
      username: data.username
    };
  },

  // 创建用户
  async createUser(user: { username: string; password: string; name: string; role: 'admin' | 'sadmin' | 'user' }): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .insert([user]);

    if (error) {
      console.error('创建用户失败:', error);
      return false;
    }

    return true;
  },

  // 更新用户
  async updateUser(id: string, updates: Partial<User>): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('更新用户失败:', error);
      return false;
    }

    return true;
  },

  // 删除用户
  async deleteUser(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除用户失败:', error);
      return false;
    }

    return true;
  }
};

// 工厂服务
export const factoryService = {
  // 获取所有工厂
  async getFactories(): Promise<Factory[]> {
    console.log('开始获取工厂数据...');
    console.log('Supabase实例:', !!supabase);
    console.log('Supabase URL:', supabaseUrl);
    
    try {
      console.log('开始查询factories表...');
      const { data, error } = await supabase
        .from('factories')
        .select('*')
        .order('created_at');

      console.log('Supabase响应:', { data, error });

      if (error) {
        console.error('获取工厂失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);
        console.error('错误提示:', error.hint);
        throw new Error(`获取工厂失败: ${error.message} (代码: ${error.code})`);
      }

      console.log('获取到工厂数据:', data);
      console.log('工厂数据长度:', data.length);
      
      return data.map((factory) => ({
        id: factory.id,
        name: factory.name,
        address: factory.address || '',
        contact: factory.contact || '',
        phone: factory.phone || ''
      }));
    } catch (error) {
      console.error('获取工厂时发生异常:', error);
      throw error;
    }
  },

  // 创建工厂
  async createFactory(factory: Omit<Factory, 'id'>): Promise<Factory | null> {
    console.log('开始创建工厂:', factory);
    const { data, error } = await supabase
      .from('factories')
      .insert([{
        name: factory.name,
        address: factory.address,
        contact: factory.contact,
        phone: factory.phone,
        created_by: factory.createdBy
      }])
      .select()
      .single();

    if (error) {
      console.error('创建工厂失败:', error);
      return null;
    }

    console.log('创建工厂成功:', data);
    return {
      id: data.id,
      name: data.name,
      address: data.address || '',
      contact: data.contact || '',
      phone: data.phone || ''
    };
  },

  // 更新工厂
  async updateFactory(id: number, updates: Partial<Factory>): Promise<boolean> {
    const { error } = await supabase
      .from('factories')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('更新工厂失败:', error);
      return false;
    }

    return true;
  },

  // 删除工厂
  async deleteFactory(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('factories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除工厂失败:', error);
      return false;
    }

    return true;
  }
};

// 供应商服务
export const supplierService = {
  async getSuppliers(): Promise<Supplier[]> {
    console.log('开始获取供应商数据...');
    console.log('Supabase实例:', !!supabase);
    console.log('Supabase URL:', supabaseUrl);
    
    try {
      console.log('开始查询suppliers表...');
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('created_at');

      console.log('Supabase响应:', { data, error });

      if (error) {
        console.error('获取供应商失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);
        console.error('错误提示:', error.hint);
        throw new Error(`获取供应商失败: ${error.message} (代码: ${error.code})`);
      }

      console.log('获取到供应商数据:', data);
      console.log('供应商数据长度:', data.length);
      
      return data.map((s) => ({
        id: s.id,
        name: s.name,
        contact: s.contact || '',
        phone: s.phone || '',
      }));
    } catch (error) {
      console.error('获取供应商时发生异常:', error);
      throw error;
    }
  },

  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier | null> {
    const { data, error } = await supabase
      .from('suppliers')
      .insert([{
        name: supplier.name,
        contact: supplier.contact || '',
        phone: supplier.phone || '',
      }])
      .select()
      .single();

    if (error) {
      console.error('创建供应商失败:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      contact: data.contact || '',
      phone: data.phone || '',
    };
  },

  async updateSupplier(id: number, updates: Partial<Supplier>): Promise<boolean> {
    const { error } = await supabase
      .from('suppliers')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('更新供应商失败:', error);
      return false;
    }

    return true;
  },

  async deleteSupplier(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('suppliers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除供应商失败:', error);
      return false;
    }

    return true;
  }
};

// 客户服务
export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    console.log('开始获取客户数据...');
    
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) {
        console.error('获取客户失败:', error);
        throw new Error(`获取客户失败: ${error.message} (代码: ${error.code})`);
      }

      console.log('获取到客户数据:', data);
      return data.map(customer => ({
        id: customer.id,
        name: customer.name,
        contact: customer.contact || '',
        phone: customer.phone || '',
        address: customer.address || '',
      }));
    } catch (error) {
      console.error('获取客户时发生异常:', error);
      throw error;
    }
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .insert([{
        name: customer.name,
        contact: customer.contact || '',
        phone: customer.phone || '',
        address: customer.address || '',
      }])
      .select()
      .single();

    if (error) {
      console.error('创建客户失败:', error);
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      contact: data.contact || '',
      phone: data.phone || '',
      address: data.address || '',
    };
  },

  async updateCustomer(id: number, updates: Partial<Customer>): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('更新客户失败:', error);
      return false;
    }

    return true;
  },

  async deleteCustomer(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除客户失败:', error);
      return false;
    }

    return true;
  }
};

// 评估记录服务
export const evaluationService = {
  // 获取所有评估记录
  async getEvaluations(): Promise<EvaluationRecord[]> {
    console.log('开始获取评估记录数据...');
    console.log('Supabase实例:', !!supabase);
    console.log('Supabase URL:', supabaseUrl);
    
    try {
      console.log('开始查询evaluations表...');
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Supabase响应:', { data, error });

      if (error) {
        console.error('获取评估记录失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);
        console.error('错误提示:', error.hint);
        throw new Error(`获取评估记录失败: ${error.message} (代码: ${error.code})`);
      }

      console.log('获取到评估记录数据:', data);
      console.log('评估记录数据长度:', data.length);

      return data.map(record => ({
        id: record.id,
        factoryId: record.factory_id,
        factoryName: record.factory_name,
        evaluator: record.evaluator_name,
        evaluatorId: record.evaluator_id,
        evalDate: record.eval_date,
        evalType: fromDbEvalType(record.eval_type),
        supplierId: record.supplier_id ?? undefined,
        supplierName: record.supplier_name ?? undefined,
        customerId: record.customer_id ?? undefined,
        customerName: record.customer_name ?? undefined,
        customerIds: record.customer_ids ?? undefined,
        customerNames: record.customer_names ?? undefined,
        orderNo: record.order_no ?? undefined,
        styleNo: record.style_no ?? undefined,
        productionStatus: record.production_status ?? undefined,
        selectedModules: record.selected_modules,
        overallPercent: parseFloat(record.overall_percent),
        results: record.results || {},
        comments: record.notes || '',
        createdAt: record.created_at,
        updatedAt: record.updated_at
      }));
    } catch (error) {
      console.error('获取评估记录时发生异常:', error);
      throw error;
    }
  },

  // 获取特定用户的评估记录
  async getEvaluationsByUser(userId: string): Promise<EvaluationRecord[]> {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('evaluator_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取用户评估记录失败:', error);
      throw error;
    }

    return data.map(record => ({
      id: record.id,
      factoryId: record.factory_id,
      factoryName: record.factory_name,
      evaluator: record.evaluator_name,
      evaluatorId: record.evaluator_id,
      evalDate: record.eval_date,
      evalType: fromDbEvalType(record.eval_type),
      supplierId: record.supplier_id ?? undefined,
      supplierName: record.supplier_name ?? undefined,
      customerId: record.customer_id ?? undefined,
      customerName: record.customer_name ?? undefined,
      customerIds: record.customer_ids ?? undefined,
      customerNames: record.customer_names ?? undefined,
      orderNo: record.order_no ?? undefined,
      styleNo: record.style_no ?? undefined,
      productionStatus: record.production_status ?? undefined,
      selectedModules: record.selected_modules,
      overallPercent: parseFloat(record.overall_percent),
      results: record.results || {},
      comments: record.notes || '',
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }));
  },

  // 创建评估记录
  async createEvaluation(evaluation: Omit<EvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EvaluationRecord | null> {
    console.log('开始插入评估数据到 Supabase:', evaluation);
    const { data, error } = await supabase
      .from('evaluations')
      .insert([{
        factory_id: evaluation.factoryId,
        factory_name: evaluation.factoryName,
        evaluator_id: evaluation.evaluatorId,
        evaluator_name: evaluation.evaluator,
        eval_date: evaluation.evalDate,
        eval_type: toDbEvalType(evaluation.evalType),
        supplier_id: evaluation.supplierId ?? null,
        supplier_name: evaluation.supplierName ?? null,
        customer_id: evaluation.customerId ?? null,
        customer_name: evaluation.customerName ?? null,
        customer_ids: evaluation.customerIds ?? null,
        customer_names: evaluation.customerNames ?? null,
        order_no: evaluation.orderNo ?? null,
        style_no: evaluation.styleNo ?? null,
        production_status: evaluation.productionStatus ?? null,
        selected_modules: evaluation.selectedModules,
        overall_percent: evaluation.overallPercent,
        result: evaluation.result ?? 'pending',
        notes: evaluation.comments ?? '',
        results: evaluation.results
      }])
      .select()
      .single();

    if (error) {
      console.error('插入评估记录失败:', error);
      console.error('错误详情:', JSON.stringify(error, null, 2));
      return null;
    }

    console.log('评估记录插入成功:', data);

    return {
      id: data.id,
      factoryId: data.factory_id,
      factoryName: data.factory_name,
      evaluator: data.evaluator_name,
      evaluatorId: data.evaluator_id,
      evalDate: data.eval_date,
      evalType: fromDbEvalType(data.eval_type),
      supplierId: data.supplier_id ?? undefined,
      supplierName: data.supplier_name ?? undefined,
      customerId: data.customer_id ?? undefined,
      customerName: data.customer_name ?? undefined,
      customerIds: data.customer_ids ?? undefined,
      customerNames: data.customer_names ?? undefined,
      orderNo: data.order_no ?? undefined,
      styleNo: data.style_no ?? undefined,
      productionStatus: data.production_status ?? undefined,
      selectedModules: data.selected_modules,
      overallPercent: parseFloat(data.overall_percent),
      results: data.results || {},
      comments: data.notes || '',
      createdAt: data.created_at,
      updatedAt: data.updated_at
    };
  },

  // 更新评估记录
  async updateEvaluation(id: string, updates: Partial<EvaluationRecord>): Promise<boolean> {
    const supabaseUpdates: any = {};

    if (updates.factoryId !== undefined) supabaseUpdates.factory_id = updates.factoryId;
    if (updates.factoryName !== undefined) supabaseUpdates.factory_name = updates.factoryName;
    if (updates.evalDate !== undefined) supabaseUpdates.eval_date = updates.evalDate;
    if (updates.evalType !== undefined) supabaseUpdates.eval_type = toDbEvalType(updates.evalType);
    if (updates.supplierId !== undefined) supabaseUpdates.supplier_id = updates.supplierId;
    if (updates.supplierName !== undefined) supabaseUpdates.supplier_name = updates.supplierName;
    if (updates.customerId !== undefined) supabaseUpdates.customer_id = updates.customerId;
    if (updates.customerName !== undefined) supabaseUpdates.customer_name = updates.customerName;
    if (updates.customerIds !== undefined) supabaseUpdates.customer_ids = updates.customerIds;
    if (updates.customerNames !== undefined) supabaseUpdates.customer_names = updates.customerNames;
    if (updates.orderNo !== undefined) supabaseUpdates.order_no = updates.orderNo;
    if (updates.styleNo !== undefined) supabaseUpdates.style_no = updates.styleNo;
    if (updates.productionStatus !== undefined) supabaseUpdates.production_status = updates.productionStatus;
    if (updates.selectedModules !== undefined) supabaseUpdates.selected_modules = updates.selectedModules;
    if (updates.overallPercent !== undefined) supabaseUpdates.overall_percent = updates.overallPercent;
    if (updates.result !== undefined) supabaseUpdates.result = updates.result;
    if (updates.comments !== undefined) supabaseUpdates.notes = updates.comments;
    if (updates.results !== undefined) supabaseUpdates.results = updates.results;

    const { error } = await supabase
      .from('evaluations')
      .update(supabaseUpdates)
      .eq('id', id);

    if (error) {
      console.error('更新评估记录失败:', error);
      return false;
    }

    return true;
  },

  // 删除评估记录
  async deleteEvaluation(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('evaluations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('删除评估记录失败:', error);
      return false;
    }

    return true;
  }
};
