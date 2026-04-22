import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Phone, Mail, Calendar, Building, Briefcase, DollarSign, MessageSquare, ExternalLink, FileText, TrendingUp, CheckCircle, Clock } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Alice Waverly', email: 'alice@quantum.io', phone: '+1 555-0101', company: 'Quantum Tech', role: 'CEO', signedUp: '2026-04-10', status: 'Active Trial', location: 'San Francisco, CA', ltv: '$0.00' },
  { id: 2, name: 'David Chen', email: 'david.c@nexus.net', phone: '+1 555-0102', company: 'Nexus Logistics', role: 'Operations', signedUp: '2026-04-12', status: 'Pro Subscriber', location: 'New York, NY', ltv: '$12,450' },
  { id: 3, name: 'Sarah Jenkins', email: 's.jenkins@studio.design', phone: '+1 555-0103', company: 'Studio 45', role: 'Founder', signedUp: '2026-04-15', status: 'Lead', location: 'London, UK', ltv: '$0.00' },
  { id: 4, name: 'Marcus Tyree', email: 'mtyree@growth.co', phone: '+1 555-0104', company: 'GrowthCo', role: 'Marketing Dir.', signedUp: '2026-04-18', status: 'Active Trial', location: 'Austin, TX', ltv: '$0.00' },
  { id: 5, name: 'Emma Watson', email: 'emma@watson.dev', phone: '+1 555-0105', company: 'Self-Employed', role: 'Freelancer', signedUp: '2026-04-20', status: 'Inactive', location: 'Berlin, DE', ltv: '$450' },
];

const mockInvoices = [
  { id: 'INV-2041', client: 'Nexus Logistics', amount: '$4,500', status: 'Paid', date: 'Apr 18, 2026' },
  { id: 'INV-2042', client: 'Alpha Capital', amount: '$12,000', status: 'Sent', date: 'Apr 20, 2026' },
  { id: 'INV-2043', client: 'GrowthCo', amount: '$2,100', status: 'Overdue', date: 'Apr 05, 2026' },
];

const mockConsultations = [
  { id: 101, name: 'James Peterson', email: 'james.p@retailcorp.com', phone: '+1 555-0201', service: 'Full E-Commerce Redesign', budget: '$15k - $25k', date: '2026-04-21', status: 'New', message: 'Looking to overhaul our Shopify store with a completely custom headless React frontend. We need high-end animations.' },
  { id: 102, name: 'Linda Vance', email: 'lvance@fintech.io', phone: '+1 555-0202', service: 'Brand Identity & Web', budget: '$5k - $10k', date: '2026-04-19', status: 'Contacted', message: 'Starting a new fintech SaaS. Need logo, brand guidelines, and a high-converting landing page ASAP.' },
  { id: 103, name: 'Omar Al-Fayed', email: 'omar@alphacapital.ae', phone: '+971 50-0203', service: 'Dashboard MVP', budget: '$25k+', date: '2026-04-15', status: 'In Talks', message: 'We want to build a highly secure, beautiful internal dashboard for our analysts. Real-time data visualization is a must.' },
];

export default function CRM() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'consultations'
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="flex flex-col gap-8 h-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Client Hub</h2>
          <p className="text-sm font-medium text-zinc-500 mt-1">Manage external users and incoming business queries.</p>
        </div>
        
        <div className="flex bg-white dark:bg-zinc-900 p-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users' 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <Users size={16} /> Registered Users
          </button>
          <button
            onClick={() => setActiveTab('consultations')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'consultations' 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <MessageSquare size={16} /> Consultations
          </button>
          <button
            onClick={() => setActiveTab('financials')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'financials' 
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm' 
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            <DollarSign size={16} /> Financials
          </button>
        </div>
      </div>

      {activeTab === 'users' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
          {/* User List */}
          <div className="lg:col-span-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-6 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col overflow-hidden">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6">User Database</h3>
            <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar flex flex-col gap-3">
              {mockUsers.map(u => (
                <div 
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 ${
                    selectedUser?.id === u.id
                      ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-500/10 dark:border-indigo-500/30'
                      : 'bg-zinc-50 dark:bg-zinc-950 border-zinc-200/50 dark:border-zinc-800/50 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{u.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      u.status === 'Active Trial' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      u.status === 'Pro Subscriber' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' :
                      'bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}>
                      {u.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 font-medium flex items-center gap-1.5"><Mail size={12}/> {u.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Details */}
          <div className="lg:col-span-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            {selectedUser ? (
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedUser.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex flex-col h-full relative z-10"
                >
                  <div className="flex items-start justify-between mb-8 pb-8 border-b border-zinc-200/50 dark:border-zinc-800/50">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {selectedUser.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{selectedUser.name}</h2>
                        <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-1">{selectedUser.role} at {selectedUser.company}</p>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-sm hover:scale-105 transition-transform shadow-md">
                      <Mail size={16} /> Contact User
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-5">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Contact Information</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800"><Mail size={14}/></div>
                        <div>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase">Email Address</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800"><Phone size={14}/></div>
                        <div>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase">Phone Number</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800"><ExternalLink size={14}/></div>
                        <div>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase">Location</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col gap-5">
                      <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Account Details</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800"><Building size={14}/></div>
                        <div>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase">Company</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.company}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800"><TrendingUp size={14} className="text-emerald-500"/></div>
                        <div>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase">Lifetime Value (LTV)</p>
                          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{selectedUser.ltv}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-500 shadow-sm border border-zinc-200 dark:border-zinc-800"><Briefcase size={14}/></div>
                        <div>
                          <p className="text-[10px] font-semibold text-zinc-500 uppercase">Account Status</p>
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{selectedUser.status}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600">
                <Users size={64} className="mb-4 opacity-50" />
                <p className="font-bold uppercase tracking-widest text-sm">Select a user to view details</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'consultations' && (
        <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col flex-1 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
          
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 relative z-10">Incoming Consultation Requests</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto hide-scrollbar pb-4 relative z-10">
            {mockConsultations.map(req => (
              <div key={req.id} className="bg-zinc-50 dark:bg-zinc-950 p-6 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col hover:border-indigo-500/30 transition-all hover:shadow-lg group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                    req.status === 'New' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' :
                    req.status === 'Contacted' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                    'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400'
                  }`}>
                    {req.status}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 flex items-center gap-1"><Calendar size={12}/> {req.date}</span>
                </div>
                
                <h4 className="text-lg font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{req.name}</h4>
                <p className="text-xs text-zinc-500 font-medium mb-4 flex items-center gap-1.5"><Mail size={12}/> {req.email}</p>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Requested Service</p>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5"><Briefcase size={14} className="text-zinc-400"/> {req.service}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-0.5">Est. Budget</p>
                    <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5"><DollarSign size={14}/> {req.budget}</p>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 italic bg-white dark:bg-zinc-900/50 p-3 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 leading-relaxed">
                      "{req.message}"
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-auto">
                  <button className="flex-1 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-xs font-bold transition-colors">
                    Reply
                  </button>
                  <button className="w-10 flex items-center justify-center rounded-xl bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    <Phone size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
          {/* Invoice Tracker */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col relative overflow-hidden">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText size={18} /> Invoice Tracker
            </h3>
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 hide-scrollbar">
              {mockInvoices.map(inv => (
                <div key={inv.id} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex justify-between items-center group hover:border-indigo-500/30 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-400 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{inv.client}</h4>
                      <p className="text-[10px] font-semibold text-zinc-500 mt-0.5">{inv.id} • {inv.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-sm font-black text-zinc-900 dark:text-white font-mono">{inv.amount}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-widest flex items-center gap-1 ${
                      inv.status === 'Paid' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                      inv.status === 'Overdue' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400' :
                      'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400'
                    }`}>
                      {inv.status === 'Paid' && <CheckCircle size={8}/>}
                      {inv.status === 'Overdue' && <X size={8}/>}
                      {inv.status === 'Sent' && <Clock size={8}/>}
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 py-3 w-full rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
              + Auto-Generate from Time Tracker
            </button>
          </div>

          {/* Profitability Calculator */}
          <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-[2rem] p-8 border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
            
            <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 relative z-10 flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-500"/> Profitability Calculator
            </h3>
            <p className="text-xs text-zinc-500 mb-6 relative z-10">Real-time margin analysis based on tracked hours.</p>

            <div className="flex flex-col gap-6 relative z-10 flex-1">
              <div className="bg-zinc-900 dark:bg-zinc-100 p-6 rounded-2xl flex flex-col gap-2 shadow-xl">
                <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Project: Nexus Backend</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium mb-1">Effective Hourly Rate</p>
                    <p className="text-3xl font-black text-white dark:text-zinc-900 tracking-tighter">$145.50</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400 dark:text-emerald-600">+45% Margin</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Total Client Paid</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-white font-mono">$12,450</p>
                </div>
                <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 flex flex-col justify-center">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Team Hours Logged</p>
                  <p className="text-xl font-black text-zinc-900 dark:text-white font-mono">85.5 hrs</p>
                </div>
              </div>

              <div className="mt-auto p-4 rounded-xl border border-amber-200/50 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-500/5 flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-amber-800 dark:text-amber-200 leading-relaxed">
                  Warning: Design team has logged 12 hours over the estimate. Effective hourly rate is dropping by $4.50/hr.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
