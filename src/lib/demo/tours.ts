import { DemoTour } from '@/contexts/DemoWizardContext';

/**
 * Demo Tours Configuration
 * 
 * Define interactive product tours for different modules
 */

export const demoTours: DemoTour[] = [
  // 🚀 Getting Started Tour
  {
    id: 'getting-started',
    name: 'Welcome to Ascent Compliance',
    description: 'A quick tour of the platform and its key features',
    category: 'getting-started',
    estimatedTime: '3 min',
    icon: '🚀',
    steps: [
      {
        id: 'welcome',
        title: 'Welcome to Ascent Compliance! 👋',
        description: 'Your intelligent compliance management platform. Let\'s take a quick tour to show you how everything works together.',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },
      {
        id: 'dashboard',
        title: 'Your Compliance Dashboard',
        description: 'This is your command center. See your overall compliance score, upcoming obligations, and critical metrics at a glance.',
        targetSelector: '[data-tour="compliance-score"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/',
      },
      {
        id: 'navigation',
        title: 'Navigate Your Compliance Universe',
        description: 'Use the sidebar to access Programs, Requirements, Controls, Tests, and Evidence. Everything is organized logically.',
        targetSelector: 'aside',
        position: 'right',
        arrowPosition: 'left',
      },
      {
        id: 'programs',
        title: 'My Programs',
        description: 'Programs are your compliance frameworks - like RBI IT Governance, ISO 27001, or DPDP Act. This is where you manage all your active programs.',
        targetSelector: '[data-tour="programs-nav"]',
        position: 'right',
        arrowPosition: 'left',
      },
      {
        id: 'quick-actions',
        title: 'Quick Actions',
        description: 'Use the command palette (Cmd+K) to quickly navigate, search, or perform actions anywhere in the platform.',
        targetSelector: '[data-tour="command-palette"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
    ],
  },

  // 📋 Programs Tour
  {
    id: 'programs-tour',
    name: 'Understanding Programs',
    description: 'Learn how to manage compliance programs and frameworks',
    category: 'programs',
    estimatedTime: '7 min',
    icon: '📋',
    steps: [
      {
        id: 'programs-start',
        title: 'Let\'s Explore Programs! 📋',
        description: 'Programs are your compliance frameworks - like RBI IT Governance, ISO 27001, GDPR, or DPDP Act. They contain all the requirements, controls, and tests you need to stay compliant. Let\'s dive in!',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },
      {
        id: 'programs-header',
        title: 'Your Programs Dashboard',
        description: 'This is your central hub for managing all compliance programs. You can import pre-built frameworks from our library or create custom programs tailored to your organization.',
        targetSelector: '[data-tour="programs-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/programs',
      },
      {
        id: 'programs-kpis',
        title: 'Key Performance Indicators',
        description: 'Track your compliance health at a glance: Average Compliance Score shows overall performance, Total Programs counts active frameworks, and Test metrics show what\'s passing or needs attention.',
        targetSelector: '[data-tour="programs-kpis"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'avg-compliance',
        title: 'Average Compliance Score',
        description: 'This is your most important metric - the weighted average compliance across all active programs. The trend indicator shows if you\'re improving or declining month-over-month.',
        targetSelector: '[data-tour="programs-avg-compliance"]',
        position: 'right',
        arrowPosition: 'left',
      },
      {
        id: 'import-program',
        title: 'Import from Library',
        description: 'Access our comprehensive library of pre-built compliance frameworks. We have 100+ programs covering regulations like RBI, SEBI, GDPR, ISO standards, and industry-specific requirements.',
        targetSelector: '[data-tour="import-program"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'create-custom',
        title: 'Create Custom Programs',
        description: 'Build your own compliance programs from scratch. Perfect for internal policies, client-specific requirements, or emerging regulations not yet in our library.',
        targetSelector: '[data-tour="create-custom-program"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'search-filter',
        title: 'Search & Filter Programs',
        description: 'Quickly find programs by name, authority, or status. Filter by Active, Draft, Under Review, or Archived. Switch between Grid, List, and Three-Pane hierarchy views.',
        targetSelector: '[data-tour="programs-search-filter"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'program-card',
        title: 'Program Card Deep Dive',
        description: 'Each program card shows: Authority tag (RBI, ISO, etc.), Import source, Status badge, Compliance score with visual bar, Citation/Control/Test counts, Owner, and Risk level. Click any card to drill down into requirements and controls.',
        targetSelector: '[data-tour="program-card-first"]',
        position: 'right',
        arrowPosition: 'left',
        highlightPadding: 12,
      },
      {
        id: 'program-grid',
        title: 'Program Grid View',
        description: 'The grid view gives you a visual overview of all programs. Green scores (90%+) mean you\'re compliant, yellow (70-89%) needs improvement, and red (<70%) requires immediate attention.',
        targetSelector: '[data-tour="programs-grid"]',
        position: 'top',
        arrowPosition: 'bottom',
      },
      {
        id: 'back-to-dashboard',
        title: 'Programs Tour Complete! 🎉',
        description: 'You now understand how to manage compliance programs. Next, explore Requirements to see what each program requires, or Controls to see how you\'re meeting those requirements.',
        targetSelector: '[data-tour="compliance-score"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/',
      },
    ],
  },

  // 📄 Requirements Tour
  {
    id: 'requirements-tour',
    name: 'Managing Requirements',
    description: 'Understand requirements and how to map controls',
    category: 'requirements',
    estimatedTime: '5 min',
    icon: '📄',
    steps: [
      {
        id: 'requirements-intro',
        title: 'What are Requirements?',
        description: 'Requirements are specific regulatory mandates you must comply with. Each requirement can be linked to multiple controls.',
        targetSelector: '[data-tour="requirements-header"]',
        position: 'bottom',
        route: '/requirements',
      },
      {
        id: 'requirement-status',
        title: 'Compliance Status',
        description: 'Each requirement shows its compliance score based on mapped controls and test results. Track your progress in real-time.',
        targetSelector: '[data-tour="requirement-row"]:first-child',
        position: 'bottom',
      },
      {
        id: 'map-controls',
        title: 'Map Controls to Requirements',
        description: 'Click "Map Control" to link implementing controls. This is how you demonstrate compliance.',
        targetSelector: '[data-tour="map-control-btn"]',
        position: 'left',
        arrowPosition: 'right',
      },
      {
        id: 'ai-assistant',
        title: 'AI Control Mapping Assistant',
        description: 'Our AI can suggest relevant controls based on the requirement text. Save time with intelligent recommendations.',
        targetSelector: '[data-tour="ai-assistant"]',
        position: 'left',
      },
    ],
  },

  // 🛡️ Controls Tour
  {
    id: 'controls-tour',
    name: 'Control Management',
    description: 'Learn how to create, test, and monitor controls',
    category: 'controls',
    estimatedTime: '6 min',
    icon: '🛡️',
    steps: [
      {
        id: 'controls-start',
        title: 'Let\'s Explore Controls! 🛡️',
        description: 'Controls are the actual processes, policies, and technical measures you implement to meet requirements. Let\'s navigate to the Controls page.',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },
      {
        id: 'controls-intro',
        title: 'Controls Dashboard',
        description: 'This is where you monitor all your controls, their effectiveness, and testing status.',
        targetSelector: '[data-tour="controls-header"]',
        position: 'bottom',
        route: '/controls',
      },
      {
        id: 'control-table',
        title: 'Control Overview',
        description: 'Each control shows its type (Preventive, Detective, Corrective), effectiveness rating, and test results.',
        targetSelector: 'table tbody tr:first-child',
        position: 'right',
        arrowPosition: 'left',
      },
      {
        id: 'back-home',
        title: 'Tour Complete! 🎉',
        description: 'You\'ve learned the basics of the Ascent Compliance platform. Explore more features on your own!',
        targetSelector: '[data-tour="compliance-score"]',
        position: 'bottom',
        route: '/',
      },
    ],
  },

  // 🎬 SOC 2 Onboarding Story - Complete Lifecycle
  {
    id: 'soc2-onboarding-story',
    name: 'SOC 2 Onboarding Journey',
    description: 'Complete walkthrough: Import SOC 2, map controls, execute tests, and track compliance',
    category: 'programs',
    estimatedTime: '12 min',
    icon: '🎬',
    steps: [
      // CHAPTER 1: Discovery & Import
      {
        id: 'story-intro',
        title: 'Welcome to Your SOC 2 Compliance Journey! 🎬',
        description: 'You\'re a compliance manager at a SaaS company. Your CEO just asked: "Are we SOC 2 compliant?" Let\'s walk through the entire process of onboarding SOC 2, from import to tracking compliance. This is a real-world scenario.',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },
      {
        id: 'story-navigate-library',
        title: 'Step 1: Find the Right Framework',
        description: 'First, you need to import the SOC 2 framework. Navigate to the Program Library where we have 100+ pre-built compliance frameworks ready to use.',
        targetSelector: '[data-tour="nav-programs"]',
        position: 'right',
        arrowPosition: 'left',
        route: '/',
      },
      {
        id: 'story-library-intro',
        title: 'The Program Library',
        description: 'This is your compliance framework library. It contains regulatory frameworks (RBI, SEBI), international standards (ISO 27001, SOC 2), and industry-specific requirements. Let\'s find SOC 2.',
        targetSelector: '[data-tour="library-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/library/programs',
      },
      {
        id: 'story-search-soc2',
        title: 'Search for SOC 2',
        description: 'Use the search bar to quickly find frameworks. Type "SOC 2" to filter the library. You can also filter by category: Regulatory, Standard, Framework, or Industry.',
        targetSelector: '[data-tour="library-search"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'story-select-soc2',
        title: 'Found It! SOC 2 Type II',
        description: 'Here\'s the SOC 2 Type II framework. It includes 16 core Trust Services Criteria (CC1-CC9, A1, C1, P1), 85 pre-mapped controls, and covers Security, Availability, Processing Integrity, Confidentiality, and Privacy. Click the card to preview details.',
        targetSelector: '[data-tour="soc2-template-card"]',
        position: 'right',
        arrowPosition: 'left',
        highlightPadding: 12,
      },
      {
        id: 'story-preview-soc2',
        title: 'Review the Framework Details',
        description: 'The preview panel shows what\'s included: 16 core requirements, 85 controls, key features, and applicability. Click "Full View" for complete details or "Import to My Programs" to add SOC 2 to your workspace.',
        targetSelector: '[data-tour="view-soc2-detail"]',
        position: 'left',
        arrowPosition: 'right',
      },
      {
        id: 'story-import-soc2',
        title: 'Import to Your Programs',
        description: 'Ready to start? Click "Import to My Programs" to add SOC 2 to your compliance workspace. This will create a new program with all requirements, controls, and tests pre-configured.',
        targetSelector: '[data-tour="import-soc2-button"]',
        position: 'left',
        arrowPosition: 'right',
      },

      // CHAPTER 2: Program Overview
      {
        id: 'story-programs-dashboard',
        title: 'Your Programs Dashboard',
        description: 'Success! SOC 2 is now in "My Programs". This dashboard shows all your active compliance programs. You can see compliance scores, risk ratings, and key metrics at a glance.',
        targetSelector: '[data-tour="programs-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/programs',
      },
      {
        id: 'story-program-kpis',
        title: 'Track Your Compliance Health',
        description: 'These KPIs give you a bird\'s-eye view: Average Compliance (currently 85%), Total Programs (19), Total Controls (1906), Tests Passed (2256), and Tests Failed (125). Your goal: get that average to 95%+.',
        targetSelector: '[data-tour="programs-kpis"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'story-find-soc2-program',
        title: 'Locate Your SOC 2 Program',
        description: 'Here\'s your newly imported SOC 2 Type II program! It shows compliance score (88%), 16 core Trust Services Criteria, 85 controls, and 120 tests. Click the card to explore the program details.',
        targetSelector: '[data-tour="soc2-program-card"]',
        position: 'right',
        arrowPosition: 'left',
        highlightPadding: 12,
      },

      // CHAPTER 3: Requirements & Mapping
      {
        id: 'story-program-detail-header',
        title: 'Inside Your SOC 2 Program',
        description: 'Welcome to your SOC 2 Type II Compliance program! This is your command center for managing all aspects of SOC 2 compliance.',
        targetSelector: '[data-tour="soc2-program-detail-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/programs/pgm-soc2-type2',
      },
      {
        id: 'story-program-kpis',
        title: 'Track Your SOC 2 Metrics',
        description: 'These KPIs show your SOC 2 health: 88% compliance score, High risk rating, 16 Trust Services Criteria, 8 obligations, 85 controls, and 120 tests. Your goal: achieve 95%+ compliance before the audit.',
        targetSelector: '[data-tour="soc2-program-kpis"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'story-program-tabs',
        title: 'Navigate Program Sections',
        description: 'Use these tabs to explore: Info (overview), Elements (requirements, controls, tests), Assessments (audit readiness), Workflows (automation), and Specifications (detailed procedures).',
        targetSelector: '[data-tour="soc2-program-tabs"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'story-requirements-intro',
        title: 'View All Requirements',
        description: 'Now let\'s explore requirements. Click "Requirements" in the sidebar to continue.',
        targetSelector: '[data-tour="nav-requirements"]',
        position: 'right',
        arrowPosition: 'left',
        highlightPadding: 8,
        waitForElement: true,
      },
      {
        id: 'story-requirements-header',
        title: 'Your SOC 2 Requirements',
        description: 'Here are all 60 SOC 2 Trust Services Criteria. They\'re organized by category: CC1-CC9 (Common Criteria covering Security - 37 points), A1 (Availability - 7 points), C1 (Confidentiality - 2 points), PI1 (Processing Integrity - 5 points), and P1 (Privacy - 9 points). The program filter is automatically applied to show only SOC 2 requirements.',
        targetSelector: '[data-tour="requirements-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/requirements?program=pgm-soc2-type2',
      },
      {
        id: 'story-requirements-kpis',
        title: 'SOC 2 Requirement Metrics',
        description: 'These KPIs show your SOC 2 requirement health: 60 total requirements across all Trust Services Criteria, compliance breakdown by status, and average compliance score. Your goal is to get all requirements to "Compliant" status before the audit.',
        targetSelector: '[data-tour="requirements-kpis"]',
        position: 'bottom',
        arrowPosition: 'top',
      },
      {
        id: 'story-requirements-table',
        title: 'Requirement Details',
        description: 'Each requirement shows its Trust Services Criteria category (CC1-CC9), risk rating, compliance status, score, and how many controls are mapped. Click any requirement to see details and map controls.',
        targetSelector: '[data-tour="requirements-table"]',
        position: 'top',
        arrowPosition: 'bottom',
      },

      // CHAPTER 3B: Requirement Onboarding & Linking Workflow
      {
        id: 'story-add-requirement-button',
        title: 'Add New Requirements',
        description: 'Need to add more requirements? Click the "+ Add Requirement" button. You can either import from the library (1000+ pre-built requirements) or create custom ones specific to your organization.',
        targetSelector: '[data-tour="requirements-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/requirements',
      },
      {
        id: 'story-requirement-detail',
        title: 'Drill Into a Requirement',
        description: 'Let\'s look at CC1.1 - "Commitment to Integrity and Ethical Values". This is the requirement detail page where you can see the full description, compliance status, linked controls, assessments, and risks.',
        targetSelector: '[data-tour="requirement-detail-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/requirements/soc2-req-cc1-1',
      },
      {
        id: 'story-map-controls-to-requirement',
        title: 'Link Controls to Requirements',
        description: 'Click the "Link Control" button to map controls that address this requirement. You can select multiple controls from your library or create new ones. This mapping proves HOW you meet each requirement.',
        targetSelector: '[data-tour="map-control-button"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/requirements/soc2-req-cc1-1',
      },
      {
        id: 'story-requirement-program-link',
        title: 'Requirements Are Linked to Programs',
        description: 'This requirement is linked to "SOC 2 Type II" program. When you import a framework, all its requirements are automatically linked. You can also manually add requirements to programs from the program detail page.',
        targetSelector: '[data-tour="requirement-program-link"]',
        position: 'left',
        arrowPosition: 'right',
        route: '/requirements/soc2-req-cc1-1',
      },

      // CHAPTER 4: Controls & Testing
      {
        id: 'story-controls-intro',
        title: 'Your Control Library',
        description: 'Controls are HOW you meet requirements. Navigate to Controls to see all 85 SOC 2 controls. They\'re categorized as Preventive (stop issues), Detective (find issues), or Corrective (fix issues).',
        targetSelector: '[data-tour="nav-controls"]',
        position: 'right',
        arrowPosition: 'left',
        route: '/',
      },
      {
        id: 'story-view-controls',
        title: 'Control Effectiveness Dashboard',
        description: 'This dashboard shows all your controls, their effectiveness rating (Effective, Partially Effective, Ineffective, Not Tested), and test results. Green = working, Red = needs attention.',
        targetSelector: '[data-tour="controls-header"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/controls',
      },
      {
        id: 'story-test-controls',
        title: 'Testing Controls',
        description: 'Controls must be tested regularly. Create tests (manual or automated), upload evidence (screenshots, logs, reports), execute tests, and track results. This proves to auditors your controls work.',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },

      // CHAPTER 5: Compliance Tracking
      {
        id: 'story-track-compliance',
        title: 'Real-Time Compliance Tracking',
        description: 'As you map controls, execute tests, and upload evidence, your compliance score updates in real-time. The dashboard shows: Requirements met, Controls effective, Tests passed, and overall compliance %.',
        targetSelector: '[data-tour="compliance-score"]',
        position: 'bottom',
        arrowPosition: 'top',
        route: '/',
      },
      {
        id: 'story-assign-owners',
        title: 'Assign Owners & Collaborate',
        description: 'Compliance is a team effort. Assign requirements to department heads, controls to engineers, and tests to QA. Everyone sees their tasks, deadlines, and can upload evidence directly.',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },
      {
        id: 'story-monitor-progress',
        title: 'Monitor Progress Over Time',
        description: 'Track compliance trends month-over-month. See which requirements are lagging, which controls need retesting, and where to focus your efforts. Export reports for executives and auditors.',
        targetSelector: '[data-tour="compliance-score"]',
        position: 'bottom',
        arrowPosition: 'top',
      },

      // CHAPTER 6: Completion
      {
        id: 'story-complete',
        title: 'You\'re Now SOC 2 Ready! 🎉',
        description: 'You\'ve learned the complete SOC 2 lifecycle: Import framework → Review requirements → Map controls → Execute tests → Upload evidence → Track compliance → Assign owners → Monitor progress. You\'re ready to achieve SOC 2 certification!',
        targetSelector: 'body',
        position: 'center',
        highlightPadding: 0,
      },
    ],
  },
];

// Helper to get tour by ID
export function getTourById(id: string): DemoTour | undefined {
  return demoTours.find(tour => tour.id === id);
}

// Helper to get tours by category
export function getToursByCategory(category: DemoTour['category']): DemoTour[] {
  return demoTours.filter(tour => tour.category === category);
}

