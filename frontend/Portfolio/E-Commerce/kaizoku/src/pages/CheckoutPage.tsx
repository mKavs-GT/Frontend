import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FooterSection } from '../components/FooterSection';
import { FadeIn } from '../components/ui/FadeIn';
import { ProductImage } from '../components/ui/ProductImage';

export const CheckoutPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = [
    { id: 'jacket3', name: 'Top Coat Amon', size: 'M', color: 'Black', price: 1320, img: new URL('../assets/product/jacket3.png', import.meta.url).href },
    { id: 'dress1', name: 'Dress Bastet', size: 'S', color: 'Black', price: 910, img: new URL('../assets/product/dress1.png', import.meta.url).href },
    { id: 'jacket1', name: 'Robe Nimti', size: 'M', color: 'Black', price: 1530, img: new URL('../assets/product/jacket1.png', import.meta.url).href },
  ];

  const total = cartItems.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="bg-[#EBEBEB] min-h-screen text-[#1A1A1A] font-sans selection:bg-black selection:text-white pb-0">
      <Navbar darkLinks={true} />
      
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 mt-10">
        <FadeIn delay={0.1} y={30}>
          <h1 className="text-[12vw] sm:text-8xl md:text-[8rem] font-black uppercase tracking-tighter leading-none mb-16 lg:mb-24 text-[#1A1A1A]">Checkout</h1>
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-32">
          {/* Left: Form Sections */}
          <div className="flex flex-col gap-12">
            
            {/* Information Section */}
            <section>
              <div className="flex justify-between items-baseline mb-8">
                <h2 className="text-2xl font-normal tracking-tight">Information</h2>
                <span className="text-[10px] text-[#1A1A1A]/50">Already have an account? <button onClick={() => window.location.href = '/'} className="text-[#1A1A1A] underline underline-offset-2 hover:text-black">Log in</button></span>
              </div>
              
              <div className="space-y-10">
                <div>
                  <h3 className="text-sm font-bold mb-6">Personal information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                    <input type="text" placeholder="First name" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    <input type="text" placeholder="Last name" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    <input type="text" placeholder="Phone number" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    <input type="email" placeholder="Email" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold mb-6">Shipping information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6">
                    <input type="text" placeholder="Country / Region" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    <input type="text" placeholder="City" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    <input type="text" placeholder="Address" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    <input type="text" placeholder="Zip / Postal code" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-xs outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer mt-2 group">
                  <div className="w-3.5 h-3.5 border border-[#1A1A1A]/40 group-hover:border-[#1A1A1A] flex items-center justify-center transition-colors">
                    <div className="w-2 h-2 bg-[#1A1A1A]" />
                  </div>
                  <span className="text-xs text-[#1A1A1A]/60">I agree to data processing</span>
                </label>
              </div>
            </section>

            {/* Delivery Section */}
            <section>
              <h2 className="text-2xl font-normal tracking-tight mb-6">Delivery</h2>
              <div className="border-t border-b border-[#1A1A1A]/10 flex flex-col">
                <label className="flex items-center justify-between py-5 cursor-pointer group border-b border-[#1A1A1A]/10 last:border-0">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="delivery" className="accent-[#1A1A1A] w-3.5 h-3.5" defaultChecked />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Standard Delivery</span>
                      <span className="text-[10px] text-[#1A1A1A]/40">Delivery within 5-7 days</span>
                    </div>
                  </div>
                  <span className="text-xs">Free</span>
                </label>
                <label className="flex items-center justify-between py-5 cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="delivery" className="accent-[#1A1A1A] w-3.5 h-3.5" />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Express Shipping</span>
                      <span className="text-[10px] text-[#1A1A1A]/40">Delivery within 1-2 days</span>
                    </div>
                  </div>
                  <span className="text-xs">$15.00</span>
                </label>
              </div>
            </section>

            {/* Payment Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-normal tracking-tight mb-6">Payment</h2>
              <div className="border-t border-b border-[#1A1A1A]/10 flex flex-col">
                 <div className="py-5 border-b border-[#1A1A1A]/10">
                    <div className="flex justify-between items-center mb-6">
                       <label className="flex items-center gap-4 cursor-pointer">
                         <input type="radio" name="payment" className="accent-[#1A1A1A] w-3.5 h-3.5" defaultChecked />
                         <span className="text-sm font-bold">Credit card</span>
                       </label>
                       <div className="flex items-center gap-2">
                          <span className="text-blue-800 font-black italic text-xs">VISA</span>
                          <div className="flex -space-x-1"><div className="w-3 h-3 rounded-full bg-red-500 opacity-90"/><div className="w-3 h-3 rounded-full bg-yellow-500 opacity-90"/></div>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-6 pl-7 mb-2">
                       <input type="text" placeholder="Card number" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-[11px] outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                       <input type="text" placeholder="Cardholder name" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-[11px] outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                       <input type="text" placeholder="Expiration date (MM/YY)" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-[11px] outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                       <input type="text" placeholder="CVV" className="w-full bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-[11px] outline-none focus:border-black transition-colors placeholder:text-[#1A1A1A]/40" />
                    </div>
                 </div>
                 
                 <label className="flex items-center justify-between py-5 border-b border-[#1A1A1A]/10 cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <input type="radio" name="payment" className="accent-[#1A1A1A] w-3.5 h-3.5" />
                     <span className="text-sm font-bold">PayPal</span>
                   </div>
                   <span className="text-blue-600 font-black italic text-sm tracking-tight">PayPal</span>
                 </label>

                 <label className="flex items-center justify-between py-5 cursor-pointer group">
                   <div className="flex items-center gap-4">
                     <input type="radio" name="payment" className="accent-[#1A1A1A] w-3.5 h-3.5" />
                     <span className="text-sm font-bold">Apple Pay</span>
                   </div>
                   <span className="text-[#1A1A1A] font-bold text-sm"> Pay</span>
                 </label>
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-8 mb-10 group">
                <div className="w-3.5 h-3.5 border border-[#1A1A1A]/40 group-hover:border-[#1A1A1A] flex items-center justify-center transition-colors">
                  <div className="w-2 h-2 bg-transparent" />
                </div>
                <span className="text-xs text-[#1A1A1A]/60">I agree to data processing</span>
              </label>

              <button 
                onClick={() => { alert('Order Placed Successfully! Thank you for shopping with Kaizoku.'); window.location.href = '/'; }}
                className="w-full bg-[#1F1F1F] text-white font-bold py-5 text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all"
              >
                Pay and Place Order
              </button>
            </section>
          </div>

          {/* Right: Shopping Bag Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32">
              <h2 className="text-2xl font-normal tracking-tight mb-8">Shopping Bag ({cartItems.length})</h2>
              
              <div className="border-t border-[#1A1A1A]/10">
                {cartItems.map((item, i) => (
                  <div key={i} className="flex gap-6 items-start py-6 border-b border-[#1A1A1A]/10">
                    <div className="w-[80px] h-[110px] bg-[#E0E0E0] overflow-hidden flex-shrink-0">
                      <ProductImage
                        id={item.id}
                        alt={item.name}
                        baseImage={item.img}
                        className="w-full h-full mix-blend-multiply opacity-90"
                      />
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div className="flex flex-col">
                        <h3 className="text-xs font-bold mb-3">{item.name}</h3>
                        <div className="text-[10px] text-[#1A1A1A]/60 space-y-1.5 font-medium">
                          <p><span className="inline-block w-14">Size:</span> {item.size}</p>
                          <p><span className="inline-block w-14">Color:</span> {item.color}</p>
                          <p><span className="inline-block w-14">Quantity:</span> 1</p>
                        </div>
                      </div>
                      <span className="text-xs">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="flex gap-4 mb-8">
                  <input type="text" placeholder="Promocode" className="flex-1 bg-transparent border-b border-[#1A1A1A]/20 pb-2 text-[11px] outline-none focus:border-black placeholder:text-[#1A1A1A]/40" />
                  <button onClick={() => alert('Promo code applied successfully!')} className="bg-[#E0E0E0] text-[#1A1A1A]/50 px-10 py-3 text-[10px] font-bold uppercase hover:bg-[#1A1A1A] hover:text-white transition-colors">Apply</button>
                </div>

                <div className="space-y-4 text-[11px] py-6 border-b border-[#1A1A1A]/10 font-bold">
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/60">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1A1A1A]/60">Discount</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="flex justify-between items-end pt-6">
                  <span className="text-[15px] font-bold">Total:</span>
                  <span className="text-[22px] font-bold">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};
