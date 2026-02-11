'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMachine } from '@xstate/react';
import { motion, AnimatePresence } from 'motion/react';
import dynamic from 'next/dynamic';

import { cvMachine } from '@/lib/cvMachine';
import '@/lib/i18n';
import {
  HeaderSection, EducationSection, SkillsSection, ExperienceSection,
  LeadershipSection, CertificatesSection, Sidebar, TopBar, Login,
  type CVData
} from '@datakit/react-core';

// Dynamic import for PDF to avoid SSR issues
// Dynamic import for PDF to avoid SSR issues
const PDFPreviewPanel = dynamic(() => import('@datakit/react-core').then(mod => mod.PDFPreviewPanel), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse text-[var(--color-text-muted)]">Loading PDF preview...</div>
    </div>
  ),
});

type SectionId = 'header' | 'education' | 'skills' | 'experience' | 'leadership' | 'certificates';

// Get data file based on language
const getDataFile = (lang: string): string => {
  switch (lang) {
    case 'es':
      return '/data-es.json';
    case 'fr':
      return '/data-fr.json';
    default:
      return '/data.json';
  }
};

const sections: { id: SectionId; icon: string }[] = [
  { id: 'header', icon: '👤' },
  { id: 'education', icon: '🎓' },
  { id: 'skills', icon: '💻' },
  { id: 'experience', icon: '💼' },
  { id: 'leadership', icon: '🏆' },
  { id: 'certificates', icon: '📜' },
];

export default function Home() {
  const { t, i18n } = useTranslation();
  const [current, send] = useMachine(cvMachine);
  const [activeSection, setActiveSection] = useState<SectionId>('header');
  const [showPreview, setShowPreview] = useState(true);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const { data, isDirty, lastSaved } = current.context;

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/verify', {
          method: 'GET',
          credentials: 'include',
        });
        setIsAuthenticated(response.ok);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkSession();
  }, []);

  // Load data based on language
  const loadDataForLanguage = useCallback(async (lang: string) => {
    // Try localStorage first (only for current language)
    const savedKey = `cvData_${lang}`;
    const savedData = localStorage.getItem(savedKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as CVData;
        send({ type: 'LOAD_DATA', data: parsed });
        return;
      } catch (e) {
        console.error('Error loading saved data:', e);
      }
    }

    // Fetch data for the language
    try {
      const dataFile = getDataFile(lang);
      const response = await fetch(dataFile);
      const initialData = await response.json() as CVData;
      send({ type: 'LOAD_DATA', data: initialData });
    } catch (e) {
      console.error('Error loading initial data:', e);
    }
  }, [send]);

  // Load data when authenticated or language changes
  useEffect(() => {
    if (isAuthenticated) {
      loadDataForLanguage(i18n.language);
    }
  }, [isAuthenticated, i18n.language, loadDataForLanguage]);

  // Save to language-specific key
  useEffect(() => {
    if (isDirty && isAuthenticated) {
      const timer = setTimeout(() => {
        // Save to language-specific key
        const saveKey = `cvData_${i18n.language}`;
        localStorage.setItem(saveKey, JSON.stringify(data));
        send({ type: 'SAVE' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isDirty, send, data, i18n.language, isAuthenticated]);

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Invalid credentials');
      }
    } catch {
      setAuthError('Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setIsAuthenticated(false);
    }
  };

  // Export to JSON
  const exportToJson = useCallback(() => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'cv-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [data]);

  // Change language and reload data
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // Data will reload via useEffect
  };

  // Scroll to section
  const scrollToSection = (sectionId: SectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="w-8 h-8 border-3 border-[var(--color-primary)]/30 border-t-[var(--color-primary)] rounded-full"
        />
      </div>
    );
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <Login
        onLogin={handleLogin}
        isLoading={authLoading}
        error={authError}
        onClearError={() => setAuthError(null)}
        labels={{
          title: t('auth.title'),
          error: t('auth.error'),
          email: t('auth.email'),
          password: t('auth.password'),
          loading: t('auth.loading'),
          login: t('auth.login'),
        }}
      />
    );
  }

  // Main editor
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-background)]">
      {/* Sidebar Navigation */}
      {/* Sidebar Navigation */}
      <Sidebar className="border-r border-[var(--color-border)] bg-[var(--color-card)]">
        <Sidebar.Header>
          <div className="p-2">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">{t('app.title')}</h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('app.subtitle')}</p>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            {sections.map(section => (
              <Sidebar.Item
                key={section.id}
                active={activeSection === section.id}
                onClick={() => scrollToSection(section.id)}
                icon={<span className="text-lg">{section.icon}</span>}
              >
                {t(`nav.${section.id}`)}
              </Sidebar.Item>
            ))}
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer>
          <div className="p-2 text-xs text-center text-[var(--color-text-muted)]">
            Built with DataKitReactCore
          </div>
        </Sidebar.Footer>
      </Sidebar>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          language={i18n.language}
          onLanguageChange={changeLanguage}
          onExportJson={exportToJson}
          onTogglePreview={() => setShowPreview(!showPreview)}
          showPreview={showPreview}
          isDirty={isDirty}
          lastSaved={lastSaved}
          onLogout={handleLogout}
          labels={{
            saving: t('actions.saving'),
            saved: t('actions.saved'),
            exportJson: t('actions.exportJson'),
            logout: t('auth.logout'),
            preview: t('actions.preview'),
            showPDF: t('actions.exportPdf'),
          }}
        />

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <motion.div
            className="flex-1 overflow-y-auto p-6"
            animate={{ width: showPreview ? '50%' : '100%' }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Header Section */}
              <div id="header">
                <HeaderSection
                  data={data.header}
                  onChange={(field, value) => send({ type: 'UPDATE_HEADER', field, value })}
                  labels={{
                    title: t('nav.header'),
                    name: t('header.name'),
                    jobTitle: t('header.jobTitle'),
                    location: t('header.location'),
                    email: t('header.email'),
                    phone: t('header.phone'),
                    github: t('header.github'),
                    summary: t('header.summary'),
                  }}
                />
              </div>

              {/* Education Section */}
              <div id="education">
                <EducationSection
                  items={data.education}
                  onAdd={() => send({ type: 'ADD_ITEM', section: 'education' })}
                  onRemove={(index) => send({ type: 'REMOVE_ITEM', section: 'education', index })}
                  onChange={(index, field, value) =>
                    send({ type: 'UPDATE_ITEM', section: 'education', index, field, value })
                  }
                  labels={{
                    title: t('education.title'),
                    add: t('education.add'),
                    remove: t('education.remove'),
                    institution: t('education.institution'),
                    location: t('education.location'),
                    degree: t('education.degree'),
                    date: t('education.date'),
                    coursework: t('education.coursework'),
                  }}
                />
              </div>

              {/* Skills Section */}
              <div id="skills">
                <SkillsSection
                  skills={data.skills}
                  onSkillChange={(field, value) => send({ type: 'UPDATE_SKILLS', field, value })}
                  onProjectAdd={() => send({ type: 'ADD_PROJECT' })}
                  onProjectRemove={(index) => send({ type: 'REMOVE_PROJECT', index })}
                  onProjectChange={(index, field, value) =>
                    send({ type: 'UPDATE_PROJECT', index, field, value })
                  }
                  labels={{
                    title: t('skills.title'),
                    programming: t('skills.programming'),
                    design: t('skills.design'),
                    projects: t('skills.projects'),
                    add: t('skills.add'),
                    remove: t('skills.remove'),
                    projectName: t('skills.projectName'),
                    projectDate: t('skills.projectDate'),
                    projectDescription: t('skills.projectDescription'),
                  }}
                />
              </div>

              {/* Experience Section */}
              <div id="experience">
                <ExperienceSection
                  items={data.experience}
                  onAdd={() => send({ type: 'ADD_ITEM', section: 'experience' })}
                  onRemove={(index) => send({ type: 'REMOVE_ITEM', section: 'experience', index })}
                  onChange={(index, field, value) =>
                    send({ type: 'UPDATE_ITEM', section: 'experience', index, field, value })
                  }
                  labels={{
                    title: t('experience.title'),
                    add: t('experience.add'),
                    remove: t('experience.remove'),
                    company: t('experience.company'),
                    location: t('experience.location'),
                    role: t('experience.role'),
                    date: t('experience.date'),
                    description: t('experience.description'),
                  }}
                />
              </div>

              {/* Leadership Section */}
              <div id="leadership">
                <LeadershipSection
                  items={data.leadership}
                  onAdd={() => send({ type: 'ADD_ITEM', section: 'leadership' })}
                  onRemove={(index) => send({ type: 'REMOVE_ITEM', section: 'leadership', index })}
                  onChange={(index, field, value) =>
                    send({ type: 'UPDATE_ITEM', section: 'leadership', index, field, value })
                  }
                  labels={{
                    title: t('leadership.title'),
                    add: t('leadership.add'),
                    remove: t('leadership.remove'),
                    organization: t('leadership.organization'),
                    location: t('leadership.location'),
                    role: t('leadership.role'),
                    date: t('leadership.date'),
                    description: t('leadership.description'),
                  }}
                />
              </div>

              {/* Certificates Section */}
              <div id="certificates">
                <CertificatesSection
                  items={data.certificates}
                  onAdd={() => send({ type: 'ADD_ITEM', section: 'certificates' })}
                  onRemove={(index) => send({ type: 'REMOVE_ITEM', section: 'certificates', index })}
                  onChange={(index, field, value) =>
                    send({ type: 'UPDATE_ITEM', section: 'certificates', index, field, value })
                  }
                  labels={{
                    title: t('certificates.title'),
                    add: t('certificates.add'),
                    remove: t('certificates.remove'),
                    name: t('certificates.name'),
                    issuer: t('certificates.issuer'),
                    date: t('certificates.date'),
                    description: t('certificates.description'),
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* PDF Preview Panel */}
          <AnimatePresence>
            {showPreview && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '50%', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-l border-[var(--color-border)] overflow-hidden"
              >
                <PDFPreviewPanel
                  data={data}
                  labels={{
                    preview: t('actions.preview'),
                    education: t('education.title'),
                    skills: t('skills.title'),
                    programming: t('skills.programming'),
                    design: t('skills.design'),
                    experience: t('experience.title'),
                    leadership: t('leadership.title'),
                    certificates: t('certificates.title'),
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
