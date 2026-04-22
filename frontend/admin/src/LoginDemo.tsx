import { SmokeyBackground, LoginForm } from "@/components/ui/login-form";

interface AdminAgent {
  email: string;
  name: string;
  role: string;
}

interface LoginDemoProps {
  onLogin?: (token: string, agent: AdminAgent) => void;
}

export default function LoginDemo({ onLogin }: LoginDemoProps) {
  return (
    <main className="relative w-screen h-screen bg-gray-900 overflow-hidden">
      <SmokeyBackground className="absolute inset-0" />
      
      {/* MKAVS Logo - Positioned at the top */}
      <div className="absolute top-16 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="relative flex items-center justify-center scale-[1.3]">
          {/* Subtle atmospheric glow behind logo */}
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full"></div>
          
          <img 
            src="/mkavs-logo.png" 
            alt="MKAVS" 
            className="relative z-10 w-[450px] h-auto"
            style={{
              filter: 'brightness(1.1) contrast(1.1)',
              mixBlendMode: 'screen'
            }}
          />
        </div>
      </div>

      {/* Login form - Perfectly centered */}
      <div className="relative z-10 flex items-center justify-center w-full h-full p-4 pt-20">
        <LoginForm onLogin={onLogin} />
      </div>
    </main>
  );
}

