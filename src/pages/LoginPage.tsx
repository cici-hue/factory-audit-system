import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, Lock, User, AlertCircle, Shirt, Sparkles, Loader2 } from 'lucide-react';
import { FactoryType } from '../types';
import { t, TranslationKey } from '../i18n/translations';

export default function LoginPage() {
  const { login, language } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedFactoryType, setSelectedFactoryType] = useState<FactoryType>('light-woven');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const tr = (key: TranslationKey) => t(language, key);

  const factoryTypes: { type: FactoryType; label: string; icon: React.ReactNode; description: string }[] = [
    {
      type: 'light-woven',
      label: 'Light Woven',
      icon: <Shirt className="w-6 h-6" />,
      description: language === 'zh' ? '轻薄梭织' : 'Light Woven'
    },
    {
      type: 'lingerie-swimwear',
      label: 'Lingerie / Swimwear',
      icon: <Sparkles className="w-6 h-6" />,
      description: language === 'zh' ? '内衣泳装' : 'Lingerie / Swimwear'
    },
    {
      type: 'flat-knit',
      label: 'Flat Knit',
      icon: <Loader2 className="w-6 h-6" />,
      description: language === 'zh' ? '横机针织' : 'Flat Knit'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(username, password, selectedFactoryType);
      if (!success) {
        setError(language === 'zh' ? '账号或密码不正确' : 'Invalid username or password');
      }
    } catch (err) {
      setError(language === 'zh' ? '登录失败，请稍后重试' : 'Login failed, please try again');
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
          <h1 className="text-2xl font-bold text-white">{tr('app.title')}</h1>
          <p className="text-slate-400 mt-2">{tr('app.subtitle')}</p>
        </div>

        {/* 工厂类型选择 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3 text-center">{tr('login.factoryType')}</label>
          <div className="grid grid-cols-3 gap-2">
            {factoryTypes.map((factory) => (
              <button
                key={factory.type}
                type="button"
                onClick={() => setSelectedFactoryType(factory.type)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200
                  ${selectedFactoryType === factory.type 
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white/5 border-white/20 text-slate-300 hover:bg-white/10 hover:border-white/30'
                  }
                `}
              >
                <div className={`mb-2 ${selectedFactoryType === factory.type ? 'text-white' : 'text-blue-400'}`}>
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
            <label className="block text-sm font-medium text-slate-300 mb-2">{tr('login.username')}</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={language === 'zh' ? '请输入账号' : 'Enter username'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{tr('login.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder={language === 'zh' ? '请输入密码' : 'Enter password'}
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
                {language === 'zh' ? '登录中...' : 'Signing in...'}
              </span>
            ) : (
              tr('login.submit')
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
