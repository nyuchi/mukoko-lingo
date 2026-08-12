/**
 * The five core proficiency skills.
 *
 * This is the source of truth for `lingo.skills`, seeded via
 * `scripts/seed-skills.ts`. The collection has been empty since the
 * MongoDB migration, so `/api/skills` returned `[]` and nothing could hang
 * a proficiency off a real skill row.
 *
 * `_id`s are stable UUID strings, matching the id convention every other
 * `lingo` collection uses (phrases, scenarios, learningStandards) — never
 * ObjectIds. Re-seeding is therefore idempotent by `_id`.
 *
 * Level thresholds mirror `scoreToLevel()` in lib/ai/skills-aware-prompts.ts
 * exactly; the two must not drift, or the AI tutor and the skills API will
 * disagree about what level a score means.
 */

import type { ProficiencyLevel, SkillName } from '../types/skills'

/** UI language tags used across the app (see lib/data/translations.ts). */
export type SkillTextByLanguage = {
  en: string
  sn: string
  nd: string
  sw: string
  zh: string
}

export interface SeedSkillLevel {
  level: ProficiencyLevel
  name: string
  min_score: number
  sort_order: number
}

export interface SeedSkill {
  _id: string
  name: SkillName
  display_name: SkillTextByLanguage
  description: SkillTextByLanguage
  icon: string
  sort_order: number
  is_active: boolean
  levels: SeedSkillLevel[]
}

/**
 * Shared across all five skills — the ladder is a property of proficiency,
 * not of the individual skill. Thresholds are the inclusive lower bound of
 * each band: 0-49, 50-64, 65-79, 80-89, 90-100.
 */
export const SKILL_LEVELS: SeedSkillLevel[] = [
  { level: 'beginner', name: 'Beginner', min_score: 0, sort_order: 1 },
  { level: 'elementary', name: 'Elementary', min_score: 50, sort_order: 2 },
  { level: 'intermediate', name: 'Intermediate', min_score: 65, sort_order: 3 },
  { level: 'advanced', name: 'Advanced', min_score: 80, sort_order: 4 },
  { level: 'fluent', name: 'Fluent', min_score: 90, sort_order: 5 },
]

export const skills: SeedSkill[] = [
  {
    _id: '01977100-0f30-7000-8000-000000000001',
    name: 'pronunciation',
    display_name: {
      en: 'Pronunciation',
      sn: 'Madudziro',
      nd: 'Ukubiza',
      sw: 'Matamshi',
      zh: '发音',
    },
    description: {
      en: 'Sound production, tone, and rhythm.',
      sn: 'Kududzira mazwi, mataurirwo nemagwaro.',
      nd: 'Ukukhuluma amagama ngendlela efaneleyo lokugcizelela.',
      sw: 'Utamkaji wa sauti, toni na mdundo.',
      zh: '发音、声调与节奏。',
    },
    icon: '🗣️',
    sort_order: 1,
    is_active: true,
    levels: SKILL_LEVELS,
  },
  {
    _id: '01977100-0f30-7000-8000-000000000002',
    name: 'vocabulary',
    display_name: {
      en: 'Vocabulary',
      sn: 'Mazwi',
      nd: 'Amagama',
      sw: 'Msamiati',
      zh: '词汇',
    },
    description: {
      en: 'Word knowledge and using words in context.',
      sn: 'Kuziva mazwi nekushandisa mazwi nenzvimbo yawo.',
      nd: 'Ukwazi amagama lokuwasebenzisa ngendlela efaneleyo.',
      sw: 'Kujua maneno na kuyatumia kulingana na muktadha.',
      zh: '词语知识与在语境中的运用。',
    },
    icon: '📚',
    sort_order: 2,
    is_active: true,
    levels: SKILL_LEVELS,
  },
  {
    _id: '01977100-0f30-7000-8000-000000000003',
    name: 'grammar',
    display_name: {
      en: 'Grammar',
      sn: 'Girama',
      nd: 'Uhlelo lolimi',
      sw: 'Sarufi',
      zh: '语法',
    },
    description: {
      en: 'Sentence structure, verb forms, and particles.',
      sn: 'Kuvakwa kwemitsara, zviito nezvimwe zvikamu zvemutauro.',
      nd: 'Ukwakhiwa kwemitsho lezenzo zolimi.',
      sw: 'Muundo wa sentensi, vitenzi na viambishi.',
      zh: '句子结构、动词形式与助词。',
    },
    icon: '📐',
    sort_order: 3,
    is_active: true,
    levels: SKILL_LEVELS,
  },
  {
    _id: '01977100-0f30-7000-8000-000000000004',
    name: 'comprehension',
    display_name: {
      en: 'Comprehension',
      sn: 'Kunzwisisa',
      nd: 'Ukuzwisisa',
      sw: 'Ufahamu',
      zh: '理解',
    },
    description: {
      en: 'Understanding what you hear and read.',
      sn: 'Kunzwisisa zvaunonzwa nezvaunoverenga.',
      nd: 'Ukuzwisisa lokho okuzwayo lokubalayo.',
      sw: 'Kuelewa unachosikia na unachosoma.',
      zh: '听力与阅读理解。',
    },
    icon: '👂',
    sort_order: 4,
    is_active: true,
    levels: SKILL_LEVELS,
  },
  {
    _id: '01977100-0f30-7000-8000-000000000005',
    name: 'conversation',
    display_name: {
      en: 'Conversation',
      sn: 'Nhaurirano',
      nd: 'Ingxoxo',
      sw: 'Mazungumzo',
      zh: '会话',
    },
    description: {
      en: 'Real-time dialogue and cultural context.',
      sn: 'Kutaurirana nevanhu uye tsika dzemutauro.',
      nd: 'Ukuxoxa labantu lokwazi amasiko olimi.',
      sw: 'Mazungumzo ya papo kwa papo na muktadha wa kitamaduni.',
      zh: '实时对话与文化语境。',
    },
    icon: '💬',
    sort_order: 5,
    is_active: true,
    levels: SKILL_LEVELS,
  },
]
