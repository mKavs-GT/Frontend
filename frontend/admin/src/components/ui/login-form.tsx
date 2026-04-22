"use client";
import { useEffect, useRef, useState, type JSX } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff, HelpCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";

// Vertex shader source code
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader source code for the smokey background effect
const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.5;

    // Normalize mouse input (0.0 - 1.0) and remap to -1.0 ~ 1.0
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    // Apply distortion for a wavy, smokey effect
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.5 / i * cos(i * 2.0 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.5 / i * cos(i * 2.0 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    // Create a glowing wave pattern
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.9, 0.2, wave);

    fragColor = vec4(u_color * glow, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

interface SmokeyBackgroundProps {
  backdropBlurAmount?: string;
  color?: string;
  className?: string;
}

const blurClassMap: Record<BlurSize, string> = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

export function SmokeyBackground({
  backdropBlurAmount = "sm",
  color = "#1E40AF", // Default dark blue
  className = "",
}: SmokeyBackgroundProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const hexToRgb = (hex: string): [number, number, number] => {
    const r = parseInt(hex.substring(1, 3), 16) / 255;
    const g = parseInt(hex.substring(3, 5), 16) / 255;
    const b = parseInt(hex.substring(5, 7), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");

    const startTime = Date.now();
    const [r, g, b] = hexToRgb(color);
    gl.uniform3f(uColorLocation, r, g, b);

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : width / 2, isHovering ? height - mousePosition.y : height / 2);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", () => setIsHovering(true));
    canvas.addEventListener("mouseleave", () => setIsHovering(false));

    render();
    return () => canvas.removeEventListener("mousemove", handleMouseMove);
  }, [isHovering, mousePosition, color]);

  const finalBlurClass = blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap["sm"];

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className={`absolute inset-0 ${finalBlurClass}`}></div>
    </div>
  );
}

// ============== AUTH MOCK DATA ==============
const ADMIN_USERS = [
  { alias: "Mr K", name: "Krishawn", role: "CEO", id: "(MGT-EXE-01)", email: "mrk@mkavs.com", pwd: "admin" },
  { alias: "Mr V", name: "Vinny", role: "CTO", id: "(MGT-EXE-02)", email: "mrv@mkavs.com", pwd: "admin" },
  { alias: "Mr Z", name: "Sitesh", role: "Chief Auditor & Sales Lead", id: "(MGT-BIZ-01)", email: "mrz@mkavs.com", pwd: "admin" },
  { alias: "MrsS", name: "Sofia", role: "Lead Frontend Dev", id: "(MGT-DEV-01)", email: "mrss@mkavs.com", pwd: "admin" },
  { alias: "Michael", name: "Lead Backend Dev", role: "Lead Backend Dev", id: "(MGT-DEV-02)", email: "michael@mkavs.com", pwd: "admin" },
  { alias: "MrA", name: "Abuzar", role: "Associate Frontend Developer", id: "(MGT-DES-01)", email: "mra@mkavs.com", pwd: "admin" },
];

const SECRET_ANSWER = "thalapathy vetri kairon";

interface LoginFormProps {
  onLogin?: (token: string, agent: { email: string; name: string; role: string }) => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://api.mkavs.com';

export function LoginForm({ onLogin }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [identifier, setIdentifier] = useState(''); // Email or ID
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  // Forgot password flow
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // 1. Try Mock Auth First for recognized users
      const mockUser = ADMIN_USERS.find(u => 
        (u.email.toLowerCase() === identifier.toLowerCase() || u.id === identifier) && 
        u.pwd === password
      );

      if (mockUser) {
        // Simulate a small delay
        await new Promise(r => setTimeout(r, 600));
        const agent = { email: mockUser.email, name: mockUser.name, role: mockUser.role, alias: mockUser.alias, employeeId: mockUser.id };
        login("mock-token-123", agent as any);
        onLogin?.("mock-token-123", agent as any);
        navigate(from, { replace: true });
        return;
      }

      // 2. Fallback to API if not a mock user
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Invalid credentials');
        return;
      }

      if (data.success) {
        login(data.token, data.agent);
        onLogin?.(data.token, data.agent);
        navigate(from, { replace: true });
      }
    } catch (err) {
      // If network fails but identifier was a mock user, we could have logged them in.
      // Since it already returned if mockUser was found, this catch handles true failures.
      setError('Connection refused. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (securityAnswer.toLowerCase().trim() === SECRET_ANSWER) {
      setResetSuccess(true);
      setTimeout(() => {
        setResetSuccess(false);
        setView('login');
        setPassword('');
        setError("Your password has been reset to 'admin'. Please log in.");
      }, 3000);
    } else {
      setError("Incorrect answer. Access denied.");
    }
  };

  return (
    <div className="w-full max-w-sm p-8 space-y-6 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-center">
      <AnimatePresence mode="wait">
        {view === 'login' ? (
          <motion.div 
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">Admin Access</h2>
              <p className="mt-2 text-xs text-gray-400 uppercase tracking-widest font-mono">Mission Critical Hub</p>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-xs text-red-300 text-center">{error}</p>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="relative z-0">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                  placeholder=" " 
                  required
                  disabled={isLoading}
                />
                <label className="absolute text-[10px] uppercase font-black tracking-widest text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  <User className="inline-block mr-2 -mt-1" size={14} />
                  Email or ID
                </label>
              </div>

              <div className="relative z-0">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer pr-10"
                  placeholder=" "
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <label className="absolute text-[10px] uppercase font-black tracking-widest text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                  <Lock className="inline-block mr-2 -mt-1" size={14} />
                  Password
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full flex items-center justify-center py-4 rounded-xl bg-blue-600 text-white font-black uppercase italic tracking-widest text-[12px] hover:bg-blue-500 transition-all shadow-xl active:scale-95 disabled:opacity-50"
              >
                {isLoading ? "Authenticating..." : "Sign In"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1" />}
              </button>
            </form>

            <button 
              onClick={() => setView('forgot')}
              className="w-full text-[10px] text-gray-500 hover:text-white uppercase tracking-widest transition-colors font-mono"
            >
              Forgot Password?
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="forgot"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">Identity Recovery</h2>
              <p className="mt-2 text-[10px] text-gray-400 uppercase tracking-widest font-mono">Verify Personal Secret</p>
            </div>

            {resetSuccess ? (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                 <div className="w-16 h-16 bg-blue-500/20 text-blue-500 rounded-full flex items-center justify-center animate-bounce">
                    <CheckCircle2 size={32} />
                 </div>
                 <p className="text-sm text-white font-bold">Access Restored.</p>
                 <p className="text-xs text-gray-400 italic">Redirecting to login dashboard...</p>
                 <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full bg-blue-500" initial={{width:0}} animate={{width:"100%"}} transition={{duration:3}} />
                 </div>
              </div>
            ) : (
              <form className="space-y-8" onSubmit={handleResetPassword}>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                   <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                      <HelpCircle size={14} /> Security Question
                   </p>
                   <p className="text-sm text-white font-medium leading-relaxed">
                      Who is the founder of MKAVS?
                   </p>
                </div>

                {error && <p className="text-center text-xs text-red-400 font-bold">{error}</p>}

                <div className="relative z-0">
                  <input
                    type="text"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                    className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-500 peer"
                    placeholder=" " 
                    required
                  />
                  <label className="absolute text-[10px] uppercase font-black tracking-widest text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
                    Enter Secret Answer
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => { setView('login'); setError(null); }}
                    className="flex-1 py-4 rounded-xl border border-white/10 text-[10px] font-black uppercase text-gray-400 hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 rounded-xl bg-blue-600 text-white font-black uppercase italic tracking-widest text-[12px] hover:bg-blue-500 transition-all shadow-xl"
                  >
                    Verify Identity
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-8 border-t border-white/5">
        <p className="text-[9px] text-gray-600 text-center uppercase tracking-widest">
          Authorized Operation Level: <span className="text-gray-400">Restricted</span>
        </p>
      </div>
    </div>
  );
}
