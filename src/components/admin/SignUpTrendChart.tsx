import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { SubscriberDoc } from '../../services/firebase';
import { TrendingUp, Users, Target, Activity, Calendar, Award } from 'lucide-react';

interface SignUpTrendChartProps {
  subscribers: SubscriberDoc[];
}

interface TimePoint {
  date: string;
  displayTime: string;
  signups: number;
  cumulative: number;
  isFirst50Eligible: number;
}

export const SignUpTrendChart: React.FC<SignUpTrendChartProps> = ({ subscribers }) => {
  const [chartType, setChartType] = useState<'cumulative' | 'daily'>('cumulative');

  // Process subscribers chronologically into time buckets
  const chartData: TimePoint[] = useMemo(() => {
    if (!subscribers || subscribers.length === 0) {
      // Provide a clean initial timeline preview if empty
      const today = new Date();
      return Array.from({ length: 5 }, (_, idx) => {
        const d = new Date(today.getTime() - (4 - idx) * 86400000);
        return {
          date: d.toISOString().split('T')[0],
          displayTime: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          signups: 0,
          cumulative: 0,
          isFirst50Eligible: 0,
        };
      });
    }

    // Sort ascending by creation time
    const sorted = [...subscribers].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Group by day or hour depending on time span
    const groupedMap = new Map<string, { signups: number; eligible: number; timestamp: number }>();

    sorted.forEach((sub) => {
      const dateObj = new Date(sub.createdAt);
      // Format as Month Day or Month Day Hour
      const dateKey = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const current = groupedMap.get(dateKey) || { signups: 0, eligible: 0, timestamp: dateObj.getTime() };
      current.signups += 1;
      if (sub.wantsLimitedCan) {
        current.eligible += 1;
      }
      groupedMap.set(dateKey, current);
    });

    // If all signups are on the same day, group by 2-hour intervals for better granularity
    if (groupedMap.size <= 1) {
      const hourlyMap = new Map<string, { signups: number; eligible: number; timestamp: number }>();
      sorted.forEach((sub) => {
        const dateObj = new Date(sub.createdAt);
        const hour = dateObj.getHours();
        const bucketHour = Math.floor(hour / 2) * 2;
        const timeKey = `${bucketHour}:00`;

        const current = hourlyMap.get(timeKey) || { signups: 0, eligible: 0, timestamp: dateObj.getTime() };
        current.signups += 1;
        if (sub.wantsLimitedCan) {
          current.eligible += 1;
        }
        hourlyMap.set(timeKey, current);
      });

      let runningCumulative = 0;
      let runningEligible = 0;
      const points: TimePoint[] = [];

      hourlyMap.forEach((val, key) => {
        runningCumulative += val.signups;
        runningEligible += val.eligible;
        points.push({
          date: key,
          displayTime: key,
          signups: val.signups,
          cumulative: runningCumulative,
          isFirst50Eligible: Math.min(runningEligible, 50),
        });
      });

      return points;
    }

    // Multiple days
    let runningCumulative = 0;
    let runningEligible = 0;
    const points: TimePoint[] = [];

    groupedMap.forEach((val, key) => {
      runningCumulative += val.signups;
      runningEligible += val.eligible;
      points.push({
        date: key,
        displayTime: key,
        signups: val.signups,
        cumulative: runningCumulative,
        isFirst50Eligible: Math.min(runningEligible, 50),
      });
    });

    return points;
  }, [subscribers]);

  const eligibleCount = subscribers.filter((s) => s.wantsLimitedCan).length;
  const currentFirst50 = Math.min(eligibleCount, 50);
  const percentToGoal = Math.round((currentFirst50 / 50) * 100);
  const slotsRemaining = Math.max(0, 50 - eligibleCount);

  // Custom Futuristic Cyber Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as TimePoint;
      return (
        <div className="bg-[#090C16]/95 border border-amber-500/40 backdrop-blur-xl p-3.5 rounded-2xl shadow-2xl text-xs font-tech text-white min-w-[200px]">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="text-white/60 uppercase tracking-widest text-[10px]">TIME WINDOW</span>
            <span className="font-bold text-blue-300">{label}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Cumulative Sign-ups:</span>
              <span className="font-bold text-white">{data.cumulative}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-400">First 50 Candidates:</span>
              <span className="font-bold text-amber-300">{data.isFirst50Eligible} / 50</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-emerald-400">New in this interval:</span>
              <span className="font-bold text-emerald-300">+{data.signups}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px]">
              <span className="text-white/50">Progress:</span>
              <span className="font-bold text-blue-400">{Math.round((data.isFirst50Eligible / 50) * 100)}% of 50</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0E1322] border border-amber-500/25 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
      {/* Header & Metric Summary */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-tech text-amber-400 uppercase tracking-widest mb-1.5">
            <Activity className="w-4 h-4" />
            <span>REAL-TIME MILESTONE ANALYTICS</span>
          </div>
          <h2 className="font-display font-black text-xl sm:text-2xl text-white tracking-wide uppercase">
            SIGN-UP TREND & FIRST 50 VELOCITY
          </h2>
          <p className="font-body text-xs sm:text-sm text-white/60 mt-1">
            Tracking visitor momentum towards claiming the 50 exclusive spots on the limited edition can packaging.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-black/60 p-1 rounded-xl border border-white/15">
          <button
            onClick={() => setChartType('cumulative')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-tech font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              chartType === 'cumulative'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>CUMULATIVE GOAL</span>
          </button>
          <button
            onClick={() => setChartType('daily')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-tech font-bold tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
              chartType === 'daily'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>INTERVAL VELOCITY</span>
          </button>
        </div>
      </div>

      {/* Progress Toward 50 Goal Bar */}
      <div className="bg-black/40 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-tech">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-white uppercase tracking-wider">
              FIRST 50 CAN CAPACITY:
            </span>
            <span className="text-amber-300 font-bold">
              {currentFirst50} of 50 SLOTS FILLED ({percentToGoal}%)
            </span>
          </div>
          <div className="text-white/50">
            {slotsRemaining > 0 ? (
              <span className="text-emerald-400 font-medium">
                {slotsRemaining} spots remaining before packaging deadline
              </span>
            ) : (
              <span className="text-amber-400 font-bold">
                ROSTER COMPLETE — 50 NAMES REACHED!
              </span>
            )}
          </div>
        </div>

        {/* Multi-layered futuristic progress bar */}
        <div className="relative w-full h-3.5 bg-black/80 rounded-full border border-white/15 overflow-hidden p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-amber-500 to-amber-300 transition-all duration-700 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            style={{ width: `${Math.min(100, Math.max(percentToGoal, 4))}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-tech text-white/40">
          <span>0 START</span>
          <span>25 HALFWAY (50%)</span>
          <span className="text-amber-400 font-bold">50 CAN TARGET (100%)</span>
        </div>
      </div>

      {/* Recharts Chart Canvas */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'cumulative' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#176BFF" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="colorEligible" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A8D8FF" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A8D8FF" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
              <XAxis
                dataKey="displayTime"
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                fontFamily="Space Grotesk, monospace"
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                domain={[0, (dataMax: number) => Math.max(dataMax + 5, 55)]}
                tickLine={false}
                fontFamily="Space Grotesk, monospace"
              />
              <Tooltip content={<CustomTooltip />} />
              {/* Reference line for the 50 Target Goal */}
              <ReferenceLine
                y={50}
                stroke="#F59E0B"
                strokeDasharray="4 4"
                label={{
                  value: 'FIRST 50 GOAL',
                  fill: '#F59E0B',
                  fontSize: 10,
                  position: 'insideTopRight',
                  fontFamily: 'Space Grotesk, monospace',
                }}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                name="Total Sign-ups"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCumulative)"
              />
              <Area
                type="monotone"
                dataKey="isFirst50Eligible"
                name="First 50 Candidates"
                stroke="#A8D8FF"
                strokeWidth={2}
                strokeDasharray="2 2"
                fillOpacity={1}
                fill="url(#colorEligible)"
              />
            </AreaChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" vertical={false} />
              <XAxis
                dataKey="displayTime"
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                fontFamily="Space Grotesk, monospace"
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.4)"
                fontSize={11}
                tickLine={false}
                fontFamily="Space Grotesk, monospace"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="signups" name="Interval Sign-ups" fill="#176BFF" radius={[6, 6, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Legend & Milestone Stats Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/10 pt-4 text-xs font-tech">
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500" />
          <span>Cumulative Momentum</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <span className="w-3 h-3 rounded-full bg-blue-300 border border-blue-400" />
          <span>First 50 Eligible Candidates</span>
        </div>
        <div className="flex items-center gap-2 text-amber-300 font-bold justify-start sm:justify-end">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Target: 50 Custom Cans</span>
        </div>
      </div>
    </div>
  );
};
