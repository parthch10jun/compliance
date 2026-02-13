# Regulatory Intelligence System - Technical Architecture

## Overview
This document outlines the technical architecture for Ascent's Regulatory Intelligence system that monitors RBI updates in real-time and automatically assesses their impact on NBFC compliance programs.

## System Components

### 1. Regulatory Monitoring Engine

#### Data Sources
- **RBI Official Website**
  - RSS Feeds: `https://rbi.org.in/Scripts/BS_PressReleaseDisplay.aspx`
  - Master Directions Page
  - Circulars & Notifications
  
- **Secondary Sources**
  - SEBI (for NBFCs in capital markets)
  - MCA (corporate governance overlaps)
  - Industry associations (NBFC forums)

#### Scraping & Monitoring
```typescript
// Automated scraper runs every 6 hours
interface RegulatorySource {
  id: string;
  name: string;
  url: string;
  scrapingFrequency: number; // in hours
  lastScraped: Date;
  parser: (html: string) => RegulatoryUpdate[];
}

interface RegulatoryUpdate {
  sourceId: string;
  title: string;
  publicationDate: Date;
  documentUrl: string;
  rawContent: string;
  category: string; // "circular" | "master-direction" | "notification"
  status: "pending-review" | "analyzed" | "published";
}
```

#### AI-Powered Classification
```typescript
// Uses LLM to classify and extract key information
interface AIClassification {
  updateId: string;
  isRelevantToNBFCs: boolean;
  affectedNBFCTypes: string[]; // ["NBFC-D", "NBFC-ND", "NBFC-MFI", etc.]
  affectedLayers: string[]; // ["Base", "Middle", "Upper", "Top"]
  regulatoryArea: string[]; // ["Capital Adequacy", "Governance", "Risk Management"]
  changeType: "new" | "amendment" | "clarification" | "withdrawal";
  severity: "critical" | "high" | "medium" | "low";
  effectiveDate: Date | null;
  implementationDeadline: Date | null;
  keyChanges: string[];
  affectedSections: string[]; // Which sections of Master Directions
}
```

### 2. Requirement Versioning System

#### Database Schema
```sql
-- Master Directions (e.g., Scale Based Regulation)
CREATE TABLE master_directions (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL, -- "RBI-SBR-2022"
  category VARCHAR(100),
  first_published DATE,
  current_version_id UUID REFERENCES requirement_versions(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sections within Master Directions
CREATE TABLE requirement_sections (
  id UUID PRIMARY KEY,
  master_direction_id UUID REFERENCES master_directions(id),
  section_number VARCHAR(50), -- "13.2"
  section_title VARCHAR(255), -- "Capital Adequacy Ratio"
  parent_section_id UUID REFERENCES requirement_sections(id), -- for nested sections
  created_at TIMESTAMP DEFAULT NOW()
);

-- Versioned Requirements
CREATE TABLE requirement_versions (
  id UUID PRIMARY KEY,
  section_id UUID REFERENCES requirement_sections(id),
  version_number VARCHAR(20), -- "v1.0", "v2.0"
  requirement_text TEXT NOT NULL,
  plain_english_interpretation TEXT,
  implementation_guidance TEXT,
  effective_date DATE NOT NULL,
  end_date DATE, -- NULL if currently active
  status VARCHAR(20), -- "active" | "upcoming" | "archived"
  change_summary TEXT,
  source_document_url VARCHAR(500),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Track what changed between versions
CREATE TABLE requirement_changes (
  id UUID PRIMARY KEY,
  from_version_id UUID REFERENCES requirement_versions(id),
  to_version_id UUID REFERENCES requirement_versions(id),
  change_type VARCHAR(50), -- "text_modified" | "threshold_changed" | "new_clause_added"
  change_description TEXT,
  impact_level VARCHAR(20), -- "breaking" | "additive" | "clarification"
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Applicability Engine

#### Client Profile Matching
```typescript
interface NBFCProfile {
  clientId: string;
  nbfcType: "NBFC-D" | "NBFC-ND" | "NBFC-MFI" | "NBFC-IDF" | "NBFC-Factor";
  currentLayer: "Base" | "Middle" | "Upper" | "Top";
  assetsUnderManagement: number; // in crores
  registrationDate: Date;
  businessActivities: string[];
  geographicPresence: string[];
  lastAuditDate: Date;
}

// Determines which requirements apply to which clients
interface ApplicabilityRule {
  requirementVersionId: string;
  conditions: {
    nbfcTypes?: string[];
    layers?: string[];
    minAUM?: number;
    maxAUM?: number;
    businessActivities?: string[];
    customLogic?: (profile: NBFCProfile) => boolean;
  };
}

function isRequirementApplicable(
  requirement: RequirementVersion,
  client: NBFCProfile
): boolean {
  const rule = getApplicabilityRule(requirement.id);
  
  // Check NBFC type
  if (rule.conditions.nbfcTypes && 
      !rule.conditions.nbfcTypes.includes(client.nbfcType)) {
    return false;
  }
  
  // Check layer
  if (rule.conditions.layers && 
      !rule.conditions.layers.includes(client.currentLayer)) {
    return false;
  }
  
  // Check AUM thresholds
  if (rule.conditions.minAUM && 
      client.assetsUnderManagement < rule.conditions.minAUM) {
    return false;
  }
  
  // Custom logic for complex rules
  if (rule.conditions.customLogic && 
      !rule.conditions.customLogic(client)) {
    return false;
  }
  
  return true;
}
```

### 4. Impact Assessment Engine

#### Automated Impact Analysis
```typescript
interface ImpactAssessment {
  updateId: string;
  clientId: string;
  assessmentDate: Date;
  
  // What's affected
  affectedRequirements: {
    requirementId: string;
    oldVersionId: string;
    newVersionId: string;
    changeType: string;
  }[];
  
  affectedControls: {
    controlId: string;
    controlName: string;
    currentStatus: string;
    projectedStatus: string; // after change
  }[];
  
  affectedPolicies: {
    policyId: string;
    policyName: string;
    sectionsToUpdate: string[];
  }[];
  
  // Compliance gap analysis
  complianceGaps: {
    requirementId: string;
    currentValue: any;
    requiredValue: any;
    gapDescription: string;
    severity: "critical" | "high" | "medium" | "low";
  }[];
  
  // Auto-generated remediation
  remediationTasks: {
    taskId: string;
    title: string;
    description: string;
    assignedTo: string; // role or user
    dueDate: Date;
    estimatedEffort: string;
    dependencies: string[];
  }[];
  
  // Cost & timeline
  estimatedCost: number;
  estimatedTimeToComply: number; // in days
  riskLevel: "high" | "medium" | "low";
}
```


