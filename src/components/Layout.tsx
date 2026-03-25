import { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  ClipboardList,
  BarChart3,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  User,
  Users,
  Truck,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout, isEditMode, setEditMode } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'audit', label: '开始评估', icon: ClipboardList },
    { id: 'history', label: '历史记录', icon: History },
    { id: 'analytics', label: '数据分析', icon: BarChart3 },
    ...(user?.role === 'sadmin' ? [{ id: 'admin', label: '系统管理', icon: Settings }] : []),
  ];

  const handleNavigate = (page: string) => {
    if (isEditMode && page !== 'audit') {
      if (!confirm('编辑模式未保存，确定要离开吗？')) {
        return;
      }
      setEditMode(false);
    }
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* 桌面端侧边栏 */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white transition-all duration-300 z-40 hidden md:flex flex-col ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo区域 */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <h1 className="font-bold text-lg whitespace-nowrap">欧图审核系统</h1>
                <p className="text-xs text-slate-400 whitespace-nowrap">Factory Audit</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 hover:bg-slate-800 rounded-lg transition-colors ${!sidebarOpen && 'hidden'}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* 展开侧边栏按钮 */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="absolute -right-3 top-20 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"
          >
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
        )}

        {/* 导航菜单 */}
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${!sidebarOpen && 'justify-center px-3'}`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* 用户信息区域 */}
        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-slate-400">
                  {user?.role === 'sadmin' ? '高级管理员' : user?.role === 'admin' ? '管理员' : '评估员'}
                </p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={logout}
              className="mt-4 w-full flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">退出登录</span>
            </button>
          )}
        </div>
      </aside>

      {/* 移动端侧边栏遮罩 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 移动端侧边栏 */}
      <aside
        className={`fixed left-0 top-0 h-full bg-slate-900 text-white z-50 md:hidden transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">欧图审核系统</h1>
              <p className="text-xs text-slate-400">Factory Audit</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-slate-400">
                {user?.role === 'sadmin' ? '高级管理员' : user?.role === 'admin' ? '管理员' : '评估员'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* 移动端顶部栏 */}
        <header className="md:hidden h-16 bg-white border-b flex items-center justify-between px-4 sticky top-0 z-30">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="font-bold">欧图审核系统</h1>
          <div className="w-10" />
        </header>

        {/* 页面内容 */}
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
