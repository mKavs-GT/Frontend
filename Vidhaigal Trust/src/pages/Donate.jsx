import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { FaLock, FaWhatsapp } from 'react-icons/fa';

const Donate = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('1000');
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [donorName, setDonorName] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleAmountClick = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (whatsappOptIn) {
      setShowPreviewModal(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('nav.donate')} | Vidhaigal Trust</title>
      </Helmet>

      <main role="main" className="pt-24 pb-20 bg-beige min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col lg:flex-row gap-12 bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* Left Side: Info */}
            <div className="lg:w-5/12 bg-primary text-white p-12 flex flex-col justify-center">
              <h1 className="text-4xl font-extrabold mb-6">Plant a Seed of Change Today</h1>
              <p className="text-lg text-light-green mb-8">
                Your donation directly funds our grassroots initiatives in education, healthcare, and environmental conservation.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-secondary text-xl">🌱</div>
                  <div>
                    <h4 className="font-bold text-lg">Tax Exempt</h4>
                    <p className="text-sm opacity-80">All donations are 50% tax-exempt under Section 80G of Income Tax Act.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-secondary text-xl">🔒</div>
                  <div>
                    <h4 className="font-bold text-lg">Secure Payment</h4>
                    <p className="text-sm opacity-80">Your payment information is encrypted and securely processed.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-sm italic opacity-80">"Recent donor: Anonymous donated ₹5,000 for Education Initiative"</p>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="lg:w-7/12 p-12 flex flex-col justify-center">
              {isSubmitted ? (
                <div className="text-center bg-light-green/30 p-10 rounded-2xl border border-primary/20">
                  <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-lg">
                    ✓
                  </div>
                  <h3 className="text-3xl font-bold text-text-dark mb-4">Thank You!</h3>
                  <p className="text-lg text-gray-600 mb-8">
                    Your generous donation has been successfully processed. A receipt has been sent to your email address.
                  </p>
                  <button 
                    onClick={() => {
                      setIsSubmitted(false);
                      setDonorName('');
                      setWhatsappOptIn(false);
                      setWhatsappNumber('');
                    }}
                    className="px-8 py-3 bg-white border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-colors"
                  >
                    Make Another Donation
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-2xl font-bold text-text-dark mb-6 border-b pb-4">Select Donation Amount</h3>
                  
                  {/* Preset Amounts */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {['100', '500', '1000', '5000'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleAmountClick(val)}
                        className={`py-3 rounded-xl border-2 font-bold text-lg transition-all ${
                          amount === val 
                            ? 'border-primary bg-light-green text-primary' 
                            : 'border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                        }`}
                      >
                        ₹{val}
                      </button>
                    ))}
                  </div>

                  <div className="mb-8 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <label htmlFor="custom-amount" className="sr-only">Custom Amount</label>
                    <input 
                      id="custom-amount"
                      type="number" 
                      placeholder="Custom Amount" 
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setAmount('custom');
                      }}
                      className={`w-full pl-8 pr-4 py-3 rounded-xl border-2 outline-none transition-colors ${
                        amount === 'custom' ? 'border-primary bg-light-green/20' : 'border-gray-200 focus:border-primary'
                      }`}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-text-dark mb-6 border-b pb-4">Your Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="donor-name" className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                      <input 
                        id="donor-name" 
                        type="text" 
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                        required 
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none" 
                      />
                    </div>
                    <div>
                      <label htmlFor="donor-email" className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                      <input id="donor-email" type="email" required className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label htmlFor="donor-phone" className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                      <input id="donor-phone" type="tel" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label htmlFor="donor-pan" className="block text-sm font-semibold text-gray-700 mb-2">PAN Number (for 80G)</label>
                      <input id="donor-pan" type="text" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none uppercase" />
                    </div>
                  </div>

                  <div className="mb-8">
                    <label htmlFor="donor-purpose" className="block text-sm font-semibold text-gray-700 mb-2">Donation Purpose</label>
                    <select id="donor-purpose" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary outline-none appearance-none bg-white">
                      <option>General Fund (Where it's needed most)</option>
                      <option>Education Initiative</option>
                      <option>Environmental Conservation</option>
                      <option>Healthcare & Medical Camps</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-secondary text-text-dark font-bold text-xl py-4 rounded-xl shadow-lg hover:bg-yellow-400 hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <FaLock className="text-sm opacity-70" />
                    Proceed to Secure Payment
                  </button>

                  <div className="border-t border-gray-100 mt-6 pt-6">
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-start gap-3">
                        <FaWhatsapp className="text-3xl text-green-500 shrink-0" />
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800 text-sm">Get updates on WhatsApp</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            Receive your 80G receipt, project milestones, and impact photos directly on WhatsApp. No spam — only updates that matter.
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <input 
                              type="checkbox" 
                              id="whatsapp-opt-in"
                              checked={whatsappOptIn}
                              onChange={(e) => setWhatsappOptIn(e.target.checked)}
                              className="w-4 h-4 accent-green-600 cursor-pointer"
                            />
                            <label htmlFor="whatsapp-opt-in" className="text-xs text-gray-600 cursor-pointer">
                              Yes, send me updates on WhatsApp
                            </label>
                          </div>
                          
                          {whatsappOptIn && (
                            <div className="mt-3">
                              <input 
                                type="tel" 
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                placeholder="+91 98765 43210"
                                required={whatsappOptIn}
                                className="w-full px-4 py-2.5 rounded-lg border-2 border-green-300 focus:border-green-500 outline-none text-sm bg-white"
                              />
                              <div className="text-xs text-green-600 mt-1">
                                🔒 Your number is never shared or used for marketing
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* ADDITION 2 — POST-DONATION WHATSAPP PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <FaWhatsapp className="text-4xl text-green-500" />
            <h2 className="text-xl font-bold mt-2">You're all set!</h2>
            <p className="text-sm text-gray-500">Here's a preview of what you'll receive:</p>

            <div className="bg-[#ECE5DD] rounded-2xl p-4 mt-4">
              <div className="bg-white rounded-2xl rounded-tl-none shadow-sm p-4 max-w-[85%]">
                <div className="text-sm text-gray-800 leading-relaxed font-sans">
                  🌱 <strong>Vidhaigal Trust</strong><br/><br/>
                  Vanakkam {donorName || 'Donor'}! 🙏<br/><br/>
                  Your donation of <strong>₹{amount === 'custom' ? customAmount || '0' : amount}</strong> has been confirmed.<br/><br/>
                  Here's what it will do:<br/>
                  🌳 Plant [trees] native trees<br/>
                  👶 Reach [children] children<br/>
                  💧 Provide [days] days of clean water<br/><br/>
                  Your <strong>80G receipt</strong> is ready:<br/>
                  [📄 Download Receipt.pdf]<br/><br/>
                  We'll keep you updated as your trees grow. Thank you for being part of the change. 💚<br/><br/>
                  — Team Vidhaigal
                </div>
                <div className="text-right mt-1">
                  <span className="text-xs text-gray-400">8:04 PM <span className="text-blue-500 font-bold">✓✓</span></span>
                </div>
              </div>
              <div className="text-xs text-gray-400 text-center mt-2">
                Next update: When your project hits its first milestone 🌿
              </div>
            </div>

            <div className="mt-4">
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noreferrer"
                className="block w-full bg-green-500 text-white text-center rounded-xl py-3 font-bold transition hover:bg-green-600"
              >
                Open WhatsApp Now →
              </a>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="w-full mt-2 bg-gray-100 text-gray-600 rounded-xl py-3 text-sm transition hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Donate;
