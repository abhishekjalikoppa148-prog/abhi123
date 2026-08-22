'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Sparkles, Gift, Music, Heart, ArrowRight, ShieldCheck, 
  CheckCircle2, Star, Smartphone, Eye, QrCode, Wand2, Play, Flame, Rocket
} from 'lucide-react';
import { TEMPLATES } from '@/lib/sample-data';

export default function LandingPage() {
  const [selectedDemoTemplate, setSelectedDemoTemplate] = useState('romantic');

  const activeTemplate = TEMPLATES.find(t => t.id === selectedDemoTemplate) || TEMPLATES[0];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden min-h-screen flex items-center">
        
        {/* Background with Blue Gradient Overlay */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, var(--bg-primary)/95, var(--bg-secondary)/90, var(--bg-tertiary)/85)'
          }} />
          {/* Subtle blue radial gradients for depth */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] -z-10" style={{
            background: 'radial-gradient(to top right, rgba(37,99,235,0.08), rgba(59,130,246,0.05), transparent)'
          }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] -z-10" style={{
            background: 'radial-gradient(to bottom right, rgba(214,180,119,0.06), rgba(217,140,154,0.04), transparent)'
          }} />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Clean Text Content */}
            <div className="space-y-8 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg text-xs font-semibold animate-fade-in-up border" style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--accent-primary)'
              }}>
                <Sparkles className="w-4 h-4 animate-spin" style={{ color: 'var(--accent-premium)' }} />
                <span style={{ color: 'var(--text-heading)' }}>✨ Loved by birthday creators worldwide</span>
              </div>

              {/* Headline */}
              <h1 className="font-cormorant text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none max-w-2xl animate-fade-in-up" style={{
                animationDelay: '0.1s',
                color: 'var(--text-heading)'
              }}>
                Create a Birthday Website They'll Never Forget
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl max-w-xl font-normal leading-relaxed animate-fade-in-up" style={{
                animationDelay: '0.2s',
                color: 'var(--text-muted)'
              }}>
                Create beautiful personalized birthday experiences with photos, music, memories, AI-powered wishes, countdowns and magical surprises — all in one place.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <Link
                  href="/signup"
                  className="magnetic-btn ripple w-full sm:w-auto px-8 py-4 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--accent-primary)',
                    color: '#FFFFFF',
                    boxShadow: 'var(--shadow-medium)'
                  }}
                >
                  <span>Create Your Birthday Website</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/templates"
                  className="magnetic-btn w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-105 border-2 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-heading)'
                  }}
                >
                  <span>Explore Templates</span>
                </Link>
              </div>

              {/* Trust Message */}
              <div className="pt-4 text-xs font-medium animate-fade-in-up" style={{
                animationDelay: '0.4s',
                color: 'var(--text-muted)'
              }}>
                No coding required • Ready in minutes • Share anywhere
              </div>

            </div>

            {/* Right Side - Browser Preview */}
            <div className="relative hidden lg:block">
              {/* Browser Window */}
              <div className="rounded-2xl shadow-2xl overflow-hidden border" style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)'
              }}>
                {/* Browser Header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b" style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-secondary)'
                }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F59E0B' }} />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }} />
                  </div>
                  <div className="flex-1 mx-4 px-4 py-1.5 rounded-full text-xs" style={{
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-muted)'
                  }}>
                    celebrationcraft.com/birthday/sarah
                  </div>
                </div>
                
                {/* Preview Content */}
                <div className="p-6 space-y-4">
                  <div className="text-center space-y-2">
                    <h3 className="font-cormorant text-2xl font-bold" style={{ color: 'var(--accent-birthday)' }}>Happy Birthday Sarah!</h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Celebrating 25 wonderful years</p>
                  </div>
                  
                  {/* Floating Stats Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl text-center" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>127</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Visitors</div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>8</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Memories</div>
                    </div>
                    <div className="p-3 rounded-xl text-center" style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div className="text-lg font-bold" style={{ color: 'var(--accent-premium)' }}>03</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Days Left</div>
                    </div>
                  </div>

                  {/* Music Playing Indicator */}
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{
                      backgroundColor: 'var(--accent-primary)'
                    }}>
                      <Music className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-heading)' }}>Birthday Song</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Now Playing</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-60 animate-float" style={{
                background: 'var(--accent-primary)',
                filter: 'blur(2px)'
              }} />
              <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full opacity-40 animate-float" style={{
                background: 'var(--accent-premium)',
                animationDelay: '1s',
                filter: 'blur(2px)'
              }} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE DEMO PREVIEW SANDBOX */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-10 rounded-3xl shadow-lg space-y-8 animate-scale-in border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Live Preview Engine</span>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold" style={{ color: 'var(--text-heading)' }}>Select a Theme to Test Live</h2>
            </div>

            {/* Template Selector Pills */}
            <div className="flex flex-wrap gap-2">
              {TEMPLATES.slice(0, 4).map((tpl) => (
                <button
                  key={tpl.id}
                  onClick={() => setSelectedDemoTemplate(tpl.id)}
                  className={`magnetic-btn px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedDemoTemplate === tpl.id ? '' : ''}`}
                  style={{
                    backgroundColor: selectedDemoTemplate === tpl.id ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: selectedDemoTemplate === tpl.id ? 'var(--bg-card)' : 'var(--text-heading)',
                    borderColor: 'var(--border-subtle)',
                    boxShadow: selectedDemoTemplate === tpl.id ? 'var(--shadow-medium)' : 'none'
                  }}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mockup Frame */}
          <div className="relative rounded-2xl overflow-hidden border p-6 sm:p-12 min-h-[420px] flex flex-col items-center justify-center text-center space-y-6 card-3d" style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-secondary)'
          }}>
            
            <div className={`absolute inset-0 bg-gradient-to-b ${activeTemplate.bgGradient} opacity-90 -z-10`} />

            <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-heading)',
              borderColor: 'var(--border-subtle)'
            }}>
              {activeTemplate.badge}
            </span>

            <div className="space-y-2">
              <h1 className="font-cormorant text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-tight" style={{ color: 'var(--text-heading)' }}>
                HAPPY BIRTHDAY, ABHISHEK ❤️
              </h1>
              <p className="text-sm sm:text-base max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
                &ldquo;You make every single day brighter with your smile. Today is all about celebrating YOU!&rdquo;
              </p>
            </div>

            {/* Interactive Demo Elements */}
            <div className="flex items-center gap-4">
              <Link
                href={`/builder?template=${activeTemplate.id}`}
                className="magnetic-btn ripple px-6 py-3 rounded-full font-extrabold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
                style={{
                  backgroundColor: 'var(--text-heading)',
                  color: 'var(--bg-card)'
                }}
              >
                <Wand2 className="w-4 h-4" /> Customize & Publish Free
              </Link>
              <Link
                href="/birthday/rohan-special-24"
                className="magnetic-btn px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all hover:scale-100 border"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-heading)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <Play className="w-4 h-4" style={{ fill: 'var(--text-heading)' }} /> Test Cake & Music
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Everything Included</span>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-bold" style={{ color: 'var(--text-heading)' }}>Packed With Magical Features ✨</h2>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            No payment required! Simply enter details, pick a theme, upload photos, and generate your free birthday page instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1 - AI Birthday Wishes */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>AI Birthday Wishes</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Generate personalized birthday messages with AI-powered wish generator.
            </p>
          </div>

          {/* Card 2 - Photo & Video Memories */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Photo & Video Memories</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Upload photos and videos to create beautiful memory galleries.
            </p>
          </div>

          {/* Card 3 - Background Music */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Background Music</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Add birthday songs with auto-play and custom audio uploads.
            </p>
          </div>

          {/* Card 4 - Birthday Countdown */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Birthday Countdown</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Build excitement with a live countdown timer to the big day.
            </p>
          </div>

          {/* Card 5 - Memory Timeline */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Memory Timeline</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Create a chronological journey of memories and milestones.
            </p>
          </div>

          {/* Card 6 - Interactive Candle Blowing */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Interactive Candle Blowing</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Visitors tap to blow out candles with sound effects and confetti.
            </p>
          </div>

          {/* Card 7 - Surprise Gift Box */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Surprise Gift Box</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Add a virtual gift box that opens with a special surprise.
            </p>
          </div>

          {/* Card 8 - QR Code Sharing */}
          <div className="p-6 rounded-2xl transition-all hover:-translate-y-1 space-y-4 group shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              color: 'var(--accent-primary)'
            }}>
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>QR Code Sharing</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Share your birthday website instantly with QR code generation.
            </p>
          </div>

        </div>
      </section>

      {/* 4. TEMPLATES SHOWCASE */}
      <section id="templates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Design Variety</span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold" style={{ color: 'var(--text-heading)' }}>8 Free Birthday Templates 🎨</h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Handcrafted designs tailored for partners, best friends, parents, kids, and elegant celebrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((tpl) => (
            <div 
              key={tpl.id}
              className="group rounded-3xl overflow-hidden transition-all hover:-translate-y-1 flex flex-col justify-between card-3d shadow-sm border"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <div className="relative h-44 w-full overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                <Image
                  src={tpl.previewImage}
                  alt={tpl.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-secondary), transparent)' }} />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold border" style={{
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-heading)',
                  borderColor: 'var(--border-subtle)'
                }}>
                  {tpl.badge}
                </span>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-base" style={{ color: 'var(--text-heading)' }}>{tpl.name}</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{tpl.description}</p>
                </div>

                <Link
                  href={`/builder?template=${tpl.id}`}
                  className="magnetic-btn ripple w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    backgroundColor: 'var(--text-heading)',
                    color: 'var(--bg-card)'
                  }}
                >
                  Use Free Template <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-premium)' }}>AI-Powered Magic</span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold" style={{ color: 'var(--text-heading)' }}>Smart Personalization ✨</h2>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            Our AI generates personalized birthday wishes and smart content tailored to your loved ones.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Feature Card 1 */}
          <div className="p-6 rounded-3xl transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm relative overflow-hidden border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10" style={{
              background: 'radial-gradient(circle at top right, var(--accent-premium)/10, transparent)'
            }} />
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-premium)/20, var(--accent-premium)/10)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-premium)'
            }}>
              <Wand2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>AI Birthday Wish Generator</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Generate heartfelt, personalized birthday wishes with AI. Choose from emotional, funny, romantic, or inspirational tones.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: 'var(--accent-premium)' }}>
              <Sparkles className="w-3 h-3" /> Powered by OpenAI GPT
            </div>
          </div>

          {/* AI Feature Card 2 */}
          <div className="p-6 rounded-3xl transition-all hover:-translate-y-1 space-y-4 card-3d group shadow-sm relative overflow-hidden border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -z-10" style={{
              background: 'radial-gradient(circle at top right, var(--accent-primary)/10, transparent)'
            }} />
            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center transition-all" style={{
              background: 'linear-gradient(to bottom right, var(--accent-primary)/20, var(--accent-cta)/10)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--accent-primary)'
            }}>
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--text-heading)' }}>Smart Content Suggestions</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Get intelligent suggestions for photo captions, memory notes, and personalized messages based on your relationship.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-semibold" style={{ color: 'var(--accent-primary)' }}>
              <Sparkles className="w-3 h-3" /> Context-Aware AI
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRICING SECTION */}
      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Simple Pricing</span>
          <h2 className="font-playfair text-3xl sm:text-5xl font-bold" style={{ color: 'var(--text-heading)' }}>Choose Your Plan 💎</h2>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Basic Plan */}
          <div className="p-6 rounded-3xl space-y-6 card-3d shadow-sm border" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)'
          }}>
            <div className="space-y-2">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Basic</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Perfect for trying out</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black" style={{ color: 'var(--text-heading)' }}>Free</span>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Forever</p>
            </div>
            <ul className="space-y-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> 3 websites per day</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Basic templates</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Photo uploads</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Music player</li>
            </ul>
            <Link
              href="/builder"
              className="magnetic-btn w-full py-3 rounded-xl font-bold text-sm transition-all border-2"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            >
              Start Free
            </Link>
          </div>

          {/* Premium Plan - Highlighted */}
          <div className="p-6 rounded-3xl space-y-6 card-3d shadow-lg border-2 relative" style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--accent-primary)'
          }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{
              backgroundColor: 'var(--accent-primary)',
              color: 'var(--bg-card)'
            }}>
              Most Popular
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Premium</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>For serious creators</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black" style={{ color: 'var(--text-heading)' }}>₹499</span>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>per month</p>
            </div>
            <ul className="space-y-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Unlimited websites</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> All premium templates</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> AI wish generator (50/mo)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Custom domain support</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} /> Priority support</li>
            </ul>
            <Link
              href="/pricing"
              className="magnetic-btn ripple w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
              style={{
                backgroundColor: 'var(--text-heading)',
                color: 'var(--bg-card)'
              }}
            >
              Get Premium
            </Link>
          </div>

          {/* Ultimate Plan - Gold Accent */}
          <div className="p-6 rounded-3xl space-y-6 card-3d shadow-sm border relative" style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--accent-premium)/30'
          }}>
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{
              background: 'linear-gradient(to right, var(--accent-premium), var(--accent-premium)/80)',
              color: 'var(--bg-card)'
            }}>
              Best Value
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold" style={{ color: 'var(--accent-premium)' }}>Ultimate</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>For power users</p>
            </div>
            <div className="space-y-1">
              <span className="text-4xl font-black" style={{ color: 'var(--accent-premium)' }}>₹999</span>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>per month</p>
            </div>
            <ul className="space-y-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-premium)' }} /> Everything in Premium</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-premium)' }} /> Unlimited AI wishes</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-premium)' }} /> Advanced analytics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-premium)' }} /> White-label option</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" style={{ color: 'var(--accent-premium)' }} /> Dedicated support</li>
            </ul>
            <Link
              href="/pricing"
              className="magnetic-btn ripple w-full py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105"
              style={{
                background: 'linear-gradient(to right, var(--accent-premium), var(--accent-premium)/80)',
                color: 'var(--bg-card)'
              }}
            >
              Get Ultimate
            </Link>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl text-center space-y-6 shadow-lg relative overflow-hidden" style={{
            background: 'linear-gradient(to right, var(--text-heading), var(--text-secondary))'
          }}>
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at top right, rgba(217,140,154,0.15), transparent)'
          }} />
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(circle at bottom left, rgba(201,164,92,0.1), transparent)'
          }} />
          
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider border" style={{
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-heading)',
            borderColor: 'var(--border-subtle)'
          }}>
            Ready to Surprise? 🎁
          </span>

          <h2 className="font-playfair text-3xl sm:text-5xl font-bold max-w-2xl mx-auto leading-tight" style={{ color: 'var(--bg-card)' }}>
            Create Their Birthday Website Free in Less Than 5 Minutes
          </h2>

          <div className="pt-2">
            <Link
              href="/builder"
              className="magnetic-btn ripple inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-base shadow-lg transition-transform hover:scale-105 border"
              style={{
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-heading)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              <Rocket className="w-5 h-5" style={{ color: 'var(--accent-premium)' }} /> Start Creating Free Now 🚀
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
