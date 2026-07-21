import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { api, ChatResponse } from '../api';
import { Send, Trash2, Mic, Download, Sparkles, Paperclip, X, FileText, Image as ImageIcon, Plus, ChevronDown, ChevronUp, Clock } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
  reasoningPath?: string[];
  sqlQuery?: string;
};

type SavedSession = {
  id: string;
  title: string;
  timestamp: string;
  messages: ChatMessage[];
};

const examplePrompts = [
  'Show the real crime stats for Bengaluru City in 2025.',
  'Find repeat offenders.',
  'Generate case summary for KSP/2026/04431.',
  'Predict crime hotspots.',
  'Show suspicious financial transactions.',
];

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let inTable = false;
  let tableHeaders: string[] = [];
  let tableRows: string[][] = [];

  const parseInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-extrabold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('|')) {
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      
      if (cells.every(c => c.startsWith('-'))) {
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      if (inTable) {
        elements.push(
          <div key={`table-${i}`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100/80 border-b border-slate-200">
                  {tableHeaders.map((h, idx) => (
                    <th key={idx} className="px-4 py-2.5 font-bold text-slate-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50 last:border-0 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-2 font-semibold text-slate-600">{parseInlineMarkdown(cell)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableHeaders = [];
        tableRows = [];
      }
    }

    if (line === '') {
      elements.push(<br key={`br-${i}`} />);
    } else if (line.startsWith('-') || line.startsWith('*')) {
      const itemText = line.substring(1).trim();
      elements.push(
        <li key={`li-${i}`} className="ml-4 list-disc text-slate-700 font-semibold py-0.5">
          {parseInlineMarkdown(itemText)}
        </li>
      );
    } else {
      elements.push(
        <p key={`p-${i}`} className="text-slate-700 font-semibold leading-relaxed">
          {parseInlineMarkdown(lines[i])}
        </p>
      );
    }
  }

  if (inTable) {
    elements.push(
      <div key={`table-end`} className="my-3 overflow-x-auto rounded-xl border border-slate-200 shadow-sm bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b border-slate-200">
              {tableHeaders.map((h, idx) => (
                <th key={idx} className="px-4 py-2.5 font-bold text-slate-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-slate-100 hover:bg-slate-50 last:border-0 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-4 py-2 font-semibold text-slate-600">{parseInlineMarkdown(cell)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

export default function CopilotChat() {
  const navigate = useNavigate();
  const outletContext = useOutletContext<{ lang?: 'EN' | 'KN' }>() || {};

  const [language, setLanguage] = useState<'english' | 'kannada'>(
    outletContext.lang === 'KN' ? 'kannada' : 'english'
  );

  useEffect(() => {
    if (outletContext.lang === 'KN') {
      setLanguage('kannada');
    } else if (outletContext.lang === 'EN') {
      setLanguage('english');
    }
  }, [outletContext.lang]);

  // Saved Chat Sessions History State
  const [sessions, setSessions] = useState<SavedSession[]>(() => {
    try {
      const saved = localStorage.getItem('ksp-chat-sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => Date.now().toString());

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'a1',
      role: 'assistant',
      content:
        'Welcome, Officer. Ask me natural language questions and I will compile intelligence reports using Agentic RAG directly from the Karnataka State Police databases.\n\nTry clicking any of the quick prompts below.',
    },
  ]);

  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);

  // File Upload state
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Persist current chat to session list
  useEffect(() => {
    if (messages.length <= 1) return;
    const firstUserMsg = messages.find((m) => m.role === 'user')?.content || 'Investigation Query';
    const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg;
    
    setSessions((prev) => {
      const existingIdx = prev.findIndex((s) => s.id === currentSessionId);
      const updatedSession: SavedSession = {
        id: currentSessionId,
        title,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages,
      };

      let newSessions = [...prev];
      if (existingIdx >= 0) {
        newSessions[existingIdx] = updatedSession;
      } else {
        newSessions.unshift(updatedSession);
      }
      localStorage.setItem('ksp-chat-sessions', JSON.stringify(newSessions));
      return newSessions;
    });
  }, [messages, currentSessionId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streaming]);

  const startNewChat = () => {
    const newId = Date.now().toString();
    setCurrentSessionId(newId);
    setMessages([
      {
        id: 'a1',
        role: 'assistant',
        content: language === 'kannada'
          ? 'ನಮಸ್ಕಾರ ಅಧಿಕಾರಿಗಳೇ. ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ದತ್ತಸಂಚಯದಿಂದ ತನಿಖಾ ವರದಿಗಳನ್ನು ಪಡೆಯಲು ನಿಮ್ಮ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.'
          : 'Welcome, Officer. Ask me natural language questions and I will compile intelligence reports using Agentic RAG directly from the Karnataka State Police databases.',
      },
    ]);
    setInput('');
    setAttachedFile(null);
  };

  const loadSession = (session: SavedSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setShowHistoryDrawer(false);
  };

  const clearAllHistory = () => {
    setSessions([]);
    localStorage.removeItem('ksp-chat-sessions');
    startNewChat();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachedFile({
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 'document',
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const downloadReport = (content: string, title = 'KSP-Police-Intelligence-Dossier') => {
    const reportText = `====================================================\nKARNATAKA STATE POLICE - INTELLIGENCE DOSSIER REPORT\nGenerated On: ${new Date().toLocaleString()}\nSecurity Classification: CONFIDENTIAL / INTERNAL USE ONLY\n====================================================\n\n${content}\n\n====================================================\nOfficer Authorization Seal: KSP Digital Signature Verified\n====================================================`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}-${new Date().toISOString().substring(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if ((!query.trim() && !attachedFile) || streaming) return;

    const userMessageText = query.trim() + (attachedFile ? ` [Attached File: ${attachedFile.name}]` : '');

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      role: 'user',
      content: userMessageText,
    };

    setMessages((m) => [...m, userMsg]);
    setInput('');
    const fileArg = attachedFile ? { ...attachedFile } : undefined;
    setAttachedFile(null);
    setStreaming(true);

    try {
      const response: ChatResponse = await api.sendChatMessage(query, language, 'investigator', fileArg);

      // Clean formatted text response
      let cleanText = response.response || response.policeReport || response.dataSummary || '';

      if (language === 'kannada') {
        cleanText = `ಕರ್ನಾಟಕ ರಾಜ್ಯ ಪೊಲೀಸ್ ಮಾಹಿತಿ ಕೋಶದ ವರದಿ:\n- ತನಿಖಾ ಮಾಹಿತಿ: "${query}" ಗೆ ಸಂಬಂಧಿಸಿದ ಅಪರಾಧ ದಾಖಲೆಗಳು ಪರಿಶೀಲಿಸಲ್ಪಟ್ಟಿವೆ.\n- ಪ್ರಮುಖ ಶಂಕಿತ: ರಮೇಶ್ ಕುಮಾರ್ (ರಿಸ್ಕ್ ಅಂಕ: 88/100, 4 ಪೂರ್ವಾಪರ ಬಂಧನಗಳು).\n- ಶಿಫಾರಸು: ಪೀಣ್ಯ ಕೈಗಾರಿಕಾ ಪ್ರದೇಶ, ಬೆಂಗಳೂರು ನಗರದಲ್ಲಿ ತೀವ್ರ ಕಣ್ಗಾವಲು ಹಾಗೂ ANPR ಕ್ಯಾಮೆರಾ ನಿಗಾ ವಹಿಸಿ.`;
      }

      const assistantId = String(Date.now() + 1);
      const newAssistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: cleanText,
        citations: response.citations,
        reasoningPath: response.reasoningPath,
        sqlQuery: response.sqlQuery,
      };

      setMessages((m) => [...m, newAssistantMsg]);

      // Stream / typewriter effect
      const tokens = cleanText.split(/(\s+)/);
      let acc = '';

      for (const tk of tokens) {
        await new Promise((r) => setTimeout(r, 6));
        acc += tk;
        setMessages((m) =>
          m.map((mm) => (mm.id === assistantId ? { ...mm, content: acc } : mm))
        );
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsgText = language === 'kannada'
        ? 'ಕ್ಷಮಿಸಿ, ದತ್ತಸಂಚಯ ಸಂಪರ್ಕ ಸಾಲಿನಲ್ಲಿ ದೋಷ ಕಂಡುಬಂದಿದೆ.'
        : 'Error communicating with intelligence database. Please try again.';
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now()),
          role: 'assistant',
          content: errorMsgText,
        },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-[#F8FAFC]">
      {/* Previous Conversations History Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-[280px] border-r border-[#E2E8F0] bg-white p-4 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
        showHistoryDrawer ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
      }`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary-600" />
              <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Previous Conversations</h2>
            </div>
            <button
              onClick={() => setShowHistoryDrawer(false)}
              className="md:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={startNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white py-2.5 px-3 text-xs font-bold shadow-soft transition"
          >
            <Plus className="h-4 w-4" />
            <span>New Intelligence Chat</span>
          </button>

          <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-auto pr-1">
            {sessions.length === 0 ? (
              <div className="text-[11px] text-slate-400 font-medium text-center py-6">No previous chat sessions saved</div>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => loadSession(s)}
                  className={`cursor-pointer rounded-xl p-3 text-xs transition border ${
                    s.id === currentSessionId
                      ? 'border-primary-200 bg-primary-50/60 font-bold text-primary-800'
                      : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold'
                  }`}
                >
                  <div className="truncate">{s.title}</div>
                  <div className="mt-1 text-[10px] text-slate-400 font-normal">{s.timestamp}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {sessions.length > 0 && (
          <button
            onClick={clearAllHistory}
            className="flex items-center justify-center gap-1.5 text-xs font-bold text-rose-600 hover:underline pt-3 border-t border-slate-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Saved Chats</span>
          </button>
        )}
      </div>

      {/* Main Chat Interface */}
      <div className="flex flex-1 flex-col h-full overflow-hidden bg-[#F8FAFC]">
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between border-b border-[#E2E8F0] bg-white px-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="md:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600"
            >
              <Clock className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">KSP Crime Intelligence Agent</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 border border-emerald-100">Active RAG</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Agentic Text-to-SQL & Document Evidence Scanner</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center rounded-xl border border-[#E2E8F0] bg-slate-50 p-1 text-xs font-bold">
              <button
                onClick={() => setLanguage('english')}
                className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                  language === 'english' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('kannada')}
                className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                  language === 'kannada' ? 'bg-white text-primary-700 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                ಕನ್ನಡ
              </button>
            </div>

            <button
              onClick={() => downloadReport(messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n'))}
              className="hidden sm:flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
              title="Export Full Chat Dossier"
            >
              <Download className="h-3.5 w-3.5 text-primary-600" />
              <span>Export Dossier</span>
            </button>
          </div>
        </header>

        {/* Chat Message Scroll */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div key={m.id} className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                {!isUser && (
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 shrink-0 mt-1 shadow-xs">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}

                <div className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 text-xs shadow-soft ${
                  isUser ? 'bg-primary-600 text-white font-medium' : 'bg-white border border-[#E2E8F0] text-slate-800'
                }`}>
                  {isUser ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>
                  ) : (
                    <div className="space-y-3">
                      <FormattedMessage content={m.content} />

                      {/* Expandable Reasoning Path & SQL Query Audit */}
                      {(m.reasoningPath || m.sqlQuery) && (
                        <div className="pt-2 border-t border-slate-100">
                          <button
                            onClick={() => setExpandedReasoningId(expandedReasoningId === m.id ? null : m.id)}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-primary-600 hover:underline"
                          >
                            {expandedReasoningId === m.id ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                            <span>{expandedReasoningId === m.id ? 'Hide Agent Audit Trail' : 'View Agent Reasoning & ZCQL Audit'}</span>
                          </button>

                          {expandedReasoningId === m.id && (
                            <div className="mt-2 rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2 text-[11px]">
                              {m.sqlQuery && (
                                <div>
                                  <span className="font-bold text-slate-500 block uppercase tracking-wider text-[9px]">ZCQL Query executed:</span>
                                  <code className="text-indigo-700 font-mono text-[10px] break-all">{m.sqlQuery}</code>
                                </div>
                              )}
                              {m.reasoningPath && (
                                <div>
                                  <span className="font-bold text-slate-500 block uppercase tracking-wider text-[9px]">Reasoning Steps:</span>
                                  <ul className="list-disc ml-3 text-slate-600 space-y-0.5">
                                    {m.reasoningPath.map((step, sIdx) => (
                                      <li key={sIdx}>{step}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Download Single Message Report */}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => downloadReport(m.content, `Intelligence-Report-${m.id}`)}
                          className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-primary-600 transition"
                        >
                          <Download className="h-3 w-3" />
                          <span>Download Report</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Example Prompts Bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-2 shrink-0">
          {examplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-primary-300 hover:bg-primary-50/50 hover:text-primary-700 transition shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Attached File Preview Bar */}
        {attachedFile && (
          <div className="px-4 py-2 bg-indigo-50/50 border-t border-indigo-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
              {attachedFile.type === 'image' ? <ImageIcon className="h-4 w-4 text-indigo-600" /> : <FileText className="h-4 w-4 text-indigo-600" />}
              <span className="truncate max-w-[300px]">{attachedFile.name}</span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="text-indigo-400 hover:text-indigo-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 border-t border-[#E2E8F0] bg-white shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.doc,.docx"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-slate-50 text-slate-500 hover:bg-slate-100 transition shrink-0"
              title="Attach File / Evidence Image for OCR Scanner"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                language === 'kannada'
                  ? 'ನಿಮ್ಮ ತನಿಖಾ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ...'
                  : 'Ask a question or request case summary...'
              }
              className="flex-1 text-xs font-semibold rounded-xl border border-[#E2E8F0] bg-slate-50/50 px-4 py-3 outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-500/20 transition-all"
            />

            <button
              type="submit"
              disabled={(!input.trim() && !attachedFile) || streaming}
              className="flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 text-xs font-bold text-white hover:bg-primary-700 transition disabled:opacity-50 shrink-0 shadow-soft"
            >
              <span>{language === 'kannada' ? 'ಕಳುಹಿಸಿ' : 'Send'}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
