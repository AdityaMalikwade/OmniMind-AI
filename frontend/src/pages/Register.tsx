import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BrainCircuit,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Temporary Registration
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4">

      <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-600/20 blur-[170px]" />

      <form
        onSubmit={handleRegister}
        className="relative z-10 w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8"
      >

        <div className="flex justify-center">

          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-cyan-400 to-indigo-600 flex items-center justify-center">

            <BrainCircuit className="text-white w-8 h-8"/>

          </div>

        </div>

        <h1 className="text-center text-3xl text-white font-bold mt-5">
          Create Account
        </h1>

        <p className="text-center text-slate-400 mt-2">
          Join OmniMind AI
        </p>

        {/* Name */}

        <div className="mt-8">

          <label className="text-slate-300 text-sm">
            Full Name
          </label>

          <div className="mt-2 bg-white/10 rounded-xl flex items-center px-4">

            <User className="text-slate-400 w-5 h-5"/>

            <input
              type="text"
              placeholder="Enter your name"
              className="bg-transparent outline-none p-4 w-full text-white"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />

          </div>

        </div>

        {/* Email */}

        <div className="mt-5">

          <label className="text-slate-300 text-sm">
            Email
          </label>

          <div className="mt-2 bg-white/10 rounded-xl flex items-center px-4">

            <Mail className="text-slate-400 w-5 h-5"/>

            <input
              type="email"
              placeholder="Enter Email"
              className="bg-transparent outline-none p-4 w-full text-white"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>

        </div>

        {/* Password */}

        <div className="mt-5">

          <label className="text-slate-300 text-sm">
            Password
          </label>

          <div className="mt-2 bg-white/10 rounded-xl flex items-center px-4">

            <Lock className="text-slate-400 w-5 h-5"/>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-transparent outline-none p-4 w-full text-white"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={()=>setShowPassword(!showPassword)}
            >
              {
                showPassword ?
                <EyeOff className="text-slate-400 w-5 h-5"/> :
                <Eye className="text-slate-400 w-5 h-5"/>
              }
            </button>

          </div>

        </div>

        {/* Confirm */}

        <div className="mt-5">

          <label className="text-slate-300 text-sm">
            Confirm Password
          </label>

          <div className="mt-2 bg-white/10 rounded-xl flex items-center px-4">

            <Lock className="text-slate-400 w-5 h-5"/>

            <input
              type={showPassword ? "text":"password"}
              placeholder="Confirm Password"
              className="bg-transparent outline-none p-4 w-full text-white"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
            />

          </div>

        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 transition rounded-xl py-4 text-white text-lg font-semibold"
        >
          Create Account
        </button>

        <p className="text-center text-slate-400 mt-6">

          Already have an account?

          <Link
            to="/login"
            className="text-indigo-400 ml-2 hover:underline"
          >
            Login
          </Link>

        </p>

      </form>

    </div>
  );
}