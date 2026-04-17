'use client';

import { useState } from 'react';
import { Save, Eye, Copy, Check } from 'lucide-react';
import { mockEmailTemplates, type EmailTemplate } from '@/lib/data/notifications';

export default function EmailTemplateEditor() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockEmailTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate>(templates[0]);
  const [subject, setSubject] = useState(selectedTemplate.subject);
  const [body, setBody] = useState(selectedTemplate.body);
  const [showPreview, setShowPreview] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      setSubject(template.subject);
      setBody(template.body);
      setShowPreview(false);
    }
  };

  const handleSave = () => {
    setTemplates(prev => prev.map(t => 
      t.id === selectedTemplate.id 
        ? { ...t, subject, body }
        : t
    ));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const insertVariable = (variable: string) => {
    setBody(prev => prev + `{{${variable}}}`);
  };

  const getPreviewContent = () => {
    let previewSubject = subject;
    let previewBody = body;

    // Replace variables with sample data
    const sampleData: Record<string, string> = {
      risk_id: 'RSK-015',
      risk_title: 'Customer data privacy breach',
      owner_name: 'Sarah Chen',
      current_rating: 'High',
      threshold: 'Medium',
      date: new Date().toLocaleDateString(),
      category: 'Cybersecurity',
    };

    Object.entries(sampleData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      previewSubject = previewSubject.replace(regex, value);
      previewBody = previewBody.replace(regex, value);
    });

    return { previewSubject, previewBody };
  };

  const { previewSubject, previewBody } = getPreviewContent();

  return (
    <div className="max-w-5xl">
      {/* Template Selector */}
      <div className="bg-white border border-[var(--border)] rounded-lg p-6 mb-6">
        <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
          Select Template
        </label>
        <select
          value={selectedTemplate.id}
          onChange={(e) => handleTemplateChange(e.target.value)}
          className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
        >
          {templates.map(template => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white border border-[var(--border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Template Editor</h2>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--primary)] hover:bg-[var(--background-secondary)] rounded-md transition-colors"
            >
              <Eye size={16} />
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              placeholder="Enter subject line..."
            />
          </div>

          {/* Body */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Email Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-[var(--border)] rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent font-mono text-sm"
              placeholder="Enter email body..."
            />
          </div>

          {/* Variables */}
          <div>
            <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
              Available Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.variables.map(variable => (
                <button
                  key={variable}
                  onClick={() => insertVariable(variable)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-xs font-mono rounded transition-colors flex items-center gap-1"
                >
                  <Copy size={12} />
                  {`{{${variable}}}`}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--foreground-muted)] mt-2">
              Click to insert variable into email body
            </p>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex items-center justify-between">
            {saved && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <Check size={16} />
                Template saved
              </div>
            )}
            <button
              onClick={handleSave}
              className="ml-auto px-6 py-2 bg-[var(--primary)] text-white rounded-lg hover:bg-[var(--primary-dark)] transition-colors flex items-center gap-2 font-medium"
            >
              <Save size={18} />
              Save Template
            </button>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="bg-white border border-[var(--border)] rounded-lg p-6">
            <h2 className="text-lg font-semibold text-[var(--foreground)] mb-4">Email Preview</h2>
            
            <div className="border border-[var(--border)] rounded-lg p-4 bg-gray-50">
              {/* Email Header */}
              <div className="mb-4 pb-4 border-b border-[var(--border)]">
                <div className="text-xs text-[var(--foreground-muted)] mb-1">Subject:</div>
                <div className="font-semibold text-[var(--foreground)]">{previewSubject}</div>
              </div>

              {/* Email Body */}
              <div className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-sans">
                {previewBody}
              </div>
            </div>

            <p className="text-xs text-[var(--foreground-muted)] mt-4">
              This preview shows how the email will look with sample data. Variables are replaced with example values.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
