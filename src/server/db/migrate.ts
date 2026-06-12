/**
 * SQL migration for DataReactProfile D1 database.
 * Uses CREATE TABLE IF NOT EXISTS — safe to run repeatedly.
 * Never drops existing data.
 */

export const MIGRATION_SQL = `
-- Roles
CREATE TABLE IF NOT EXISTS DataReactProfile_Roles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    job_title TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Hobbies (NEW)
CREATE TABLE IF NOT EXISTS DataReactProfile_Hobbies (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL DEFAULT '',
    name_es TEXT NOT NULL DEFAULT '',
    name_fr TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Header
CREATE TABLE IF NOT EXISTS DataReactProfile_Header (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    title_en TEXT NOT NULL DEFAULT '',
    title_es TEXT NOT NULL DEFAULT '',
    title_fr TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    github TEXT NOT NULL DEFAULT '',
    linkedin TEXT NOT NULL DEFAULT '',
    website TEXT NOT NULL DEFAULT '',
    ai_prompt_enabled INTEGER NOT NULL DEFAULT 0,
    ai_prompt_color TEXT NOT NULL DEFAULT '#ffffff',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Education
CREATE TABLE IF NOT EXISTS DataReactProfile_Education (
    id TEXT PRIMARY KEY,
    institution_en TEXT NOT NULL DEFAULT '',
    institution_es TEXT NOT NULL DEFAULT '',
    institution_fr TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    degree_en TEXT NOT NULL DEFAULT '',
    degree_es TEXT NOT NULL DEFAULT '',
    degree_fr TEXT NOT NULL DEFAULT '',
    date_start TEXT NOT NULL DEFAULT '',
    date_end TEXT NOT NULL DEFAULT '',
    gpa TEXT NOT NULL DEFAULT '',
    coursework_en TEXT NOT NULL DEFAULT '',
    coursework_es TEXT NOT NULL DEFAULT '',
    coursework_fr TEXT NOT NULL DEFAULT '',
    honors_en TEXT NOT NULL DEFAULT '',
    honors_es TEXT NOT NULL DEFAULT '',
    honors_fr TEXT NOT NULL DEFAULT '',
    sat_scores TEXT NOT NULL DEFAULT '',
    projects_en TEXT NOT NULL DEFAULT '',
    projects_es TEXT NOT NULL DEFAULT '',
    projects_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Experience
CREATE TABLE IF NOT EXISTS DataReactProfile_Experience (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL DEFAULT '',
    role_en TEXT NOT NULL DEFAULT '',
    role_es TEXT NOT NULL DEFAULT '',
    role_fr TEXT NOT NULL DEFAULT '',
    date_start TEXT NOT NULL DEFAULT '',
    date_end TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Projects (nested under experience or standalone)
CREATE TABLE IF NOT EXISTS DataReactProfile_Projects (
    id TEXT PRIMARY KEY,
    experience_id TEXT,
    name_en TEXT NOT NULL DEFAULT '',
    name_es TEXT NOT NULL DEFAULT '',
    name_fr TEXT NOT NULL DEFAULT '',
    role_en TEXT NOT NULL DEFAULT '',
    role_es TEXT NOT NULL DEFAULT '',
    role_fr TEXT NOT NULL DEFAULT '',
    date_start TEXT NOT NULL DEFAULT '',
    date_end TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    link TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Skills
CREATE TABLE IF NOT EXISTS DataReactProfile_Skills (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL DEFAULT '',
    name_es TEXT NOT NULL DEFAULT '',
    name_fr TEXT NOT NULL DEFAULT '',
    category TEXT NOT NULL DEFAULT 'programming',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Leadership
CREATE TABLE IF NOT EXISTS DataReactProfile_Leadership (
    id TEXT PRIMARY KEY,
    organization_en TEXT NOT NULL DEFAULT '',
    organization_es TEXT NOT NULL DEFAULT '',
    organization_fr TEXT NOT NULL DEFAULT '',
    role_en TEXT NOT NULL DEFAULT '',
    role_es TEXT NOT NULL DEFAULT '',
    role_fr TEXT NOT NULL DEFAULT '',
    date_start TEXT NOT NULL DEFAULT '',
    date_end TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Certificates
CREATE TABLE IF NOT EXISTS DataReactProfile_Certificates (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL DEFAULT '',
    name_es TEXT NOT NULL DEFAULT '',
    name_fr TEXT NOT NULL DEFAULT '',
    issuer_en TEXT NOT NULL DEFAULT '',
    issuer_es TEXT NOT NULL DEFAULT '',
    issuer_fr TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_fr TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Languages
CREATE TABLE IF NOT EXISTS DataReactProfile_Languages (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL DEFAULT '',
    name_es TEXT NOT NULL DEFAULT '',
    name_fr TEXT NOT NULL DEFAULT '',
    level TEXT NOT NULL DEFAULT 'B1',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Awards
CREATE TABLE IF NOT EXISTS DataReactProfile_Awards (
    id TEXT PRIMARY KEY,
    name_en TEXT NOT NULL DEFAULT '',
    name_es TEXT NOT NULL DEFAULT '',
    name_fr TEXT NOT NULL DEFAULT '',
    issuer_en TEXT NOT NULL DEFAULT '',
    issuer_es TEXT NOT NULL DEFAULT '',
    issuer_fr TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL DEFAULT '',
    description_en TEXT NOT NULL DEFAULT '',
    description_es TEXT NOT NULL DEFAULT '',
    description_fr TEXT NOT NULL DEFAULT '',
    location_en TEXT NOT NULL DEFAULT '',
    location_es TEXT NOT NULL DEFAULT '',
    location_fr TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    role_ids TEXT NOT NULL DEFAULT 'all',
    created_at TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT ''
);

-- Section Order
CREATE TABLE IF NOT EXISTS DataReactProfile_SectionOrder (
    id TEXT PRIMARY KEY,
    section_key TEXT NOT NULL UNIQUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    visible INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT ''
);
`;

/**
 * Seed SQL — uses INSERT OR IGNORE so it only runs once.
 * Only creates the bare minimum structural defaults.
 */
export const SEED_SQL = `
-- Default "All" role
INSERT OR IGNORE INTO DataReactProfile_Roles (id, name, job_title, sort_order, created_at, updatedAt)
VALUES ('all', 'All', '', 0, datetime('now'), datetime('now'));

-- Default header
INSERT OR IGNORE INTO DataReactProfile_Header (id, name, updated_at)
VALUES ('default', '', datetime('now'));

-- Default section order
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-roles', 'roles', 0, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-header', 'header', 1, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-education', 'education', 2, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-skills', 'skills', 3, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-experience', 'experience', 4, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-projects', 'projects', 5, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-leadership', 'leadership', 6, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-certificates', 'certificates', 7, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-languages', 'languages', 8, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-awards', 'awards', 9, 1, datetime('now'));
INSERT OR IGNORE INTO DataReactProfile_SectionOrder (id, section_key, sort_order, visible, updated_at) VALUES
('sec-hobbies', 'hobbies', 10, 1, datetime('now'));
`;

/**
 * Column migrations — ALTER TABLE statements run individually with try/catch.
 * Safe to re-run (duplicate column errors are silently ignored).
 */
export const COLUMN_MIGRATIONS: string[] = [
    "ALTER TABLE DataReactProfile_Header ADD COLUMN linkedin TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE DataReactProfile_Header ADD COLUMN website TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE DataReactProfile_Header ADD COLUMN ai_prompt_enabled INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE DataReactProfile_Header ADD COLUMN ai_prompt_color TEXT NOT NULL DEFAULT '#ffffff'",
];
