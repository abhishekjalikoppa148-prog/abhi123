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
  const [selectedMusicTrack, setSelectedMusicTrack] = useState(DEFAULT_MUSIC_TRACKS[0]);

  // Step 5: Templates & Customizations
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>(initialTemplateParam || 'bestfriend');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200 dark:border-[#27272A] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Birthday Website Generator</span>
            {dailyUsage.isLimitReached ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-700 text-[11px] font-extrabold flex items-center gap-1">
                ⚠️ Daily Limit Reached (3/3 Free Used)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-300 text-blue-700 text-[11px] font-extrabold flex items-center gap-1">
                🔥 {dailyUsage.count}/3 Daily Free Uses
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">Create Birthday Website 🎁</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              showPreview 
                ? 'bg-blue-500 text-white' 
                : 'bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/10'
            }`}
          >
            <Eye className="w-4 h-4" /> {showPreview ? 'Hide Preview' : 'Live Preview'}
          </button>
          
          {dailyUsage.isLimitReached ? (
            <button
              onClick={handlePublishDirectly}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-1.5 cursor-pointer"
            >
              <Rocket className="w-4 h-4" /> Upgrade & Publish (3/3 Used) 💳
            </button>
          ) : (
            <button
              onClick={handlePublishDirectly}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 cursor-pointer"
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
      <div className="grid grid-cols-6 gap-2 bg-white dark:bg-[#12121A] p-2 rounded-2xl border border-blue-200 dark:border-[#27272A] text-center text-xs font-bold shadow-sm dark:shadow-blue-500/10">
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
              className={`py-2.5 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all ${isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : isDone ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* STEP 1: BIRTHDAY PERSON INFORMATION */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 1 — Birthday Person Details 👤</h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">Fill in details to personalize the birthday website experience.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Birthday Person Name *</label>
              <input
                type="text"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Nickname (Optional)</label>
              <input
                type="text"
                value={personNickname}
                onChange={(e) => setPersonNickname(e.target.value)}
                placeholder="e.g. Rohu, Anu, Champ"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Turning Age</label>
              <input
                type="number"
                value={personAge}
                onChange={(e) => setPersonAge(parseInt(e.target.value) || 1)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Birthday Date</label>
              <input
                type="date"
                value={birthdayDate}
                onChange={(e) => setBirthdayDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Your Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Favorite Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={favColor}
                  onChange={(e) => setFavColor(e.target.value)}
                  className="w-12 h-10 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] cursor-pointer"
                />
                <input
                  type="text"
                  value={favColor}
                  onChange={(e) => setFavColor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm font-mono focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Favorite Song</label>
              <input
                type="text"
                value={favSong}
                onChange={(e) => setFavSong(e.target.value)}
                placeholder="e.g. Perfect by Ed Sheeran"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Favorite Food / Treat</label>
              <input
                type="text"
                value={favFood}
                onChange={(e) => setFavFood(e.target.value)}
                placeholder="e.g. Red Velvet Cake & Pizza"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Hobbies & Passions (Comma separated)</label>
              <input
                type="text"
                value={hobbyInput}
                onChange={(e) => setHobbyInput(e.target.value)}
                placeholder="e.g. Guitar, Photography, Road Trips"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 dark:shadow-blue-500/40"
            >
              <span>Next: Write Message</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: PERSONAL MESSAGE & AI GENERATOR */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 2 — Personal Message ❤️</h2>
              <p className="text-xs text-slate-600 dark:text-slate-400">Write your own message or use AI to craft the perfect wish.</p>
            </div>

            {/* AI Generator Style Buttons */}
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" /> AI Message Generator
                </span>
                <select
                  value={aiStyle}
                  onChange={(e) => setAiStyle(e.target.value as AIStyle)}
                  className="px-2 py-1 rounded-lg bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-700 dark:text-slate-200 text-xs focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
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
                className="w-full py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-blue-500/25"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                {isGeneratingAI ? 'Generating AI Wish...' : 'Generate with AI ✨'}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Birthday Message Text</label>
            <textarea
              rows={8}
              value={birthdayMessage}
              onChange={(e) => setBirthdayMessage(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-900 dark:text-white text-sm focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none leading-relaxed font-sans"
            />
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 dark:shadow-blue-500/40"
            >
              <span>Next: Add Photos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PHOTOS & MEMORIES */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 3 — Photos & Memories 📸</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Upload photos with memory captions to create photo galleries & polaroid sliders.</p>
          </div>

          {/* Add Photo Input */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 space-y-4">
            <h3 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Add Photo by Image URL</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Image URL (https://...)"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-700 dark:text-slate-200 text-xs focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Caption memory note..."
                value={newPhotoCaption}
                onChange={(e) => setNewPhotoCaption(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] text-slate-700 dark:text-slate-200 text-xs focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-500/20 focus:outline-none"
              />
            </div>

            <button
              onClick={handleAddPhoto}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-500/25"
            >
              <Plus className="w-4 h-4" /> Add Photo
            </button>
          </div>

          {/* Photos Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {photos.map((p) => (
              <div key={p.id} className="relative rounded-2xl overflow-hidden bg-white dark:bg-[#1A1A24] border border-blue-200 dark:border-[#27272A] group p-3 space-y-2 shadow-sm dark:shadow-blue-500/10">
                <div className="relative h-40 w-full rounded-xl overflow-hidden bg-blue-50 dark:bg-blue-500/10">
                  <Image src={p.url} alt={p.caption} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <button
                    onClick={() => handleRemovePhoto(p.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-xs text-slate-900 dark:text-white font-semibold truncate">{p.caption}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 dark:shadow-blue-500/40"
            >
              <span>Next: Select Music</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: MUSIC */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 4 — Background Music 🎵</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Select copyright-safe birthday music or upload a custom audio track.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DEFAULT_MUSIC_TRACKS.map((track) => (
              <div
                key={track.id}
                onClick={() => setSelectedMusicTrack(track)}
                className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${selectedMusicTrack.id === track.id ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 text-slate-900 dark:text-white' : 'bg-white dark:bg-[#1A1A24] border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-400'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-500 dark:text-blue-400">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{track.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{track.artist}</p>
                  </div>
                </div>
                {selectedMusicTrack.id === track.id && (
                  <Check className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 dark:shadow-blue-500/40"
            >
              <span>Next: Pick Template</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: TEMPLATES & CUSTOMIZATION */}
      {step === 5 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 5 — Select & Customize Template 🎨</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Pick from 8 visual themes and customize colors & typography.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`p-3 rounded-2xl border cursor-pointer space-y-2 transition-all ${selectedTemplateId === tpl.id ? 'bg-blue-50 dark:bg-blue-500/20 border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/50 dark:ring-blue-500/30' : 'bg-white dark:bg-[#1A1A24] border-blue-200 dark:border-[#27272A] hover:border-blue-300 dark:hover:border-blue-400'}`}
              >
                <div className="relative h-24 w-full rounded-xl overflow-hidden">
                  <Image src={tpl.previewImage} alt={tpl.name} fill sizes="25vw" className="object-cover opacity-70" />
                </div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white text-center">{tpl.name}</h4>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={() => setStep(4)}
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={() => setStep(6)}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 dark:shadow-blue-500/40"
            >
              <span>Next: Preview & Publish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: PREVIEW & PUBLISH */}
      {step === 6 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Step 6 — Preview & Publish 🚀</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Review your birthday website and publish it live.</p>
          </div>

          {/* Free Unlocked / Daily Usage Banner */}
          {dailyUsage.isLimitReached ? (
            <div className="p-5 rounded-2xl bg-amber-100 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/40 text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 dark:text-white font-black text-xs uppercase tracking-wider">
                Daily Free Limit Reached (3/3 Used Today)
              </span>
              <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold">
                You have used your 3 free website creations for today. Next creations require a paid plan starting at ₹99.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-blue-100 dark:bg-blue-500/20 border border-blue-300 dark:border-blue-500/40 text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-blue-500 text-white font-black text-xs uppercase tracking-wider">
                {3 - dailyUsage.count} Free Creation{3 - dailyUsage.count === 1 ? '' : 's'} Remaining Today
              </span>
              <p className="text-xs text-blue-700 dark:text-blue-400 font-semibold">
                You get 3 free creations every single day! All features included: Unlimited Photos, AI Message Writer, Background Music, Fireworks & Custom Link.
              </p>
            </div>
          )}

          <div className="flex justify-between items-center pt-4">
            <button
              onClick={() => setStep(5)}
              className="px-6 py-3 rounded-xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-500/10"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handlePublishDirectly}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/40"
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
              <div className="p-4 rounded-2xl bg-white dark:bg-[#12121A] border border-blue-200 dark:border-[#27272A] shadow-sm dark:shadow-blue-500/10 mb-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Live Preview</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Updates in real-time</span>
              </div>
              <div className="rounded-3xl overflow-hidden border border-blue-200 dark:border-[#27272A] h-[calc(100vh-200px)]">
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
