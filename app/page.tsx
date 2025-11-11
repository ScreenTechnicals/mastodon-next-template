"use client"

import { Code2, Github, Sparkles, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white overflow-hidden">
      {/* Grid background effect */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        {/* Logo Badge */}
        <div className="mb-8 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/30">
            <span className="text-3xl font-black text-white">M</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-300">
              Mastodon + Next.js
            </h1>
            <p className="text-xl sm:text-2xl font-light text-slate-300">Developer playground for social integration</p>
          </div>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
            A powerful template for testing Mastodon integrations using Next.js, NextAuth, and the Masto SDK. Build,
            test, and deploy social features with ease.
          </p>

          {/* CTA Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/test-hooks")}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105 flex items-center gap-2 group"
            >
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Test Hooks
            </button>
            <button
              onClick={() => window.open("https://github.com/ScreenTechnicals/mastodon-next-template", "_blank")}
              className="px-8 py-3 border border-slate-600 hover:border-slate-400 text-slate-200 font-semibold rounded-full hover:bg-slate-900/50 transition-all duration-300 flex items-center gap-2 group"
            >
              <Github className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
              View GitHub
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {[
            { icon: Code2, label: "Next.js", desc: "Modern React framework" },
            { icon: Sparkles, label: "Masto SDK", desc: "Mastodon integration" },
            { icon: Zap, label: "NextAuth", desc: "Authentication ready" },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-linear-to-br from-slate-900/80 to-slate-950/80 border border-slate-700/50 hover:border-blue-600/50 transition-colors duration-300 backdrop-blur-sm group"
            >
              <feature.icon className="w-6 h-6 text-blue-400 mb-3 group-hover:text-blue-300 transition-colors" />
              <h3 className="font-semibold text-white">{feature.label}</h3>
              <p className="text-sm text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-4 border-t border-slate-800/50 bg-black/50 backdrop-blur-sm">
        <div className="flex justify-center text-xs text-slate-500">
          Built by <span className="text-blue-400 font-medium mx-1">Dev Verse</span>
          <span className="text-slate-600">⚡</span>
        </div>
      </footer>
    </main>
  )
}
