import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { auditModules, TOTAL_SCORE } from '../data/modules';
import {
  LineChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Building2, TrendingUp, AlertTriangle, Target, BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  const { factoryList, evaluations, getEvaluationsByFactory } = useApp();
  const [selectedFactory, setSelectedFactory] = useState<number>(factoryList[0]?.id || 0);

  // 获取工厂的评估数据
  const factoryData = useMemo(() => {
    return getEvaluationsByFactory(selectedFactory).sort(
      (a, b) => new Date(a.evalDate).getTime() - new Date(b.evalDate).getTime()
    );
  }, [selectedFactory, evaluations]);

  // 趋势图数据
  const trendData = useMemo(() => {
    return factoryData.map((e) => ({
      date: e.evalDate,
      score: e.overallPercent,
      type: e.evalType,
    }));
  }, [factoryData]);

  // 雷达图数据（最新评估的模块得分）
  const radarData = useMemo(() => {
    if (factoryData.length === 0) return [];

    const latestEval = factoryData[factoryData.length - 1];
    return auditModules.map((mod) => {
      let earned = 0;
      let total = 0;

      if (latestEval.selectedModules.includes(mod.name)) {
        Object.values(mod.subModules).forEach((subMod) => {
          subMod.items.forEach((item) => {
            total += item.score;
            if (latestEval.results[item.id]?.isChecked) {
              earned += item.score;
            }
          });
        });
      }

      return {
        module: mod.name.replace('品质控制', '').replace('制作', ''),
        score: total > 0 ? (earned / total) * 100 : 0,
        fullMark: 100,
      };
    });
  }, [factoryData]);

  // 高频缺陷数据
  const defectData = useMemo(() => {
    const allDetails: { [key: string]: number } = {};

    evaluations.forEach((e) => {
      Object.values(e.results).forEach((result) => {
        if (!result.isChecked && result.details) {
          result.details.forEach((detail) => {
            allDetails[detail] = (allDetails[detail] || 0) + 1;
          });
        }
      });
    });

    return Object.entries(allDetails)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [evaluations]);

  // 模块合规率数据
  const complianceData = useMemo(() => {
    const data: { [key: string]: { passed: number; total: number } } = {};

    auditModules.forEach((mod) => {
      data[mod.name] = { passed: 0, total: 0 };
      Object.values(mod.subModules).forEach((subMod) => {
        subMod.items.forEach((item) => {
          data[mod.name].total += item.score;
        });
      });
    });

    evaluations.forEach((e) => {
      auditModules.forEach((mod) => {
        if (e.selectedModules.includes(mod.name)) {
          Object.values(mod.subModules).forEach((subMod) => {
            subMod.items.forEach((item) => {
              if (e.results[item.id]?.isChecked) {
                data[mod.name].passed += item.score;
              }
            });
          });
        }
      });
    });

    return Object.entries(data).map(([name, { passed, total }]) => ({
      name: name.length > 8 ? name.substring(0, 8) + '...' : name,
      fullName: name,
      rate: total > 0 ? (passed / total) * 100 : 0,
    }));
  }, [evaluations]);

  // 统计数据
  const stats = useMemo(() => {
    const factoryEvals = factoryData;
    const avgScore = factoryEvals.length > 0
      ? factoryEvals.reduce((sum, e) => sum + e.overallPercent, 0) / factoryEvals.length
      : 0;
    const bestScore = factoryEvals.length > 0
      ? Math.max(...factoryEvals.map(e => e.overallPercent))
      : 0;
    const totalEvals = factoryEvals.length;

    return { avgScore, bestScore, totalEvals };
  }, [factoryData]);

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">数据分析</h1>
          <p className="text-slate-500 mt-1">深度分析工厂质量评估数据</p>
        </div>
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-slate-400" />
          <select
            value={selectedFactory}
            onChange={(e) => setSelectedFactory(Number(e.target.value))}
            className="px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {factoryList.map((factory) => (
              <option key={factory.id} value={factory.id}>{factory.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">评估次数</p>
              <p className="text-2xl font-bold">{stats.totalEvals}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">平均得分率</p>
              <p className="text-2xl font-bold">{stats.avgScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">最高得分</p>
              <p className="text-2xl font-bold">{stats.bestScore.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 趋势图 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">工厂健康趋势图</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                  name="得分率(%)"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              暂无评估数据
            </div>
          )}
        </div>

        {/* 雷达图 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">模块能力画像</h3>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="module" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar
                  name="得分率"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              暂无评估数据
            </div>
          )}
        </div>

        {/* 高频缺陷排行 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">行业高频缺陷排行</h3>
          {defectData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={defectData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#ef4444" radius={[0, 4, 4, 0]} name="频次" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              <div className="text-center">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>暂无缺陷数据</p>
              </div>
            </div>
          )}
        </div>

        {/* 模块合规率 */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold mb-4">细项合规性穿透</h3>
          {complianceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="rate" fill="#22c55e" radius={[4, 4, 0, 0]} name="合格率(%)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-400">
              暂无数据
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
