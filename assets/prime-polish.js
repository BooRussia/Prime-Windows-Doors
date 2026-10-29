// ═══════════════════════════════════════════════════
// PRIME POLISH — inertial smooth scrolling + gliding anchor links.
// Loaded after lenis.min.js on every page. Desktop mouse/trackpad only:
// touch devices keep native momentum scrolling, and "reduce motion"
// keeps plain native scrolling.
//   window.primeLenis        — the Lenis instance, or null when inactive
//   window.primeScrollTo(el|y) — glide to an element / offset (falls back to native)
// ═══════════════════════════════════════════════════
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var lenis = null;

  function easeInOutQuart(t){ return t < .5 ? 8*t*t*t*t : 1 - Math.pow(-2*t + 2, 4) / 2; }

  // opts.offset: px added to the target (e.g. -navHeight for a sticky header)
  window.primeScrollTo = function(target, opts){
    opts = opts || {};
    var y = (typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY) + (opts.offset || 0);
    y = Math.max(0, y);
    if(lenis){
      // duration scales with distance: short hops feel crisp, long ones unhurried
      var duration = Math.min(2, Math.max(.9, Math.abs(y - window.scrollY) / 3000));
      lenis.scrollTo(y, { duration: opts.duration || duration, easing: easeInOutQuart, immediate: !!opts.immediate });
    } else {
      window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
    }
  };

  window.primeLenis = null;
  if(reduce || !finePointer || typeof window.Lenis !== 'function') return;

  lenis = new window.Lenis({
    lerp: 0.085,              // weighty, silky glide — lower = longer coast
    wheelMultiplier: 0.95,
    smoothWheel: true,
    gestureOrientation: 'vertical'
  });
  window.primeLenis = lenis;

  function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  // Same-page anchors that the page didn't already handle glide with Lenis.
  document.addEventListener('click', function(e){
    if(e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if(!a) return;
    var id = a.getAttribute('href');
    if(id.length < 2) return;
    var t = document.querySelector(id);
    if(!t) return;
    e.preventDefault();
    // honour CSS scroll-margin-top so targets clear sticky headers
    window.primeScrollTo(t, { offset: -(parseFloat(getComputedStyle(t).scrollMarginTop) || 0) });
  });
})();
