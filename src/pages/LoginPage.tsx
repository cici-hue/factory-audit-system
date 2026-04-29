import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Lock, User, AlertCircle, Shirt, Sparkles, Loader2 } from 'lucide-react';
import { FactoryType } from '../types';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFactoryType, setSelectedFactoryType] = useState<FactoryType>('light-woven');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const factoryTypes: { type: FactoryType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      type: 'light-woven',
      label: 'Light Woven',
      icon: <Shirt className="w-6 h-6" />,
      description: '轻薄梭织'
    },
    {
      type: 'lingerie-swimwear',
      label: 'Lingerie / Swimwear',
      icon: <Sparkles className="w-6 h-6" />,
      description: '内衣泳装'
    },
    {
      type: 'flat-knit',
      label: 'Flat Knit',
      icon: <Loader2 className="w-6 h-6" />,
      description: '横机针织'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Flat Knit 开发中，暂时不可用
    if (selectedFactoryType === 'flat-knit') {
      setError('Flat Knit 功能正在开发中，敬请期待...');
      setLoading(false);
      return;
    }

    try {
      const success = await login(username, password, selectedFactoryType);
      if (!success) {
        setError('账号或密码不正确');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>

      <div className="relative w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 m-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg shadow-blue-500/30">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">欧图工厂审核系统</h1>
          <p className="text-slate-400 mt-2">Factory Audit System</p>
        </div>

        {/* 工厂类型选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3 text-center">请选择工厂类型</label>
          <div className="grid grid-cols-3 gap-2">
            {factoryTypes.map((factory) => (
              <button
                key={factory.type}
                type="button"
                onClick={() => setSelectedFactoryType(factory.type)}
                disabled={factory.type === 'flat-knit'}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
                  ${selectedFactoryType === factory.type 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : factory.type === 'flat-knit'
                      ? 'bg-white/5 border-white/10 text-slate-500 cursor-not-allowed'
                      : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                <div className={`mb-2 ${selectedFactoryType === factory.type ? 'text-white' : factory.type === 'flat-knit' ? 'text-slate-500' : 'text-blue-400'}`}>
                  {factory.icon}
                </div>
                <span className="text-xs font-medium text-center leading-tight">{factory.label}</span>
                <span className="text-[10px] opacity-70 mt-1">{factory.description}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入账号"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="请输入密码"
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                登录中...
              </span>
            ) : (
              '登录'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
