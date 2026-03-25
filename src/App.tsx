import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import AuditPage from './pages/AuditPage';
import HistoryPage from './pages/HistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AdminPage from './pages/AdminPage';
import DatabaseSetupPage from './pages/DatabaseSetupPage';
import { EvaluationRecord } from './types';

function AppContent() {
  const { isLoggedIn, user, setEditMode, isLoading, error, setError, factoryList, supplierList } = useApp();
  const [currentPage, setCurrentPage] = useState('audit');

  // 处理从历史记录页面编辑
  const handleEditFromHistory = (record: EvaluationRecord) => {
    setEditMode(true, record);
    setCurrentPage('audit');
  };

  // 如果正在加载，显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">正在连接数据库...</p>
        </div>
      </div>
    );
  }

  // 如果未登录，显示登录页面
  if (!isLoggedIn) {
    return <LoginPage />;
  }

  // 渲染当前页面
  const renderPage = () => {
    switch (currentPage) {
      case 'audit':
        return <AuditPage />;
      case 'history':
        return <HistoryPage onEdit={handleEditFromHistory} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'admin':
        // 只有 sadmin 可以访问管理页面
        if (user?.role !== 'sadmin') {
          return <AuditPage />;
        }
        return <AdminPage />;
      default:
        return <AuditPage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong className="font-bold">错误:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <Toaster position="top-right" richColors />
      <AppContent />
    </AppProvider>
  );
}

export default App;
