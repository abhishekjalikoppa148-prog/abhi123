import { TemplateId } from './types';

export type RelationshipType = 'partner' | 'bestfriend' | 'family' | 'classmate' | 'colleague' | 'other';

export interface RelationshipOption {
  id: RelationshipType;
  label: string;
  emoji: string;
  recommendedTemplates: TemplateId[];
}

export const RELATIONSHIP_OPTIONS: RelationshipOption[] = [
  {
    id: 'partner',
    label: 'Partner',
    emoji: '❤️',
    recommendedTemplates: ['rose-garden', 'pearl-sunset', 'black-gold']
  },
  {
    id: 'bestfriend',
    label: 'Best Friend',
    emoji: '🫶',
    recommendedTemplates: ['dreamy-pastel', 'royal-blue', 'minimal-love']
  },
  {
    id: 'family',
    label: 'Family',
    emoji: '👨‍👩‍👧',
    recommendedTemplates: ['golden-memories', 'dreamy-pastel', 'minimal-love']
  },
  {
    id: 'classmate',
    label: 'Classmate',
    emoji: '🎓',
    recommendedTemplates: ['dreamy-pastel', 'royal-blue', 'minimal-love']
  },
  {
    id: 'colleague',
    label: 'Colleague',
    emoji: '💼',
    recommendedTemplates: ['black-gold', 'minimal-love', 'royal-blue']
  },
  {
    id: 'other',
    label: 'Other',
    emoji: '🎂',
    recommendedTemplates: ['royal-blue', 'dreamy-pastel', 'minimal-love']
  }
];

export function getRecommendedTemplates(relationship: RelationshipType): TemplateId[] {
  const option = RELATIONSHIP_OPTIONS.find(opt => opt.id === relationship);
  return option?.recommendedTemplates || ['minimal-love', 'rose-garden', 'golden-memories'];
}

export function getRelationshipLabel(relationship: RelationshipType): string {
  const option = RELATIONSHIP_OPTIONS.find(opt => opt.id === relationship);
  return option?.label || 'Other';
}
