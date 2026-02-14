export interface ResumeData {
    id?: string;
    title: string;
    personal: {
        firstName: string;
        lastName: string;
        title: string;
        email: string;
        phone: string;
        location: string;
        address?: string; // Newly added
        summary: string;
        website?: string;
    };
    experience: Array<{
        id: string;
        title: string;
        company: string;
        startDate: string;
        endDate?: string;
        description: string;
    }>;
    education: Array<{
        id: string;
        degree: string;
        field: string;
        school: string;
        startDate: string;
        endDate: string;
    }>;
    skills: string[]; // Restored
    languages: Array<{
        language: string;
        level: string;
    }>;
    activities?: Array<{
        id: string;
        title: string;
        organization: string;
        description: string;
    }>;
    design: ResumeDesign; // Integrated Design Settings
}

export interface ResumeDesign {
    template: string; // e.g. 'modern', 'classic', 'creative'
    layout: {
        margins: {
            top: number; // pt
            right: number;
            bottom: number;
            left: number;
        };
        columns: 1 | 2;
        columnDistribution: '50/50' | '60/40' | '70/30' | '75/25'; // For 2 columns
        spacing: {
            section: number; // pt
            item: number;
            paragraph: number;
        };
    };
    typography: {
        fontFamily: {
            body: string; // e.g. 'Inter'
            heading: string; // e.g. 'Montserrat'
        };
        fontSize: {
            h1: number; // pt, Name
            h2: number; // pt, Sections
            h3: number; // pt, Subsections
            body: number; // pt
            small: number; // pt, Meta info
        };
        lineHeight: number; // 1.0 - 2.0
    };
    colors: {
        primary: string; // HEX
        text: string;
        background: string;
        accent: string;
    };
}

export const defaultResumeDesign: ResumeDesign = {
    template: 'modern',
    layout: {
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        columns: 1,
        columnDistribution: '70/30',
        spacing: { section: 16, item: 8, paragraph: 4 },
    },
    typography: {
        fontFamily: { body: 'Inter', heading: 'Inter' },
        fontSize: { h1: 24, h2: 18, h3: 14, body: 11, small: 9 },
        lineHeight: 1.5,
    },
    colors: {
        primary: '#000000',
        text: '#1F2937',
        background: '#FFFFFF',
        accent: '#3B82F6',
    },
};

export const defaultResumeData: ResumeData = {
    title: 'Mein Lebenslauf',
    personal: {
        firstName: '',
        lastName: '',
        title: '',
        email: '',
        phone: '',
        location: '',
        address: '',
        summary: '',
    },
    experience: [],
    education: [],
    skills: [],
    languages: [],
    design: defaultResumeDesign,
};
