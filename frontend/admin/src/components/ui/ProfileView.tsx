import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { User, Mail, Shield, Code2, Sparkles, Coffee, Bug, Moon } from "lucide-react";
import React, { useEffect } from "react";

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface AgentProfile {
  name: string;
  displayName: string;
  role: string;
  title: string;
  description: string[];
  quote: string;
  email?: string;
  image: string;
  funFacts: {
    coffee: string;
    bugs: string;
    lateNights: string;
  };
  specialization: string;
  skills: string[];
}

interface ProfileViewProps {
  adminAgent: AdminAgent | null;
}

const agentProfiles: Record<string, AgentProfile> = {
  "MRK": {
    name: "MRK",
    displayName: "Meet MR K",
    role: "Founder",
    title: "FOUNDER",
    description: [
      "If there's one person who can take your wild idea, debug your dreams, and still ship a website that looks like it walked out of a sci-fi movie, it's Mr K — our full-stack developer, creative nitpicker, and unofficial electrician because he \"fixes everything\"",
      "From front-end magic (React, GSAP, Framer Motion) to backend wizardry (Node, Express, database sorcery), he's the guy who makes sure everything runs smooth… even when the WiFi doesn't.",
      "With over 40+ projects crafted this year, he's turned late-night coffees and questionable life choices into high-performing websites loved by clients everywhere. He doesn't just build websites — he builds experiences, brands, and occasional \"wow how the hell did you do that?\" moments."
    ],
    quote: "Building digital experiences that make people say 'wow, how did you do that?'",
    image: "/founder.png",
    funFacts: {
      coffee: "2,847",
      bugs: "1,293",
      lateNights: "156"
    },
    specialization: "Full-Stack",
    skills: ["React", "Node.js", "GSAP", "Framer Motion", "Express", "MongoDB"]
  },
  "MRV": {
    name: "MRV",
    displayName: "MR. V",
    role: "CTO & Admin",
    title: "CTO & ADMIN",
    description: [
      "The engine that drives this studio forward. Leading with strategic vision and technical excellence to deliver cutting-edge solutions.",
      "Cutting through the noise of generic web design to deliver something fresher and cleaner.",
      "Focused on building unforgettable digital futures by stopping to play it safe and starting to build bold experiences."
    ],
    quote: "I oversee the engine that drives this studio forward. We cut through the noise of generic web design to deliver something fresher and cleaner. Let's stop playing it safe and start building your unforgettable digital future.",
    image: "/mrv.png",
    funFacts: {
      coffee: "4,521",
      bugs: "2,847",
      lateNights: "298"
    },
    specialization: "Architecture",
    skills: ["Leadership", "System Design", "Cloud", "DevOps", "Strategy", "Management"]
  },
  "MRS": {
    name: "MRS",
    displayName: "MRS. S",
    role: "Senior Designer",
    title: "SENIOR DESIGNER",
    description: [
      "Design is about identity — a visual language that feels elite and intentional.",
      "Bringing personality and energy back into brands, ensuring every pixel serves a purpose and every layout tells a story.",
      "Crafting visual experiences that resonate with audiences and elevate brand presence."
    ],
    quote: "Design is about identity, a visual language that feels elite and intentional. I'm here to bring personality and energy back into your brand, ensuring every pixel serves a purpose and every layout tells a story.",
    image: "/mrss.png",
    funFacts: {
      coffee: "3,145",
      bugs: "892",
      lateNights: "187"
    },
    specialization: "UI/UX Design",
    skills: ["Figma", "Adobe XD", "Branding", "UI Design", "UX Research", "Prototyping"]
  },
  "MRM": {
    name: "MRM",
    displayName: "MR. M",
    role: "Senior Developer",
    title: "SENIOR DEVELOPER",
    description: [
      "Ensuring that every site is robust, scalable, and powerful. Good development is the backbone of an unforgettable digital experience.",
      "Building websites with precision and logic, focusing on performance and reliability.",
      "Transforming architectural plans into solid, maintainable codebases that stand the test of time."
    ],
    quote: "Ensuring that every site is robust, scalable, and powerful. Good development is the backbone of an unforgettable digital experience. I make sure your website is built with precision and logic.",
    image: "/mrm.png",
    funFacts: {
      coffee: "3,892",
      bugs: "2,145",
      lateNights: "234"
    },
    specialization: "Backend",
    skills: ["Python", "Django", "PostgreSQL", "API Design", "Microservices", "Security"]
  },
  "MRA": {
    name: "MRA",
    displayName: "MR. A",
    role: "Frontend Developer",
    title: "FRONTEND DEVELOPER",
    description: [
      "Bringing the design to life through fluid animations and seamless interactions.",
      "Bridging the gap between static art and human experience through cutting-edge frontend development.",
      "Creating engaging user interfaces that feel alive and responsive to every interaction."
    ],
    quote: "Bringing the design to life through fluid animations and seamless interactions. I bridge the gap between static art and human experience.",
    image: "/mra.png",
    funFacts: {
      coffee: "2,654",
      bugs: "1,567",
      lateNights: "178"
    },
    specialization: "Frontend",
    skills: ["React", "TypeScript", "Three.js", "WebGL", "CSS", "Animations"]
  }
};

export function ProfileView({ adminAgent }: ProfileViewProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for tilt/parallax
  const springConfig = { damping: 20, stiffness: 100 };
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = clientX - innerWidth / 2;
      const y = clientY - innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Get profile based on admin agent - try multiple detection methods
  let agentKey = "MRK"; // Default to founder
  
  console.log("🔍 ProfileView - adminAgent received:", adminAgent);
  
  if (adminAgent) {
    // Method 1: Try exact match from name field
    if (adminAgent.name) {
      const exactName = adminAgent.name.toUpperCase().trim();
      console.log("📝 Checking exact name:", exactName);
      
      // Check if it's exactly one of our agent keys
      if (agentProfiles[exactName]) {
        agentKey = exactName;
        console.log("✅ Matched by exact name:", agentKey);
      } else {
        // Try first 3 characters
        const nameKey = exactName.substring(0, 3);
        console.log("📝 Checking name prefix (first 3):", nameKey);
        if (agentProfiles[nameKey]) {
          agentKey = nameKey;
          console.log("✅ Matched by name prefix:", agentKey);
        }
      }
    }
    
    // Method 2: Try from email pattern (agent05mrm@gmail.com -> MRM)
    if (agentKey === "MRK" && adminAgent.email) { // Only if not found yet
      const emailMatch = adminAgent.email.match(/agent\d+(\w{3})/i);
      console.log("📧 Email regex match:", emailMatch);
      
      if (emailMatch && emailMatch[1]) {
        const emailKey = emailMatch[1].toUpperCase();
        console.log("📧 Email key extracted:", emailKey);
        
        if (agentProfiles[emailKey]) {
          agentKey = emailKey;
          console.log("✅ Matched by email pattern:", agentKey);
        }
      }
    }
    
    // Method 3: Try from role field as last resort
    if (agentKey === "MRK" && adminAgent.role) {
      console.log("👔 Checking role:", adminAgent.role);
      
      // Map common role names to agent keys
      const roleMap: Record<string, string> = {
        'founder': 'MRK',
        'cto': 'MRV',
        'designer': 'MRS',
        'senior developer': 'MRM',
        'frontend developer': 'MRA',
        'backend': 'MRM',
        'frontend': 'MRA',
      };
      
      const roleLower = adminAgent.role.toLowerCase();
      for (const [key, value] of Object.entries(roleMap)) {
        if (roleLower.includes(key)) {
          agentKey = value;
          console.log("✅ Matched by role:", agentKey);
          break;
        }
      }
    }
  }
  
  console.log("🎯 Final agentKey selected:", agentKey);
  const profile = agentProfiles[agentKey] || agentProfiles["MRK"];
  console.log("👤 Profile loaded:", profile.displayName, "-", profile.title);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Animated Background Grid & Parallax Orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        {/* Grain Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <motion.div
          className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"
          style={{
            x: useSpring(useTransform(mouseX, [-500, 500], [50, -50])),
            y: useSpring(useTransform(mouseY, [-500, 500], [50, -50])),
          }}
        />
        <motion.div
          className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
          style={{
            x: useSpring(useTransform(mouseX, [-500, 500], [-50, 50])),
            y: useSpring(useTransform(mouseY, [-500, 500], [-50, 50])),
          }}
        />
      </div>

      <motion.div
        className="max-w-7xl mx-auto space-y-6 px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/90 via-zinc-900/70 to-black/90 border border-white/10 backdrop-blur-2xl shadow-2xl"
        >
          {/* Animated gradient overlay */}
          <motion.div
            className="absolute inset-0 opacity-30"
            style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)"
            }}
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 md:p-12">
            <motion.div 
              className="relative group flex items-center justify-center perspective-1000"
              style={{ rotateX, rotateY }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative w-full max-w-md aspect-square transform-gpu">
                {/* Visual Depth Stack */}
                <div className="absolute -inset-4 bg-white/[0.02] rounded-[40px] blur-sm border border-white/[0.05]" />
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl overflow-hidden">
                   <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,1)_0%,transparent_70%)]" />
                </div>

                <motion.img
                  src={profile.image}
                  alt={profile.displayName}
                  className="relative w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-transform duration-500 z-10"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Floating badge */}
                <motion.div
                  className="absolute top-4 right-4 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Online</span>
                </motion.div>
              </div>
            </motion.div>

            {/* Info */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-blue-200">
                    {profile.displayName}
                  </h1>
                </motion.div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-6 py-2.5 rounded-full text-base font-bold bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 shadow-lg shadow-blue-900/30 backdrop-blur-xl">
                    {profile.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{adminAgent?.email || "admin@mkavs.com"}</span>
                </div>
              </div>

              {/* Quote with better styling */}
              <div className="relative pl-6 py-6 rounded-2xl bg-gradient-to-br from-blue-950/30 to-purple-950/30 border-l-4 border-blue-500/50">
                <Sparkles className="absolute top-6 left-2 w-4 h-4 text-blue-400 opacity-50" />
                <blockquote className="text-lg text-zinc-300 italic leading-relaxed">
                  "{profile.quote}"
                </blockquote>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Fun Facts Grid with Power Level Bars */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Coffee Fact */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl p-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <Coffee className="w-8 h-8 text-amber-500" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Caffeine Intake</p>
                  <p className="text-3xl font-black text-white">{profile.funFacts.coffee}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-amber-500/70 tracking-widest">
                  <span>Energy Level</span>
                  <span>94%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: "94%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bugs Fact */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl p-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                  <Bug className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Bugs Neutralized</p>
                  <p className="text-3xl font-black text-white">{profile.funFacts.bugs}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">
                  <span>Precision Rate</span>
                  <span>88%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-emerald-500"
                    initial={{ width: 0 }}
                    animate={{ width: "88%" }}
                    transition={{ duration: 1.5, delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Late Nights Fact */}
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative overflow-hidden rounded-3xl bg-zinc-900/60 border border-white/5 backdrop-blur-xl p-8 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                  <Moon className="w-8 h-8 text-indigo-500" />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Nocturnal Mastery</p>
                  <p className="text-3xl font-black text-white">{profile.funFacts.lateNights}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-black uppercase text-indigo-500/70 tracking-widest">
                  <span>Focus Intensity</span>
                  <span>96%</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: "96%" }}
                    transition={{ duration: 1.5, delay: 0.9 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/80 via-zinc-900/60 to-black/80 border border-white/10 backdrop-blur-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Code2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-white">Tech Stack & Skills</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {profile.skills.map((skill, index) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-800/80 to-zinc-900/80 border border-zinc-700/50 text-zinc-300 font-semibold text-sm hover:border-blue-500/50 hover:text-blue-300 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-default"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Description Cards */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 gap-4"
        >
          {profile.description.map((paragraph, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ x: 5 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/60 to-zinc-900/40 border border-white/5 backdrop-blur-xl p-8 group"
            >
              {/* Side accent bar */}
              <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-500 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/5 group-hover:to-purple-600/5 transition-all duration-500" />
              <p className="relative z-10 text-zinc-300 leading-relaxed text-lg">
                {paragraph}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Info Cards Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 backdrop-blur-xl p-6 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-blue-600/10 group-hover:from-blue-600/10 group-hover:to-blue-600/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <User className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Role</h3>
              <p className="text-xl font-bold text-white">{profile.role}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: -1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 backdrop-blur-xl p-6 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-purple-600/10 group-hover:from-purple-600/10 group-hover:to-purple-600/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Code2 className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Specialization</h3>
              <p className="text-xl font-bold text-white">{profile.specialization}</p>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900/80 to-black border border-white/5 backdrop-blur-xl p-6 group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/0 to-emerald-600/10 group-hover:from-emerald-600/10 group-hover:to-emerald-600/20 transition-all duration-500" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                <p className="text-xl font-bold text-white">Active</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
