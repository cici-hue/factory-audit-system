import { supabase, supabaseUrl } from './supabase';
import { User, Factory, EvaluationRecord, AuditResult, Supplier, Customer, AuditDraft } from '../types';

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
  // 获取所有评估记录（带重试机制）
  async getEvaluations(retryCount = 3): Promise<EvaluationRecord[]> {
    console.log('开始获取评估记录数据...');
    console.log('Supabase实例:', !!supabase);
    console.log('Supabase URL:', supabaseUrl);
    
    try {
      console.log('开始查询evaluations表...');
      // 只选择必要字段，避免查询过大的 results 字段
      const { data, error } = await supabase
        .from('evaluations')
        .select('id, factory_id, factory_name, evaluator_id, evaluator_name, eval_date, eval_type, supplier_id, supplier_name, customer_id, customer_name, customer_ids, customer_names, order_no, style_no, production_status, selected_modules, overall_percent, result, notes, failed_items_priority, created_at, updated_at')
        .order('created_at', { ascending: false });

      console.log('Supabase响应:', { data, error });

      if (error) {
        console.error('获取评估记录失败:', error);
        console.error('错误代码:', error.code);
        console.error('错误消息:', error.message);
        console.error('错误提示:', error.hint);
        
        // 如果是超时错误且还有重试次数，则重试
        if (error.code === '57014' && retryCount > 0) {
          console.log(`查询超时，${retryCount}秒后重试...`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return this.getEvaluations(retryCount - 1);
        }
        
        throw new Error(`获取评估记录失败: ${error.message} (代码: ${error.code})`);
      }

      console.log('获取到评估记录数据:', data);
      console.log('评估记录数据长度:', data?.length || 0);

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
        failedItemsPriority: record.failed_items_priority || undefined,
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
      failedItemsPriority: record.failed_items_priority || undefined,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }));
  },

  // 创建评估记录
  async createEvaluation(evaluation: Omit<EvaluationRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<EvaluationRecord | null> {
    console.log('开始插入评估数据到 Supabase:', evaluation);
    
    // 简化 results 数据，只保留必要字段以减少数据量
    const simplifiedResults = evaluation.results ? Object.entries(evaluation.results).reduce((acc, [key, value]) => {
      acc[key] = {
        isChecked: value.isChecked,
        details: value.details || [],
        imagePath: value.imagePath || null
      };
      return acc;
    }, {} as typeof evaluation.results) : {};
    
    // 先插入数据，不使用 select 以减少超时风险
    const { error: insertError } = await supabase
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
        results: simplifiedResults,
        failed_items_priority: evaluation.failedItemsPriority ?? null
      }]);

    if (insertError) {
      console.error('插入评估记录失败:', insertError);
      console.error('错误详情:', JSON.stringify(insertError, null, 2));
      return null;
    }

    // 查询刚插入的记录
    const { data: queryData, error: selectError } = await supabase
      .from('evaluations')
      .select('*')
      .eq('factory_id', evaluation.factoryId)
      .eq('eval_date', evaluation.evalDate)
      .eq('evaluator_id', evaluation.evaluatorId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (selectError) {
      console.error('查询评估记录失败:', selectError);
      return null;
    }

    if (!queryData || queryData.length === 0) {
      console.error('未找到刚插入的评估记录');
      return null;
    }

    const data = queryData[0];

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
      failedItemsPriority: data.failed_items_priority || undefined,
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
    if (updates.failedItemsPriority !== undefined) supabaseUpdates.failed_items_priority = updates.failedItemsPriority;
    
    // 简化 results 数据，避免 base64 图片数据导致超时
    if (updates.results !== undefined) {
      const simplifiedResults = Object.entries(updates.results).reduce((acc, [key, value]) => {
        acc[key] = {
          isChecked: value.isChecked,
          details: value.details || [],
          // 不保存 base64 图片数据，只保存 Storage URL 或 null
          imagePath: value.imagePath && value.imagePath.startsWith('http') ? value.imagePath : null
        };
        return acc;
      }, {} as typeof updates.results);
      supabaseUpdates.results = simplifiedResults;
    }

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

// 评估草稿服务
export const draftService = {
  // 获取用户的草稿
  async getDraft(userId: string): Promise<AuditDraft | null> {
    try {
      const { data, error } = await supabase
        .from('audit_drafts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // 没有找到记录
          return null;
        }
        console.error('获取草稿失败:', error);
        throw error;
      }

      return {
        id: data.id,
        userId: data.user_id,
        selectedFactory: data.selected_factory,
        selectedSupplier: data.selected_supplier,
        selectedCustomers: data.selected_customers || [],
        evalDate: data.eval_date,
        evalType: fromDbEvalType(data.eval_type),
        orderNo: data.order_no || '',
        styleNo: data.style_no || '',
        productionStatus: data.production_status || '',
        selectedModules: data.selected_modules || [],
        comments: data.comments || '',
        currentAuditResults: data.current_audit_results || {},
        expandedModules: data.expanded_modules || [],
        expandedSubModules: data.expanded_sub_modules || [],
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (error) {
      console.error('获取草稿异常:', error);
      return null;
    }
  },

  // 保存或更新草稿
  async saveDraft(draft: Omit<AuditDraft, 'id' | 'createdAt' | 'updatedAt'>): Promise<AuditDraft | null> {
    try {
      // 先检查是否已有草稿
      const existingDraft = await this.getDraft(draft.userId);

      // 简化 current_audit_results 数据，避免超时
      const simplifiedResults = draft.currentAuditResults ? Object.entries(draft.currentAuditResults).reduce((acc, [key, value]) => {
        acc[key] = {
          isChecked: value.isChecked,
          details: value.details || [],
          // 不保存 base64 图片数据，只保存 Storage URL 或 null
          imagePath: value.imagePath && value.imagePath.startsWith('http') ? value.imagePath : null
        };
        return acc;
      }, {} as typeof draft.currentAuditResults) : {};

      const dbData = {
        user_id: draft.userId,
        selected_factory: draft.selectedFactory,
        selected_supplier: draft.selectedSupplier,
        selected_customers: draft.selectedCustomers,
        eval_date: draft.evalDate,
        eval_type: toDbEvalType(draft.evalType),
        order_no: draft.orderNo || null,
        style_no: draft.styleNo || null,
        production_status: draft.productionStatus || null,
        selected_modules: draft.selectedModules,
        comments: draft.comments || null,
        current_audit_results: simplifiedResults,
        expanded_modules: draft.expandedModules,
        expanded_sub_modules: draft.expandedSubModules
      };

      if (existingDraft) {
        // 更新现有草稿
        const { error: updateError } = await supabase
          .from('audit_drafts')
          .update(dbData)
          .eq('id', existingDraft.id);

        if (updateError) {
          console.error('更新草稿失败:', updateError);
          throw updateError;
        }

        // 查询更新后的数据
        return await this.getDraft(draft.userId);
      } else {
        // 创建新草稿
        const { error: insertError } = await supabase
          .from('audit_drafts')
          .insert([dbData]);

        if (insertError) {
          console.error('创建草稿失败:', insertError);
          throw insertError;
        }

        // 查询刚插入的数据
        return await this.getDraft(draft.userId);
      }
    } catch (error) {
      console.error('保存草稿异常:', error);
      return null;
    }
  },

  // 删除草稿
  async deleteDraft(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('audit_drafts')
        .delete()
        .eq('user_id', userId);

      if (error) {
        console.error('删除草稿失败:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('删除草稿异常:', error);
      return false;
    }
  }
};
