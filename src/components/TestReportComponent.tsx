import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TestReportComponent() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, passed: 0, failed: 0, duration: 0, suites: [] as any[]});
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchResults = async () => {
      try {
          const res = await fetch('/test-results.json');
          if (!res.ok) throw new Error("Failed to fetch results");
          const data = await res.json();
          setStats({
              total: data.stats.expected + data.stats.unexpected + data.stats.skipped,
              passed: data.stats.expected,
              failed: data.stats.unexpected,
              duration: data.stats.duration,
              suites: data.suites || []
          });
      } catch (e) {
          console.error("Error loading test results", e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1e1e2f', color: '#e0e0e0', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: '0 0 8px 0', color: '#f87171' }}>
              Execution Failures
            </h1>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '1.1rem' }}>Playwright Test Report</p>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={fetchResults} style={{ padding: '10px 20px', backgroundColor: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 0 1 9-9"/></svg>
              Refresh
            </button>
            {/* <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', backgroundColor: 'rgba(96, 165, 250, 0.1)', color: '#60a5fa', border: '1px solid rgba(96, 165, 250, 0.2)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 500 }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.2)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(96, 165, 250, 0.1)'}>
              Back to Dashboard
            </button> */}
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
             <p>Loading Results...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginBottom: '40px' }}>
              {/* Graphical Representation (Donut Chart) */}
              <div style={{ flex: '1', minWidth: '250px', backgroundColor: 'rgba(40, 42, 54, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#f3f4f6', alignSelf: 'flex-start' }}>Execution Overview</h3>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    {/* Background circle */}
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="3.5"
                    />
                    {/* Passed segment */}
                    {stats.passed > 0 && (
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="3.5"
                        strokeDasharray={`${(stats.passed / stats.total) * 100}, 100`}
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                    )}
                    {/* Failed segment */}
                    {stats.failed > 0 && (
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3.5"
                        strokeDasharray={`${(stats.failed / stats.total) * 100}, 100`}
                        strokeDashoffset={-(stats.passed / stats.total) * 100}
                        style={{ transition: 'stroke-dasharray 1s ease' }}
                      />
                    )}
                  </svg>
                  {/* Center Text */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f3f4f6' }}>
                      {stats.total > 0 ? Math.round((stats.passed / stats.total) * 100) : 0}%
                    </span>
                    <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>Pass Rate</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div style={{ flex: '2', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', flex: 1 }}>
                  {[
                    { label: 'Total Executed', value: stats.total, color: '#3b82f6', icon: <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /> },
                    { label: 'Passed', value: stats.passed, color: '#22c55e', icon: <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                    { label: 'Failed', value: stats.failed, color: '#ef4444', icon: <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /> }
                  ].map((stat, i) => (
                    <div key={i} style={{ backgroundColor: 'rgba(40, 42, 54, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={stat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.1 }}>
                        {stat.icon}
                      </svg>
                      <span style={{ color: '#9ca3af', fontSize: '1rem', fontWeight: 500, marginBottom: '8px' }}>{stat.label}</span>
                      <span style={{ fontSize: '3rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Suite Information */}
            <div style={{ marginTop: '40px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 20px 0', color: '#e5e7eb' }}>Test Suites Breakdown</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {stats.suites.map((suite, idx) => {
                  const getAllSpecs = (s: any): any[] => {
                    let specs = s.specs || [];
                    if (s.suites) {
                      s.suites.forEach((subSuite: any) => {
                        specs = [...specs, ...getAllSpecs(subSuite)];
                      });
                    }
                    return specs;
                  };

                  const allSpecs = getAllSpecs(suite);
                  const suiteDurationMs = allSpecs.reduce((acc: number, spec: any) => 
                     acc + (spec.tests?.[0]?.results?.[0]?.duration || 0), 0) || 0;
                  const suiteDurationSec = (suiteDurationMs / 1000).toFixed(2);
                  
                  return (
                    <div key={idx} style={{ backgroundColor: 'rgba(30, 30, 46, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9ca3af' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                          {suite.file}
                        </h3>
                        <span style={{ fontSize: '0.9rem', color: '#9ca3af', backgroundColor: 'rgba(0,0,0,0.2)', padding: '4px 10px', borderRadius: '20px' }}>
                          {suiteDurationSec}s
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {allSpecs.map((spec: any, sIdx: number) => {
                          const result = spec.tests?.[0]?.results?.[0];
                          const durationMs = result?.duration || 0;
                          
                          // Convert absolute paths to relative paths for the browser
                          // Assuming the path contains "public/test-results/..."
                          const getRelativePath = (absPath: string) => {
                            if (!absPath) return "";
                            const parts = absPath.split(/[\\/]/);
                            const publicIdx = parts.indexOf("public");
                            if (publicIdx !== -1) {
                              return "/" + parts.slice(publicIdx + 1).join("/");
                            }
                            return "";
                          };

                          return (
                            <div key={sIdx} style={{ backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: '8px', overflow: 'hidden', borderLeft: `4px solid ${spec.ok ? '#22c55e' : '#ef4444'}` }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                                <div>
                                  <span style={{ fontSize: '1rem', color: '#d1d5db' }}>{spec.title}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <span style={{ fontSize: '0.85rem', color: '#9ca3af' }}>{durationMs}ms</span>
                                  {spec.ok ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                  ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                  )}
                                </div>
                              </div>

                              {/* Test Steps Section */}
                              {result?.steps?.length > 0 && (
                                <div style={{ padding: '0 16px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
                                  <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', margin: '12px 0 8px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Execution Steps</p>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {result.steps.map((step: any, stepIdx: number) => (
                                      <div key={stepIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#9ca3af', padding: '4px 8px', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '4px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                          <span style={{ color: '#4f46e5', fontWeight: 'bold' }}>{stepIdx + 1}.</span>
                                          <span>{step.title}</span>
                                        </div>
                                        <span style={{ fontSize: '0.75rem' }}>{step.duration}ms</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Attachments Section */}
                              {result?.attachments?.length > 0 && (
                                <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                                  {result.attachments.map((attachment: any, aIdx: number) => {
                                    const relPath = getRelativePath(attachment.path);
                                    if (!relPath) return null;

                                    if (attachment.name === "screenshot") {
                                      return (
                                        <div key={aIdx} style={{ maxWidth: '300px' }}>
                                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>Screenshot</p>
                                          <a href={relPath} target="_blank" rel="noopener noreferrer">
                                            <img src={relPath} alt="Failure Screenshot" style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                          </a>
                                        </div>
                                      );
                                    }
                                    if (attachment.name === "video") {
                                      return (
                                        <div key={aIdx} style={{ maxWidth: '300px' }}>
                                          <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '4px' }}>Video</p>
                                          <video controls style={{ width: '100%', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                            <source src={relPath} type="video/webm" />
                                            Your browser does not support the video tag.
                                          </video>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
