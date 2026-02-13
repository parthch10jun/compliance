'use client';

import { ArrowRight, Download, Shield, Globe, BookOpen, Scale, UserCheck, FileCheck } from 'lucide-react';
import clsx from 'clsx';

const hubSections = [
  {
    id: 'basics',
    title: 'DPDP Act Basics',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-600',
    description: 'Essential information to understand India\'s Digital Personal Data Protection Act',
    resources: [
      {
        title: 'Your complete guide to DPDP Act 2023',
        description: 'The Digital Personal Data Protection Act 2023 establishes a comprehensive framework for data protection in India. Learn what it is, who it applies to, and how to achieve compliance.',
        type: 'Article',
        badge: 'DPDP 2023',
        link: '#',
      },
      {
        title: 'Understanding Data Fiduciaries and Data Processors',
        description: 'Learn about the key roles and responsibilities under DPDP - from Data Fiduciaries to Data Processors and their obligations.',
        type: 'Article',
        badge: 'Roles & Responsibilities',
        link: '#',
      },
      {
        title: 'DPDP Act: Key Definitions and Concepts',
        description: 'A comprehensive glossary of essential terms including personal data, consent, data principal, and more.',
        type: 'Free Download',
        badge: 'Glossary',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'consent',
    title: 'Consent Management',
    icon: UserCheck,
    color: 'from-emerald-500 to-teal-600',
    description: 'Guidance on implementing valid consent mechanisms under DPDP',
    resources: [
      {
        title: 'DPDP Consent Requirements: Complete Guide',
        description: 'Understand the requirements for valid consent under DPDP - free, specific, informed, unconditional, and unambiguous with clear affirmative action.',
        type: 'Article',
        badge: 'Consent',
        link: '#',
      },
      {
        title: 'Consent Notice Templates',
        description: 'Ready-to-use templates for consent notices that meet DPDP requirements in English and Hindi.',
        type: 'Free Download',
        badge: 'Templates',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Consent Management System Checklist',
        description: 'Ensure your consent management system captures, records, and manages consent withdrawal effectively.',
        type: 'Free Download',
        badge: 'Checklist',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'rights',
    title: 'Data Principal Rights',
    icon: Scale,
    color: 'from-violet-500 to-purple-600',
    description: 'Understanding and implementing data subject rights under DPDP',
    resources: [
      {
        title: 'Data Principal Rights: Implementation Guide',
        description: 'Learn how to implement the rights to access, correction, erasure, grievance redressal, and nomination under DPDP Act.',
        type: 'Article',
        badge: 'Rights',
        link: '#',
      },
      {
        title: 'Rights Request Response Templates',
        description: 'Templates for responding to data principal requests for access, correction, erasure, and grievance redressal.',
        type: 'Free Download',
        badge: 'Templates',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Grievance Redressal Mechanism Setup',
        description: 'Step-by-step guide to establishing an effective grievance redressal mechanism as required by DPDP.',
        type: 'Article',
        badge: 'Grievance',
        link: '#',
      },
    ],
  },
  {
    id: 'obligations',
    title: 'Fiduciary Obligations',
    icon: Shield,
    color: 'from-amber-500 to-orange-600',
    description: 'Key obligations for Data Fiduciaries under DPDP Act',
    resources: [
      {
        title: 'Data Fiduciary Obligations Checklist',
        description: 'Complete checklist covering purpose limitation, data minimization, accuracy, storage limitation, and security safeguards.',
        type: 'Free Download',
        badge: 'Checklist',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Implementing Reasonable Security Safeguards',
        description: 'Practical guidance on implementing technical and organizational measures to protect personal data.',
        type: 'Article',
        badge: 'Security',
        link: '#',
      },
      {
        title: 'Data Breach Response Plan Template',
        description: 'Template for creating a data breach notification and response plan compliant with DPDP requirements.',
        type: 'Free Download',
        badge: 'Template',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'cross-border',
    title: 'Cross-Border Data Transfers',
    icon: Globe,
    color: 'from-red-500 to-pink-600',
    description: 'Guidelines for transferring personal data outside India',
    resources: [
      {
        title: 'Cross-Border Transfer Requirements',
        description: 'Understand the restrictions and requirements for transferring personal data to countries notified by the Central Government.',
        type: 'Article',
        badge: 'Transfers',
        link: '#',
      },
      {
        title: 'Data Transfer Impact Assessment Template',
        description: 'Template for assessing and documenting cross-border data transfer risks and safeguards.',
        type: 'Free Download',
        badge: 'Template',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & Enforcement',
    icon: FileCheck,
    color: 'from-indigo-500 to-blue-600',
    description: 'Resources for maintaining compliance and understanding enforcement',
    resources: [
      {
        title: 'DPDP Compliance Roadmap',
        description: 'Step-by-step roadmap to achieve and maintain compliance with the DPDP Act 2023.',
        type: 'Article',
        badge: 'Roadmap',
        link: '#',
      },
      {
        title: 'Understanding DPDP Penalties',
        description: 'Learn about the penalty framework - up to ₹250 crores for violations and the Data Protection Board\'s enforcement powers.',
        type: 'Article',
        badge: 'Penalties',
        link: '#',
      },
      {
        title: 'DPDP Compliance Audit Checklist',
        description: 'Comprehensive checklist for conducting internal audits of your DPDP compliance program.',
        type: 'Free Download',
        badge: 'Checklist',
        link: '#',
        downloadable: true,
      },
    ],
  },
];

export default function DPDPHubPage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 p-12 text-center animate-fade-in-up">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_50%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-p2 font-semibold text-orange-900 mb-3 uppercase tracking-wider">Resources</p>
          <h1 className="text-[3.5rem] font-black text-gray-900 mb-4 tracking-tight leading-tight">
            DPDP Act Hub
          </h1>
          <p className="text-h4 text-gray-800 max-w-3xl mx-auto leading-relaxed">
            A comprehensive digital content hub offering in-depth information on India's Digital Personal Data Protection Act 2023, compliance requirements, and implementation guidance.
          </p>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-white/30 rounded-full" />
        <div className="absolute bottom-10 right-10 w-16 h-16 border-4 border-white/30 rounded-full" />
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/20 rounded-lg rotate-12" />
        <div className="absolute top-1/3 right-1/4 w-10 h-10 bg-white/20 rounded-lg -rotate-12" />
      </div>

      {/* Featured Resource */}
      <div className="rounded-2xl border border-[var(--border)] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 animate-fade-in-up delay-1">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-12 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
            <div className="relative w-80 h-80 rounded-full border-8 border-gray-900 flex items-center justify-center bg-gradient-to-br from-orange-400 to-red-500">
              <div className="text-center px-8">
                <Shield size={64} className="mx-auto mb-4 text-gray-900" />
                <div className="text-5xl font-black text-gray-900">DPDP</div>
                <div className="text-6xl font-black text-gray-900">2023</div>
                <div className="mt-4 text-xs font-bold text-gray-900 uppercase tracking-wider break-words">
                  India's Data Protection Law
                </div>
              </div>
            </div>
          </div>
          <div className="p-12 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-p3 font-bold mb-4 w-fit">
              DPDP Act 2023
            </span>
            <h2 className="text-h2 font-bold text-[var(--foreground)] mb-4">
              Your complete guide to DPDP Act 2023
            </h2>
            <p className="text-p2 text-[var(--foreground-muted)] mb-6 leading-relaxed">
              The Digital Personal Data Protection Act 2023 establishes a comprehensive framework for data protection in India. Learn what it is, who it applies to, key obligations, and how to achieve compliance with this landmark legislation.
            </p>
            <button className="flex items-center gap-2 text-[var(--primary)] font-semibold text-p2 hover:gap-3 transition-all group">
              Read more
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Hub Sections */}
      <div className="space-y-12 animate-fade-in-up delay-2">
        {hubSections.map((section) => {
          const SectionIcon = section.icon;
          return (
            <div key={section.id} className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-4 pb-4 border-b-2 border-[var(--border)]">
                <div className={clsx('w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center', section.color)}>
                  <SectionIcon size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-h2 font-bold text-[var(--foreground)]">{section.title}</h2>
                  <p className="text-p2 text-[var(--foreground-muted)] mt-1">{section.description}</p>
                </div>
              </div>

              {/* Resources Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.resources.map((resource, resourceIndex) => (
                  <div
                    key={resourceIndex}
                    className="group rounded-xl border border-[var(--border)] bg-white p-6 hover:shadow-xl hover:border-[var(--primary)] transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className={clsx(
                        'inline-block px-3 py-1 rounded-full text-p3 font-bold',
                        resource.downloadable
                          ? 'bg-emerald-100 text-emerald-700'
                          : resource.type === 'Fast Track Tool'
                          ? 'bg-violet-100 text-violet-700'
                          : 'bg-blue-100 text-blue-700'
                      )}>
                        {resource.badge}
                      </span>
                      {resource.downloadable && (
                        <Download size={18} className="text-[var(--foreground-muted)] group-hover:text-[var(--primary)] transition-colors" />
                      )}
                    </div>
                    <h3 className="text-h4 font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--primary)] transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-p2 text-[var(--foreground-muted)] mb-4 leading-relaxed line-clamp-3">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-p3 font-medium text-[var(--foreground-muted)]">{resource.type}</span>
                      <ArrowRight size={18} className="text-[var(--primary)] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 p-12 text-center text-white animate-fade-in-up delay-3">
        <h2 className="text-h2 font-bold mb-4">Ready to start your DPDP compliance journey?</h2>
        <p className="text-p1 mb-8 max-w-2xl mx-auto opacity-90">
          Get started with our comprehensive platform and achieve DPDP compliance faster with expert guidance, pre-built templates, and automated workflows.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:shadow-xl transition-all">
            Start Free Trial
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
            Book a Demo
          </button>
        </div>
      </div>
    </div>
  );
}

