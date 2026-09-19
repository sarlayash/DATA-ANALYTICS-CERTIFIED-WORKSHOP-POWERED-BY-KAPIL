import React, { useState } from 'react';
import { SIMPLE_NOTES_DATA } from '../data/simpleNotesData';
import { 
  BookOpen, 
  Copy, 
  Check, 
  AlertTriangle, 
  Lightbulb, 
  Calculator, 
  FileText,
  Search,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface SimpleNotesTabProps {
  dayNumber: number;
}

export const SimpleNotesTab: React.FC<SimpleNotesTabProps> = ({ dayNumber }) => {
  const [copiedFormulaIndex, setCopiedFormulaIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const noteData = SIMPLE_NOTES_DATA.find(n => n.day === dayNumber) || SIMPLE_NOTES_DATA[0];

  const handleCopyFormula = (syntax: string, idx: number) => {
    navigator.clipboard.writeText(syntax);
    setCopiedFormulaIndex(idx);
    setTimeout(() => setCopiedFormulaIndex(null), 2000);
  };

  const filteredCheatSheets = noteData.cheatSheet.filter(sheet => 
    sheet.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sheet.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredFormulas = noteData.keyFormulasAndSyntax.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.syntax.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.usage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-2">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              Day {dayNumber} Simple Notes & Pocket Cheat Sheet
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Day {dayNumber}: {noteData.domain}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
              {noteData.summary}
            </p>
          </div>
        </div>

        {/* Quick Search inside Notes */}
        <div className="mt-6 relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search cheat sheets, syntax, formulas, and rules in today's notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Cheat Sheet Categories */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Core Reference Cheat Sheets ({filteredCheatSheets.length})
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCheatSheets.map((sheet, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-5 shadow-xs hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700/60">
                <span className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {sheet.category}
                </h4>
              </div>

              <ul className="space-y-2">
                {sheet.items.map((item, iIdx) => (
                  <li key={iIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Key Formulas & Syntax Cards */}
      {filteredFormulas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-500" />
            Key Formulas, Operations & Syntax
          </h3>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredFormulas.map((formula, fIdx) => {
              const isCopied = copiedFormulaIndex === fIdx;

              return (
                <div 
                  key={fIdx}
                  className="bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {formula.name}
                    </span>
                    <button
                      onClick={() => handleCopyFormula(formula.syntax, fIdx)}
                      className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-500 font-medium">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Syntax</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 text-amber-300 font-mono text-xs overflow-x-auto border border-slate-800">
                    <code>{formula.syntax}</code>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-700 dark:text-slate-300">When to use: </strong>
                    {formula.usage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Common Mistakes to Avoid & Pro Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Mistakes */}
        <div className="bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/30 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Common Beginner Mistakes to Avoid
          </h4>
          <ul className="space-y-2">
            {noteData.commonMistakes.map((mistake, mIdx) => (
              <li key={mIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                <span className="text-rose-500 font-bold shrink-0">✕</span>
                <span>{mistake}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Real-World Pro Tips */}
        <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Staff Data Analyst Pro Tips
          </h4>
          <ul className="space-y-2">
            {noteData.proTips.map((tip, pIdx) => (
              <li key={pIdx} className="text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
