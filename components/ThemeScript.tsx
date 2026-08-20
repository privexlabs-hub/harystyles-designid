/**
 * Applies the saved theme and type pairing before first paint.
 *
 * The Tweaks panel writes these to localStorage; without this inline script the
 * page would paint in the default ink theme and then swap, which on a design
 * system reads as a bug in the design system.
 */
const SCRIPT = `(function(){try{
var t=localStorage.getItem('hs-theme');
if(t&&t!=='ink')document.documentElement.setAttribute('data-theme',t);
var p=localStorage.getItem('hs-font-pair');
if(p&&p!=='fraunces-inter'){
  var s=document.documentElement.style;
  if(p==='all-mono'){s.setProperty('--font-ui','"JetBrains Mono", monospace');}
  else if(p==='all-serif'){s.setProperty('--font-ui','"Fraunces", Georgia, serif');}
}
}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
