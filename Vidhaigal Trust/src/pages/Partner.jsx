import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const Partner = () => {
  const [activeTab, setActiveTab] = useState('schools');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [csrSubmitted, setCsrSubmitted] = useState(false);

  return (
    <>
      <Helmet>
        <title>Partner With Us | Vidhaigal Trust</title>
      </Helmet>

      <section className="bg-primary pt-24 pb-16 text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4">Partner With Us</h1>
        <p className="text-xl text-green-200 max-w-2xl mx-auto mb-8">
          Schools. Colleges. Corporates. Together we plant more than trees.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <div className="bg-white/20 text-white text-sm px-5 py-2 rounded-full font-medium">🏫 12 Schools Registered</div>
          <div className="bg-white/20 text-white text-sm px-5 py-2 rounded-full font-medium">🎓 8 Colleges Active</div>
          <div className="bg-white/20 text-white text-sm px-5 py-2 rounded-full font-medium">⏱️ 3,200+ Student Hours Logged</div>
        </div>
      </section>

      <div className="bg-white sticky top-16 z-40 border-b border-gray-200 shadow-sm">
        <div className="flex justify-center max-w-xl mx-auto">
          <button
            onClick={() => setActiveTab('schools')}
            className={activeTab === 'schools' 
              ? "border-b-4 border-primary text-primary font-bold py-4 px-8 text-base transition-all"
              : "text-gray-500 py-4 px-8 text-base hover:text-primary transition-all"}
          >
            🏫 For Schools & Colleges
          </button>
          <button
            onClick={() => setActiveTab('corporate')}
            className={activeTab === 'corporate'
              ? "border-b-4 border-primary text-primary font-bold py-4 px-8 text-base transition-all"
              : "text-gray-500 py-4 px-8 text-base hover:text-primary transition-all"}
          >
            🏢 For Corporates & CSR
          </button>
        </div>
      </div>

      {activeTab === 'schools' && (
        <div>
          <section className="bg-accent py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-extrabold text-primary text-center mb-12">
                How the Partnership Works
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 relative pt-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                  <div className="text-3xl mb-3">📋</div>
                  <h3 className="font-bold text-lg mb-2">Register Your Institution</h3>
                  <p className="text-sm text-gray-500">Fill a simple form with your school or college details. Approval in 48 hours.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 relative pt-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                  <div className="text-3xl mb-3">🗺️</div>
                  <h3 className="font-bold text-lg mb-2">Choose a Project</h3>
                  <p className="text-sm text-gray-500">Browse active Vidhaigal projects near your location and pick one that fits your students.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 relative pt-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                  <div className="text-3xl mb-3">👥</div>
                  <h3 className="font-bold text-lg mb-2">Deploy Students</h3>
                  <p className="text-sm text-gray-500">Students sign up for volunteer slots. Hours are tracked automatically on the platform.</p>
                </div>
                <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100 relative pt-10">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                  <div className="text-3xl mb-3">🏆</div>
                  <h3 className="font-bold text-lg mb-2">Get Certified</h3>
                  <p className="text-sm text-gray-500">Institution gets a monthly impact report. Students receive verified digital certificates.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-extrabold text-center text-primary mb-3">
                Active Partner Institutions
              </h2>
              <p className="text-gray-500 text-center mb-12">
                Already making an impact with Vidhaigal.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">College</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mt-4">PSG Arts & Science College</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 Coimbatore, Tamil Nadu</p>
                  <div className="border-t mt-4 pt-4 grid grid-cols-3 text-center">
                    <div><div className="font-bold text-primary text-lg">84</div><div className="text-xs text-gray-500 mt-0.5">Students</div></div>
                    <div><div className="font-bold text-primary text-lg">1240</div><div className="text-xs text-gray-500 mt-0.5">Hours</div></div>
                    <div><div className="font-bold text-primary text-lg">3</div><div className="text-xs text-gray-500 mt-0.5">Projects</div></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">School</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mt-4">Sri Ramakrishna Mission Vidyalaya</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 Coimbatore, Tamil Nadu</p>
                  <div className="border-t mt-4 pt-4 grid grid-cols-3 text-center">
                    <div><div className="font-bold text-primary text-lg">45</div><div className="text-xs text-gray-500 mt-0.5">Students</div></div>
                    <div><div className="font-bold text-primary text-lg">380</div><div className="text-xs text-gray-500 mt-0.5">Hours</div></div>
                    <div><div className="font-bold text-primary text-lg">2</div><div className="text-xs text-gray-500 mt-0.5">Projects</div></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">College</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mt-4">Loyola College</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 Chennai, Tamil Nadu</p>
                  <div className="border-t mt-4 pt-4 grid grid-cols-3 text-center">
                    <div><div className="font-bold text-primary text-lg">112</div><div className="text-xs text-gray-500 mt-0.5">Students</div></div>
                    <div><div className="font-bold text-primary text-lg">1680</div><div className="text-xs text-gray-500 mt-0.5">Hours</div></div>
                    <div><div className="font-bold text-primary text-lg">4</div><div className="text-xs text-gray-500 mt-0.5">Projects</div></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between">
                    <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">School</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mt-4">Govt. Higher Secondary School</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 Madurai, Tamil Nadu</p>
                  <div className="border-t mt-4 pt-4 grid grid-cols-3 text-center">
                    <div><div className="font-bold text-primary text-lg">67</div><div className="text-xs text-gray-500 mt-0.5">Students</div></div>
                    <div><div className="font-bold text-primary text-lg">520</div><div className="text-xs text-gray-500 mt-0.5">Hours</div></div>
                    <div><div className="font-bold text-primary text-lg">2</div><div className="text-xs text-gray-500 mt-0.5">Projects</div></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">College</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mt-4">NIT Trichy — NSS Chapter</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 Trichy, Tamil Nadu</p>
                  <div className="border-t mt-4 pt-4 grid grid-cols-3 text-center">
                    <div><div className="font-bold text-primary text-lg">93</div><div className="text-xs text-gray-500 mt-0.5">Students</div></div>
                    <div><div className="font-bold text-primary text-lg">1140</div><div className="text-xs text-gray-500 mt-0.5">Hours</div></div>
                    <div><div className="font-bold text-primary text-lg">3</div><div className="text-xs text-gray-500 mt-0.5">Projects</div></div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
                  <div className="flex justify-between">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">College</span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✓ Active</span>
                  </div>
                  <h3 className="text-lg font-bold text-text-dark mt-4">VIT Vellore — NSS Wing</h3>
                  <p className="text-sm text-gray-500 mt-1">📍 Vellore, Tamil Nadu</p>
                  <div className="border-t mt-4 pt-4 grid grid-cols-3 text-center">
                    <div><div className="font-bold text-primary text-lg">156</div><div className="text-xs text-gray-500 mt-0.5">Students</div></div>
                    <div><div className="font-bold text-primary text-lg">2080</div><div className="text-xs text-gray-500 mt-0.5">Hours</div></div>
                    <div><div className="font-bold text-primary text-lg">5</div><div className="text-xs text-gray-500 mt-0.5">Projects</div></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-accent py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-extrabold text-primary text-center mb-12">
                Top Student Volunteers This Month
              </h2>

              <div className="flex justify-center items-end gap-4 mb-10">
                <div className="text-center order-1">
                  <div className="bg-gray-200 rounded-t-2xl w-24 h-28 flex flex-col items-center justify-center">
                    <span className="text-2xl">🥈</span>
                    <span className="text-xs font-bold text-gray-700 mt-1">Kavitha S.</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">Loyola College</div>
                  <div className="text-sm font-bold text-primary">38 hrs</div>
                </div>

                <div className="text-center order-2">
                  <div className="bg-secondary rounded-t-2xl w-28 h-36 flex flex-col items-center justify-center">
                    <span className="text-3xl">🥇</span>
                    <span className="text-xs font-bold mt-1">Arjun M.</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">VIT Vellore</div>
                  <div className="text-sm font-bold text-primary">52 hrs</div>
                </div>

                <div className="text-center order-3">
                  <div className="bg-amber-100 rounded-t-2xl w-24 h-20 flex flex-col items-center justify-center">
                    <span className="text-2xl">🥉</span>
                    <span className="text-xs font-bold mt-1">Nithya R.</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">NIT Trichy</div>
                  <div className="text-sm font-bold text-primary">31 hrs</div>
                </div>
              </div>

              <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden mt-8">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-primary text-white text-xs">
                      <th className="py-3 px-4 font-semibold">Rank</th>
                      <th className="py-3 px-4 font-semibold">Name</th>
                      <th className="py-3 px-4 font-semibold">Institution</th>
                      <th className="py-3 px-4 font-semibold">Hours</th>
                      <th className="py-3 px-4 font-semibold">Projects</th>
                      <th className="py-3 px-4 font-semibold text-center">Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { rank: 4, name: 'Deepa K.', inst: 'PSG College', hours: '28 hrs', projs: 2, badge: '🌱' },
                      { rank: 5, name: 'Raj P.', inst: 'Loyola', hours: '24 hrs', projs: 2, badge: '🌱' },
                      { rank: 6, name: 'Preethi M.', inst: 'NIT Trichy', hours: '22 hrs', projs: 1, badge: '🌿' },
                      { rank: 7, name: 'Sunil V.', inst: 'VIT', hours: '19 hrs', projs: 2, badge: '🌿' },
                      { rank: 8, name: 'Ananya R.', inst: 'PSG', hours: '17 hrs', projs: 1, badge: '🌿' },
                      { rank: 9, name: 'Kiran S.', inst: 'Loyola', hours: '14 hrs', projs: 1, badge: '🌱' },
                      { rank: 10, name: 'Meera T.', inst: 'Ramakrishna', hours: '11 hrs', projs: 1, badge: '🌱' },
                    ].map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 text-sm font-medium text-gray-700">{row.rank}</td>
                        <td className="py-3 px-4 text-sm font-semibold text-gray-900">{row.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{row.inst}</td>
                        <td className="py-3 px-4 text-sm font-bold text-primary">{row.hours}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{row.projs}</td>
                        <td className="py-3 px-4 text-sm text-center">{row.badge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-xs text-gray-400 text-center mt-3 pb-2">
                🌱 Sapling: 10+ hrs  ·  🌿 Sprout: 20+ hrs  ·  🌳 Grove: 40+ hrs  ·  🏆 Champion: 50+ hrs
              </div>
            </div>
          </section>

          <section className="bg-white py-16">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-3xl font-extrabold text-primary mb-8">
                    Why Partner With Vidhaigal?
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 bg-light-green text-primary rounded-full flex items-center justify-center text-lg shrink-0">✓</div>
                      <div>
                        <h3 className="font-semibold text-text-dark">Verified NSS/NCC Hours</h3>
                        <p className="text-sm text-gray-500 mt-0.5">All hours officially tracked and verified for academic credit and NSS/NCC records.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 bg-light-green text-primary rounded-full flex items-center justify-center text-lg shrink-0">📜</div>
                      <div>
                        <h3 className="font-semibold text-text-dark">Co-Branded Certificates</h3>
                        <p className="text-sm text-gray-500 mt-0.5">Each student receives a professionally designed certificate branded with both logos.</p>
                      </div>
                    </div>
                    {/* Awaiting the rest of the benefits */}
                  </div>
                </div>
                {/* Form to be provided */}
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-center text-center">
                  <p className="text-gray-500 text-sm">Please provide the rest of the form specifications to complete this section.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'corporate' && (
        <div className="py-16 text-center">
          <p className="text-gray-500">Corporate CSR tab content to be provided...</p>
        </div>
      )}
    </>
  );
};

export default Partner;
