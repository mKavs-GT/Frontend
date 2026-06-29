
import React, { useState } from 'react';
import { mockJournalPosts } from '../constants/mockData';
import StarRating from '../components/StarRating';
import { JournalPost } from '../types';
import ScrollReveal from '../components/ScrollReveal';

export default function JournalPage() {
  const [posts, setPosts] = useState<JournalPost[]>(mockJournalPosts);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost: JournalPost = {
      id: Date.now(),
      title,
      content,
      rating,
      image: imagePreview || undefined,
      author: "Current User",
      location: "Dream Destination",
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
    setRating(0);
    setImagePreview(null);
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-7xl">
      {/* Page Header */}
      <ScrollReveal>
        <div className="text-center mb-24 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-waypoint-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
          <span className="text-waypoint-accent font-semibold tracking-[0.4em] uppercase text-xs md:text-sm mb-4 block animate-fade-in">Private Collection</span>
          <h1 className="text-6xl md:text-8xl font-extrabold text-white tracking-tighter mb-6">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-waypoint-accent via-white to-waypoint-primary">Journal</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-light leading-relaxed">
            A sanctuary for your most cherished memories. Document your travels in high fidelity.
          </p>
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-waypoint-accent to-transparent mx-auto mt-10"></div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Column: Create Post (Sticks on Desktop) */}
        <div className="lg:col-span-5">
          <div className="sticky top-32">
            <ScrollReveal direction="left">
              <section className="bg-white/[0.03] p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/10 backdrop-blur-3xl relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-waypoint-accent/10 blur-[50px] rounded-full"></div>
                <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-waypoint-primary/10 blur-[50px] rounded-full"></div>

                <div className="relative z-10">
                  <h2 className="text-3xl font-extrabold mb-8 text-white flex items-center">
                    <span className="w-8 h-8 rounded-full bg-waypoint-accent/20 flex items-center justify-center mr-3">
                      <i className="fas fa-pen-fancy text-sm text-waypoint-accent"></i>
                    </span>
                    New <span className="text-waypoint-accent ml-2">Entry</span>
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="group relative">
                      <input
                        type="text"
                        placeholder="Title of your post"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 focus:border-waypoint-accent/50 focus:bg-white/[0.08] focus:outline-none transition-all duration-300 placeholder-gray-500 text-white"
                      />
                    </div>

                    <div className="group relative">
                      <textarea
                        placeholder="Share your experience..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="w-full bg-white/5 p-4 rounded-2xl border border-white/5 focus:border-waypoint-accent/50 focus:bg-white/[0.08] focus:outline-none transition-all duration-300 placeholder-gray-500 text-white resize-none"
                      ></textarea>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="mb-4 sm:mb-0">
                        <label className="block text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Atmosphere</label>
                        <StarRating rating={rating} setRating={setRating} size="lg" />
                      </div>
                      <div className="w-full sm:w-auto">
                        <label htmlFor="file-upload" className="cursor-pointer flex items-center justify-center bg-white/10 text-white px-5 py-2.5 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/10 group">
                          <i className="fas fa-camera mr-2 text-waypoint-accent group-hover:scale-110 transition-transform"></i>
                          <span className="text-sm font-semibold">Snapshot</span>
                        </label>
                        <input id="file-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                      </div>
                    </div>

                    {imagePreview && (
                      <div className="relative group rounded-2xl overflow-hidden h-40 border border-waypoint-accent/30 shadow-lg shadow-waypoint-accent/10">
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setImagePreview(null)} className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition-transform">
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-waypoint-primary to-waypoint-darkest text-white font-extrabold rounded-2xl text-lg hover:shadow-[0_0_20px_rgba(166,101,165,0.4)] transform hover:-translate-y-1 transition-all duration-300 border border-white/10"
                    >
                      Publish to Journal
                    </button>
                  </form>
                </div>
              </section>
            </ScrollReveal>
          </div>
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-7">
          <ScrollReveal direction="right">
            <div className="flex items-center space-x-4 mb-12">
              <div className="w-12 h-1 bg-gradient-to-r from-waypoint-accent to-waypoint-primary rounded-full"></div>
              <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Timeline</h2>
            </div>
          </ScrollReveal>

          <div className="space-y-12">
            {posts.map((post, idx) => (
              <ScrollReveal key={post.id} delay={idx * 100} direction="up">
                <article className="relative bg-white/[0.02] rounded-[3rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-700 group shadow-2xl">
                  {/* Glass Layout */}
                  <div className="flex flex-col md:flex-row h-full md:min-h-[400px]">
                    {/* Image Area */}
                    {post.image && (
                      <div className="w-full md:w-5/12 h-64 md:h-auto overflow-hidden relative">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transform transition-transform duration-[2000ms] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-waypoint-darkest via-transparent to-transparent opacity-60"></div>
                        <div className="absolute top-6 left-6">
                          <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                            <StarRating rating={post.rating} size="sm" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content Area */}
                    <div className={`p-8 md:p-12 flex flex-col justify-center flex-grow ${!post.image ? 'w-full' : 'md:w-7/12'} bg-gradient-to-br from-white/[0.03] to-transparent`}>
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2 text-waypoint-accent">
                          <i className="fas fa-map-marker-alt text-xs animate-pulse"></i>
                          <span className="text-xs font-bold uppercase tracking-[0.2em]">{post.location}</span>
                        </div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{post.date}</span>
                      </div>

                      <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-6 group-hover:text-waypoint-accent transition-colors duration-500 leading-tight">
                        {post.title}
                      </h3>

                      <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-8 italic font-serif opacity-80 group-hover:opacity-100 transition-opacity flex-grow">
                        "{post.content}"
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-white/10">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-waypoint-accent to-waypoint-primary flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:rotate-12 transition-transform duration-500">
                              {post.author[0]}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-waypoint-darkest rounded-full"></div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white font-bold leading-none mb-1">{post.author}</span>
                            <span className="text-[10px] text-waypoint-accent uppercase font-black tracking-widest">Explorer</span>
                          </div>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-waypoint-accent hover:text-waypoint-darkest transition-all duration-300">
                          <i className="fas fa-share-alt"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}