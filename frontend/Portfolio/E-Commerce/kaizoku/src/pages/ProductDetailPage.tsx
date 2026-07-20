import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FooterSection } from '../components/FooterSection';
import { FadeIn } from '../components/ui/FadeIn';
import { ProductImage } from '../components/ui/ProductImage';

// This is a simplified way to get assets. In a real app, this would be a database or a more robust asset mapper.
const getProductImages = (id: string) => {
  // id will be something like "jacket1", "top2", etc.
  try {
    const base = id;
    const model = `${id}model`;
    const detail = `${id}C`;

    // We'll use a dynamic approach for the imports in a real project, 
    // but for this demo environment, we'll assume the files are available via these paths.
    return {
      main: new URL(`../assets/product/${base}.png`, import.meta.url).href,
      model: new URL(`../assets/product/${model}.png`, import.meta.url).href,
      detail: new URL(`../assets/product/${detail}.jpg`, import.meta.url).href, // Most 'C' files were .jpg
    };
  } catch (e) {
    return null;
  }
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImg, setActiveImg] = useState<string>('');

  const images = id ? getProductImages(id) : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (images) setActiveImg(images.main);
  }, [id]);

  if (!id || !images) return <div className="bg-[#0C0C0C] min-h-screen text-white flex items-center justify-center">Product not found</div>;

  return (
    <div className="bg-white min-h-screen text-black selection:bg-[#DFA09D] selection:text-white">
      <Navbar darkLinks={true} />

      <main className="max-w-7xl mx-auto pl-0 pr-6 pt-16 pb-32">
        {/* Breadcrumbs */}
        <div className="flex gap-2 text-[10px] uppercase tracking-widest text-black/40 mb-12 pl-4">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-black">Catalog</Link>
          <span>/</span>
          <span className="text-black font-bold">{id.replace(/([a-z])([0-9])/, '$1 $2')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-32">
          {/* Gallery */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-3 w-16 sm:w-20 md:w-24 flex-shrink-0">
              {[images.main, images.model, images.detail].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(img)}
                  className={`aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 transition-all ${activeImg === img ? 'border-black' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Thumbnail" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-[4/5] bg-gray-100 overflow-hidden rounded-2xl">
              <ProductImage
                id={id}
                alt="Product"
                baseImage={activeImg}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col lg:pt-34">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter italic leading-none mb-4">
              {id.replace(/([a-z])([0-9])/, '$1 $2')}
            </h1>
            <p className="text-2xl font-bold mb-8">₹ 1,299.00</p>

            <div className="prose prose-sm text-black/60 mb-12">
              <p>
                An over-engineered piece from the Kaizoku core collection. Designed with structural silhouettes and distressed hardware, this garment represents the pinnacle of rebellion-inspired streetwear.
              </p>
              <p>
                Each piece is meticulously crafted using high-density materials to ensure durability while maintaining the ethereal, tattered elegance that defines our brand.
              </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center border border-black/20 rounded-full px-6 py-3 gap-8">
                <button className="text-xl hover:text-[#DFA09D]">-</button>
                <span className="font-bold">1</span>
                <button className="text-xl hover:text-[#DFA09D]">+</button>
              </div>
              <button 
                onClick={() => window.location.href = '/checkout'}
                className="flex-1 bg-black text-white font-bold py-4 rounded-full hover:bg-[#DFA09D] transition-colors uppercase tracking-widest text-xs"
              >
                Add to Basket
              </button>
            </div>

            {/* Technical Specs */}
            <div className="grid grid-cols-1 gap-4 border-t border-black/10 pt-12">
              {[
                { label: 'Type', value: 'Limited Edition' },
                { label: 'Material', value: 'Distressed Cotton' },
                { label: 'Fit', value: 'Oversized Structural' },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between text-[11px] uppercase tracking-widest border-b border-black/5 pb-4">
                  <span className="font-bold">{spec.label}</span>
                  <span className="text-black/40">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
          <div>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6">Description</h2>
            <p className="text-sm leading-relaxed text-black/60">
              Structural silhouettes with distressed hardware. Engineered cotton with haunting graphic prints.
              Ethereal, tattered elegance that giving girl boss energy. This product features hand-finished
              details and reinforced stitching for longevity.
            </p>
          </div>
          <div className="bg-gray-100 rounded-[40px] aspect-video overflow-hidden">
            <img src={images.detail} className="w-full h-full object-cover opacity-80" alt="Detail" />
          </div>
        </div>

        {/* Rating & Reviews Section */}
        <section className="mb-40 flex flex-col items-center border-y border-[#DFA09D] py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-[2.75rem] font-medium tracking-tight mb-6 leading-tight text-[#1A1A1A]">
              Read reviews,<br/>ride with confidence.
            </h2>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-sm font-medium">
              <span className="text-[#1A1A1A]">4.2/5</span>
              <div className="flex items-center text-[#00B67A] ml-1">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <span className="font-bold text-lg tracking-tight text-[#1A1A1A]">Trustpilot</span>
              <span className="text-[#1A1A1A]/50 ml-1 sm:ml-2">Based on 5210 reviews</span>
            </div>
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-12 lg:gap-8 items-start">
            {/* Left Col */}
            <div className="lg:w-[320px] flex-shrink-0 flex flex-col pl-4">
              <span className="text-[140px] leading-none text-black/20 font-serif mb-0 -ml-2 -mt-8">"</span>
              <h3 className="text-[1.75rem] font-medium tracking-tight pr-10 mb-12 -mt-8 leading-snug text-[#1A1A1A]">What our customers are saying</h3>
              <div className="flex items-center gap-4 text-black/30">
                <button className="hover:text-black transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <div className="h-[2px] w-24 bg-black/10 relative rounded-full">
                  <div className="absolute left-0 top-0 h-full w-1/3 bg-[#1A1A1A] rounded-full"></div>
                </div>
                <button className="hover:text-black transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            {/* Right Col: Cards Slider */}
            <div className="flex-1 w-full flex gap-6 overflow-x-auto pb-12 pt-4 px-4 -mx-4 hide-scrollbar snap-x snap-mandatory">
              {[
                { name: "Karan", time: "1 week ago", text: "My buying experience is so nice, and received me very politely. Riding experience is also very good. Very good performance. I never experienced such a kind of performance. Very good service." },
                { name: "Catherine", time: "10 days ago", text: "I love my e-bike and the customer service is excellent. They respond in a timely manner with loads of information about e-bikes, accessories and maintenance information." },
                { name: "Peter", time: "2 weeks ago", text: "Visited to EO store. Product looks great, particularly welds, looked clean and sturdy. My wife and I took small test drive around the parking lot area. We bought 2 bikes." },
              ].map((review, i) => (
                <div key={i} className="snap-start shrink-0 w-[300px] sm:w-[340px] flex flex-col relative">
                  {/* Bubble */}
                  <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] relative z-10">
                    <p className="text-[13px] text-[#1A1A1A]/70 leading-[1.6] mb-8 h-[105px] overflow-hidden">
                      {review.text}
                    </p>
                    <div className="flex gap-1 text-[#00B67A] text-sm">
                      ★★★★★
                    </div>
                    {/* Tail */}
                    <svg className="absolute -bottom-4 left-8 w-6 h-6 text-white" viewBox="0 0 20 20" fill="currentColor" style={{ filter: 'drop-shadow(0 8px 8px rgba(0,0,0,0.04))' }}>
                      <path d="M0 0 L20 0 L0 20 Z" />
                    </svg>
                  </div>
                  {/* User info */}
                  <div className="flex items-center gap-3 mt-8 ml-8">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shrink-0 shadow-sm">
                      <img src={`https://i.pravatar.cc/100?u=${review.name}`} alt={review.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A1A]">{review.name}</span>
                      <span className="text-[10px] text-[#1A1A1A]/50">{review.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section className="mb-40">
          <h2 className="text-4xl font-black uppercase text-center mb-16 tracking-tighter italic">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
            {[
              { id: 'jacket1', name: 'Howls Jacket', price: '₹ 1,299.00', img: new URL('../assets/product/jacket1.png', import.meta.url).href },
              { id: 'top2', name: 'Leonhart Corset', price: '₹ 440.00', img: new URL('../assets/product/top2.png', import.meta.url).href },
              { id: 'dress3', name: 'Frankie Dress', price: '₹ 810.00', img: new URL('../assets/product/dress3.png', import.meta.url).href },
            ].map((product) => (
              <Link to={`/product/${product.id}`} key={product.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-gray-100 rounded-3xl mb-6 overflow-hidden relative">
                  <ProductImage
                    id={product.id}
                    alt={product.name}
                    baseImage={product.img}
                    className="w-full h-full"
                  />
                  <button className="absolute top-6 right-6 z-10 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-[#DFA09D] hover:text-white transition-colors shadow-sm">
                    ♡
                  </button>
                  <div className="absolute top-6 left-6 z-10 flex gap-2">
                    <span className="px-3 py-1 bg-white text-[8px] font-bold rounded-full uppercase tracking-widest shadow-sm">Bestseller</span>
                  </div>
                </div>
                <div className="flex justify-between items-center px-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest">{product.name}</h4>
                  <span className="text-xs text-black/60">{product.price}</span>
                </div>
                <button className="w-full mt-6 py-3 border border-black/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-colors">
                  Add to Cart
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gradient-to-br from-[#DFA09D] via-[#E2AFA9] to-[#EABFBB] rounded-[40px] md:rounded-[60px] p-8 md:p-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 shadow-lg">
          <div className="flex-1 flex flex-col gap-12 text-white w-full">
            {/* Text Content */}
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight mb-4 leading-[1.1]">
                Subscribe to<br />our newsletter
              </h2>
              <p className="text-white text-sm leading-relaxed max-w-md opacity-90 font-medium">
                Join our newsletter to get exclusive insights, timely updates, and expert tips that help you stay ahead of the rebellion.
              </p>
            </div>

            {/* Form Content */}
            <div className="flex flex-col gap-3">
              <span className="text-white font-bold text-sm">Stay Informed</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-[#FFEFE5] text-black px-6 py-4 rounded-xl sm:rounded-2xl flex-1 outline-none focus:ring-2 focus:ring-white transition-all placeholder:text-black/50 text-sm font-semibold"
                />
                <button className="bg-[#7A2E24] text-white px-8 py-4 rounded-xl sm:rounded-2xl font-semibold text-sm hover:bg-[#5C2018] transition-colors whitespace-nowrap shadow-md">
                  Subscribe
                </button>
              </div>
              <p className="text-white/80 text-[11px] mt-1 font-medium">
                By subscribing you agree to our <a href="#" className="underline underline-offset-4 hover:text-white transition-colors">Privacy Policy</a>
              </p>
            </div>
          </div>

          {/* Existing Picture */}
          <div className="flex-1 w-full aspect-square bg-white/20 rounded-[30px] md:rounded-[40px] overflow-hidden shadow-2xl relative">
            <img src={images.model} className="w-full h-full object-cover" alt="Newsletter Model" />
          </div>
        </section>
      </main>

      <FooterSection />
    </div>
  );
};
