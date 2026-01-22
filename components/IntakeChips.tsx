'use client';

import { useState } from 'react';
import { FileWarning, FileSignature, Scale, Receipt, Copy, Check, MessageCircle } from 'lucide-react';
import { intakeTemplates, enrichTemplate } from '@/lib/templates';
import { copyToClipboard, generateMetaFooter, devLog } from '@/lib/utils';
import { useToast } from './Toast';

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  FileWarning,
  FileSignature,
  Scale,
  Receipt,
};

export default function IntakeChips() {
  const { showToast } = useToast();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleChipClick = async (templateId: string) => {
    const template = intakeTemplates.find((t) => t.id === templateId);
    if (!template) return;

    devLog('intake-chip-clicked', { templateId });

    // Generate metadata footer
    const metaFooter = generateMetaFooter();
    const fullTemplate = enrichTemplate(template.template, metaFooter);

    // Copy to clipboard
    const copySuccess = await copyToClipboard(fullTemplate);

    if (copySuccess) {
      setCopiedId(templateId);
      showToast('Šablonas nukopijuotas – įklijuok į chatą', 'success');
      devLog('template-copied', { templateId });

      // Reset copy indicator
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } else {
      showToast('Nepavyko nukopijuoti. Bandykite dar kartą.', 'error');
      devLog('template-copy-failed', { templateId });
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-navy-400">
        Greitas startas – pasirink šabloną:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {intakeTemplates.map((template) => {
          const IconComponent = iconMap[template.icon] || FileWarning;
          const isCopied = copiedId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => handleChipClick(template.id)}
              className="intake-chip justify-start text-left group"
              aria-label={`${template.title} - ${template.description}`}
            >
              <div className="flex items-center gap-3 w-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-navy-700/50 flex items-center justify-center group-hover:bg-accent-blue/20 transition-colors">
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <IconComponent className="w-4 h-4 text-accent-blue" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">{template.title}</p>
                  <p className="text-xs text-navy-400 truncate">{template.description}</p>
                </div>
                <Copy className="w-4 h-4 text-navy-500 group-hover:text-navy-300 flex-shrink-0" />
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-navy-500 flex items-center gap-1">
        <MessageCircle className="w-3 h-3" />
        Spustelėjus šablonas nukopijuojamas – įklijuok į chatą
      </p>
    </div>
  );
}
