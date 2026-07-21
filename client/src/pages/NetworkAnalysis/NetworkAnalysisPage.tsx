import React, { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import { HelpCircle, RefreshCw, Network, User, FileText, CreditCard, ShieldAlert, Award } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type: 'case' | 'accused' | 'victim' | 'account' | 'location';
  details?: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
  label: string;
  type: string;
  flagged?: boolean;
}

export default function NetworkAnalysisPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('All');

  const loadNetwork = () => {
    setLoading(true);
    api.getNetworkAnalysis()
      .then(res => {
        // Lay out nodes in a clean concentric circle structure based on type to prevent overlap
        const laidOutNodes = layoutNodes(res.nodes);
        setNodes(laidOutNodes);
        setLinks(res.links);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching network graph:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadNetwork();
  }, []);

  // Concentric circle layout algorithm
  const layoutNodes = (rawNodes: Node[]): Node[] => {
    const width = 800;
    const height = 550;
    const cx = width / 2;
    const cy = height / 2;

    // Separate nodes by type
    const accused = rawNodes.filter(n => n.type === 'accused');
    const cases = rawNodes.filter(n => n.type === 'case');
    const accounts = rawNodes.filter(n => n.type === 'account');
    const victims = rawNodes.filter(n => n.type === 'victim');

    const result: Node[] = [];

    // Accused in inner circle
    const rAcc = 80;
    accused.forEach((n, idx) => {
      const angle = (idx * 2 * Math.PI) / accused.length;
      n.x = cx + rAcc * Math.cos(angle);
      n.y = cy + rAcc * Math.sin(angle);
      result.push(n);
    });

    // Cases in middle circle
    const rCases = 180;
    cases.forEach((n, idx) => {
      const angle = (idx * 2 * Math.PI) / cases.length + (Math.PI / 4);
      n.x = cx + rCases * Math.cos(angle);
      n.y = cy + rCases * Math.sin(angle);
      result.push(n);
    });

    // Victims & Accounts in outer circle
    const outer = [...victims, ...accounts];
    const rOuter = 260;
    outer.forEach((n, idx) => {
      const angle = (idx * 2 * Math.PI) / outer.length + (Math.PI / 6);
      n.x = cx + rOuter * Math.cos(angle);
      n.y = cy + rOuter * Math.sin(angle);
      result.push(n);
    });

    // Catch-all for other nodes
    rawNodes.forEach(n => {
      if (!result.find(r => r.id === n.id)) {
        n.x = cx + (Math.random() - 0.5) * 100;
        n.y = cy + (Math.random() - 0.5) * 100;
        result.push(n);
      }
    });

    return result;
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'case': return <FileText className="h-4 w-4" />;
      case 'accused': return <User className="h-4 w-4" />;
      case 'account': return <CreditCard className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case 'case': return 'bg-indigo-500 text-white';
      case 'accused': return 'bg-rose-500 text-white';
      case 'account': return 'bg-amber-500 text-white';
      case 'victim': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-400 text-white';
    }
  };

  // Find linked nodes of the currently selected node
  const getConnectedNodeIds = (): Set<string> => {
    const connected = new Set<string>();
    if (!selectedNodeId) return connected;
    connected.add(selectedNodeId);

    links.forEach(l => {
      const srcId = typeof l.source === 'object' ? (l.source as any).id : l.source;
      const destId = typeof l.target === 'object' ? (l.target as any).id : l.target;
      if (srcId === selectedNodeId) {
        connected.add(destId);
      } else if (destId === selectedNodeId) {
        connected.add(srcId);
      }
    });

    return connected;
  };

  const connectedSet = getConnectedNodeIds();
  const highlightedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="flex h-[calc(100vh-56px)] w-full bg-[#F8FAFC]">
      {/* Node Details Inspector */}
      <div className="w-[340px] shrink-0 border-r border-[#E2E8F0] bg-white p-5 flex flex-col justify-between overflow-auto">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <Network className="h-5 w-5 text-primary-600" />
              <h1 className="text-xl font-bold text-slate-800 font-sans">Link Analysis</h1>
            </div>
            <p className="mt-1 text-xs text-slate-500 leading-normal">
              Audit the network links of criminal groups, accomplice structures, and financial transaction accounts.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Filter View</span>
            <div className="grid grid-cols-2 gap-1.5">
              {['All', 'accused', 'case', 'account'].map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                    filterType === t
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {t === 'All' ? 'Show All' : t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Inspector Panel */}
          {highlightedNode ? (
            <div className="rounded-2xl border border-primary-100 bg-primary-50/20 p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${getBgColor(highlightedNode.type)}`}>
                  {getIcon(highlightedNode.type)}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{highlightedNode.type} Node</div>
                  <h3 className="text-sm font-extrabold text-slate-800">{highlightedNode.label}</h3>
                </div>
              </div>
              
              <div className="text-xs text-slate-600 leading-relaxed bg-white border rounded-xl p-3 shadow-soft">
                <strong>Registry Notes:</strong><br />
                {highlightedNode.details || 'No catalog metadata registered.'}
              </div>

              <button
                onClick={() => setSelectedNodeId(null)}
                className="w-full text-center text-xs font-bold text-indigo-600 hover:underline"
              >
                Clear Node Isolation
              </button>
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-2xl bg-slate-50 text-slate-400 text-xs leading-normal">
              Click a node in the graphic visualization network to isolate and inspect its local connections, shell accounts, and crime links.
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="rounded-2xl border border-[#E2E8F0] p-4 bg-slate-50 text-[11px] space-y-2.5">
          <span className="font-bold text-slate-400 uppercase tracking-wider block">Graph Legend</span>
          <div className="space-y-1.5 font-semibold text-slate-600">
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-500" /> Accused (Suspects)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-indigo-500" /> FIRs (Incident Cases)</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-500" /> Bank Accounts</div>
            <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> Victims</div>
            <div className="flex items-center gap-2"><span className="h-4 w-px border-t border-dashed border-rose-500 bg-rose-500 h-0.5 w-4 inline-block" /> Flagged transactions (Hawala)</div>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="flex-1 h-full relative overflow-hidden bg-[#0F172A] flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-slate-400 text-sm font-semibold">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
            Mapping accomplice network clusters...
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 800 550" className="overflow-visible select-none">
            {/* Draw Links/Edges */}
            <g>
              {links.map((link, idx) => {
                const sourceNode = nodes.find(n => n.id === link.source);
                const targetNode = nodes.find(n => n.id === link.target);

                if (!sourceNode || !targetNode || sourceNode.x === undefined || sourceNode.y === undefined || targetNode.x === undefined || targetNode.y === undefined) return null;

                // Check if isolated node is active
                const isLinked = selectedNodeId === null || (connectedSet.has(sourceNode.id) && connectedSet.has(targetNode.id));

                return (
                  <g key={idx} opacity={isLinked ? 1 : 0.08} className="transition-opacity duration-300">
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={link.flagged ? '#EF4444' : '#475569'}
                      strokeWidth={link.flagged ? 2 : 1.5}
                      strokeDasharray={link.flagged ? '4 4' : 'none'}
                    />
                    {/* Centered Edge Label */}
                    <text
                      x={(sourceNode.x + targetNode.x) / 2}
                      y={(sourceNode.y + targetNode.y) / 2 - 5}
                      fill={link.flagged ? '#EF4444' : '#64748B'}
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="bg-slate-900 px-1"
                    >
                      {link.label}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Draw Nodes */}
            <g>
              {nodes
                .filter(n => filterType === 'All' || n.type === filterType)
                .map((n) => {
                  if (n.x === undefined || n.y === undefined) return null;

                  const isConnected = selectedNodeId === null || connectedSet.has(n.id);
                  const isSelected = selectedNodeId === n.id;

                  let color = '#4F46E5'; // indigo-600
                  if (n.type === 'accused') color = '#E11D48'; // rose-600
                  if (n.type === 'account') color = '#D97706'; // amber-600
                  if (n.type === 'victim') color = '#059669'; // emerald-600

                  return (
                    <g
                      key={n.id}
                      transform={`translate(${n.x}, ${n.y})`}
                      onClick={() => setSelectedNodeId(isSelected ? null : n.id)}
                      className="cursor-pointer group"
                      opacity={isConnected ? 1 : 0.15}
                    >
                      <circle
                        r={isSelected ? 26 : 22}
                        fill={color}
                        stroke="#0F172A"
                        strokeWidth="2.5"
                        className="transition-all duration-300 group-hover:scale-110"
                      />
                      
                      {/* Node Type Text label */}
                      <text
                        y={36}
                        fill={isConnected ? '#F1F5F9' : '#94A3B8'}
                        fontSize="10"
                        fontWeight="700"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {n.label}
                      </text>

                      {/* Icon inside circle */}
                      <g transform="translate(-8, -8)" className="pointer-events-none text-white scale-[0.8] opacity-90">
                        {n.type === 'accused' ? (
                          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        ) : n.type === 'case' ? (
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        ) : n.type === 'account' ? (
                          <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        ) : (
                          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" fill="none" />
                        )}
                      </g>
                    </g>
                  );
                })}
            </g>
          </svg>
        )}

        {/* Refresh button */}
        <button
          onClick={loadNetwork}
          className="absolute right-4 top-4 rounded-xl border border-slate-700 bg-slate-800 p-2 text-slate-300 hover:bg-slate-700"
          title="Recalculate Network Links"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
