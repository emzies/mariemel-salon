"use client"
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedService, setExpandedService] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)

  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Intercept in-page hash link clicks and perform smooth scroll (fallback for browsers/Next.js)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest ? (target.closest('a') as HTMLAnchorElement | null) : null
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || !href.startsWith('#')) return
      const id = href.slice(1)
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        // update hash without the browser jump
        try { history.pushState(null, '', href) } catch { /* ignore */ }
        setMenuOpen(false)
      }
    }

    document.addEventListener('click', onClick)

    // If page loaded with a hash, gently scroll to it after mount
    if (location.hash) {
      const id = location.hash.slice(1)
      const el = document.getElementById(id)
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
    }

    return () => document.removeEventListener('click', onClick)
  }, [setMenuOpen])

  const basePath = process.env.NODE_ENV === 'production' ? '/mariemel-salon' : ''

  const services = [
    {
      id: 'hair',
      label: 'HAIR',
      image: `${basePath}/hair.jpg`,
      title: 'Hair Styling',
      tagline: 'Cut. Color. Transform.',
      desc: 'Modern cuts and styling tailored to your look.',
      expanded: 'Expert stylists with years of experience provide personalized haircuts, coloring, and styling services to bring out your best look.',
    },
    {
      id: 'nails',
      label: 'NAILS',
      image: `${basePath}/nail.jpg`,
      title: 'Nail Care',
      tagline: 'Polish. Perfect. Shine.',
      desc: 'Clean, elegant, and long-lasting nail treatments.',
      expanded: 'From manicures to pedicures, our nail specialists use premium products and techniques to keep your nails beautiful and healthy.',
    },
    {
      id: 'spa',
      label: 'SPA',
      image: `${basePath}/spa.jpg`,
      title: 'Spa Treatments',
      tagline: 'Relax. Restore. Glow.',
      desc: 'Relaxing and rejuvenating skincare services.',
      expanded: 'Indulge in our luxurious spa treatments including facials, massages, and body treatments designed to restore your natural glow.',
    },
  ]

  return (
    <>
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-[#319905] pointer-events-none z-[9999] transition-transform duration-[80ms] ease-out hidden md:block"
        style={{ willChange: 'transform' }}
      />
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#319905] pointer-events-none z-[9999] transition-transform duration-[30ms] ease-out hidden md:block"
        style={{ willChange: 'transform' }}
      />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(2deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blob {
          0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        }

        .float-anim { animation: float 6s ease-in-out infinite; }
        .float-anim-delay { animation: float 6s ease-in-out 2s infinite; }
        .float-anim-delay2 { animation: float 6s ease-in-out 4s infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #319905, #6abf40, #256e03, #8fd45a, #319905);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }

        .blob-anim { animation: blob 8s ease-in-out infinite; }
        .slide-up { animation: slide-up 0.7s ease forwards; }
        .marquee-inner { animation: marquee 20s linear infinite; }
        .spin-slow { animation: spin-slow 20s linear infinite; }

        .card-hover {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
        }
        .card-hover:hover {
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 30px 60px -10px rgba(49,153,5,0.15);
        }

        .hero-gradient {
          background: linear-gradient(135deg, #1a3a0a 0%, #256e03 40%, #319905 70%, #4aad1a 100%);
        }

        .noise-overlay {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.3;
        }

        .glow-btn {
          position: relative;
          overflow: hidden;
        }
        .glow-btn::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 0; height: 0;
          background: rgba(255,255,255,0.25);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          transition: width 0.6s ease, height 0.6s ease;
        }
        .glow-btn:hover::before { width: 300px; height: 300px; }

        .stat-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.25);
        }
      `}</style>

      <main className="bg-[#FCF8F5] text-[#1a1a1a] overflow-x-hidden">

        {/* ── NAVBAR ── */}
        <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrollY > 60
            ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 py-3'
            : 'bg-transparent py-5'
        }`}>
          <div className="flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#319905] flex items-center justify-center text-sm font-bold text-white">M</div>
              <span className={`font-display text-xl font-bold tracking-wide transition-colors duration-300 ${scrollY > 60 ? 'text-[#1a1a1a]' : 'text-white'}`}>
                Marie-mel<span className={scrollY > 60 ? 'text-[#319905]' : 'text-[#e8f5e2]'}>.</span>
              </span>
            </div>

            <div className={`hidden md:flex items-center gap-10 text-sm font-medium tracking-wider transition-colors duration-300 ${scrollY > 60 ? 'text-[#1a1a1a]' : 'text-white'}`}>
              {['Home', 'Services', 'About', 'Contact'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="relative group py-1">
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-[#319905] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              <div className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2 bg-[#1a1a1a]' : scrollY > 60 ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
              <div className={`w-6 h-0.5 mb-1.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${scrollY > 60 ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
              <div className={`w-6 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2 bg-[#1a1a1a]' : scrollY > 60 ? 'bg-[#1a1a1a]' : 'bg-white'}`} />
            </button>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-60' : 'max-h-0'}`}>
            <div className="bg-white border-t border-[#e8f5e2] px-6 py-6 flex flex-col gap-5 text-base shadow-lg">
              {['Home', 'Services', 'About', 'Contact'].map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-[#6b6b6b] hover:text-[#319905] transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section id="home" className="relative min-h-screen flex flex-col justify-center overflow-hidden hero-gradient">
          <div className="absolute inset-0 noise-overlay pointer-events-none" />

          <div className="absolute top-20 -left-32 w-96 h-96 bg-white/10 rounded-full blob-anim blur-3xl" />
          <div className="absolute bottom-20 -right-32 w-[500px] h-[500px] bg-[#256e03]/40 rounded-full blob-anim blur-3xl" style={{animationDelay: '3s'}} />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#e8f5e2]/10 rounded-full blob-anim blur-3xl" style={{animationDelay: '5s'}} />

          <div className="absolute top-32 right-16 text-5xl float-anim select-none opacity-70">✨</div>
          <div className="absolute top-64 right-32 text-4xl float-anim-delay select-none opacity-60">💄</div>
          <div className="absolute bottom-48 left-16 text-4xl float-anim-delay2 select-none opacity-60">🌿</div>
          <div className="absolute top-48 left-1/4 text-3xl float-anim select-none opacity-50">💅</div>

          <div className="absolute right-10 top-1/3 w-48 h-48 rounded-full border border-white/20 spin-slow hidden lg:block" />
          <div className="absolute right-16 top-[38%] w-36 h-36 rounded-full border border-[#e8f5e2]/30 spin-slow hidden lg:block" style={{animationDirection: 'reverse'}} />

          <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase mb-8 backdrop-blur-sm text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e8f5e2] animate-pulse" />
                Premium Salon Experience
              </div>

              <h2 className="font-display text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-[0.9] mb-6 text-white">
                Your
                <br />
                <span className="italic font-light text-[#e8f5e2]">Beauty,</span>
                <br />
                Elevated.
              </h2>

              <p className="text-white/80 text-lg md:text-xl max-w-lg mb-12 leading-relaxed">
                Experience premium care and personalized treatments in a calm, elegant environment designed just for you.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="glow-btn group bg-white text-[#319905] font-bold px-10 py-5 rounded-full text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/20 text-center"
                >
                  Explore Services
                  <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </a>
                {/* <a
                  href="#contact"
                  className="group border-2 border-white/50 text-white px-10 py-5 rounded-full text-base font-medium hover:bg-white/15 transition-all duration-300 text-center"
                >
                  Contact Us
                </a> */}
              </div>

              <div className="flex flex-wrap gap-5 mt-20">
                {[['200+', 'Happy Clients'], ['4+', 'Expert Stylists'], ['10+', 'Services'], ['5★', 'Avg Rating']].map(([num, label]) => (
                  <div key={label} className="stat-card rounded-2xl px-6 py-4">
                    <div className="font-display text-3xl font-bold text-white">{num}</div>
                    <div className="text-white/60 text-xs tracking-wider uppercase mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 text-xs tracking-widest">
            <span>SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
          </div>
        </section>

        {/* ── MARQUEE ──
        <div className="bg-[#319905] py-3 overflow-hidden">
          <div className="flex whitespace-nowrap marquee-inner">
            {Array(2).fill(['✂️ Hair Styling', '💅 Nail Art', '🧖 Spa Facials', '💆 Massages', '🌿 Organic Care', '✨ Glow Treatments', '💄 Makeup', '🎨 Hair Color']).flat().map((item, i) => (
              <span key={i} className="text-white font-semibold text-sm mx-8">{item}</span>
            ))}
          </div>
        </div> */}

        {/* ── SERVICES ── */}
        <section id="services" className="px-6 md:px-12 py-24 bg-[#FCF8F5]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-[#319905] text-xs tracking-[0.3em] uppercase font-medium mb-4">What We Offer</p>
              <h3 className="font-display text-5xl md:text-6xl font-bold text-[#1a1a1a]">
                Our <span className="italic font-light text-[#6b6b6b]">Services</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {services.map((svc) => (
                <div
                  key={svc.id}
                  onClick={() => setExpandedService(expandedService === svc.id ? null : svc.id)}
                  className="card-hover rounded-3xl relative cursor-pointer group"
                >
                 <div className="h-1.5 w-full bg-[#319905] rounded-t-3xl" />
                  <div className="bg-white border border-[#e8f5e2] border-t-0 rounded-b-3xl p-8 shadow-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <Image src={svc.image} alt={svc.title} width={180} height={180} className="w-32 h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover" />
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#e8f5e2] text-[#256e03]">{svc.label}</span>
                    </div>
                    <p className="text-[#319905] text-xs tracking-widest uppercase mb-2 font-medium">{svc.tagline}</p>
                    <h4 className="font-display text-2xl md:text-3xl font-bold mb-3 text-[#1a1a1a]">{svc.title}</h4>
                    <p className="text-[#6b6b6b] text-base md:text-lg leading-relaxed">{svc.desc}</p>

                    {expandedService === svc.id && (
                      <div className="mt-5 pt-5 border-t border-[#e8f5e2] slide-up">
                        <p className="text-[#6b6b6b] text-base md:text-lg leading-relaxed">{svc.expanded}</p>
                      </div>
                    )}

                    <div className="mt-6 flex items-center gap-2 text-[#6b6b6b] text-xs group-hover:text-[#319905] transition-colors">
                      <span>{expandedService === svc.id ? 'Click to collapse' : 'Click to learn more'}</span>
                      <span className={`transition-transform duration-300 ${expandedService === svc.id ? 'rotate-180' : ''}`}>↓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY US ── */}
        <section className="bg-[#e8f5e2] py-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-[#319905] text-xs tracking-[0.3em] uppercase font-medium mb-4">Why Choose Us</p>
                <h3 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#1a1a1a]">
                  Where Beauty
                  <br />
                  Meets <span className="shimmer-text">Nature</span>
                </h3>
                <p className="text-[#6b6b6b] text-lg leading-relaxed">
                  At Marie-mel, we believe every visit should feel like a reset — a moment just for you. Our talented team brings artistry, warmth, and expertise to every service.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  // { icon: '🏆', title: 'Award Winning', desc: 'Recognized for excellence in beauty and wellness.' },
                  { icon: '🌱', title: 'Organic Products', desc: 'Only premium, skin-safe, eco-friendly products.' },
                  { icon: '⚡', title: 'Quick & Efficient', desc: 'Always on time, no long waits, ever.' },
                  { icon: '🤝', title: 'Personalized Care', desc: 'Every treatment tailored just for you.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-white border border-[#e8f5e2] rounded-2xl p-6 hover:border-[#319905]/40 hover:shadow-md transition-all duration-300"
                  >
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <h5 className="font-display font-bold text-lg md:text-xl mb-1 text-[#1a1a1a]">{item.title}</h5>
                    <p className="text-[#6b6b6b] text-sm md:text-base leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── ABOUT ── */}
        <section id="about" className="py-24 px-6 md:px-12 bg-[#FCF8F5]">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-[#319905] text-xs tracking-[0.3em] uppercase font-medium mb-4">Our Story</p>
            <h3 className="font-display text-5xl md:text-6xl font-bold mb-6 text-[#1a1a1a]">
              About <span className="italic font-light text-[#6b6b6b]">Marie-mel</span>
            </h3>
            <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto leading-relaxed mb-16">
              Marie-mel Salon was born from a passion for natural beauty and human confidence. We&apos;re dedicated to bringing out your natural radiance through expert care, premium products, and an experience that truly refreshes your spirit.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left">
              {[
                { quote: 'Best salon I have ever been to. The atmosphere is incredible and the stylists are absolute artists.', name: 'Sofia R.', role: 'Regular Client' },
                { quote: 'My nails have never looked better. The attention to detail here is unlike anything else in the city.', name: 'Ana M.', role: 'Nail Art Client' },
                { quote: 'The spa treatment was transformative. I walked out glowing. Cannot recommend highly enough!', name: 'Lia T.', role: 'Spa Client' },
              ].map((t, i) => (
                <div key={i} className="bg-white border border-[#e8f5e2] rounded-3xl p-8 hover:border-[#319905]/30 hover:shadow-md transition-all duration-300">
                  <div className="text-[#319905] text-xl mb-4">★★★★★</div>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed italic mb-6">&quot;{t.quote}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#319905] flex items-center justify-center font-bold text-sm text-white">
                      {t.name[0]}
                    </div>
                    <div>
                      <div className="text-[#1a1a1a] font-semibold text-sm">{t.name}</div>
                      <div className="text-[#6b6b6b] text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section id="contact" className="py-24 px-6 md:px-12 bg-[#e8f5e2]">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-[#319905] text-xs tracking-[0.3em] uppercase font-medium mb-4">Get In Touch</p>
            <h3 className="font-display text-5xl md:text-6xl font-bold leading-tight mb-6 text-[#1a1a1a]">
              Come <span className="shimmer-text">Find Us</span>
            </h3>
            <p className="text-[#6b6b6b] text-lg leading-relaxed mb-16 max-w-xl mx-auto">
              We&apos;d love to hear from you. Visit us, give us a call, or drop us an email — we&apos;re always happy to help.
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { icon: '📍', label: 'Location', value: 'Dagupan, Ilocos, PH' },
                { icon: '📞', label: 'Phone', value: '+63 912 345 6789' },
                { icon: '✉️', label: 'Email', value: 'hello@marie-melsalon.com' },
                { icon: '⏰', label: 'Hours', value: 'Mon–Sat: 8am – 8pm · Sun: 11:30am – 7pm' },
              ].map(({ icon, label, value }) => (
                <div
                  key={label}
                  className="bg-white border border-[#e8f5e2] rounded-2xl p-6 hover:border-[#319905]/40 hover:shadow-md transition-all duration-300 flex flex-col items-center text-center gap-3"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#e8f5e2] border border-[#319905]/20 flex items-center justify-center text-2xl">
                    {icon}
                  </div>
                  <div>
                    <div className="text-[#6b6b6b] text-xs uppercase tracking-wider mb-1">{label}</div>
                    <div className="text-[#1a1a1a] font-semibold text-sm">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-[#e8f5e2] py-10 px-6 md:px-12 bg-[#FCF8F5]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#319905] flex items-center justify-center text-xs font-bold text-white">M</div>
              <span className="font-display text-lg font-bold text-[#1a1a1a]">Marie-mel<span className="text-[#319905]">.</span></span>
            </div>
            <p className="text-[#6b6b6b] text-sm">© 2025 Marie-mel Salon. All rights reserved.</p>
            <div className="flex gap-6 text-[#6b6b6b] text-sm">
              {['Instagram', 'Facebook', 'TikTok'].map(s => (
                <a key={s} href="#" className="hover:text-[#319905] transition-colors">{s}</a>
              ))}
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}