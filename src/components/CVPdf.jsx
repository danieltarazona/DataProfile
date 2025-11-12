// src/components/CVPdf.jsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Enhanced styles to better match the original resume layout: adjusted font sizes, added flex rows for alignments (e.g., institution left, location right; degree left, date right), left-aligned section titles, tighter spacing, supported bold/italic in descriptions.
const FONT_SIZE = 10;

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: FONT_SIZE,
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: FONT_SIZE,
  },
  contact: {
    fontSize: FONT_SIZE,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: FONT_SIZE,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 0,
  },
  item: {
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  itemTitle: {
    fontSize: FONT_SIZE,
    fontWeight: 'bold',
  },
  itemSubtitle: {
    fontSize: FONT_SIZE,
  },
  itemDate: {
    fontSize: FONT_SIZE,
  },
  itemLocation: {
    fontSize: FONT_SIZE,
  },
  description: {
    fontSize: FONT_SIZE,
    lineHeight: 1.2,
    marginBottom: 8,
  },
  skillsListSection: {
    marginBottom: 8,
  },
  skillsList: {
    fontSize: FONT_SIZE,
  },
});

// Helper to parse Markdown-like formatting: bold (**text**), italic (*text*), bullets (- )
const parseText = (text) => {
  const parts = [];
  let lastIndex = 0;
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const content = match[2] || match[3];
    const style = match[2] ? { fontWeight: 'bold' } : { fontStyle: 'italic' };
    parts.push(<Text key={parts.length} style={style}>{content}</Text>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};

const renderDescription = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, index) => {
    let content = parseText(line);
    if (line.trim().startsWith('- ')) {
      content = [<Text key="bullet">• </Text>, ...parseText(line.trim().slice(2))];
    }
    return <Text key={index} style={styles.description}>{content}{'\n'}</Text>;
  });
};

const CVPdf = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.header.name}</Text>
        <Text style={styles.title}>{data.header.title}</Text>
        <Text style={styles.contact}>
          {data.header.location} • {data.header.email} • {data.header.phone} • {data.header.github}
        </Text>
        {data.header.summary && (
          <Text style={{ fontSize: FONT_SIZE, textAlign: 'center', fontStyle: 'italic', marginTop: 10 }}>
            {data.header.summary}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        {data.education.map((edu, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{edu.institution}</Text>
              <Text style={styles.itemLocation}>{edu.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemSubtitle}>{edu.degree}</Text>
              <Text style={styles.itemDate}>{edu.date}</Text>
            </View>
            {renderDescription(edu.coursework)}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills & Projects</Text>
        <Text style={styles.skillsList}>
          <Text style={{ fontWeight: 'bold' }}>Programming:</Text> {data.skills.programming}
        </Text>
        <Text style={styles.skillsList}>
          <Text style={{ fontWeight: 'bold' }}>Design:</Text> {data.skills.design}
        </Text>
        {data.skills.projects.map((proj, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{proj.name}</Text>
              <Text style={styles.itemDate}>{proj.date}</Text>
            </View>
            {renderDescription(proj.description)}
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Relevant Experience</Text>
        {data.experience.map((exp, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{exp.company}</Text>
              <Text style={styles.itemLocation}>{exp.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemSubtitle}>{exp.role}</Text>
              <Text style={styles.itemDate}>{exp.date}</Text>
            </View>
            {renderDescription(exp.description)}
          </View>
        ))}
      </View>

      {data.leadership && data.leadership.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Leadership</Text>
        {data.leadership.map((lead, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{lead.organization}</Text>
              <Text style={styles.itemLocation}>{lead.location}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.itemSubtitle}>{lead.role}</Text>
              <Text style={styles.itemDate}>{lead.date}</Text>
            </View>
            {renderDescription(lead.description)}
          </View>
        ))}
      </View>
      )}

      {data.certificates && data.certificates.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Certificates</Text>
        {data.certificates && data.certificates.map((cert, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.row}>
              <Text style={styles.itemTitle}>{cert.name}</Text>
              <Text style={styles.itemDate}>{cert.date}</Text>
            </View>
            <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
            {renderDescription(cert.description)}
          </View>
        ))}
      </View>
      )}
    </Page>
  </Document>
);

export default CVPdf;