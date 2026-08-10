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
    recommendedTemplates: ['romantic', 'pink-gold', 'elegant']
  },
  {
    id: 'bestfriend',
    label: 'Best Friend',
    emoji: '🫶',
    recommendedTemplates: ['bestfriend', 'party', 'modern']
  },
  {
    id: 'family',
    label: 'Family',
    emoji: '👨‍👩‍👧',
    recommendedTemplates: ['family', 'cute', 'minimal']
  },
  {
    id: 'classmate',
    label: 'Classmate',
    emoji: '🎓',
    recommendedTemplates: ['bestfriend', 'party', 'modern']
  },
  {
    id: 'colleague',
    label: 'Colleague',
    emoji: '💼',
    recommendedTemplates: ['elegant', 'minimal', 'modern']
  },
  {
    id: 'other',
    label: 'Other',
    emoji: '🎂',
    recommendedTemplates: ['party', 'cute', 'bestfriend']
  }
];

export function getRecommendedTemplates(relationship: RelationshipType): TemplateId[] {
  const option = RELATIONSHIP_OPTIONS.find(opt => opt.id === relationship);
  return option?.recommendedTemplates || ['bestfriend', 'romantic', 'family'];
}

export function getRelationshipLabel(relationship: RelationshipType): string {
  const option = RELATIONSHIP_OPTIONS.find(opt => opt.id === relationship);
  return option?.label || 'Other';
}
