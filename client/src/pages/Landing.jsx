import { Link } from "react-router-dom";
import { Button, Card } from "flowbite-react";
import { useAppSelector } from "../app/hooks";
import Navbar from "../components/layout/Navbar";

const features = [
  { icon: "⚡", title: "Instant Verdicts", desc: "Get AI-powered decisions in seconds based on your arguments and evidence." },
  { icon: "🔒", title: "Fair & Unbiased", desc: "Neutral AI analysis ensures every case is judged without prejudice." },
  { icon: "📄", title: "Document Support", desc: "Upload evidence and documents to strengthen your case arguments." }
];

const steps = [
  { icon: "📝", title: "Create a Case", desc: "Register and create your case. Choose whether you're the Plaintiff (Side A) or Defendant (Side B)." },
  { icon: "🔗", title: "Share Case ID", desc: "You'll receive a unique Case ID. Share it with your opponent. Only 2 people allowed per case." },
  { icon: "💬", title: "Present Arguments", desc: "Both parties present their arguments across 5 rounds. Upload supporting documents." },
  { icon: "⚖️", title: "Get AI Verdict", desc: "Request the AI Judge verdict. The AI analyzes both sides and delivers a fair decision." }
];

const stats = [
  { value: "100%", label: "Unbiased" },
  { value: "24/7", label: "Available" },
  { value: "Instant", label: "Results" },
  { value: "Secure", label: "Platform" }
];

export default function Landing() {
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector(state => state.auth.user);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gray-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
            <span className="bg-linear-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">AI Courtroom</span><br />Simulator ⚖️
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Present arguments, upload documents, and let the AI Judge deliver a <span className="text-yellow-400 font-semibold">neutral verdict</span> based on reasoning and evidence.
          </p>
          
          {isAuthenticated ? (
            <div className="mb-20 flex flex-col items-center">
              <p className="text-2xl text-white mb-6">Welcome back, <span className="text-yellow-400 font-bold">{user?.name || "User"}!</span></p>
              <Link to="/dashboard">
                <Button size="xl" className="bg-linear-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold">Go to Dashboard →</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
              <Link to="/register"><Button size="xl" className="bg-linear-to-r from-yellow-500 to-yellow-600 text-gray-900 w-64 font-bold">Create Account</Button></Link>
              <Link to="/login"><Button size="xl" outline className="border-2 border-yellow-400 text-yellow-400 w-64 font-bold hover:bg-yellow-400 hover:text-gray-900">Login</Button></Link>
            </div>
          )}

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            {features.map((f, i) => (
              <Card key={i} className="bg-white/10 backdrop-blur-lg border border-gray-700 hover:border-yellow-400/50 transition-all duration-300">
                <div className="text-5xl mb-4">{f.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-gray-300">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-linear-to-b from-gray-900 to-gray-800 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-white mb-4">How It Works</h2>
          <p className="text-center text-gray-400 mb-16">Simple 4-step process to resolve disputes with AI</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <Card key={i} className="relative bg-white/10 backdrop-blur-lg border border-gray-700 hover:border-yellow-400 transition-all duration-300">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-gray-900 font-bold text-xl">{i + 1}</div>
                <div className="text-4xl mb-4 mt-4">{s.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                <p className="text-gray-300 text-sm">{s.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white/5 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-yellow-400 mb-2">{s.value}</div>
                <div className="text-gray-300">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/50 py-8 text-center border-t border-gray-800">
        <p className="text-gray-400">© {new Date().getFullYear()} AI Judge · Fair · Transparent · Unbiased</p>
      </footer>
    </div>
  );
}
