import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Users, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { t, TranslationKey } from '../i18n/translations';

export default function DatabaseSetupPage() {
  const { syncData, language } = useApp();
  const tr = (key: TranslationKey, params?: Record<string, string | number>) => t(language, key, params);
  const isZh = language === 'zh';
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const setupDatabase = async () => {
    setIsSettingUp(true);
    setStatus({ type: 'info', message: tr('dbsetup.initializing') });

    try {
      // 1. Init tables and create default data
      setStatus({ type: 'info', message: tr('dbsetup.initTables') });

      // Create default users
      setStatus({ type: 'info', message: tr('dbsetup.createUsers') });
      const defaultUsers = [
        { username: 'admin', password: 'admin123', name: isZh ? '管理员' : 'Admin', role: 'admin' },
        { username: 'sadmin', password: 'sadmin123', name: isZh ? '高级管理员' : 'Super Admin', role: 'sadmin' },
        { username: 'zhangsan', password: 'zhangsan123', name: tr('mock.zhangsan'), role: 'user' },
        { username: 'lisi', password: 'lisi123', name: tr('mock.lisi'), role: 'user' },
        { username: 'wangwu', password: 'wangwu123', name: tr('mock.wangwu'), role: 'user' },
      ];

      for (const user of defaultUsers) {
        const { error } = await supabase.from('users').upsert(user, { onConflict: 'username' });
        if (error) {
          console.error(tr('dbsetup.errCreateUser', { name: user.username }), error);
          throw error;
        }
      }

      // Create default factories
      setStatus({ type: 'info', message: tr('dbsetup.createFactories') });
      const defaultFactories = [
        { name: tr('mock.eastChinaFactory'), address: tr('mock.eastChinaAddress'), contact: tr('mock.zhangManager'), phone: '021-88888888' },
        { name: tr('mock.southChinaFactory'), address: tr('mock.southChinaAddress'), contact: tr('mock.liManager'), phone: '0755-66666666' },
        { name: tr('mock.northChinaFactory'), address: tr('mock.northChinaAddress'), contact: tr('mock.wangManager'), phone: '010-55555555' },
      ];

      for (const factory of defaultFactories) {
        try {
          const { error } = await supabase.from('factories').insert({
            ...factory,
            created_by: 'system'
          });
          if (error) {
            console.error(tr('dbsetup.errCreateFactory', { name: factory.name }), error);
            throw error;
          } else {
            console.log(tr('dbsetup.factoryCreated', { name: factory.name }));
          }
        } catch (error) {
          console.error(tr('dbsetup.errCreateFactory', { name: factory.name }), error);
          throw error;
        }
      }

      // Check creation success
      const { data: factories, error: factoriesError } = await supabase.from('factories').select('*');
      if (factoriesError) {
        console.error(tr('dbsetup.checkFactoryFailed'), factoriesError);
        throw factoriesError;
      } else {
        console.log(tr('dbsetup.factoryCount', { n: factories.length }));
        if (factories.length === 0) {
          console.error(tr('dbsetup.factoryCreateFailed'));
          throw new Error(tr('dbsetup.factoryCreateFailed'));
        }
      }

      // Create default suppliers
      setStatus({ type: 'info', message: tr('dbsetup.createSuppliers') });
      const defaultSuppliers = [
        { name: tr('mock.shenzhenSupplier'), contact: tr('mock.zhangsan'), phone: '13800138001' },
        { name: tr('mock.guangzhouSupplier'), contact: tr('mock.lisi'), phone: '13900139001' },
        { name: tr('mock.dongguanSupplier'), contact: tr('mock.wangwu'), phone: '13700137001' },
      ];

      for (const supplier of defaultSuppliers) {
        const { error } = await supabase.from('suppliers').insert(supplier);
        if (error) {
          console.error(tr('dbsetup.errCreateSupplier', { name: supplier.name }), error);
          throw error;
        }
      }

      // 5. Refresh data
      setStatus({ type: 'info', message: tr('dbsetup.refreshData') });
      console.log(tr('dbsetup.syncData'));
      await syncData();
      console.log(tr('dbsetup.syncComplete'));

      setStatus({ type: 'success', message: tr('dbsetup.complete') });

      // Reload after a short delay
      setTimeout(() => {
        console.log(tr('dbsetup.reload'));
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error(tr('dbsetup.initFailed'), error);
      setStatus({ type: 'error', message: `${tr('dbsetup.initFailed')}: ${error instanceof Error ? error.message : tr('dbsetup.unknownError')}` });
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Database className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{tr('dbsetup.title')}</h1>
          <p className="text-gray-600">{isZh ? '初始化Supabase数据库并创建默认数据' : 'Initialize Supabase database and create default data'}</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {tr('dbsetup.createContent')}
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {tr('dbsetup.usersCount')}
            </li>
            <li className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {tr('dbsetup.factoriesCount')}
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">{tr('dbsetup.defaultAccounts')}</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{tr('dbsetup.adminUser')}</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">admin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{tr('dbsetup.sadminUser')}</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">sadmin / sadmin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{tr('dbsetup.normalUser')}</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">zhangsan / zhangsan123</span>
            </div>
          </div>
        </div>

        {status && (
          <div
            className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
              status.type === 'success' ? 'bg-green-50 text-green-800' :
              status.type === 'error' ? 'bg-red-50 text-red-800' :
              'bg-blue-50 text-blue-800'
            }`}
          >
            {status.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
            {status.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            {status.type === 'info' && <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        <button
          onClick={setupDatabase}
          disabled={isSettingUp}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isSettingUp ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {tr('dbsetup.initializing2')}
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              {tr('dbsetup.startInit')}
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          {tr('dbsetup.addNotDelete')}
        </p>
      </div>
    </div>
  );
}
