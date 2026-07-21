import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api, ChatResponse } from '../api';
import { Send, Trash2, Mic, MicOff, Volume2, Download, Sparkles, Paperclip, X, FileText, Image, Plus } from 'lucide-react';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: any[];
  reasoningPath?: string[];
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

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'a1',
      role: 'assistant',
      content:
        'Welcome, Officer. Ask me natural language questions and I will compile intelligence reports using SQLite Text-to-SQL Agentic RAG directly from the state crime databases.\n\nTry clicking any of the quick prompts below.',
    },
  ]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [language, setLanguage] = useState<'english' | 'kannada'>('english');
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  // File Upload state
  const [attachedFile, setAttachedFile] = useState<{ name: string; type: string; base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const listRef = useRef<HTMLDivElement | null>(null);

  // Load chat history from SQLite on mount
  useEffect(() => {
    api.getChatHistory()
      .then((history) => {
        if (history && history.length > 0) {
          setMessages(
            history.map((h, idx) => ({
              id: `sqlite-msg-${idx}`,
              role: h.role,
              content: h.content,
              citations: h.citations,
              reasoningPath: h.reasoningPath,
            }))
          );
        }
      })
      .catch((err) => console.error('Error loading SQLite chat history:', err));
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [messages, streaming]);

  function scrollToEnd() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => prev + ' ' + transcript);
        setIsListening(false);
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported in this browser version. Please try Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = language === 'kannada' ? 'kn-IN' : 'en-IN';
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Text to Speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const clean = text.replace(/[*#`_\-]/g, '').substring(0, 400);
      const utterance = new SpeechSynthesisUtterance(clean);
      
      if (language === 'kannada') {
        utterance.lang = 'kn-IN';
        const voices = window.speechSynthesis.getVoices();
        const knVoice = voices.find((v) => v.lang.includes('kn') || v.name.toLowerCase().includes('kannada'));
        if (knVoice) utterance.voice = knVoice;
      } else {
        utterance.lang = 'en-IN';
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Text to speech not supported in this browser.');
    }
  };

  // Convert uploaded files to base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        name: file.name,
        type: file.type,
        base64: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeAttachedFile = () => {
    setAttachedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  async function handleSend() {
    const text = input.trim();
    if (!text && !attachedFile) return;
    if (streaming) return;

    const userMsgId = String(Date.now());
    const displayMsg = attachedFile ? `[Attached: ${attachedFile.name}] ${text}` : text;
    const userMsg: ChatMessage = { id: userMsgId, role: 'user', content: displayMsg };
    
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setStreaming(true);

    const activeFilePayload = attachedFile ? { ...attachedFile } : undefined;
    removeAttachedFile();

    try {
      const response: ChatResponse = await api.sendChatMessage(text, language, 'investigator', activeFilePayload);

      const assistantId = String(Date.now() + 1);
      const newAssistantMsg: ChatMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        citations: response.citations,
        reasoningPath: response.reasoningPath,
      };

      setMessages((m) => [...m, newAssistantMsg]);

      // Stream / typewriter effect
      const responseText = response.response || response.policeReport || '';
      const tokens = responseText.split(/(\s+)/);
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
      setMessages((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: '⚠️ API Connection Error. Make sure the backend server and MongoDB/SQLite are running.',
        },
      ]);
    }

    setStreaming(false);
  }

  // Generate printable KSP Police dossier
  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export the conversation dossier.');
      return;
    }

    const username = localStorage.getItem('ksp-user-name') || 'KSP Officer';
    const role = localStorage.getItem('ksp-user-role') || 'Investigator';

    const htmlContent = `
      <html>
        <head>
          <title>KSP Crime Intel Dossier Transcript</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1E293B; background: #FFF; }
            .header { text-align: center; border-bottom: 2px solid #0F172A; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1px; color: #0F172A; }
            .header p { margin: 5px 0 0 0; font-size: 12px; color: #64748B; font-weight: 600; }
            .meta-box { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 15px; border-radius: 8px; margin-bottom: 25px; font-size: 11px; }
            .meta-box table { width: 100%; border-collapse: collapse; }
            .meta-box td { padding: 4px 8px; }
            .meta-box td.label { font-weight: bold; color: #64748B; width: 120px; }
            .message { margin-bottom: 25px; page-break-inside: avoid; }
            .message.user { border-left: 3px solid #64748B; padding-left: 15px; }
            .message.assistant { border-left: 3px solid #4F46E5; padding-left: 15px; }
            .message-sender { font-size: 11px; font-weight: bold; text-transform: uppercase; tracking: 0.5px; color: #475569; margin-bottom: 6px; }
            .message-content { font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
            .footer { border-top: 1px solid #E2E8F0; font-size: 10px; text-align: center; color: #94A3B8; padding-top: 15px; margin-top: 40px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Karnataka State Police</h1>
            <p>Crime Intelligence Platform • Official Dossier Transcript</p>
          </div>
          <div class="meta-box">
            <table>
              <tr>
                <td class="label">Date Extracted:</td>
                <td>${new Date().toLocaleString()}</td>
                <td class="label">Operator:</td>
                <td>${username} (${role.toUpperCase()})</td>
              </tr>
              <tr>
                <td class="label">Classification:</td>
                <td>CONFIDENTIAL - INTERNAL LAW ENFORCEMENT ONLY</td>
                <td class="label">Language:</td>
                <td>${language.toUpperCase()}</td>
              </tr>
            </table>
          </div>
          <div class="content">
            ${messages
              .map(
                (m) => `
              <div class="message ${m.role}">
                <div class="message-sender">${m.role === 'user' ? 'Operator Query' : 'AI Copilot Summary'}</div>
                <div class="message-content">${m.content}</div>
              </div>
            `
              )
              .join('')}
          </div>
          <div class="footer">
            Generated via KSP Command Portal. Persistent SQLite database logs archived.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleCitationClick = (url: string) => {
    navigate(url);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: 'a1',
        role: 'assistant',
        content: 'Welcome, Officer. Ask me natural language questions and I will compile intelligence reports using SQLite Text-to-SQL Agentic RAG directly from the state crime databases.\n\nTry clicking any of the quick prompts below.',
      },
    ]);
  };

  const handleClear = async () => {
    if (window.confirm('Clear session history from SQLite database?')) {
      try {
        await api.clearChatHistory();
        setMessages([
          {
            id: 'a1',
            role: 'assistant',
            content: 'Session cleared. Ready for new intelligence search queries.',
          },
        ]);
      } catch (err) {
        console.error('Failed to clear SQLite logs:', err);
      }
    }
  };

  return (
    <div className="mx-auto flex h-full max-w-5xl flex-col rounded-3xl border border-[#E2E8F0] bg-white shadow-soft overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#E2E8F0] px-5 py-3.5 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 font-sans">KSP AI Crime Copilot</h2>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">State Security Intelligence Chat</div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-bold text-primary-700 hover:bg-primary-100 transition shadow-sm"
            title="Start New Chat Session"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>New Chat</span>
          </button>

          {/* Language selector toggle */}
          <div className="rounded-xl border border-[#E2E8F0] p-0.5 flex bg-slate-50">
            <button
              onClick={() => setLanguage('english')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'english' ? 'bg-white text-slate-800 shadow-soft' : 'text-slate-500'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('kannada')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'kannada' ? 'bg-white text-slate-800 shadow-soft' : 'text-slate-500'
              }`}
            >
              ಕನ್ನಡ
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-slate-600 hover:bg-slate-50"
            title="Download PDF Dossier"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-slate-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600"
            title="Clear Chat Logs from Database"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages list */}
      <div ref={listRef} className="flex-1 overflow-auto p-5 space-y-5 bg-[#FAFAFA]">
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
            <div className={
              'max-w-[85%] rounded-2xl border p-4 shadow-soft space-y-3 transition-all ' +
              (m.role === 'user'
                ? 'border-indigo-100 bg-indigo-50/50 text-slate-900'
                : 'border-[#E2E8F0] bg-white text-slate-900')
            }>
              <div className="text-sm leading-relaxed text-slate-800">
                <FormattedMessage content={m.content} />
              </div>
              
              {/* Citations references */}
              {m.role === 'assistant' && m.citations && m.citations.length > 0 && (
                <div className="border-t border-slate-100 pt-3 space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI SQL Agent Citations</div>
                  <div className="flex flex-wrap gap-2">
                    {m.citations.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCitationClick(c.url)}
                        className="rounded-xl border border-primary-100 bg-primary-50/50 px-2.5 py-1 text-xs font-bold text-primary-700 hover:bg-primary-100 transition"
                      >
                        {c.label} • <span className="text-[10px] opacity-75">{c.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {m.role === 'assistant' && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => speakText(m.content)}
                    className="rounded-lg p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                    title="Speak Aloud"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {streaming && (
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
            Agent compiling query and executing SQL retrieval...
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-[#E2E8F0] p-4 bg-white space-y-3">
        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {examplePrompts.map((p) => (
            <button
              key={p}
              onClick={() => setInput(p)}
              className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-1 text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 font-medium transition"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Attached file preview bubble */}
        {attachedFile && (
          <div className="flex items-center justify-between border border-indigo-100 bg-indigo-50/40 rounded-xl p-2 px-3 text-xs max-w-sm animate-fadeIn">
            <div className="flex items-center gap-2 font-bold text-slate-700 min-w-0">
              {attachedFile.type.startsWith('image/') ? <Image className="h-4 w-4 text-indigo-600 shrink-0" /> : <FileText className="h-4 w-4 text-indigo-600 shrink-0" />}
              <span className="truncate">{attachedFile.name}</span>
            </div>
            <button onClick={removeAttachedFile} className="text-slate-400 hover:text-rose-600 transition shrink-0 ml-2">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {/* File attachment hidden inputs */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,text/plain,.csv,.json,.pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="h-[44px] min-w-[44px] rounded-2xl border border-[#E2E8F0] bg-slate-50 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
            title="Attach Evidence Photo or Document Log"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              language === 'kannada'
                ? "ಬೆಂಗಳೂರಿನ ನೈಜ ಅಪರಾಧ ಅಂಕಿಅಂಶಗಳ ಬಗ್ಗೆ ಅಥವಾ ಪ್ರಕರಣಗಳ ಬಗ್ಗೆ ಕೇಳಿ..."
                : "Ask about 2025 KSP crime stats, repeat offenders, or upload evidence..."
            }
            className="min-h-[44px] max-h-[80px] w-full resize-none rounded-2xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-700 font-medium"
          />

          <button
            onClick={toggleListening}
            className={`h-[44px] min-w-[44px] rounded-2xl border p-2 flex items-center justify-center transition-all ${
              isListening ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-slate-50 border-[#E2E8F0] text-slate-600 hover:bg-slate-100'
            }`}
            title="Speech Input (Voice)"
          >
            {isListening ? <MicOff className="h-4.5 w-4.5 animate-pulse" /> : <Mic className="h-4.5 w-4.5" />}
          </button>
          
          <button
            onClick={handleSend}
            disabled={streaming || (!input.trim() && !attachedFile)}
            className="h-[44px] min-w-[44px] rounded-2xl bg-primary-600 p-2 text-white hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center"
            aria-label="Send"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
