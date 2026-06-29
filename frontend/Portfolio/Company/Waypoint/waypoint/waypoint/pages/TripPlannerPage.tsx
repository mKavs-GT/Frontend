
import React, { useState, useMemo, useEffect } from 'react';
import { BudgetItem, Currency } from '../types';
import FlightBooking from '../components/FlightBooking';
import ScrollReveal from '../components/ScrollReveal';

const initialTasks = [
  { id: 1, text: 'Confirm Airport Transfer', completed: false, icon: 'fa-plane-departure' },
  { id: 2, text: 'Verify Travel Insurance', completed: false, icon: 'fa-shield-alt' },
  { id: 3, text: 'Download Offline Maps', completed: false, icon: 'fa-map-marked-alt' },
  { id: 4, text: 'Make Dinner Reservations', completed: false, icon: 'fa-utensils' },
  { id: 5, text: 'Confirm Mode of Transport', completed: false, icon: 'fa-car' },
];

const initialBudgetItems: BudgetItem[] = [
  { id: 1, category: 'Flights', estimated: 800, actual: 750 },
  { id: 2, category: 'Accommodation', estimated: 1200, actual: 1350 },
  { id: 3, category: 'Food & Dining', estimated: 600, actual: 450 },
  { id: 4, category: 'Activities', estimated: 400, actual: 0 },
];

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
};

const BudgetChart: React.FC<{ data: BudgetItem[], currencySymbol: string }> = ({ data, currencySymbol }) => {
  const [rechartsReady, setRechartsReady] = useState(false);

  useEffect(() => {
    const checkRecharts = () => {
      if (typeof (window as any).Recharts !== 'undefined') {
        setRechartsReady(true);
      } else {
        const intervalId = setInterval(() => {
          if (typeof (window as any).Recharts !== 'undefined') {
            setRechartsReady(true);
            clearInterval(intervalId);
          }
        }, 100);
        return () => clearInterval(intervalId);
      }
    };
    checkRecharts();
  }, []);

  if (!rechartsReady) {
    return <div className="flex items-center justify-center h-[350px] text-gray-400 bg-white/5 rounded-2xl border border-white/5">
      <div className="flex flex-col items-center">
        <i className="fas fa-spinner fa-spin text-3xl mb-4 text-waypoint-primary"></i>
        <p className="animate-pulse">Loading Charts...</p>
      </div>
    </div>;
  }

  const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } = (window as any).Recharts;

  const COLORS = ['#A665A5', '#C4A4D4', '#E5B4E2', '#D8B4FE', '#8B5CF6', '#6366F1'];

  return (
    <div className="grid grid-cols-1 gap-8 w-full">
      {/* Bar Chart Overview */}
      <div className="h-[350px] w-full bg-white/5 p-6 rounded-2xl border border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Spending vs Budget</p>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart key={`bar-${JSON.stringify(data)}`} data={data} margin={{ top: 0, right: 0, left: -25, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
            <XAxis
              dataKey="category"
              stroke="#9ca3af"
              tick={{ fill: '#d1d5db', fontSize: 10 }}
              interval={0}
              angle={-45}
              textAnchor="end"
            />
            <YAxis stroke="#9ca3af" tick={{ fill: '#d1d5db', fontSize: 10 }} tickFormatter={(tick) => `${currencySymbol}${tick}`} />
            <Tooltip
              cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem' }}
              labelStyle={{ color: '#f9fafb', fontWeight: 'bold' }}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, '']}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', paddingBottom: '20px' }} />
            <Bar dataKey="estimated" fill="#A665A5" name="Budget" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="actual" fill="#E5B4E2" name="Actual" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart Distribution */}
      <div className="h-[350px] w-full bg-white/5 p-6 rounded-2xl border border-white/5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6">Expense Distribution</p>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart key={`pie-${JSON.stringify(data)}`}>
            <Pie
              data={data.filter(d => d.actual > 0)}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="actual"
              nameKey="category"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '0.75rem' }}
              itemStyle={{ color: '#f9fafb', fontSize: '12px' }}
              formatter={(value: number) => [`${currencySymbol}${value.toLocaleString()}`, 'Spent']}
            />
            <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function TripPlannerPage() {
  const [tasks, setTasks] = useState(initialTasks);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>(initialBudgetItems);
  const [newCategory, setNewCategory] = useState('');
  const [newEstimated, setNewEstimated] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');

  const currencySymbol = useMemo(() => currencySymbols[currency], [currency]);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleActualChange = (id: number, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numericValue)) {
      setBudgetItems(budgetItems.map(item =>
        item.id === id ? { ...item, actual: numericValue } : item
      ));
    }
  };

  const handleEstimatedChange = (id: number, value: string) => {
    const numericValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numericValue)) {
      setBudgetItems(budgetItems.map(item =>
        item.id === id ? { ...item, estimated: numericValue } : item
      ));
    }
  };

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    const estimatedValue = parseFloat(newEstimated);
    if (newCategory.trim() && !isNaN(estimatedValue) && estimatedValue > 0) {
      const newItem: BudgetItem = { id: Date.now(), category: newCategory.trim(), estimated: estimatedValue, actual: 0 };
      setBudgetItems([...budgetItems, newItem]);
      setNewCategory('');
      setNewEstimated('');
    }
  };

  const progress = useMemo(() => (tasks.filter(t => t.completed).length / tasks.length) * 100, [tasks]);

  const { totalEstimated, totalActual } = useMemo(() => {
    return budgetItems.reduce((acc, item) => {
      acc.totalEstimated += item.estimated;
      acc.totalActual += item.actual;
      return acc;
    }, { totalEstimated: 0, totalActual: 0 });
  }, [budgetItems]);

  const remainingBudget = totalEstimated - totalActual;

  return (
    <div className="container mx-auto px-6 py-12">
      <ScrollReveal>
        <div className="text-center mb-16">
          <span className="text-waypoint-accent font-semibold tracking-[0.3em] uppercase text-xs md:text-sm mb-3 block">Seamless Travels</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight">
            Trip <span className="text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent to-waypoint-primary">Planner</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary mx-auto mt-6 rounded-full"></div>
        </div>
      </ScrollReveal>

      <section className="mb-16">
        <ScrollReveal>
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary rounded-full"></div>
            <h2 className="text-3xl font-extrabold text-white">Book Your <span className="text-waypoint-accent">Journey</span></h2>
          </div>
          <FlightBooking />
        </ScrollReveal>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <ScrollReveal direction="left">
          <section>
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-10 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary rounded-full"></div>
              <h2 className="text-3xl font-extrabold text-white">Preparation <span className="text-waypoint-accent">Checklist</span></h2>
            </div>
            <div className="w-full max-w-2xl mx-auto lg:mx-0">
              <div className="mb-8"><div className="flex justify-between items-center mb-2"><span className="text-sm font-medium text-gray-300">Progress</span><span className="text-sm font-medium text-white">{Math.round(progress)}%</span></div><div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-gradient-to-r from-waypoint-secondary to-waypoint-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div></div></div>
              <div className="space-y-4">{tasks.map((task) => (<div key={task.id} onClick={() => toggleTask(task.id)} className={`flex items-center p-5 rounded-lg cursor-pointer transition-all duration-300 ${task.completed ? 'bg-green-500/20 border-l-4 border-green-500' : 'bg-white/5 hover:bg-white/10'}`}><div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 text-xl ${task.completed ? 'bg-green-500 text-white' : 'bg-waypoint-primary/30 text-waypoint-accent'}`}><i className={`fas ${task.icon}`}></i></div><span className={`flex-grow text-lg ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>{task.text}</span><div className={`w-7 h-7 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-green-500 border-green-400' : 'border-gray-500'}`}>{task.completed && <i className="fas fa-check text-white text-sm"></i>}</div></div>))}</div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal direction="right">
          <section>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center text-center lg:text-left mb-8">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="w-10 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary rounded-full"></div>
                <h2 className="text-3xl font-extrabold text-white">Trip <span className="text-waypoint-accent">Budget</span></h2>
              </div>
              <div className="relative">
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-gray-800 text-white p-2 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-waypoint-primary pr-8">
                  {Object.keys(currencySymbols).map(key => <option key={key} value={key}>{key}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"></i>
              </div>
            </div>
            <div className="w-full max-w-2xl mx-auto lg:mx-0 bg-white/[0.03] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-48 h-48 bg-waypoint-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-waypoint-accent/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="space-y-6 mb-6">
                {budgetItems.map(item => {
                  const maxVal = Math.max(item.estimated * 1.5, item.actual, 100);
                  const thumbPercentage = (item.actual / maxVal) * 100;
                  const budgetLimitPercentage = (item.estimated / maxVal) * 100;
                  const isOverBudget = item.actual > item.estimated;

                  return (
                    <div key={item.id} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                        <span className="font-bold text-lg">{item.category}</span>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center bg-gray-900 rounded-lg px-3 py-1 border border-white/10 focus-within:border-waypoint-secondary">
                            <span className="text-gray-500 text-[10px] uppercase font-bold mr-2">Spent</span>
                            <input
                              type="number"
                              min="0"
                              value={item.actual}
                              onChange={(e) => handleActualChange(item.id, e.target.value)}
                              className="w-16 bg-transparent py-1 text-right focus:outline-none font-mono"
                            />
                          </div>
                          <div className="flex items-center bg-white/5 rounded-lg px-3 py-1 border border-white/10 focus-within:border-waypoint-primary">
                            <span className="text-gray-500 text-[10px] uppercase font-bold mr-2">Goal</span>
                            <input
                              type="number"
                              min="0"
                              value={item.estimated}
                              onChange={(e) => handleEstimatedChange(item.id, e.target.value)}
                              className="w-16 bg-transparent py-1 text-right focus:outline-none font-mono text-gray-400"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="relative h-6 flex items-center">
                        <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`absolute h-full transition-all duration-200 cubic-bezier(0.2, 0.8, 0.2, 1) ${isOverBudget ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-gradient-to-r from-waypoint-secondary to-waypoint-primary'}`}
                            style={{ width: `${thumbPercentage}%` }}
                          ></div>
                          <div
                            className="absolute top-0 h-full w-0.5 bg-white/30"
                            style={{ left: `${budgetLimitPercentage}%` }}
                          ></div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max={maxVal}
                          value={item.actual}
                          onChange={(e) => handleActualChange(item.id, e.target.value)}
                          className="w-full absolute inset-0 appearance-none bg-transparent cursor-pointer custom-slider z-20"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={handleAddBudgetItem} className="flex flex-col sm:flex-row gap-2 mb-6 border-t border-white/10 pt-6"><input type="text" value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="New Category" className="flex-grow bg-gray-800 p-2 rounded-lg border-2 border-transparent focus:border-waypoint-primary focus:outline-none" /><input type="number" value={newEstimated} onChange={e => setNewEstimated(e.target.value)} placeholder="Est. Cost" className="w-full sm:w-32 bg-gray-800 p-2 rounded-lg border-2 border-transparent focus:border-waypoint-primary focus:outline-none" /><button type="submit" className="px-4 py-2 bg-waypoint-primary hover:bg-opacity-80 rounded-lg font-semibold transition-colors">Add</button></form>
              <div className="border-t border-white/10 pt-8 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Estimated</p>
                    <p className="text-xl font-bold">{currencySymbol}{totalEstimated.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Spent</p>
                    <p className="text-xl font-bold">{currencySymbol}{totalActual.toLocaleString()}</p>
                  </div>
                  <div className={`p-4 rounded-xl border col-span-2 md:col-span-1 transition-all ${remainingBudget >= 0 ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                    <p className="text-[10px] uppercase font-bold mb-1 opacity-70">{remainingBudget >= 0 ? 'Remaining' : 'Over Limit'}</p>
                    <p className="text-xl font-bold animate-pulse-subtle">{currencySymbol}{Math.abs(remainingBudget).toLocaleString()}</p>
                  </div>
                </div>
                <div className="w-full pt-4">
                  <BudgetChart data={budgetItems} currencySymbol={currencySymbol} />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
      <style>{`
        .custom-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 24px;
            height: 24px;
            background: white;
            border: 5px solid #3F172C;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(0,0,0,0.4);
            margin-top: -6px;
            transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            z-index: 30;
        }
        .custom-slider:active::-webkit-slider-thumb {
            transform: scale(1.15);
            box-shadow: 0 0 25px rgba(166, 101, 165, 0.6);
            border-color: #A665A5;
        }
        .custom-slider::-moz-range-thumb {
            width: 24px;
            height: 24px;
            background: white;
            border: 5px solid #3F172C;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 15px rgba(0,0,0,0.4);
            transition: all 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            z-index: 30;
        }
        .custom-slider:active::-moz-range-thumb {
            transform: scale(1.15);
            box-shadow: 0 0 25px rgba(166, 101, 165, 0.6);
            border-color: #A665A5;
        }
        .custom-slider::-webkit-slider-runnable-track {
            background: transparent;
            height: 12px;
        }
        .custom-slider::-moz-range-track {
            background: transparent;
            height: 12px;
        }
        @keyframes pulse-subtle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
        }
        .animate-pulse-subtle {
            animation: pulse-subtle 2s infinite ease-in-out;
        }
        .custom-slider:focus {
            outline: none;
        }
        .custom-slider:focus::-webkit-slider-thumb {
            box-shadow: 0 0 0 3px rgba(196, 164, 212, 0.5); /* glow effect */
        }
        .custom-slider:focus::-moz-range-thumb {
            box-shadow: 0 0 0 3px rgba(196, 164, 212, 0.5);
        }
      `}</style>
    </div>
  );
}
