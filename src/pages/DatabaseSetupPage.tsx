import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Database, Users, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function DatabaseSetupPage() {
  const { syncData } = useApp();
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const setupDatabase = async () => {
    setIsSettingUp(true);
    setStatus({ type: 'info', message: '开始初始化数据库...' });

    try {
      // 1. 初始化数据表并创建默认数据
      setStatus({ type: 'info', message: '初始化数据表...' });
      
      // 创建默认用户
      setStatus({ type: 'info', message: '创建默认用户...' });
      const defaultUsers = [
        { username: 'admin', password: 'admin123', name: '管理员', role: 'admin' },
        { username: 'sadmin', password: 'sadmin123', name: '高级管理员', role: 'sadmin' },
        { username: 'zhangsan', password: 'zhangsan123', name: '张三', role: 'user' },
        { username: 'lisi', password: 'lisi123', name: '李四', role: 'user' },
        { username: 'wangwu', password: 'wangwu123', name: '王五', role: 'user' },
      ];

      for (const user of defaultUsers) {
        const { error } = await supabase.from('users').upsert(user, { onConflict: 'username' });
        if (error) {
          console.error(`创建用户 ${user.username} 失败:`, error);
          throw error;
        }
      }

      // 创建默认工厂
      setStatus({ type: 'info', message: '创建默认工厂...' });
      const defaultFactories = [
        { name: '华东分厂', address: '上海市浦东新区张江高科技园区', contact: '张经理', phone: '021-88888888' },
        { name: '华南分厂', address: '广东省深圳市南山区科技园', contact: '李经理', phone: '0755-66666666' },
        { name: '华北分厂', address: '北京市海淀区中关村科技园区', contact: '王经理', phone: '010-55555555' },
        { name: '华中分厂', address: '湖北省武汉市东湖新技术开发区', contact: '刘经理', phone: '027-44444444' },
        { name: '西南分厂', address: '四川省成都市高新区天府软件园', contact: '陈经理', phone: '028-33333333' },
      ];

      for (const factory of defaultFactories) {
        try {
          const { error } = await supabase.from('factories').insert({
            ...factory,
            created_by: 'system'
          });
          if (error) {
            console.error(`创建工厂 ${factory.name} 失败:`, error);
            throw error;
          } else {
            console.log(`创建工厂 ${factory.name} 成功`);
          }
        } catch (error) {
          console.error(`创建工厂 ${factory.name} 时发生异常:`, error);
          throw error;
        }
      }

      // 检查是否创建成功
      const { data: factories, error: factoriesError } = await supabase.from('factories').select('*');
      if (factoriesError) {
        console.error('检查工厂数据失败:', factoriesError);
        throw factoriesError;
      } else {
        console.log('工厂数据:', factories);
        console.log('工厂数量:', factories.length);
        if (factories.length === 0) {
          console.error('工厂数据创建失败，数量为0');
          throw new Error('工厂数据创建失败，数量为0');
        }
      }

      // 创建默认供应商
      setStatus({ type: 'info', message: '创建默认供应商...' });
      const defaultSuppliers = [
        { name: '深圳供应商', contact: '张三', phone: '13800138001' },
        { name: '广州供应商', contact: '李四', phone: '13900139001' },
        { name: '东莞供应商', contact: '王五', phone: '13700137001' },
      ];

      for (const supplier of defaultSuppliers) {
        const { error } = await supabase.from('suppliers').insert(supplier);
        if (error) {
          console.error(`创建供应商 ${supplier.name} 失败:`, error);
          throw error;
        }
      }

      // 5. 刷新数据
      setStatus({ type: 'info', message: '刷新应用数据...' });
      console.log('调用syncData函数...');
      await syncData();
      console.log('syncData函数执行完成');

      setStatus({ type: 'success', message: '数据库初始化完成！可以开始使用系统了。' });
      
      // 延迟一秒后跳转到评估界面
      setTimeout(() => {
        console.log('刷新页面...');
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('数据库初始化失败:', error);
      setStatus({ type: 'error', message: `初始化失败: ${error instanceof Error ? error.message : '未知错误'}` });
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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">数据库设置</h1>
          <p className="text-gray-600">初始化Supabase数据库并创建默认数据</p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            将创建的内容
          </h2>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              5个默认用户账户
            </li>
            <li className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              5个默认工厂信息
            </li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">默认账户</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">管理员:</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">admin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">高级管理员:</span>
              <span className="font-mono bg-gray-200 px-2 py-0.5 rounded">sadmin / sadmin123</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">普通用户:</span>
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
              初始化中...
            </>
          ) : (
            <>
              <Database className="w-5 h-5" />
              开始初始化
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          此操作将添加默认数据，不会删除现有数据
        </p>
      </div>
    </div>
  );
}
