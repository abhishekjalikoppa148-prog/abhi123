'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PinkGoldTheme from '@/components/templates/PinkGoldTheme';

function PinkGoldContent() {
  const searchParams = useSearchParams();
  
  const name = searchParams.get('name') || searchParams.get('personName') || 'Sophia';
  const nickname = searchParams.get('nickname') || searchParams.get('personNickname') || 'Sophi';
  const age = parseInt(searchParams.get('age') || searchParams.get('personAge') || '24');
  const relationship = searchParams.get('relationship') || 'Best Friend';
  const creator = searchParams.get('creator') || searchParams.get('creatorName') || 'Aarav';
  const message = searchParams.get('message') || undefined;

  return (
    <PinkGoldTheme
      personName={name}
      personNickname={nickname}
      personAge={age}
      relationship={relationship}
      creatorName={creator}
      customMessage={message}
    />
  );
}

export default function PinkGoldBirthdayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6 text-[#2D1B36] font-bold text-base">
        Loading Pink & Gold Birthday Surprise... 🎂✨
      </div>
    }>
      <PinkGoldContent />
    </Suspense>
  );
}
