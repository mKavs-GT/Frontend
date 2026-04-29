import React, { useState, useEffect } from 'react';

const districtMapping = {
  Chennai: { project: "Green Canopy Project", gps: "13.0827° N, 80.2707° E" },
  Coimbatore: { project: "Women Empowerment Skills", gps: "11.0168° N, 76.9558° E" },
  Madurai: { project: "Clean Water Access", gps: "9.9252° N, 78.1198° E" },
  Trichy: { project: "Mobile Health Clinics", gps: "10.7905° N, 78.7047° E" },
  Salem: { project: "Plastic-Free Coasts", gps: "11.6643° N, 78.1460° E" },
  Vellore: { project: "Rural Education Initiative", gps: "12.9165° N, 79.1325° E" },
  Krishnagiri: { project: "City Forest Alpha", gps: "12.5186° N, 78.2137° E" },
  Thanjavur: { project: "Village Solar Setup", gps: "10.7870° N, 79.1378° E" }
};

const FieldWorker = () => {
  const [isOffline, setIsOffline] = useState(false);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPlaceholderPhoto, setShowPlaceholderPhoto] = useState(false);
  
  const [formData, setFormData] = useState({
    workerName: 'Ramesh K.',
    district: 'Chennai',
    activity: 'Seeds/Saplings Planted',
    count: '',
    notes: ''
  });

  const [reports, setReports] = useState([
    {
      worker: "Anita R.",
      district: "Madurai", 
      project: "Clean Water Access",
      activity: "Beneficiaries Met",
      count: 47,
      gps: "9.9252° N, 78.1198° E",
      time: "Today, 2:14 PM",
      synced: true
    },
    {
      worker: "Suresh S.",
      district: "Krishnagiri",
      project: "City Forest Alpha", 
      activity: "Seeds/Saplings Planted",
      count: 120,
      gps: "12.5186° N, 78.2137° E",
      time: "Today, 11:32 AM",
      synced: true
    },
    {
      worker: "Meena S.",
      district: "Vellore",
      project: "Rural Education Initiative",
      activity: "Materials Distributed",
      count: 35,
      gps: "12.9165° N, 79.1325° E",
      time: "Yesterday, 4:45 PM",
      synced: false
    }
  ]);

  const [submittedData, setSubmittedData] = useState(null);

  useEffect(() => {
    if (!isOffline && pendingCount > 0) {
      setShowSuccessBanner(true);
      
      // Update pending reports to synced
      setReports(prev => prev.map(r => r.synced === false ? { ...r, synced: true } : r));
      setPendingCount(0);
      
      const timer = setTimeout(() => {
        setShowSuccessBanner(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, pendingCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const currentMapping = districtMapping[formData.district];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newReport = {
      worker: formData.workerName || 'Unknown',
      district: formData.district,
      project: currentMapping.project,
      activity: formData.activity,
      count: formData.count || 0,
      gps: currentMapping.gps,
      time: `Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      synced: !isOffline
    };

    if (isOffline) {
      setPendingCount(prev => prev + 1);
      setReports(prev => [newReport, ...prev]);
      // Small toast simulation for saving locally
      const btn = document.getElementById('submitBtn');
      const originalText = btn.innerText;
      btn.innerText = "Saved! Will sync when online.";
      setTimeout(() => {
        if(btn) btn.innerText = originalText;
      }, 2000);

      // Reset form but keep worker name
      setFormData(prev => ({ ...prev, district: 'Chennai', activity: 'Seeds/Saplings Planted', count: '', notes: '' }));
      setShowPlaceholderPhoto(false);
    } else {
      setReports(prev => [newReport, ...prev]);
      setSubmittedData({ ...newReport, timestamp: newReport.time });
      setIsSubmitted(true);
    }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen pt-20 pb-12 w-full">
      {/* Phone-like container */}
      <div className="max-w-sm mx-auto bg-[#F3F4F6] sm:shadow-2xl sm:rounded-3xl sm:border-[8px] sm:border-gray-800 sm:overflow-hidden relative min-h-[800px]">
        
        {/* SECTION A — TOP BAR */}
        <div className="bg-[#1B4332] py-4 px-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-bold text-primary text-xs shrink-0">
              V
            </div>
            <span className="text-white font-bold text-base leading-none">Field Reporter</span>
          </div>
          <div className="flex flex-col items-end">
            <button 
              onClick={() => setIsOffline(!isOffline)}
              className="text-[10px] text-gray-300 underline mb-1 hover:text-white"
            >
              Simulate {isOffline ? 'Online' : 'Offline'}
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-green-400'}`}></span>
              <span className="text-[10px] text-white">
                {isOffline ? 'Offline — saving locally' : 'Synced'}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION B — PENDING SYNC BANNER */}
        {isOffline && pendingCount > 0 && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 text-xs font-medium border-b border-yellow-200 text-center">
            ⚠️ {pendingCount} {pendingCount === 1 ? 'report' : 'reports'} saved locally. Will sync when connected.
          </div>
        )}
        {!isOffline && showSuccessBanner && (
          <div className="bg-green-100 text-green-800 px-4 py-2 text-xs font-medium border-b border-green-200 text-center transition-all">
            ✅ {pendingCount} reports synced successfully!
          </div>
        )}

        {/* SECTION C & D — MAIN CONTENT */}
        <div className="px-4 mt-6 pb-8">
          {isSubmitted && submittedData ? (
            /* SECTION D — SUCCESS STATE */
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center mb-6 border border-gray-100">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl text-green-600">✓</span>
              </div>
              <h2 className="text-xl font-bold text-primary mb-1">Report Submitted!</h2>
              <p className="text-gray-500 text-xs mb-5">Synced to dashboard at {submittedData.timestamp}</p>
              
              <div className="bg-green-50 rounded-xl p-4 text-left mb-6 space-y-2 border border-green-100">
                <div className="text-sm font-medium text-gray-800">📍 {submittedData.district} — {submittedData.project}</div>
                <div className="text-sm text-gray-700">🌱 {submittedData.count} {submittedData.activity}</div>
                <div className="text-sm text-gray-700">🕐 {submittedData.timestamp}</div>
                <div className="text-sm text-green-700 font-medium">✅ GPS Verified</div>
              </div>

              <button 
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData(prev => ({ ...prev, district: 'Chennai', activity: 'Seeds/Saplings Planted', count: '', notes: '' }));
                  setShowPlaceholderPhoto(false);
                }}
                className="w-full py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-green-50 transition-colors text-sm"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            /* SECTION C — SUBMIT FORM */
            <div className="bg-white rounded-2xl shadow-lg p-5 mb-6 border border-gray-100">
              <h2 className="font-bold text-lg text-primary mb-4">New Field Report</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Worker Name</label>
                  <input 
                    type="text" 
                    name="workerName"
                    value={formData.workerName}
                    onChange={handleChange}
                    placeholder="Your name" 
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">District</label>
                  <select 
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none text-sm"
                  >
                    {Object.keys(districtMapping).map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Project</label>
                  <select 
                    disabled
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 appearance-none cursor-not-allowed text-sm"
                  >
                    <option>{currentMapping.project}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Activity Done</label>
                  <select 
                    name="activity"
                    value={formData.activity}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all appearance-none text-sm"
                  >
                    <option value="Seeds/Saplings Planted">Seeds/Saplings Planted</option>
                    <option value="Beneficiaries Met">Beneficiaries Met</option>
                    <option value="Materials Distributed">Materials Distributed</option>
                    <option value="Site Inspection">Site Inspection</option>
                    <option value="Community Meeting">Community Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">How many? (trees / people / items)</label>
                  <input 
                    type="number" 
                    name="count"
                    value={formData.count}
                    onChange={handleChange}
                    placeholder="e.g. 24" 
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all text-sm"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-700">📍 GPS Location</label>
                    <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">Auto-captured</span>
                  </div>
                  <input 
                    type="text" 
                    readOnly
                    value={currentMapping.gps}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 font-mono text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Photo Evidence</label>
                  {!showPlaceholderPhoto ? (
                    <button 
                      type="button" 
                      onClick={() => setShowPlaceholderPhoto(true)}
                      className="w-full border-2 border-dashed border-gray-300 rounded-xl py-6 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-primary transition-colors"
                    >
                      <span className="text-gray-400 text-sm">📷 Tap to attach photo</span>
                    </button>
                  ) : (
                    <div className="relative w-full rounded-xl overflow-hidden border border-gray-200">
                      <img src="https://placehold.co/400x200/e2e8f0/64748b?text=Evidence+Photo" alt="Evidence" className="w-full h-32 object-cover" />
                      <button 
                        type="button"
                        onClick={() => setShowPlaceholderPhoto(false)}
                        className="absolute top-2 right-2 bg-white/90 text-red-500 text-xs px-2 py-1 rounded shadow"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Any observations, challenges, or remarks..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none text-sm"
                  ></textarea>
                </div>

                <button 
                  id="submitBtn"
                  type="submit" 
                  className={`w-full font-bold py-3.5 rounded-xl text-sm mt-2 transition-all shadow active:scale-[0.98] ${
                    isOffline 
                      ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-500' 
                      : 'bg-primary text-white hover:bg-[#1B4332]'
                  }`}
                >
                  {isOffline ? 'Save Locally 📥' : 'Submit Report ✓'}
                </button>
              </form>
            </div>
          )}

          {/* SECTION E — RECENT REPORTS LOG */}
          <div>
            <h3 className="font-bold text-gray-700 mb-3 text-sm">Recent Reports</h3>
            <div className="space-y-3">
              {reports.map((report, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3.5 relative overflow-hidden">
                  
                  <div className="flex justify-between items-start mb-1.5 pl-1">
                    <span className="font-semibold text-gray-900 text-sm">{report.worker}</span>
                    {report.synced ? (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-medium">✓ Synced</span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-700 text-[10px] px-2 py-0.5 rounded-full font-medium">⏳ Pending</span>
                    )}
                  </div>
                  
                  <div className="text-gray-700 text-xs mb-2.5 pl-1">
                    <span className="font-medium text-gray-900">{report.count} {report.activity}</span> <span className="text-gray-400">—</span> {report.project}
                  </div>
                  
                  <div className="flex justify-between items-center pl-1">
                    <span className="text-[10px] text-gray-400">📍 {report.gps}</span>
                    <span className="text-[10px] text-gray-400">{report.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FieldWorker;
