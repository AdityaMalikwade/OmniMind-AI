import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Temporary Login
    if (email && password) {
      navigate("/dashboard");
    } else {
      alert("Please fill all fields");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-indigo-600/20 blur-[150px] rounded-full"></div>

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >

        <div className="flex justify-center mb-6">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-600 flex items-center justify-center">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>

        </div>

        <h1 className="text-3xl font-bold text-center text-white">
          Welcome Back
        </h1>

        <p className="text-slate-400 text-center mt-2">
          Login to OmniMind AI
        </p>

        {/* Email */}

        <div className="mt-8">

          <label className="text-slate-300 text-sm">
            Email
          </label>

          <div className="mt-2 flex items-center bg-white/10 rounded-xl px-4">

            <Mail className="w-5 h-5 text-slate-400" />

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent p-4 outline-none text-white"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

        </div>

        {/* Password */}

        <div className="mt-6">

          <label className="text-slate-300 text-sm">
            Password
          </label>

          <div className="mt-2 flex items-center bg-white/10 rounded-xl px-4">

            <Lock className="w-5 h-5 text-slate-400"/>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="w-full bg-transparent p-4 outline-none text-white"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
            >

              {showPassword ? (
                <EyeOff className="w-5 h-5 text-slate-400"/>
              ) : (
                <Eye className="w-5 h-5 text-slate-400"/>
              )}

            </button>

          </div>

        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 transition rounded-xl py-4 text-lg font-semibold text-white"
        >
          Login
        </button>

        <p className="text-center text-slate-400 mt-6">

          Don't have an account?

          <Link
            to="/register"
            className="text-indigo-400 ml-2 hover:underline"
          >
            Register
          </Link>

        </p>

      </form>

    </div>
  );
}