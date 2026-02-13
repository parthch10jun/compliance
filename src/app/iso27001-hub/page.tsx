'use client';

import { useState } from 'react';
import { PageHeader } from '@/components';
import { BookOpen, FileText, Award, Lightbulb, CheckCircle, ArrowRight, Download, ExternalLink, Shield, Lock, Globe, Users, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

const hubSections = [
  {
    id: 'basics',
    title: 'ISO 27001 Basics',
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-600',
    description: 'Essential information to get started with ISO 27001',
    resources: [
      {
        title: 'Your complete guide to ISO 27001',
        description: 'ISO 27001 provides organisations with a structured framework to safeguard their information assets and ISMS. In this article we\'ll explore in detail what it is, why you need it, and how to achieve certification.',
        type: 'Article',
        badge: 'ISO 27001',
        link: '#',
      },
      {
        title: 'The proven path to ISO 27001 success',
        description: 'If you\'re approaching ISO 27001 for the first time it can be a bit intimidating. In this free guide we outline what the standard is, what an ISMS is, and what are the key areas your business needs to address.',
        type: 'Free Download',
        badge: 'Guide',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Everything you need to know about the ISO 27001:2022 update',
        description: 'A new and improved version of ISO 27001 was published in 2022 to address growing global cybersecurity challenges and improve digital trust.',
        type: 'Free Download',
        badge: 'Updated 2025',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'implementation',
    title: 'Implementation & Certification',
    icon: Target,
    color: 'from-emerald-500 to-teal-600',
    description: 'Step-by-step guidance for implementing and achieving certification',
    resources: [
      {
        title: 'Headstart: Begin with 81% of the work already complete',
        description: 'Up to 81% of the work is already done for you thanks to Headstart, our pre-built bank of ISO 27001 controls, frameworks, policies & controls, and more.',
        type: 'Fast Track Tool',
        badge: 'Headstart',
        link: '#',
      },
      {
        title: 'Assured Results Method: Step-by-step guidance',
        description: 'The Assured Results Method is your simple, practical, time-saving path to first-time ISO 27001 success. Broken into 11 steps, just run through the process one step at a time.',
        type: 'Fast Track Tool',
        badge: 'ARM',
        link: '#',
      },
      {
        title: 'Virtual Coach: Your always-on guide to ISO 27001',
        description: 'Created by our in-house ISO 27001 experts, Virtual Coach delivers simple, practical advice whenever and wherever you need it, giving you the confidence that you\'re on the right path.',
        type: 'Fast Track Tool',
        badge: 'Virtual Coach',
        link: '#',
      },
    ],
  },
  {
    id: 'controls',
    title: 'Annex A Controls',
    icon: Shield,
    color: 'from-violet-500 to-purple-600',
    description: 'Detailed information on ISO 27001 Annex A controls',
    resources: [
      {
        title: 'ISO 27001 Annex A Controls: Complete guide',
        description: 'A comprehensive breakdown of all 93 Annex A controls in ISO 27001:2022, organized by category with implementation guidance.',
        type: 'Article',
        badge: '93 Controls',
        link: '#',
      },
      {
        title: 'Annex A Controls Checklist',
        description: 'Download our complete checklist of all Annex A controls to track your implementation progress.',
        type: 'Free Download',
        badge: 'Checklist',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'compliance',
    title: 'Compliance & Auditing',
    icon: Award,
    color: 'from-amber-500 to-orange-600',
    description: 'Resources for maintaining compliance and preparing for audits',
    resources: [
      {
        title: 'How to prepare for your ISO 27001 audit',
        description: 'Everything you need to know to prepare for and successfully pass your ISO 27001 certification audit.',
        type: 'Article',
        badge: 'Audit Prep',
        link: '#',
      },
      {
        title: 'Internal audit checklist',
        description: 'Use this comprehensive checklist to conduct thorough internal audits of your ISMS.',
        type: 'Free Download',
        badge: 'Checklist',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Maintaining your ISO 27001 certification',
        description: 'Best practices for maintaining compliance and preparing for surveillance audits.',
        type: 'Article',
        badge: 'Maintenance',
        link: '#',
      },
    ],
  },
  {
    id: 'risk',
    title: 'Risk Management',
    icon: Zap,
    color: 'from-red-500 to-pink-600',
    description: 'Tools and guidance for effective risk management',
    resources: [
      {
        title: 'ISO 27001 Risk Assessment Guide',
        description: 'Learn how to conduct comprehensive risk assessments that meet ISO 27001 requirements.',
        type: 'Article',
        badge: 'Risk Assessment',
        link: '#',
      },
      {
        title: 'Risk Treatment Plan Template',
        description: 'Download our template to document your risk treatment decisions and implementation plans.',
        type: 'Free Download',
        badge: 'Template',
        link: '#',
        downloadable: true,
      },
    ],
  },
  {
    id: 'resources',
    title: 'Templates & Tools',
    icon: FileText,
    color: 'from-indigo-500 to-blue-600',
    description: 'Ready-to-use templates and tools for your ISMS',
    resources: [
      {
        title: 'ISMS Policy Templates',
        description: 'Complete set of policy templates covering all required ISO 27001 documentation.',
        type: 'Free Download',
        badge: 'Templates',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Statement of Applicability (SoA) Template',
        description: 'Pre-formatted SoA template to document your Annex A control decisions.',
        type: 'Free Download',
        badge: 'Template',
        link: '#',
        downloadable: true,
      },
      {
        title: 'Gap Analysis Tool',
        description: 'Assess your current security posture against ISO 27001 requirements.',
        type: 'Tool',
        badge: 'Assessment',
        link: '#',
      },
    ],
  },
];

export default function ISO27001HubPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 p-12 text-center animate-fade-in-up">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15),transparent_50%)]" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <p className="text-p2 font-semibold text-emerald-900 mb-3 uppercase tracking-wider">Resources</p>
          <h1 className="text-[3.5rem] font-black text-gray-900 mb-4 tracking-tight leading-tight">
            ISO 27001 Hub
          </h1>
          <p className="text-h4 text-gray-800 max-w-3xl mx-auto leading-relaxed">
            A comprehensive digital content hub offering in-depth information on the ISO 27001 standard, compliance and certification.
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
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
            <div className="relative w-80 h-80 rounded-full border-8 border-gray-900 flex items-center justify-center bg-gradient-to-br from-emerald-400 to-teal-500">
              <div className="text-center px-8">
                <Globe size={64} className="mx-auto mb-4 text-gray-900" />
                <div className="text-5xl font-black text-gray-900">ISO</div>
                <div className="text-6xl font-black text-gray-900">27001</div>
                <div className="mt-4 text-xs font-bold text-gray-900 uppercase tracking-wider break-words">
                  Everything You Need To Know
                </div>
              </div>
            </div>
          </div>
          <div className="p-12 flex flex-col justify-center">
            <span className="inline-block px-3 py-1 bg-[var(--primary-lightest)] text-[var(--primary)] rounded-full text-p3 font-bold mb-4 w-fit">
              ISO 27001
            </span>
            <h2 className="text-h2 font-bold text-[var(--foreground)] mb-4">
              Your complete guide to ISO 27001
            </h2>
            <p className="text-p2 text-[var(--foreground-muted)] mb-6 leading-relaxed">
              ISO 27001 provides organisations with a structured framework to safeguard their information assets and ISMS. In this article we'll explore in detail what it is, why you need it, and how to achieve certification.
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
      <div className="rounded-2xl bg-gradient-to-br from-[var(--primary)] to-blue-600 p-12 text-center text-white animate-fade-in-up delay-3">
        <h2 className="text-h2 font-bold mb-4">Ready to start your ISO 27001 journey?</h2>
        <p className="text-p1 mb-8 max-w-2xl mx-auto opacity-90">
          Get started with our comprehensive platform and achieve certification faster with expert guidance and pre-built templates.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-8 py-3 bg-white text-[var(--primary)] rounded-xl font-semibold hover:shadow-xl transition-all">
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


