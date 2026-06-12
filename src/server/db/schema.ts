import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// ─── Roles ───────────────────────────────────────────────────
export const roles = sqliteTable('DataReactProfile_Roles', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    jobTitle: text('job_title').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Header ──────────────────────────────────────────────────
export const header = sqliteTable('DataReactProfile_Header', {
    id: text('id').primaryKey(),
    name: text('name').notNull().default(''),
    titleEn: text('title_en').notNull().default(''),
    titleEs: text('title_es').notNull().default(''),
    titleFr: text('title_fr').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    email: text('email').notNull().default(''),
    phone: text('phone').notNull().default(''),
    github: text('github').notNull().default(''),
    linkedin: text('linkedin').notNull().default(''),
    website: text('website').notNull().default(''),
    aiPromptEnabled: integer('ai_prompt_enabled').notNull().default(0),
    aiPromptColor: text('ai_prompt_color').notNull().default('#ffffff'),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Education ───────────────────────────────────────────────
export const education = sqliteTable('DataReactProfile_Education', {
    id: text('id').primaryKey(),
    institutionEn: text('institution_en').notNull().default(''),
    institutionEs: text('institution_es').notNull().default(''),
    institutionFr: text('institution_fr').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    degreeEn: text('degree_en').notNull().default(''),
    degreeEs: text('degree_es').notNull().default(''),
    degreeFr: text('degree_fr').notNull().default(''),
    dateStart: text('date_start').notNull().default(''),
    dateEnd: text('date_end').notNull().default(''),
    gpa: text('gpa').notNull().default(''),
    courseworkEn: text('coursework_en').notNull().default(''),
    courseworkEs: text('coursework_es').notNull().default(''),
    courseworkFr: text('coursework_fr').notNull().default(''),
    honorsEn: text('honors_en').notNull().default(''),
    honorsEs: text('honors_es').notNull().default(''),
    honorsFr: text('honors_fr').notNull().default(''),
    satScores: text('sat_scores').notNull().default(''),
    projectsEn: text('projects_en').notNull().default(''),
    projectsEs: text('projects_es').notNull().default(''),
    projectsFr: text('projects_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Experience ──────────────────────────────────────────────
export const experience = sqliteTable('DataReactProfile_Experience', {
    id: text('id').primaryKey(),
    company: text('company').notNull().default(''),
    roleEn: text('role_en').notNull().default(''),
    roleEs: text('role_es').notNull().default(''),
    roleFr: text('role_fr').notNull().default(''),
    dateStart: text('date_start').notNull().default(''),
    dateEnd: text('date_end').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    descriptionEn: text('description_en').notNull().default(''),
    descriptionEs: text('description_es').notNull().default(''),
    descriptionFr: text('description_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Projects (can be nested under Experience) ───────────────
export const projects = sqliteTable('DataReactProfile_Projects', {
    id: text('id').primaryKey(),
    experienceId: text('experience_id'),  // NULL = standalone, UUID = nested under experience
    nameEn: text('name_en').notNull().default(''),
    nameEs: text('name_es').notNull().default(''),
    nameFr: text('name_fr').notNull().default(''),
    roleEn: text('role_en').notNull().default(''),
    roleEs: text('role_es').notNull().default(''),
    roleFr: text('role_fr').notNull().default(''),
    dateStart: text('date_start').notNull().default(''),
    dateEnd: text('date_end').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    link: text('link').notNull().default(''),
    descriptionEn: text('description_en').notNull().default(''),
    descriptionEs: text('description_es').notNull().default(''),
    descriptionFr: text('description_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Skills ──────────────────────────────────────────────────
export const skills = sqliteTable('DataReactProfile_Skills', {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull().default(''),
    nameEs: text('name_es').notNull().default(''),
    nameFr: text('name_fr').notNull().default(''),
    category: text('category').notNull().default('programming'), // programming | design | tools
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Leadership ──────────────────────────────────────────────
export const leadership = sqliteTable('DataReactProfile_Leadership', {
    id: text('id').primaryKey(),
    organizationEn: text('organization_en').notNull().default(''),
    organizationEs: text('organization_es').notNull().default(''),
    organizationFr: text('organization_fr').notNull().default(''),
    roleEn: text('role_en').notNull().default(''),
    roleEs: text('role_es').notNull().default(''),
    roleFr: text('role_fr').notNull().default(''),
    dateStart: text('date_start').notNull().default(''),
    dateEnd: text('date_end').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    descriptionEn: text('description_en').notNull().default(''),
    descriptionEs: text('description_es').notNull().default(''),
    descriptionFr: text('description_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Certificates ────────────────────────────────────────────
export const certificates = sqliteTable('DataReactProfile_Certificates', {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull().default(''),
    nameEs: text('name_es').notNull().default(''),
    nameFr: text('name_fr').notNull().default(''),
    issuerEn: text('issuer_en').notNull().default(''),
    issuerEs: text('issuer_es').notNull().default(''),
    issuerFr: text('issuer_fr').notNull().default(''),
    date: text('date').notNull().default(''),
    descriptionEn: text('description_en').notNull().default(''),
    descriptionEs: text('description_es').notNull().default(''),
    descriptionFr: text('description_fr').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Languages (NEW) ─────────────────────────────────────────
export const languages = sqliteTable('DataReactProfile_Languages', {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull().default(''),
    nameEs: text('name_es').notNull().default(''),
    nameFr: text('name_fr').notNull().default(''),
    level: text('level').notNull().default('B1'), // A1 | A2 | B1 | B2 | C1 | C2 | Native
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Awards (NEW) ───────────────────────────────────────────
export const awards = sqliteTable('DataReactProfile_Awards', {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull().default(''),
    nameEs: text('name_es').notNull().default(''),
    nameFr: text('name_fr').notNull().default(''),
    issuerEn: text('issuer_en').notNull().default(''),
    issuerEs: text('issuer_es').notNull().default(''),
    issuerFr: text('issuer_fr').notNull().default(''),
    date: text('date').notNull().default(''),
    descriptionEn: text('description_en').notNull().default(''),
    descriptionEs: text('description_es').notNull().default(''),
    descriptionFr: text('description_fr').notNull().default(''),
    locationEn: text('location_en').notNull().default(''),
    locationEs: text('location_es').notNull().default(''),
    locationFr: text('location_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Section Order ───────────────────────────────────────────
export const sectionOrder = sqliteTable('DataReactProfile_SectionOrder', {
    id: text('id').primaryKey(),
    sectionKey: text('section_key').notNull().unique(),
    sortOrder: integer('sort_order').notNull().default(0),
    visible: integer('visible').notNull().default(1),
    updatedAt: text('updated_at').notNull().default(''),
});

// ─── Hobbies (NEW) ───────────────────────────────────────────
export const hobbies = sqliteTable('DataReactProfile_Hobbies', {
    id: text('id').primaryKey(),
    nameEn: text('name_en').notNull().default(''),
    nameEs: text('name_es').notNull().default(''),
    nameFr: text('name_fr').notNull().default(''),
    descriptionEn: text('description_en').notNull().default(''),
    descriptionEs: text('description_es').notNull().default(''),
    descriptionFr: text('description_fr').notNull().default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    roleIds: text('role_ids').notNull().default('all'),
    createdAt: text('created_at').notNull().default(''),
    updatedAt: text('updated_at').notNull().default(''),
});

