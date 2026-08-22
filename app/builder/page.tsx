'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { 
  User as UserIcon, Heart, Camera, Music, Palette, Eye, Sparkles, 
  Wand2, Check, ArrowRight, ArrowLeft, Trash2, Rocket, Plus
} from 'lucide-react';

import { 
  BirthdayWebsite, PhotoMemory, TemplateId, PlanId, Customizations 
} from '@/lib/types';
import { 
  publishWebsiteDirectly, getWebsiteByIdOrSlug, 
  getDailyUsageInfo, DailyUsageInfo, DAILY_FREE_LIMIT, saveWebsite 
} from '@/lib/store';
import { useAuth } from '@/components/auth/AuthProvider';
import { TEMPLATES, DEFAULT_MUSIC_TRACKS, PLANS } from '@/lib/sample-data';
import { generateAIBirthdayWish, AIStyle } from '@/lib/ai-generator';
import RazorpayModal from '@/components/RazorpayModal';
import BuilderPreview from '@/components/BuilderPreview';

function BuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const existingId = searchParams.get('id');
  const initialTemplateParam = searchParams.get('template') as TemplateId | null;
  const initialPlanParam = searchParams.get('plan') as PlanId | null;
  const { user } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(initialPlanParam || 'ultimate');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [dailyUsage, setDailyUsage] = useState<DailyUsageInfo>({ 
    date: '', 
    count: 0, 
    max: DAILY_FREE_LIMIT, 
    remaining: DAILY_FREE_LIMIT, 
    isLimitReached: false 
  });

  useEffect(() => {
    setDailyUsage(getDailyUsageInfo());
  }, []);

  // Form State
  const [websiteId, setWebsiteId] = useState<string>(`site-${Date.now()}`);
  const [slug, setSlug] = useState<string>('');
  const [personName, setPersonName] = useState<string>('Rohan');
  const [personNickname, setPersonNickname] = useState<string>('Rohu');
  const [personAge, setPersonAge] = useState<number>(24);
  const [birthdayDate, setBirthdayDate] = useState<string>('2026-08-25');
  const [relationship, setRelationship] = useState<string>('Best Friend');
  const [favColor, setFavColor] = useState<string>('#8b5cf6');
  const [favSong, setFavSong] = useState<string>('Levitating by Dua Lipa');
  const [favFood, setFavFood] = useState<string>('Pizza & Tacos');
  const [favPlace, setFavPlace] = useState<string>('Goa Beaches');
  const [hobbyInput, setHobbyInput] = useState<string>('Guitar, Photography, Traveling');
  const [personality, setPersonality] = useState<string>('Energetic & Hilarious');
  const [customInfo, setCustomInfo] = useState<string>('');

  // Step 2: Message & AI
  const [birthdayMessage, setBirthdayMessage] = useState<string>(
    `Happy Birthday Rohan! 🎉\n\nMay your year ahead be packed with endless adventures, late night laughs, and unmatched success. Blow out those candles and make a big wish! 🥂✨`
  );
  const [aiStyle, setAiStyle] = useState<AIStyle>('emotional');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Step 3: Photos
  const [photos, setPhotos] = useState<PhotoMemory[]>([
    {
      id: 'p1',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop',
      caption: 'Unforgettable trip memory! 🏖️',
      date: 'March 2025'
    },
    {
      id: 'p2',
      url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&auto=format&fit=crop',
      caption: 'Jamming till late night 🎸',
      date: 'November 2025'
    }
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');

  // Step 4: Music
  const [musicTracks, setMusicTracks] = useState(DEFAULT_MUSIC_TRACKS);
  const [selectedMusicTrack, setSelectedMusicTrack] = useState(DEFAULT_MUSIC_TRACKS[0]);
  const [isLoadingMusic, setIsLoadingMusic] = useState(false);

  // Step 5: Templates & Customizations
  const [templates, setTemplates] = useState(TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(initialTemplateParam || 'golden-memories');
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);
  const [customizations] = useState<Customizations>({
    accentColor: '#a855f7',
    fontStyle: 'outfit',
    bgAnimation: 'confetti',
    buttonStyle: 'glow',
    photoLayout: 'polaroid',
    showAge: true,
    enableMusic: true,
    autostartMusic: false
  });

  // Load existing if editing
  useEffect(() => {
    if (existingId) {
      const site = getWebsiteByIdOrSlug(existingId);
      if (site) {
        setWebsiteId(site.id);
        setSlug(site.slug);
        setPersonName(site.personName);
        setPersonNickname(site.personNickname || '');
        setPersonAge(site.personAge || 24);
        setBirthdayDate(site.birthdayDate);
        setRelationship(site.relationship);
        setFavColor(site.favColor || '#8b5cf6');
        setFavSong(site.favSong || '');
        setFavFood(site.favFood || '');
        setFavPlace(site.favPlace || '');
        setHobbyInput((site.hobbies || []).join(', '));
        setPersonality(site.personality || '');
        setCustomInfo(site.customInfo || '');
        setBirthdayMessage(site.birthdayMessage);
        setPhotos(site.photos || []);
        setSelectedMusicTrack(site.music || DEFAULT_MUSIC_TRACKS[0]);
        setSelectedTemplateId(site.templateId);
        setSelectedPlanId(site.planId);
      }
    }
  }, [existingId]);

  // Auto-slug generator
  useEffect(() => {
    if (!slug || slug.length < 3) {
      const sanitized = personName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setSlug(`${sanitized}-bday-${Math.floor(1000 + Math.random() * 9000)}`);
    }
  }, [personName, slug]);

  // Fetch music tracks from API
  useEffect(() => {
    const fetchMusicTracks = async () => {
      try {
        setIsLoadingMusic(true);
        const res = await fetch('/api/content/music');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            setMusicTracks(data.data);
            // Set default to first track if no track selected
            if (!selectedMusicTrack || selectedMusicTrack.id === DEFAULT_MUSIC_TRACKS[0].id) {
              setSelectedMusicTrack(data.data[0]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch music tracks:', error);
        // Keep using DEFAULT_MUSIC_TRACKS as fallback
      } finally {
        setIsLoadingMusic(false);
      }
    };

    fetchMusicTracks();
  }, []);

  // Fetch templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        const res = await fetch('/api/content/themes');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            setTemplates(data.data);
            // Set default to first template if no template selected
            if (!selectedTemplateId || selectedTemplateId === 'golden-memories') {
              setSelectedTemplateId(data.data[0].id as TemplateId);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error);
        // Keep using TEMPLATES as fallback
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleGenerateAIMessage = () => {
    setIsGeneratingAI(true);
    setTimeout(async () => {
      const generated = await generateAIBirthdayWish({
        personName,
        personNickname,
        relationship,
        age: personAge,
        hobbies: hobbyInput.split(',').map(s => s.trim()).filter(Boolean),
        favPlace,
        favFood,
        style: aiStyle
      });
      setBirthdayMessage(generated);
      setIsGeneratingAI(false);
    }, 600);
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl) return;
    const newP: PhotoMemory = {
      id: `photo-${Date.now()}`,
      url: newPhotoUrl,
      caption: newPhotoCaption || 'Birthday memory 💖',
      date: new Date().toISOString().split('T')[0]
    };
    setPhotos(prev => [...prev, newP]);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  const constructWebsiteObject = (): BirthdayWebsite => {
    return {
      id: websiteId,
      slug: slug || `${personName.toLowerCase()}-surprise`,
      userId: user ? user.id : 'user-demo-1',
      creatorName: user ? user.name : 'Aarav',
      personName,
      personNickname,
      personAge,
      birthdayDate,
      relationship,
      favColor,
      favSong,
      favFood,
      favPlace,
      hobbies: hobbyInput.split(',').map(s => s.trim()).filter(Boolean),
      personality,
      customInfo,
      birthdayMessage,
      photos,
      music: selectedMusicTrack,
      templateId: selectedTemplateId,
      customizations,
      planId: selectedPlanId,
      paymentStatus: 'paid',
      views: 0,
      createdAt: new Date().toISOString().split('T')[0],
      expiresAt: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0]
    };
  };

  const handlePublishDirectly = async () => {
    const currentUsage = getDailyUsageInfo();
    setDailyUsage(currentUsage);
    const siteObj = constructWebsiteObject();

    // Persist to Supabase backend API (non-blocking / resilient)
    fetch('/api/websites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(siteObj),
    }).catch((err) => console.error('Failed to sync website to API:', err));

    if (currentUsage.isLimitReached) {
      // Free limit of 3 reached today -> Require paid plan!
      saveWebsite(siteObj);
      setShowPaymentModal(true);
    } else {
      // Under 3 free uses today -> Publish directly
      const saved = publishWebsiteDirectly(siteObj);
      setDailyUsage(getDailyUsageInfo());
      router.push(`/birthday/${saved.slug}`);
    }
  };

  const activeTemplateDef = TEMPLATES.find(t => t.id === selectedTemplateId) || TEMPLATES[0];

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Birthday Website Generator</span>
            {dailyUsage.isLimitReached ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 border" style={{
                backgroundColor: 'var(--accent-premium)/20',
                borderColor: 'var(--accent-premium)/40',
                color: 'var(--accent-premium)'
              }}>
                ⚠️ Daily Limit Reached (3/3 Free Used)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 border" style={{
                backgroundColor: 'var(--accent-primary)/20',
                borderColor: 'var(--accent-primary)/40',
                color: 'var(--accent-primary)'
              }}>
                🔥 {dailyUsage.count}/3 Daily Free Uses
              </span>
            )}
          </div>
          <h1 className="font-cormorant text-2xl sm:text-3xl font-bold mt-1" style={{ color: 'var(--text-heading)' }}>Create Birthday Website 🎁</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border cursor-pointer"
            style={{
              backgroundColor: showPreview ? 'var(--accent-primary)' : 'var(--bg-card)',
              color: showPreview ? 'var(--bg-card)' : 'var(--text-heading)',
              borderColor: 'var(--border-subtle)'
            }}
          >
            <Eye className="w-4 h-4" /> {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
          
          {dailyUsage.isLimitReached ? (
            <button
              onClick={handlePublishDirectly}
              className="px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              style={{
                background: 'linear-gradient(to right, var(--accent-premium), var(--accent-cta))',
                color: 'var(--bg-card)'
              }}
            >
              <Rocket className="w-4 h-4" /> Upgrade & Publish (3/3 Used) 💳
            </button>
          ) : (
            <button
              onClick={handlePublishDirectly}
              className="px-6 py-2.5 rounded-xl font-extrabold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <Rocket className="w-4 h-4" /> Publish Free ({3 - dailyUsage.count} Left Today) 🚀
            </button>
          )}
        </div>
      </div>

      {/* Split Screen Layout */}
      <div className={`flex gap-6 ${showPreview ? 'flex-col lg:flex-row' : ''}`}>
        
        {/* Builder Form */}
        <div className={`${showPreview ? 'lg:w-1/2' : 'w-full'} space-y-8`}>

      {/* Step Stepper Navigation */}
      <div className="grid grid-cols-6 gap-2 p-2 rounded-2xl text-center text-xs font-bold shadow-sm border" style={{
        backgroundColor: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)'
      }}>
        {[
          { num: 1, label: 'Person', icon: UserIcon },
          { num: 2, label: 'Message', icon: Heart },
          { num: 3, label: 'Photos', icon: Camera },
          { num: 4, label: 'Music', icon: Music },
          { num: 5, label: 'Template', icon: Palette },
          { num: 6, label: 'Preview', icon: Eye }
        ].map((item) => {
          const Icon = item.icon;
          const isActive = step === item.num;
          const isDone = step > item.num;

          return (
            <button
              key={item.num}
              onClick={() => setStep(item.num)}
              className="py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? 'var(--accent-primary)' : isDone ? 'var(--accent-primary)/20' : 'transparent',
                color: isActive ? 'var(--bg-card)' : isDone ? 'var(--accent-primary)' : 'var(--text-muted)'
              }}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: BIRTHDAY PERSON INFORMATION */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Step 1 — Birthday Person Details 👤</h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Fill in details to personalize the birthday website experience.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Birthday Person Name *</label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Nickname (Optional)</label>
              <input
                type="text"
                value={personNickname}
                onChange={(e) => setPersonNickname(e.target.value)}
                placeholder="e.g. Rohu, Anu, Champ"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Turning Age</label>
              <input
                type="number"
                value={personAge}
                onChange={(e) => setPersonAge(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Birthday Date</label>
              <input
                type="date"
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Your Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              >
                <option>Partner / Lover</option>
                <option>Best Friend</option>
                <option>Sister</option>
                <option>Brother</option>
                <option>Mom / Mother</option>
                <option>Dad / Father</option>
                <option>Friend / Colleague</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Favorite Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={favColor}
                  onChange={(e) => setFavColor(e.target.value)}
                  className="w-12 h-10 rounded-xl cursor-pointer border"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)'
                  }}
                />
                <input
                  type="text"
                  value={favColor}
                  onChange={(e) => setFavColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm font-mono focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-heading)'
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Favorite Song</label>
              <input
                type="text"
                value={favSong}
                onChange={(e) => setFavSong(e.target.value)}
                placeholder="e.g. Perfect by Ed Sheeran"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Favorite Food / Treat</label>
              <input
                type="text"
                value={favFood}
                onChange={(e) => setFavFood(e.target.value)}
                placeholder="e.g. Red Velvet Cake & Pizza"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Hobbies & Passions (Comma separated)</label>
              <input
                type="text"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                placeholder="e.g. Guitar, Photography, Road Trips"
                className="w-full px-4 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <span>Next: Write Message</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: PERSONAL MESSAGE & AI GENERATOR */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Step 2 — Personal Message ❤️</h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Write your own message or use AI to craft the perfect wish.</p>
            </div>

            {/* AI Generator Style Buttons */}
            <div className="p-3 rounded-2xl space-y-3 border" style={{
              backgroundColor: 'var(--bg-secondary)',
              borderColor: 'var(--border-subtle)'
            }}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                  <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} /> AI Message Generator
                </span>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value as AIStyle)}
                  className="px-2 py-1 rounded-lg text-xs focus:outline-none"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-heading)'
                  }}
                >
                  <option value="emotional">Emotional ❤️</option>
                  <option value="funny">Funny 😂</option>
                  <option value="romantic">Romantic 🌹</option>
                  <option value="friendship">Friendship 🥂</option>
                  <option value="family">Family 👨‍👩‍👧‍👦</option>
                  <option value="cute">Cute 🧸</option>
                  <option value="inspirational">Inspirational 🚀</option>
                  <option value="short">Short ✨</option>
                </select>
              </div>

              <button
                onClick={handleGenerateAIMessage}
                disabled={isGeneratingAI}
                className="w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-primary)',
                  color: '#FFFFFF'
                }}
              >
                <Wand2 className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                {isGeneratingAI ? 'Generating AI Wish...' : 'Generate with AI ✨'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-heading)' }}>Birthday Message Text</label>
            <textarea
              rows={8}
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full p-4 rounded-2xl text-sm focus:outline-none leading-relaxed font-sans"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <span>Next: Add Photos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTOS & MEMORIES */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div>
            <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Step 3 — Photos & Memories 📸</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Upload photos with memory captions to create photo galleries & polaroid sliders.</p>
          </div>

          {/* Add Photo Input */}
          <div className="p-4 rounded-2xl space-y-4 border" style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-subtle)'
          }}>
            <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent-primary)' }}>Add Photo by Image URL</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Image URL (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
              <input
                type="text"
                placeholder="Caption memory note..."
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs focus:outline-none"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-heading)'
                }}
              />
            </div>

            <button
              onClick={handleAddPhoto}
              className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {photos.map((p) => (
              <div key={p.id} className="relative rounded-2xl overflow-hidden group p-3 space-y-2 shadow-sm border" style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)'
              }}>
                <div className="relative h-40 w-full rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--bg-secondary)' }}>
                  <Image src={p.url} alt={p.caption} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                    style={{
                      backgroundColor: 'var(--accent-cta)',
                      color: 'var(--bg-card)'
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-heading)' }}>{p.caption}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <span>Next: Select Music</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MUSIC */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div>
            <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Step 4 — Background Music 🎵</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Select copyright-safe birthday music or upload a custom audio track.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoadingMusic ? (
              <div className="col-span-2 text-center py-8" style={{ color: 'var(--text-muted)' }}>
                Loading music tracks...
              </div>
            ) : (
              musicTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => setSelectedMusicTrack(track)}
                className="p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all"
                style={{
                  backgroundColor: selectedMusicTrack.id === track.id ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  borderColor: selectedMusicTrack.id === track.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  color: selectedMusicTrack.id === track.id ? 'var(--text-heading)' : 'var(--text-muted)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    backgroundColor: 'var(--accent-primary)/20',
                    color: 'var(--accent-primary)'
                  }}>
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-heading)' }}>{track.title}</h4>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{track.artist}</p>
                  </div>
                </div>
                {selectedMusicTrack.id === track.id && (
                  <Check className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                )}
              </div>
              ))
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <span>Next: Pick Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: TEMPLATES & CUSTOMIZATION */}
      {step === 5 && (
        <div className="p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div>
            <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Step 5 — Select & Customize Template 🎨</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Pick from 8 visual themes and customize colors & typography.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {isLoadingTemplates ? (
              <div className="col-span-4 text-center py-8" style={{ color: 'var(--text-muted)' }}>
                Loading templates...
              </div>
            ) : (
              templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className="p-3 rounded-2xl border cursor-pointer space-y-2 transition-all"
                style={{
                  backgroundColor: selectedTemplateId === tpl.id ? 'var(--bg-secondary)' : 'var(--bg-card)',
                  borderColor: selectedTemplateId === tpl.id ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  boxShadow: selectedTemplateId === tpl.id ? '0 0 0 2px var(--accent-primary)/30' : 'none'
                }}
              >
                <div className="relative h-24 w-full rounded-xl overflow-hidden">
                  <Image src={tpl.previewImage} alt={tpl.name} fill sizes="25vw" className="object-cover opacity-70" />
                </div>
                <h4 className="font-bold text-xs text-center" style={{ color: 'var(--text-heading)' }}>{tpl.name}</h4>
              </div>
              ))
            )}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <span>Next: Preview & Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PREVIEW & PUBLISH */}
      {step === 6 && (
        <div className="p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 border" style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)'
        }}>
          <div>
            <h2 className="font-cormorant text-xl font-bold" style={{ color: 'var(--text-heading)' }}>Step 6 — Preview & Publish 🚀</h2>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Review your birthday website and publish it live.</p>
          </div>

          {/* Free Unlocked / Daily Usage Banner */}
          {dailyUsage.isLimitReached ? (
            <div className="p-5 rounded-2xl text-center space-y-2 border" style={{
              backgroundColor: 'var(--accent-premium)/20',
              borderColor: 'var(--accent-premium)/40'
            }}>
              <span className="px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider" style={{
                backgroundColor: 'var(--accent-premium)',
                color: 'var(--bg-card)'
              }}>
                Daily Free Limit Reached (3/3 Used Today)
              </span>
              <p className="text-xs font-semibold" style={{ color: 'var(--accent-premium)' }}>
                You have used your 3 free website creations for today. Next creations require a paid plan starting at ₹99.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl text-center space-y-2 border" style={{
              backgroundColor: 'var(--accent-primary)/20',
              borderColor: 'var(--accent-primary)/40'
            }}>
              <span className="px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider" style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'var(--bg-card)'
              }}>
                {3 - dailyUsage.count} Free Creation{3 - dailyUsage.count === 1 ? '' : 's'} Remaining Today
              </span>
              <p className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                You get 3 free creations every single day! All features included: Unlimited Photos, AI Message Writer, Background Music, Fireworks & Custom Link.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 border cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-heading)'
              }}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handlePublishDirectly}
              className="px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#FFFFFF'
              }}
            >
              <Rocket className="w-4 h-4" /> Publish Website Free
            </button>
          </div>
        </div>
      )}

      {/* Razorpay Checkout Modal when Daily Free Limit is Reached */}
      {showPaymentModal && (
        <RazorpayModal
          plan={PLANS.find(p => p.id === selectedPlanId) || PLANS[1]}
          website={constructWebsiteObject()}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(_orderId, slug) => {
            setShowPaymentModal(false);
            router.push(`/birthday/${slug}`);
          }}
        />
      )}

        </div>

        {/* Live Preview Panel */}
        {showPreview && (
          <div className="lg:w-1/2">
            <div className="sticky top-4">
              <div className="p-4 rounded-2xl shadow-sm mb-4 flex items-center justify-between border" style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-subtle)'
              }}>
                <span className="text-xs font-bold" style={{ color: 'var(--text-heading)' }}>Live Preview</span>
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Updates in real-time</span>
              </div>
              <div className="rounded-3xl overflow-hidden border h-[calc(100vh-200px)]" style={{
                borderColor: 'var(--border-subtle)'
              }}>
                <BuilderPreview website={{
                  personName,
                  personNickname,
                  personAge,
                  birthdayDate,
                  relationship,
                  birthdayMessage,
                  photos,
                  music: selectedMusicTrack,
                  templateId: selectedTemplateId,
                  customizations,
                  creatorName: user?.name || 'Someone'
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white text-sm font-semibold">
        Loading Builder...
      </div>
    }>
      <BuilderContent />
    </Suspense>
  );
}
