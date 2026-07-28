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
import { t, TranslationKey } from '../i18n/translations';

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
    language,
  } = useApp();
  const tr = (key: TranslationKey, params?: Record<string, string | number>) => t(language, key, params);
  const isZh = language === 'zh';
  const getRoleText = (role: string) => {
    if (role === 'sadmin') return tr('role.sadmin');
    if (role === 'admin') return tr('role.admin');
    return tr('role.evaluator');
  };
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

  // Process add factory
  const handleAddFactory = () => {
    if (!newFactoryName.trim()) {
      toast.error(tr('admin.inputFactoryName'));
      return;
    }

    const newFactory: Factory = {
      id: Math.max(...factoryList.map(f => f.id), 0) + 1,
      name: newFactoryName.trim(),
    };

    addFactory(newFactory);
    setNewFactoryName('');
    setIsAddingFactory(false);
    toast.success(tr('admin.factoryAdded'));
  };

  // Process add supplier
  const handleAddSupplier = async () => {
    if (!newSupplierName.trim()) {
      toast.error(tr('admin.inputSupplierName'));
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
      toast.success(tr('admin.supplierAdded'));
    } catch (error) {
      console.error(isZh ? '添加供应商失败:' : 'Add supplier failed:', error);
      toast.error(tr('admin.addFailed'));
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setEditingSupplier({ ...supplier });
  };

  const handleSaveSupplier = async () => {
    if (!editingSupplier?.name.trim()) {
      toast.error(tr('admin.inputSupplierName'));
      return;
    }
    try {
      await updateSupplier(editingSupplier.id, {
        name: editingSupplier.name.trim(),
        contact: (editingSupplier.contact || '').trim(),
        phone: (editingSupplier.phone || '').trim(),
      });
      setEditingSupplier(null);
      toast.success(tr('admin.supplierUpdated'));
    } catch (error) {
      console.error(isZh ? '更新供应商失败:' : 'Update supplier failed:', error);
      toast.error(tr('admin.updateFailed'));
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    const isUsed = evaluations.some((e) => e.supplierId === id);
    if (isUsed) {
      toast.error(tr('admin.supplierInUse'));
      return;
    }
    if (confirm(tr('admin.confirmDeleteSupplier'))) {
      try {
        await deleteSupplier(id);
        toast.success(tr('admin.supplierDeleted'));
      } catch (error) {
        console.error(isZh ? '删除供应商失败:' : 'Delete supplier failed:', error);
        toast.error(tr('admin.updateFailed'));
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
      toast.error(tr('admin.usernameNameRequired'));
      return;
    }
    await updateUserInDb(editingUserId, {
      username: editingUsername.trim(),
      name: editingName.trim(),
      role: editingRole,
      ...(editingPassword.trim() ? { password: editingPassword.trim() } : {}),
    });
    toast.success(tr('admin.factoryUpdated'));
    cancelEditUser();
  };

  const handleAddUser = async () => {
    if (!newUsername.trim() || !newPassword.trim() || !newName.trim()) {
      toast.error(tr('admin.allRequired'));
      return;
    }
    await addUser({
      username: newUsername.trim(),
      password: newPassword.trim(),
      name: newName.trim(),
      role: newRole,
    });
    toast.success(tr('admin.userDeleted').replace('deleted', 'added'));
    setIsAddingUser(false);
    setNewUsername('');
    setNewPassword('');
    setNewName('');
    setNewRole('user');
  };

  const handleDeleteUser = async (id: string) => {
    if (id === user?.id) {
      toast.error(tr('admin.cannotDeleteSelf'));
      return;
    }
    if (confirm(tr('admin.confirmDeleteUser'))) {
      await deleteUserInDb(id);
      toast.success(tr('admin.userDeleted'));
    }
  };

  // Process edit factory
  const handleEditFactory = (factory: Factory) => {
    setEditingFactory({ ...factory });
  };

  // Save edit
  const handleSaveFactory = () => {
    if (!editingFactory?.name.trim()) {
      toast.error(tr('admin.inputFactoryName'));
      return;
    }

    updateFactory(editingFactory.id, editingFactory);
    setEditingFactory(null);
    toast.success(tr('admin.factoryUpdated'));
  };

  // Process delete factory
  const handleDeleteFactory = (id: number) => {
    const hasEvaluations = evaluations.some(e => e.factoryId === id);
    if (hasEvaluations) {
      toast.error(tr('admin.factoryHasEval'));
      return;
    }

    if (confirm(tr('admin.confirmDeleteFactory'))) {
      deleteFactory(id);
      toast.success(tr('admin.factoryDeleted'));
    }
  };

  // Process add customer
  const handleAddCustomer = async () => {
    if (!newCustomerName.trim()) {
      toast.error(tr('admin.inputCustomerName'));
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
      toast.success(tr('admin.customerAdded'));
    } catch (error) {
      console.error(isZh ? '添加客户失败:' : 'Add customer failed:', error);
      toast.error(tr('admin.addFailed'));
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer({ ...customer });
  };

  const handleSaveCustomer = async () => {
    if (!editingCustomer?.name.trim()) {
      toast.error(tr('admin.inputCustomerName'));
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
      toast.success(tr('admin.customerUpdated'));
    } catch (error) {
      console.error(isZh ? '更新客户失败:' : 'Update customer failed:', error);
      toast.error(tr('admin.updateFailed'));
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    const isUsed = evaluations.some((e) => e.customerId === id);
    if (isUsed) {
      toast.error(tr('admin.customerInUse'));
      return;
    }
    if (confirm(tr('admin.confirmDeleteCustomer'))) {
      try {
        await deleteCustomer(id);
        toast.success(tr('admin.customerDeleted'));
      } catch (error) {
        console.error(isZh ? '删除客户失败:' : 'Delete customer failed:', error);
        toast.error(tr('admin.updateFailed'));
      }
    }
  };

  // Process delete evaluation record
  const handleDeleteEvaluation = async (id: string) => {
    if (confirm(tr('admin.confirmDeleteRecord'))) {
      try {
        await deleteEvaluation(id);
        toast.success(tr('admin.recordDeleted'));
      } catch (error) {
        toast.error(tr('admin.deleteFailed'));
      }
    }
  };

  // Manual sync data
  const handleSyncData = async () => {
    setIsSyncing(true);
    try {
      await syncData();
      toast.success(tr('admin.syncComplete'));
    } catch (error) {
      console.error(isZh ? '同步数据失败:' : 'Sync data failed:', error);
      toast.error(tr('admin.syncFailed'));
    } finally {
      setIsSyncing(false);
    }
  };

  // Reinitialize database
  const handleResetDatabase = async () => {
    if (!confirm(tr('admin.confirmResetDb'))) {
      return;
    }

    try {
      // Create default users
      const defaultUsers = [
        { username: 'admin', password: 'admin123', name: tr('admin.defaultUserAdmin'), role: 'admin' },
        { username: 'sadmin', password: 'sadmin123', name: tr('admin.defaultUserSadmin'), role: 'sadmin' },
        { username: 'zhangsan', password: 'zhangsan123', name: isZh ? '张三' : 'Zhang San', role: 'user' },
        { username: 'lisi', password: 'lisi123', name: isZh ? '李四' : 'Li Si', role: 'user' },
        { username: 'wangwu', password: 'wangwu123', name: isZh ? '王五' : 'Wang Wu', role: 'user' },
      ];

      for (const user of defaultUsers) {
        await supabase.from('users').upsert(user, { onConflict: 'username' });
      }

      // Create default factories
      const defaultFactories = [
        { name: isZh ? '华东分厂' : 'East China Factory', address: isZh ? '上海市浦东新区' : 'Pudong, Shanghai', contact: isZh ? '张经理' : 'Mr. Zhang', phone: '021-88888888' },
        { name: isZh ? '华南分厂' : 'South China Factory', address: isZh ? '广东省深圳市' : 'Shenzhen, Guangdong', contact: isZh ? '李经理' : 'Mr. Li', phone: '0755-66666666' },
        { name: isZh ? '华北分厂' : 'North China Factory', address: isZh ? '北京市海淀区' : 'Haidian, Beijing', contact: isZh ? '王经理' : 'Mr. Wang', phone: '010-55555555' },
      ];

      for (const factory of defaultFactories) {
        await supabase.from('factories').insert(factory);
      }

      // Create default suppliers
      const defaultSuppliers = [
        { name: isZh ? '深圳供应商' : 'Shenzhen Supplier', contact: isZh ? '张三' : 'Zhang San', phone: '13800138001' },
        { name: isZh ? '广州供应商' : 'Guangzhou Supplier', contact: isZh ? '李四' : 'Li Si', phone: '13900139001' },
        { name: isZh ? '东莞供应商' : 'Dongguan Supplier', contact: isZh ? '王五' : 'Wang Wu', phone: '13700137001' },
      ];

      for (const supplier of defaultSuppliers) {
        await supabase.from('suppliers').insert(supplier);
      }

      await syncData();
      toast.success(tr('admin.dbInitialized'));
    } catch (error) {
      toast.error(tr('admin.initFailed'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{tr('admin.title')}</h1>
        <p className="text-slate-500 mt-1">{tr('admin.subtitle')}</p>
      </div>

      {/* Tab Navigation */}
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
            {tr('admin.factoryTab')}
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
            {tr('admin.supplierTab')}
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
            {tr('admin.customerTab')}
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
            {tr('admin.userTab')}
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
            {tr('admin.recordsTab')}
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
            {tr('admin.databaseTab')}
          </div>
          {activeTab === 'database' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
          )}
        </button>
      </div>

      {/* Factory Management */}
      {activeTab === 'factory' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">{tr('admin.factoryList')}</h3>
            <button
              onClick={() => setIsAddingFactory(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {tr('admin.addFactory')}
            </button>
          </div>

          {/* Add Factory Form */}
          {isAddingFactory && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  value={newFactoryName}
                  onChange={(e) => setNewFactoryName(e.target.value)}
                  placeholder={tr('admin.factoryName')}
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleAddFactory}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {tr('common.save')}
                </button>
                <button
                  onClick={() => {
                    setIsAddingFactory(false);
                    setNewFactoryName('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  {tr('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Factory List */}
          <div className="divide-y">
            {factoryList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Building2 className="w-12 h-12 mx-auto mb-4" />
                <p>{tr('admin.noFactory')}</p>
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
                        {tr('common.save')}
                      </button>
                      <button
                        onClick={() => setEditingFactory(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {tr('common.cancel')}
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
                          <p className="text-sm text-slate-400">{tr('common.id')}: {factory.id}</p>
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

      {/* Supplier Management */}
      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">{tr('admin.supplierList')}</h3>
            <button
              onClick={() => setIsAddingSupplier(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {tr('admin.addSupplier')}
            </button>
          </div>

          {/* Add Supplier Form */}
          {isAddingSupplier && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  placeholder={tr('admin.supplierName')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="text"
                  value={newSupplierContact}
                  onChange={(e) => setNewSupplierContact(e.target.value)}
                  placeholder={tr('admin.contactOptional')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newSupplierPhone}
                  onChange={(e) => setNewSupplierPhone(e.target.value)}
                  placeholder={tr('admin.phoneOptional')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAddSupplier}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {tr('common.save')}
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
                  {tr('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Supplier List */}
          <div className="divide-y">
            {supplierList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Truck className="w-12 h-12 mx-auto mb-4" />
                <p>{tr('admin.noSupplier')}</p>
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
                        placeholder={tr('admin.contact')}
                      />
                      <input
                        type="text"
                        value={editingSupplier.phone || ''}
                        onChange={(e) => setEditingSupplier({ ...editingSupplier, phone: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={tr('admin.phone')}
                      />
                      <button
                        onClick={handleSaveSupplier}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {tr('common.save')}
                      </button>
                      <button
                        onClick={() => setEditingSupplier(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {tr('common.cancel')}
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
                            {tr('admin.contactLabel')}{s.contact || '-'} | {tr('admin.phoneLabel')}{s.phone || '-'}
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

      {/* Customer Management */}
      {activeTab === 'customers' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{tr('admin.customerList')}</h3>
              <p className="text-sm text-slate-500 mt-1">{tr('admin.manageCustomer')}</p>
            </div>
            <button
              onClick={() => setIsAddingCustomer(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {tr('admin.addCustomer')}
            </button>
          </div>

          {isAddingCustomer && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder={tr('admin.customerName')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="text"
                  value={newCustomerContact}
                  onChange={(e) => setNewCustomerContact(e.target.value)}
                  placeholder={tr('admin.contact')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newCustomerPhone}
                  onChange={(e) => setNewCustomerPhone(e.target.value)}
                  placeholder={tr('admin.phone')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newCustomerAddress}
                  onChange={(e) => setNewCustomerAddress(e.target.value)}
                  placeholder={tr('admin.address')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAddCustomer}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {tr('common.save')}
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
                  {tr('common.cancel')}
                </button>
              </div>
            </div>
          )}

          {/* Customer List */}
          <div className="divide-y">
            {customerList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>{tr('admin.noCustomer')}</p>
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
                        placeholder={tr('admin.contact')}
                      />
                      <input
                        type="text"
                        value={editingCustomer.phone || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={tr('admin.phone')}
                      />
                      <input
                        type="text"
                        value={editingCustomer.address || ''}
                        onChange={(e) => setEditingCustomer({ ...editingCustomer, address: e.target.value })}
                        className="w-48 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={tr('admin.address')}
                      />
                      <button
                        onClick={handleSaveCustomer}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {tr('common.save')}
                      </button>
                      <button
                        onClick={() => setEditingCustomer(null)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {tr('common.cancel')}
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
                            {c.contact ? `${tr('admin.contactLabel')}${c.contact}` : tr('admin.noContact')} | {c.phone ? `${tr('admin.phoneLabel')}${c.phone}` : tr('admin.noPhone')}
                            {c.address ? ` | ${tr('admin.addressLabel')}${c.address}` : ''}
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

      {/* Evaluator Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{tr('admin.userList')}</h3>
              <p className="text-sm text-slate-500 mt-1">{tr('admin.sadminOnly')}</p>
            </div>
            <button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              {tr('admin.addUser')}
            </button>
          </div>

          {isAddingUser && (
            <div className="px-6 py-4 bg-blue-50 border-b">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder={tr('admin.username')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={tr('admin.password')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={tr('admin.name')}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">{tr('admin.evaluatorRole')}</option>
                  <option value="admin">{tr('admin.adminRole')}</option>
                  <option value="sadmin">{tr('admin.sadminRole')}</option>
                </select>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={handleAddUser}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {tr('common.save')}
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
                  {tr('common.cancel')}
                </button>
              </div>
            </div>
          )}

          <div className="divide-y">
            {userList.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <p>{tr('admin.noUser')}</p>
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
                        placeholder={tr('admin.username')}
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="w-44 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={tr('admin.name')}
                      />
                      <select
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value as any)}
                        className="w-40 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="user">{tr('admin.evaluatorRole')}</option>
                        <option value="admin">{tr('admin.adminRole')}</option>
                        <option value="sadmin">{tr('admin.sadminRole')}</option>
                      </select>
                      <input
                        type="password"
                        value={editingPassword}
                        onChange={(e) => setEditingPassword(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={tr('admin.newPasswordOptional')}
                      />
                      <button
                        onClick={saveEditUser}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        {tr('common.save')}
                      </button>
                      <button
                        onClick={cancelEditUser}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                        {tr('common.cancel')}
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
                            {tr('admin.roleLabelPrefix')}{getRoleText(u.role)} | {tr('common.id')}: {u.id}
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

      {/* Records Management */}
      {activeTab === 'records' && (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">{tr('admin.records')}</h3>
            <p className="text-sm text-slate-500 mt-1">
              {tr('admin.totalRecords', { n: evaluations.length })}
            </p>
          </div>

          <div className="divide-y">
            {evaluations.length === 0 ? (
              <div className="px-6 py-12 text-center text-slate-400">
                <Database className="w-12 h-12 mx-auto mb-4" />
                <p>{tr('admin.noRecord')}</p>
              </div>
            ) : (
              evaluations
                .sort((a, b) => new Date(b.evalDate).getTime() - new Date(a.evalDate).getTime())
                .map((record) => (
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
                          {tr('admin.evaluatorLabel', { name: record.evaluator })} | {tr('admin.scoreLabel', { score: record.overallPercent.toFixed(2) })}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvaluation(record.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      {tr('common.delete')}
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* Database Management */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold">{tr('admin.dataSync')}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {tr('admin.syncDesc')}
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{tr('admin.manualSync')}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {tr('admin.manualSyncDesc')}
                  </p>
                </div>
                <button
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-colors"
                >
                  <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? tr('admin.syncing') : tr('admin.syncData')}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold">{tr('admin.dbInfo')}</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">{tr('admin.factoryCount')}</p>
                  <p className="text-2xl font-bold text-slate-900">{factoryList.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500">{tr('admin.evalRecords')}</p>
                  <p className="text-2xl font-bold text-slate-900">{evaluations.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-800">{tr('admin.dbInit')}</p>
              <p className="text-sm text-amber-700 mt-1">
                {tr('admin.dbInitDesc')}
              </p>
              <button
                onClick={handleResetDatabase}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
              >
                <Database className="w-4 h-4" />
                {tr('admin.resetDb')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Tips */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">{tr('admin.tip')}</p>
          <ul className="text-sm text-amber-700 mt-1 space-y-1">
            <li>• {tr('admin.tip1')}</li>
            <li>• {tr('admin.tip2')}</li>
            <li>• {tr('admin.tip3')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
