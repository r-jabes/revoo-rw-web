/**
 * Runs synchronously in <head>, before first paint and before hydration.
 * It only sets classes; see src/styles/motion.css for the contract.
 */
export const MOTION_BOOT = `(function(){var d=document.documentElement,c=d.classList;c.add("js");try{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)c.add("rm");if(sessionStorage.getItem("revoo:intro"))c.add("intro-seen");}catch(e){}setTimeout(function(){if(!c.contains("motion-on"))c.add("motion-failed");},4500);})();`;
