
const install = () => {
    if (!window.__tv_js_errors) {
      window.__tv_js_errors = [];
    }
    
    window.addEventListener('error', (event) => {
      const timestamp = new Date().toISOString();
      const errorMessage = event.message || 'JS error';
      const filename = event.filename || '<unknown url>';
      const line = event.lineno;
      const column = event.colno;
      const errorDetails = getErrorDetails(event.error);
      window.__tv_js_errors.push(`${timestamp} ${errorMessage}. ${filename}, line ${line}, col ${column}.\nError: ${errorDetails}`);
    }, false);
  
    window.addEventListener('unhandledrejection', (event) => {
      const timestamp = new Date().toISOString();
      const reason = getErrorDetails(event.reason);
      window.__tv_js_errors.push(`${timestamp} Unhandled rejection.\nReason: ${reason}`);
    }, false);
  
    document.addEventListener('securitypolicyviolation', (event) => {
      if (String(event.sourceFile).startsWith('https://securepubads.g.doubleclick.net') && String(event.blockedURI).startsWith('https://adservice.google.')) {
        return;
      }
      const timestamp = new Date().toISOString();
      const violationType = event.disposition === 'report' ? 'CSP report-only' : 'CSP violation';
      const violatedDirective = event.violatedDirective || event.effectiveDirective;
      const sourceFile = event.sourceFile || '<unknown url>';
      const lineNumber = event.lineNumber;
      const columnNumber = event.columnNumber;
      const blockedURI = event.blockedURI;
      const sample = event.sample;
      const target = getErrorDetails(event.target);
      window.__tv_js_errors.push(`${timestamp} ${violationType}: ${violatedDirective}. ${sourceFile}, line ${lineNumber}, col ${columnNumber}.\nBlocked URI: ${blockedURI}\nSample: ${sample}\nTarget: ${target}`);
    }, false);
  };