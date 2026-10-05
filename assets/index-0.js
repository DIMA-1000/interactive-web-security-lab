
    (() => {
      const reducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finePointer =
        window.matchMedia("(hover: hover) and (pointer: fine)").matches;

      /* Existing circuit-background parallax */
      const circuit = document.getElementById("circuitBackground");

      if (circuit && !reducedMotion) {
        let targetX = 0;
        let targetY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener("mousemove", (event) => {
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;

          targetX = x * -14;
          targetY = y * -10;
        }, { passive: true });

        document.addEventListener("mouseleave", () => {
          targetX = 0;
          targetY = 0;
        });

        const animateBackground = () => {
          currentX += (targetX - currentX) * 0.035;
          currentY += (targetY - currentY) * 0.035;

          circuit.style.transform =
            `translate3d(${currentX}px, ${currentY}px, 0)`;

          requestAnimationFrame(animateBackground);
        };

        animateBackground();
      }

      /* Small security cursor accent — desktop only */
      const cursorDot = document.getElementById("cursorDot");

      if (cursorDot && finePointer && !reducedMotion) {
        document.addEventListener("mousemove", (event) => {
          cursorDot.style.left = `${event.clientX}px`;
          cursorDot.style.top = `${event.clientY}px`;
          cursorDot.style.opacity = "0.78";
        }, { passive: true });

        document.addEventListener("mouseleave", () => {
          cursorDot.style.opacity = "0";
        });

        document.querySelectorAll("a, .card, h1").forEach((element) => {
          element.addEventListener("mouseenter", () => {
            cursorDot.classList.add("active");
          });

          element.addEventListener("mouseleave", () => {
            cursorDot.classList.remove("active");
          });
        });
      }

      /* Hidden portfolio detail: appears briefly on first lab interaction */
      const securityToast = document.getElementById("securityToast");
      let toastShown = false;
      let toastTimer;

      const showSecurityToast = () => {
        if (!securityToast || toastShown) return;

        toastShown = true;
        securityToast.classList.add("show");

        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
          securityToast.classList.remove("show");
        }, 2200);
      };

      document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("mouseenter", showSecurityToast, { once: true });
        card.addEventListener("focusin", showSecurityToast, { once: true });
      });

      /* Portfolio NORMAL / HARDENED presentation mode.
         Real server-side headers and DDoS controls are not changed by this UI. */
      const modeSwitch = document.getElementById("securityModeSwitch");
      const normalLabel = document.getElementById("normalModeLabel");
      const hardenedLabel = document.getElementById("hardenedModeLabel");
      const hardeningPanel = document.getElementById("hardeningPanel");
      const hardeningScan = document.getElementById("hardeningScan");

      if (modeSwitch && normalLabel && hardenedLabel && hardeningPanel) {
        modeSwitch.addEventListener("click", () => {
          const hardened = !document.body.classList.contains("hardened");

          document.body.classList.toggle("hardened", hardened);
          modeSwitch.setAttribute("aria-checked", String(hardened));
          hardeningPanel.setAttribute("aria-hidden", String(!hardened));
          normalLabel.classList.toggle("active", !hardened);
          hardenedLabel.classList.toggle("active", hardened);

          if (hardened && hardeningScan && !reducedMotion) {
            hardeningScan.classList.remove("run");
            void hardeningScan.offsetWidth;
            hardeningScan.classList.add("run");
          }
        });
      }

    })();
  

/* Calm, bounded automatic name scan; independent of hover and touch. */
(() => {
 const name = document.querySelector('.name-row h1');
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 if (!name || motion.matches) return;
 let count = 0, timer, finish;
 const stop = () => {clearTimeout(timer); clearTimeout(finish); name.classList.remove('auto-scan');};
 const scan = () => {
  if (motion.matches || count >= 10) {stop(); return;}
  if (document.hidden) {timer = setTimeout(scan, 1000); return;}
  count++; name.classList.add('auto-scan');
  finish = setTimeout(() => {
   name.classList.remove('auto-scan');
   if(count < 10) timer = setTimeout(scan, count < 3 ? 1500 : 7200);
  }, 2800);
 };
 motion.addEventListener('change', event => {if(event.matches) stop();});
 window.addEventListener('pagehide',stop,{once:true});
 timer = setTimeout(scan,600);
})();

/* Shared circuit background automatically applies to existing and future lab cards. */
(() => {
  function decorateCards() {
    const template = document.getElementById('card-circuit-template');
    if (!template) return;
    document.querySelectorAll('.labs .card:not(.audit-card)').forEach(card => {
      if (card.querySelector('.card-circuit')) return;
      card.prepend(template.content.cloneNode(true));
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', decorateCards, { once: true });
  else decorateCards();
  const labs = document.querySelector('.labs');
  if (labs) new MutationObserver(decorateCards).observe(labs, { childList: true, subtree: true });
})();
