// src/App.jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import MDEditor from '@uiw/react-md-editor';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer'; // Added PDFViewer
import CVPdf from './components/CVPdf.jsx';
import './index.css';
import CVPreview from './components/CVPreview.jsx';
import initialData from './data.json';

function App() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(initialData);

  const updateField = (section, field, value, index = null) => {
    setData((prev) => {
      if (index !== null) {
        const updatedSection = prev[section].map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        );
        return { ...prev, [section]: updatedSection };
      } else if (typeof field === 'object') {
        return { ...prev, [section]: { ...prev[section], ...field } };
      } else {
        return { ...prev, [section]: { ...prev[section], [field]: value } };
      }
    });
  };

  const updateProject = (index, projField, value) => {
    setData((prev) => {
      const updatedProjects = prev.skills.projects.map((proj, i) =>
        i === index ? { ...proj, [projField]: value } : proj
      );
      return { ...prev, skills: { ...prev.skills, projects: updatedProjects } };
    });
  };

  const addItem = (section) => {
    const defaultValues = {
      education: { institution: '', location: '', degree: '', date: '', coursework: '' },
      experience: { company: '', role: '', date: '', location: '', description: '' },
      leadership: { organization: '', role: '', date: '', location: '', description: '' },
      certificates: { name: '', issuer: '', date: '', description: '' },
    };
    setData((prev) => ({
      ...prev,
      [section]: [...prev[section], defaultValues[section] || {}],
    }));
  };

  const addProject = () => {
    setData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        projects: [...prev.skills.projects, { name: '', date: '', description: '' }],
      },
    }));
  };

  const removeItem = (section, index) => {
    setData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const removeProject = (index) => {
    setData((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        projects: prev.skills.projects.filter((_, i) => i !== index),
      },
    }));
  };

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('cvData');
    if (savedData) {
      try {
        setData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('cvData', JSON.stringify(data));
  }, [data]);

  const exportToJson = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'cv-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="app">
      <div className="editor">
        <div className="header-controls">
          <h1>{t('app.title')}</h1>
          <div className="controls">
            <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
            <button onClick={exportToJson}>{t('actions.exportJson')}</button>
          </div>
        </div>
        
        <section>
          <h3>{t('header.name')}</h3>
          <label>{t('header.name')}</label>
          <input
            type="text"
            value={data.header.name}
            onChange={(e) => updateField('header', 'name', e.target.value)}
            placeholder={t('header.name')}
          />
          <label>{t('header.title')}</label>
          <input
            type="text"
            value={data.header.title}
            onChange={(e) => updateField('header', 'title', e.target.value)}
            placeholder={t('header.title')}
          />
          <label>{t('header.location')}</label>
          <input
            type="text"
            value={data.header.location}
            onChange={(e) => updateField('header', 'location', e.target.value)}
            placeholder={t('header.location')}
          />
          <label>{t('header.email')}</label>
          <input
            type="email"
            value={data.header.email}
            onChange={(e) => updateField('header', 'email', e.target.value)}
            placeholder={t('header.email')}
          />
          <label>{t('header.phone')}</label>
          <input
            type="tel"
            value={data.header.phone}
            onChange={(e) => updateField('header', 'phone', e.target.value)}
            placeholder={t('header.phone')}
          />
          <label>{t('header.github')}</label>
          <input
            type="url"
            value={data.header.github}
            onChange={(e) => updateField('header', 'github', e.target.value)}
            placeholder={t('header.github')}
          />
        </section>

        <section>
          <h3>{t('education.title')}</h3>
          {data.education.map((edu, index) => (
            <div key={index} className="education-item">
              <label>{t('education.institution')}</label>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateField('education', 'institution', e.target.value, index)}
                placeholder={t('education.institution')}
              />
              <label>{t('education.location')}</label>
              <input
                type="text"
                value={edu.location}
                onChange={(e) => updateField('education', 'location', e.target.value, index)}
                placeholder={t('education.location')}
              />
              <label>{t('education.degree')}</label>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateField('education', 'degree', e.target.value, index)}
                placeholder={t('education.degree')}
              />
              <label>{t('education.date')}</label>
              <input
                type="text"
                value={edu.date}
                onChange={(e) => updateField('education', 'date', e.target.value, index)}
                placeholder={t('education.date')}
              />
              <label>{t('education.coursework')}</label>
              <MDEditor
                value={edu.coursework}
                onChange={(value) => updateField('education', 'coursework', value, index)}
                preview="edit"
              />
              <button onClick={() => removeItem('education', index)}>{t('education.remove')}</button>
            </div>
          ))}
          <button onClick={() => addItem('education')}>{t('education.add')}</button>
        </section>

        <section>
          <h3>{t('skills.title')}</h3>
          <label>{t('skills.programming')}</label>
          <input
            type="text"
            value={data.skills.programming}
            onChange={(e) => updateField('skills', { programming: e.target.value })}
            placeholder={t('skills.programming')}
          />
          <label>{t('skills.design')}</label>
          <input
            type="text"
            value={data.skills.design}
            onChange={(e) => updateField('skills', { design: e.target.value })}
            placeholder={t('skills.design')}
          />
          {data.skills.projects.map((proj, index) => (
            <div key={index} className="project-item">
              <label>{t('skills.name')}</label>
              <input
                type="text"
                value={proj.name}
                onChange={(e) => updateProject(index, 'name', e.target.value)}
                placeholder={t('skills.name')}
              />
              <label>{t('skills.date')}</label>
              <input
                type="text"
                value={proj.date}
                onChange={(e) => updateProject(index, 'date', e.target.value)}
                placeholder={t('skills.date')}
              />
              <label>{t('skills.description')}</label>
              <MDEditor
                value={proj.description}
                onChange={(value) => updateProject(index, 'description', value)}
                preview="edit"
              />
              <button onClick={() => removeProject(index)}>{t('skills.remove')}</button>
            </div>
          ))}
          <button onClick={addProject}>{t('skills.add')}</button>
        </section>

        <section>
          <h3>{t('experience.title')}</h3>
          {data.experience.map((exp, index) => (
            <div key={index} className="experience-item">
              <label>{t('experience.company')}</label>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateField('experience', 'company', e.target.value, index)}
                placeholder={t('experience.company')}
              />
              <label>{t('experience.role')}</label>
              <input
                type="text"
                value={exp.role}
                onChange={(e) => updateField('experience', 'role', e.target.value, index)}
                placeholder={t('experience.role')}
              />
              <label>{t('experience.date')}</label>
              <input
                type="text"
                value={exp.date}
                onChange={(e) => updateField('experience', 'date', e.target.value, index)}
                placeholder={t('experience.date')}
              />
              <label>{t('experience.location')}</label>
              <input
                type="text"
                value={exp.location}
                onChange={(e) => updateField('experience', 'location', e.target.value, index)}
                placeholder={t('experience.location')}
              />
              <label>{t('experience.description')}</label>
              <MDEditor
                value={exp.description}
                onChange={(value) => updateField('experience', 'description', value, index)}
                preview="edit"
              />
              <button onClick={() => removeItem('experience', index)}>{t('experience.remove')}</button>
            </div>
          ))}
          <button onClick={() => addItem('experience')}>{t('experience.add')}</button>
        </section>

        {data.leadership && data.leadership.length > 0 && (
        <section>
           <h3>{t('leadership.title')}</h3>
           {data.leadership.map((lead, index) => (
            <div key={index} className="leadership-item">
              <label>{t('leadership.organization')}</label>
              <input
                type="text"
                value={lead.organization}
                onChange={(e) => updateField('leadership', 'organization', e.target.value, index)}
                placeholder={t('leadership.organization')}
              />
              <label>{t('leadership.role')}</label>
              <input
                type="text"
                value={lead.role}
                onChange={(e) => updateField('leadership', 'role', e.target.value, index)}
                placeholder={t('leadership.role')}
              />
              <label>{t('leadership.date')}</label>
              <input
                type="text"
                value={lead.date}
                onChange={(e) => updateField('leadership', 'date', e.target.value, index)}
                placeholder={t('leadership.date')}
              />
              <label>{t('leadership.location')}</label>
              <input
                type="text"
                value={lead.location}
                onChange={(e) => updateField('leadership', 'location', e.target.value, index)}
                placeholder={t('leadership.location')}
              />
              <label>{t('leadership.description')}</label>
              <MDEditor
                value={lead.description}
                onChange={(value) => updateField('leadership', 'description', value, index)}
                preview="edit"
              />
              <button onClick={() => removeItem('leadership', index)}>{t('leadership.remove')}</button>
            </div>
          ))}
          <button onClick={() => addItem('leadership')}>{t('leadership.add')}</button>
        </section>
       )}

        {data.certificates && data.certificates.length > 0 && (
        <section>
           <h3>{t('certificates.title')}</h3>
           {data.certificates.map((cert, index) => (
            <div key={index} className="certificate-item">
              <label>{t('certificates.name')}</label>
              <input
                type="text"
                value={cert.name}
                onChange={(e) => updateField('certificates', 'name', e.target.value, index)}
                placeholder={t('certificates.name')}
              />
              <label>{t('certificates.issuer')}</label>
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) => updateField('certificates', 'issuer', e.target.value, index)}
                placeholder={t('certificates.issuer')}
              />
              <label>{t('certificates.date')}</label>
              <input
                type="text"
                value={cert.date}
                onChange={(e) => updateField('certificates', 'date', e.target.value, index)}
                placeholder={t('certificates.date')}
              />
              <label>{t('certificates.description')}</label>
              <MDEditor
                value={cert.description}
                onChange={(value) => updateField('certificates', 'description', value, index)}
                preview="edit"
              />
              <button onClick={() => removeItem('certificates', index)}>{t('certificates.remove')}</button>
            </div>
          ))}
          <button onClick={() => addItem('certificates')}>{t('certificates.add')}</button>
        </section>
       )}
      </div>

      <div className="pdf-preview">
        <h2>PDF Preview</h2>
        <PDFViewer width="100%" height="600">
          <CVPdf data={data} />
        </PDFViewer>
      </div>

    </div>
  );
}

export default App;