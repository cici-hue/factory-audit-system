import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Factory, Supplier, Customer } from '../types';
import { supabase } from '../lib/supabase';
import {
  Settings,
  Building2,
  Database,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  AlertTriangle,
  Users,
  Truck,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const {
    factoryList,
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
    updateUser: updateUserInDb,
    deleteUser: deleteUserInDb,
    evaluations,
    syncData,
    user,
    deleteEvaluation,
  } = useApp();
  const [activeTab, setActiveTab] = useState<'factory' | 'suppliers' | 'customers' | 'users' | 'records' | 'database'>('factory');
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);
  const [isAddingFactory, setIsAddingFactory] = useState(false);
  const [newFactoryName, setNewFactoryName] = useState('');

  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [isAddingSupplier, setIsAddingSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierContact, setNewSupplierContact] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerContact, setNewCustomerContact] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editingUsername, setEditingUsername] = useState('');
  const [editingName, setEditingName] = useState('');
  const [editingRole, setEditingRole] = useState<'admin' | 'sadmin' | 'user'>('user');
  const [editingPassword, setEditingPassword] = useState('');

  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'sadmin' | 'user'>('user');

  const [isSyncing, setIsSyncing] = useState(false);

  // 处理添加工厂
  const handleAddFactory = () => {
    if (!newFactoryName.trim()) {
      toast.error('请输入工厂名称');
      return;
    }

    const newFactory: Factory = {
      id: Math.max(...factoryList.map(f => f.id), 0) + 1,
      name: newFactoryName.trim(),
    };

    addFactory(newFactory);
    setNewFactoryName('');
    setIsAddingFactory(false);
    toast.success('工厂添加成功');
  };

  // 处理添加供应商
  const handleAddSupplier = async () => {
    if (!newSupplierName.trim()) {
      toast.error('请输入供应商名称');
      return;
    }
    try {
      await addSupplier({
        name: newSupplierName.trim(),
        contact: newSupplierContact.trim(),
        phone: newSupplierPhone.trim(),
      });
      setNewSupplierName('');
      setNewSupplierContact('');
      setNewSupplierPhone('');
      setIsAddingSupplier(false);
      toast.success('供应商添加成功');
    } catch (error) {
      console.error('添加供应商失败:', error);
      toast.error('添加供应商失败，请检查Supabase连接');
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier({ ...supplier });
  };

  const handleSaveSupplier = async () => {
    if (!editingSupplier?.name.trim()) {
      toast.error('请输入供应商名称');
      return;
    }
    try {
      await updateSupplier(editingSupplier.id, {
        name: editingSupplier.name.trim(),
        contact: (editingSupplier.contact || '').trim(),
        phone: (editingSupplier.phone || '').trim(),
      });
      setEditingSupplier(null);
      toast.success('供应商信息已更新');
    } catch (error) {
      console.error('更新供应商失败:', error);
      toast.error('更新供应商失败，请检查Supabase连接');
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    const isUsed = evaluations.some((e) => e.supplierId === id);
    if (isUsed) {
      toast.error('该供应商存在评估记录关联，无法删除');
      return;
    }
    if (confirm('确定要删除这个供应商吗？')) {
      try {
        await deleteSupplier(id);
        toast.success('供应商已删除');
      } catch (error) {
        console.error('删除供应商失败:', error);
        toast.error('删除供应商失败，请检查Supabase连接');
      }
    }
  };

  const beginEditUser = (u: any) => {
    setEditingUserId(u.id);
    setEditingUsername(u.username || '');
    setEditingName(u.name || '');
    setEditingRole(u.role || 'user');
    setEditingPassword('');
  };

  const cancelEditUser = () => {
    setEditingUserId(null);
    setEditingUsername('');
    setEditingName('');
    setEditingRole('user');
    setEditingPassword('');
  };

  const saveEditUser = async () => {
    if (!editingUserId) return;
    if (!editingUsername.trim() || !editingName.trim()) {
      toast.error('用户名和姓名不能为空');
      return;
    }
    await updateUserInDb(editingUserId, {
      username: editingUsername.trim(),
      name: editingName.trim(),
      role: editingRole,
      ...(editingPassword.trim() ? { password: editingPassword.trim() } : {}),
    });
    toast.success('用户信息已更新');
    cancelEditUser();
  };

  const handleAddUser = async () => {
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      toast.error('用户名、密码、姓名不能为空');
      return;
    }
    await addUser({
      username: newUsername.trim(),
      password: newPassword.trim(),
      name: newName.trim(),
      role: newRole,
    });
    toast.success('用户已添加');
    setIsAddingUser(false);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewRole('user');
  };

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) {
      toast.error('不能删除当前登录用户');
      return;
    }
    if (confirm('确定要删除这个用户吗？')) {
      await deleteUserInDb(id);
      toast.success('用户已删除');
    }
  };

  // 处理编辑工厂
  const handleEditFactory = (factory: Factory) => {
    setEditingFactory({ ...factory });
  };

  // 保存编辑
  const handleSaveFactory = () => {
    if (!editingFactory?.name.trim()) {
      toast.error('请输入工厂名称');
      return;
    }

    updateFactory(editingFactory.id, editingFactory);
    setEditingFactory(null);
    toast.success('工厂信息已更新');
  };

  // 处理删除工厂
  const handleDeleteFactory = (id: number) => {
    const hasEvaluations = evaluations.some(e => e.factoryId === id);
    if (hasEvaluations) {
      toast.error('该工厂存在评估记录，无法删除');
      return;
    }

    if (confirm('确定要删除这个工厂吗？')) {
      deleteFactory(id);
      toast.success('工厂已删除');
    }
  };

  // 处理添加客户
  const handleAddCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast.error('请输入客户名称');
      return;
    }
    try {
      await addCustomer({
        name: newCustomerName.trim(),
        contact: newCustomerContact.trim(),
        phone: newCustomerPhone.trim(),
        address: newCustomerAddress.trim(),
      });
      setNewCustomerName('');
      setNewCustomerContact('');
      setNewCustomerPhone('');
      setNewCustomerAddress('');
      setIsAddingCustomer(false);
      toast.success('客户添加成功');
    } catch (error) {
      console.error('添加客户失败:', error);
      toast.error('添加客户失败，请检查Supabase连接');
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer?.name.trim()) {
      toast.error('请输入客户名称');
      return;
    }
    try {
      await updateCustomer(editingCustomer.id, {
        name: editingCustomer.name.trim(),
        contact: (editingCustomer.contact || '').trim(),
        phone: (editingCustomer.phone || '').trim(),
        address: (editingCustomer.address || '').trim(),
      });
      setEditingCustomer(null);
      toast.success('客户信息已更新');
    } catch (error) {
      console.error('更新客户失败:', error);
      toast.error('更新客户失败，请检查Supabase连接');
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    const isUsed = evaluations.some((e) => e.customerId === id);
    if (isUsed) {
      toast.error('该客户存在评估记录关联，无法删除');
      return;
    }
    if (confirm('确定要删除这个客户吗？')) {
      try {
        await deleteCustomer(id);
        toast.success('客户已删除');
      } catch (error) {
        console.error('删除客户失败:', error);
        toast.error('删除客户失败，请检查Supabase连接');
      }
    }
  };

  // 处理删除评估记录
  const handleDeleteEvaluation = async (id: string) => {
    if (confirm('确定要删除这条评估记录吗？此操作不可恢复。')) {
      try {
        await deleteEvaluation(id);
        toast.success('评估记录已删除');
      } catch (error) {
        toast.error('删除失败');
      }
    }
  };

  // 手动同步数据
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      await syncData();
      toast.success('数据同步完成');
    } catch (error) {
      console.error('同步数据失败:', error);
      toast.error('同步失败，请检查Supabase连接');
    } finally {
      setIsSyncing(false);
    }
  };

  // 重新初始化数据库
  const handleResetDatabase = async () => {
    if (!confirm('确定要重新初始化数据库吗？这将创建默认用户和工厂。')) {
      return;
    }

    try {
      // 创建默认用户
      const defaultUsers = [
        { username: 'admin', password: 'admin123', name: '管理员', role: 'admin' },
        { username: 'sadmin', password: 'sadmin123', name: '高级管理员', role: 'sadmin' },
        { username: 'zhangsan', password: 'zhangsan123', name: '张三', role: 'user' },
        { username: 'lisi', password: 'lisi123', name: '李四', role: 'user' },
        { username: 'wangwu', password: 'wangwu123', name: '王五', role: 'user' },
      ];

      for (const user of defaultUsers) {
        await supabase.from('users').upsert(user, { onConflict: 'username' });
      }

      // 创建默认工厂
      const defaultFactories = [
        { name: '华东分厂', address: '上海市浦东新区', contact: '张经理', phone: '021-88888888' },
        { name: '华南分厂', address: '广东省深圳市', contact: '李经理', phone: '0755-66666666' },
        { name: '华北分厂', address: '北京市海淀区', contact: '王经理', phone: '010-55555555' },
      ];

      for (const factory of defaultFactories) {
        await supabase.from('factories').insert(factory);
      }

      // 创建默认供应商
      const defaultSuppliers = [
        { name: '深圳供应商', contact: '张三', phone: '13800138001' },
        { name: '广州供应商', contact: '李四', phone: '13900139001' },
        { name: '东莞供应商', contact: '王五', phone: '13700137001' },
      ];

      for (const supplier of defaultSuppliers) {
        await supabase.from('suppliers').insert(supplier);
      }

      await syncData();
      toast.success('数据库初始化完成');
    } catch (error) {
      toast.error('初始化失败');
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">系统管理</h1>
        <p className="text-slate-500 mt-1">管理系统配置和数据维护</p>
      </div>

      {/* Tab 导航 */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('factory')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'factory'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            工厂管理
          </div>
          {activeTab === 'factory' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('suppliers')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'suppliers'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            供应商管理
          </div>
          {activeTab === 'suppliers' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'customers'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            客户管理
          </div>
          {activeTab === 'customers' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'users'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            评估人员维护
          </div>
          {activeTab === 'users' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'records'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            记录维护
          </div>
          {activeTab === 'records' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-6 py-3 font-medium transition-colors relative ${
            activeTab === 'database'
              ? 'text-blue-600'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            数据库
          </div>
          {activeTab === 'database' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* 工厂管理 */}
      {activeTab === 'factory' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">工厂列表</h3>
            <button
              onClick={() => setIsAddingFactory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加工厂
            </button>
          </div>

          {/* 添加工厂表单 */}
          {isAddingFactory && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={newFactoryName}
                  onChange={(e) => setNewFactoryName(e.target.value)}
                  placeholder="请输入工厂名称"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleAddFactory}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsAddingFactory(false);
                    setNewFactoryName('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 工厂列表 */}
          <div className="divide-y">
            {factoryList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Building2 className="w-12 h-12 mx-auto mb-4" />
                <p>暂无工厂数据</p>
              </div>
            ) : (
              factoryList.map((factory) => (
                <div
                  key={factory.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50"
                >
                  {editingFactory?.id === factory.id ? (
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="text"
                        value={editingFactory.name}
                        onChange={(e) =>
                          setEditingFactory({ ...editingFactory, name: e.target.value })
                        }
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <button
                        onClick={handleSaveFactory}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                      <button
                        onClick={() => setEditingFactory(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">{factory.name}</p>
                          <p className="text-sm text-slate-400">ID: {factory.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditFactory(factory)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFactory(factory.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 供应商管理 */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">供应商列表</h3>
            <button
              onClick={() => setIsAddingSupplier(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加供应商
            </button>
          </div>

          {/* 添加供应商表单 */}
          {isAddingSupplier && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder="供应商名称"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="text"
                  value={newSupplierContact}
                  onChange={(e) => setNewSupplierContact(e.target.value)}
                  placeholder="联系人（可选）"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newSupplierPhone}
                  onChange={(e) => setNewSupplierPhone(e.target.value)}
                  placeholder="电话（可选）"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAddSupplier}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsAddingSupplier(false);
                    setNewSupplierName('');
                    setNewSupplierContact('');
                    setNewSupplierPhone('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 供应商列表 */}
          <div className="divide-y">
            {supplierList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Truck className="w-12 h-12 mx-auto mb-4" />
                <p>暂无供应商数据</p>
              </div>
            ) : (
              supplierList.map((s) => (
                <div
                  key={s.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50"
                >
                  {editingSupplier?.id === s.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editingSupplier.name}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, name: e.target.value })}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editingSupplier.contact || ''}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, contact: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="联系人"
                      />
                      <input
                        type="text"
                        value={editingSupplier.phone || ''}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="电话"
                      />
                      <button
                        onClick={handleSaveSupplier}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                      <button
                        onClick={() => setEditingSupplier(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">{s.name}</p>
                          <p className="text-sm text-slate-400">
                            {s.contact ? `联系人：${s.contact}` : '联系人：-'} | {s.phone ? `电话：${s.phone}` : '电话：-'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditSupplier(s)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSupplier(s.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 客户管理 */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">客户列表</h3>
              <p className="text-sm text-slate-500 mt-1">管理客户信息</p>
            </div>
            <button
              onClick={() => setIsAddingCustomer(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加客户
            </button>
          </div>

          {isAddingCustomer && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="客户名称"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="text"
                  value={newCustomerContact}
                  onChange={(e) => setNewCustomerContact(e.target.value)}
                  placeholder="联系人"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder="电话"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  placeholder="地址"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAddCustomer}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsAddingCustomer(false);
                    setNewCustomerName('');
                    setNewCustomerContact('');
                    setNewCustomerPhone('');
                    setNewCustomerAddress('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 客户列表 */}
          <div className="divide-y">
            {customerList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>暂无客户数据</p>
              </div>
            ) : (
              customerList.map((c) => (
                <div
                  key={c.id}
                  className="px-6 py-4 flex items-center justify-between hover:bg-slate-50"
                >
                  {editingCustomer?.id === c.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editingCustomer.name}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editingCustomer.contact || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, contact: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="联系人"
                      />
                      <input
                        type="text"
                        value={editingCustomer.phone || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="电话"
                      />
                      <input
                        type="text"
                        value={editingCustomer.address || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="地址"
                      />
                      <button
                        onClick={handleSaveCustomer}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                      <button
                        onClick={() => setEditingCustomer(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">{c.name}</p>
                          <p className="text-sm text-slate-400">
                            {c.contact ? `联系人：${c.contact}` : '联系人：-'} | {c.phone ? `电话：${c.phone}` : '电话：-'}
                            {c.address ? ` | 地址：${c.address}` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCustomer(c)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(c.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 评估人员维护 */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">用户列表</h3>
              <p className="text-sm text-slate-500 mt-1">仅高级管理员(sadmin)可维护</p>
            </div>
            <button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加用户
            </button>
          </div>

          {isAddingUser && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="用户名"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="密码"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="姓名"
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">评估员</option>
                  <option value="admin">管理员</option>
                  <option value="sadmin">高级管理员</option>
                </select>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  保存
                </button>
                <button
                  onClick={() => {
                    setIsAddingUser(false);
                    setNewUsername('');
                    setNewPassword('');
                    setNewName('');
                    setNewRole('user');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  取消
                </button>
              </div>
            </div>
          )}

          <div className="divide-y">
            {userList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>暂无用户数据（请先同步或检查权限）</p>
              </div>
            ) : (
              userList.map((u: any) => (
                <div key={u.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50">
                  {editingUserId === u.id ? (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="text"
                        value={editingUsername}
                        onChange={(e) => setEditingUsername(e.target.value)}
                        className="w-44 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="用户名"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-44 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="姓名"
                      />
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value as any)}
                        className="w-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">评估员</option>
                        <option value="admin">管理员</option>
                        <option value="sadmin">高级管理员</option>
                      </select>
                      <input
                        type="password"
                        value={editingPassword}
                        onChange={(e) => setEditingPassword(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="新密码（可选，留空不修改）"
                      />
                      <button
                        onClick={saveEditUser}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        保存
                      </button>
                      <button
                        onClick={cancelEditUser}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        取消
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                          <Users className="w-5 h-5 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {u.name} <span className="text-slate-400 text-sm">({u.username})</span>
                          </p>
                          <p className="text-sm text-slate-400">
                            角色：{u.role === 'sadmin' ? '高级管理员' : u.role === 'admin' ? '管理员' : '评估员'} | ID: {u.id}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => beginEditUser(u)}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 记录维护 */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">评估记录管理</h3>
            <p className="text-sm text-slate-500 mt-1">
              当前系统共有 <span className="font-medium text-slate-900">{evaluations.length}</span> 条评估记录
            </p>
          </div>

          <div className="divide-y">
            {evaluations.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Database className="w-12 h-12 mx-auto mb-4" />
                <p>暂无评估记录</p>
              </div>
            ) : (
              evaluations
                .sort((a, b) => new Date(b.evalDate).getTime() - new Date(a.evalDate).getTime())
                .map((record, index) => (
                  <div
                    key={record.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {record.factoryName} - {record.evalDate}
                        </p>
                        <p className="text-sm text-slate-400">
                          评估员：{record.evaluator} | 得分：{record.overallPercent.toFixed(2)}%
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvaluation(record.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* 数据库管理 */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold">数据同步</h3>
              <p className="text-sm text-slate-500 mt-1">
                从云端数据库同步最新数据到本地
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">手动同步数据</p>
                  <p className="text-sm text-slate-500 mt-1">
                    点击按钮从Supabase云端拉取最新数据
                  </p>
                </div>
                <button
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? '同步中...' : '同步数据'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold">数据库信息</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">工厂数量</p>
                  <p className="text-2xl font-bold text-slate-900">{factoryList.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">评估记录</p>
                  <p className="text-2xl font-bold text-slate-900">{evaluations.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">数据库初始化</p>
              <p className="text-sm text-amber-700 mt-1">
                如果数据库为空或需要重置，可以点击下方按钮重新初始化默认数据。
              </p>
              <button
                onClick={handleResetDatabase}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                重新初始化数据库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 危险提示 */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">操作提示</p>
          <ul className="text-sm text-amber-700 mt-1 space-y-1">
            <li>• 删除工厂将同时删除该工厂的所有评估记录</li>
            <li>• 评估记录删除后无法恢复，请谨慎操作</li>
            <li>• 只有高级管理员(sadmin)可以访问此页面</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
