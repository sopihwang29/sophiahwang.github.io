// Shared by index.html and every page in /projects
(function () {
  const root = document.documentElement;
  const $ = (selector, context = document) =>
    context.querySelector(selector);
  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];

  // Keep the site blue-only, including if an old pink preference was saved.
  root.dataset.theme = "blue";

  try {
    localStorage.setItem("theme", "blue");
  } catch (error) {
    // The site still works if browser storage is unavailable.
  }

  // Hide the old theme toggle if it is still present in the HTML.
  const themeToggle = $("#themeToggle");
  if (themeToggle) themeToggle.hidden = true;

  // Update the footer year.
  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Scroll reveal, with a fallback for browsers without IntersectionObserver.
  const revealItems = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("in"));
  }

  // Scroll progress bar.
  const progressBar = $("#progress");

  if (progressBar) {
    const updateProgress = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const progress =
        scrollableHeight > 0
          ? (window.scrollY / scrollableHeight) * 100
          : 0;

      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
  }

  // Subtle project-card tilt on devices with a mouse.
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".tilt").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          `perspective(900px) ` +
          `rotateX(${(-y * 3).toFixed(2)}deg) ` +
          `rotateY(${(x * 4).toFixed(2)}deg) ` +
          `translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  // Project filter buttons.
  $$(".filter").forEach(button => {
    button.addEventListener("click", () => {
      $$(".filter").forEach(filter => {
        filter.classList.remove("active");
      });

      button.classList.add("active");

      const selectedFilter = button.dataset.filter;

      $$("#projectGrid .card").forEach(card => {
        const categories = (card.dataset.cat || "").split(/\s+/);
        const shouldShow =
          selectedFilter === "all" || categories.includes(selectedFilter);

        card.classList.toggle("hide", !shouldShow);
      });
    });
  });

  // Cello / Matcha tabs.
  $$(".tab").forEach(button => {
    button.addEventListener("click", () => {
      $$(".tab").forEach(tab => tab.classList.remove("active"));
      $$(".tab-panel").forEach(panel => panel.classList.remove("active"));

      button.classList.add("active");

      const panel = $(`#tab-${button.dataset.tab}`);
      if (panel) panel.classList.add("active");
    });
  });

  // MIPS multicycle stage explorer.
  const stageBox = $("#stageDesc");
  const stageButtons = $$(".stage");

  if (stageBox && stageButtons.length) {
    const descriptions = {
      fetch:
        "<b>Fetch.</b> The program counter sends an address to instruction memory, the instruction is read into the instruction register, and the PC moves to the next instruction.",

      decode:
        "<b>Decode.</b> The control unit reads the opcode and function fields while the register file reads the source registers. Immediates are sign-extended.",

      execute:
        "<b>Execute.</b> The ALU performs arithmetic or logic, calculates load and store addresses, or compares values for branches.",

      memory:
        "<b>Memory.</b> Loads read from data memory and stores write to it. Instructions that do not access memory skip this step.",

      writeback:
        "<b>Writeback.</b> The result from the ALU or memory is written into the destination register."
    };

    const showStage = button => {
      const description = descriptions[button.dataset.stage];
      if (!description) return;

      stageButtons.forEach(stageButton => {
        const isActive = stageButton === button;
        stageButton.classList.toggle("active", isActive);
        stageButton.setAttribute("aria-pressed", String(isActive));
      });

      stageBox.innerHTML = description;
    };

    stageButtons.forEach(button => {
      button.addEventListener("click", () => showStage(button));
    });

    const initialStage =
      stageButtons.find(button => button.classList.contains("active")) ||
      stageButtons[0];

    showStage(initialStage);
  }

  // Remove empty gallery sections after image load/error handlers run.
  window.addEventListener("load", () => {
    $$(".gallery").forEach(gallery => {
      if (!gallery.querySelector(".shot")) {
        const block = gallery.closest(".block");
        if (block) block.remove();
      }
    });
  });
})();