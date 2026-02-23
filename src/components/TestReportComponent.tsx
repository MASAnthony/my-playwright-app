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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
              {[
                { label: 'Total Executed', value: stats.total, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
                { label: 'Passed', value: stats.passed, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
                { label: 'Failed', value: stats.failed, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
              ].map((stat, i) => (
                <div key={i} style={{ backgroundColor: 'rgba(40, 42, 54, 0.8)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <span style={{ color: '#9ca3af', fontSize: '0.9rem', fontWeight: 500 }}>{stat.label}</span>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'rgba(40, 42, 54, 0.8)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 600, color: '#fca5a5' }}>Failed Tests</h3>
              </div>
              
              <div style={{ padding: '0' }}>
                {stats.suites.flatMap(suite => 
                   (suite.specs || []).filter((s:any) => !s.ok).map((spec: any, j: number) => {
                       const errorMsg = spec.tests?.[0]?.results?.[0]?.error?.message || "Unknown Error";
                       return (
                          <div key={`${suite.title}-${j}`} style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                 <div>
                                    <span style={{ color: '#9ca3af', fontSize: '0.85rem', display: 'block', marginBottom: '4px' }}>{suite.title}</span>
                                    <h4 style={{ margin: '0', fontSize: '1.1rem', color: '#f3f4f6' }}>{spec.title}</h4>
                                 </div>
                                 <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                   FAILED
                                 </span>
                             </div>
                             <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                                 <pre style={{ margin: 0, color: '#f87171', fontSize: '0.9rem', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
                                     {errorMsg}
                                 </pre>
                             </div>
                          </div>
                       )
                   })
                )}
                
                {stats.failed === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#22c55e' }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ margin: '0 auto 16px', display: 'block' }}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>All Tests Passed!</h3>
                    <p style={{ margin: 0, color: '#9ca3af' }}>No execution failures found in the latest report.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
