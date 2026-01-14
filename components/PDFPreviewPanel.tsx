'use client';

import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';
import type { CVData } from '@/lib/types';

const FONT_SIZE = 10;

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: FONT_SIZE,
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
    title: {
        fontSize: FONT_SIZE + 1,
        marginTop: 4,
        color: '#444',
    },
    contact: {
        fontSize: FONT_SIZE,
        marginTop: 4,
        color: '#666',
    },
    summary: {
        fontSize: FONT_SIZE,
        fontStyle: 'italic',
        marginTop: 8,
        color: '#555',
        lineHeight: 1.4,
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: FONT_SIZE + 1,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        textAlign: 'center',
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        color: '#333',
    },
    item: {
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
    },
    itemTitle: {
        fontSize: FONT_SIZE,
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: FONT_SIZE,
        color: '#555',
    },
    itemDate: {
        fontSize: FONT_SIZE,
        color: '#666',
        fontStyle: 'italic',
    },
    itemLocation: {
        fontSize: FONT_SIZE,
        color: '#666',
    },
    description: {
        fontSize: FONT_SIZE,
        lineHeight: 1.4,
        marginTop: 2,
        color: '#444',
    },
    skillsList: {
        fontSize: FONT_SIZE,
        marginBottom: 4,
        lineHeight: 1.4,
    },
    skillLabel: {
        fontWeight: 'bold',
        fontFamily: 'Helvetica-Bold',
    },
});

// CV PDF Document
function CVDocument({ data }: { data: CVData }) {
    const { t } = useTranslation();
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.header.name || 'Your Name'}</Text>
                    {data.header.title && <Text style={styles.title}>{data.header.title}</Text>}
                    <Text style={styles.contact}>
                        {[data.header.location, data.header.email, data.header.phone, data.header.github]
                            .filter(Boolean)
                            .join(' • ')}
                    </Text>
                    {data.header.summary && (
                        <Text style={styles.summary}>{data.header.summary}</Text>
                    )}
                </View>

                {/* Education */}
                {data.education.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('education.title')}</Text>
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
                                {edu.coursework && <Text style={styles.description}>{edu.coursework}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {(data.skills.programming || data.skills.design || data.skills.projects.length > 0) && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('skills.title')}</Text>
                        {data.skills.programming && (
                            <Text style={styles.skillsList}>
                                <Text style={styles.skillLabel}>{t('skills.programming')}: </Text>
                                {data.skills.programming}
                            </Text>
                        )}
                        {data.skills.design && (
                            <Text style={styles.skillsList}>
                                <Text style={styles.skillLabel}>{t('skills.design')}: </Text>
                                {data.skills.design}
                            </Text>
                        )}
                        {data.skills.projects.map((proj, index) => (
                            <View key={index} style={styles.item}>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle}>{proj.name}</Text>
                                    <Text style={styles.itemDate}>{proj.date}</Text>
                                </View>
                                {proj.description && <Text style={styles.description}>{proj.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('experience.title')}</Text>
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
                                {exp.description && <Text style={styles.description}>{exp.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Leadership */}
                {data.leadership.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('leadership.title')}</Text>
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
                                {lead.description && <Text style={styles.description}>{lead.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}

                {/* Certificates */}
                {data.certificates.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('certificates.title')}</Text>
                        {data.certificates.map((cert, index) => (
                            <View key={index} style={styles.item}>
                                <View style={styles.row}>
                                    <Text style={styles.itemTitle}>{cert.name}</Text>
                                    <Text style={styles.itemDate}>{cert.date}</Text>
                                </View>
                                <Text style={styles.itemSubtitle}>{cert.issuer}</Text>
                                {cert.description && <Text style={styles.description}>{cert.description}</Text>}
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}

interface PDFPreviewPanelProps {
    data: CVData;
}

export default function PDFPreviewPanel({ data }: PDFPreviewPanelProps) {
    const { t } = useTranslation();
    return (
        <div className="h-full flex flex-col bg-[var(--color-background)]">
            {/* Header */}
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-card)]">
                <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    📄 {t('actions.preview')}
                </h2>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 p-4">
                <div className="h-full rounded-lg overflow-hidden shadow-lg border border-[var(--color-border)]">
                    <PDFViewer width="100%" height="100%" showToolbar={false}>
                        <CVDocument data={data} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
}
