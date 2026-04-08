// Tiny UI engine (no framework)
const UI = (() => {
  const state = new Map();

  const get = (key) => state.get(key);
  const set = (key, value) => {
    state.set(key, value);
    document.dispatchEvent(new CustomEvent(`state:${key}`, { detail: value }));
  };

  const toggle = (key) => set(key, !get(key));

  // Bind click actions
  const bindActions = () => {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;

      const action = el.dataset.action;
      const target = el.dataset.target;

      if (action === 'toggle') toggle(target);
      if (action === 'open') set(target, true);
      if (action === 'close') set(target, false);
    });
  };

  // Bind UI updates
  const bindState = () => {
    document.querySelectorAll('[data-bind]').forEach((el) => {
      const key = el.dataset.bind;

      // initial state
      if (!state.has(key)) state.set(key, false);

      const update = (value) => {
        el.toggleAttribute('data-open', value);
        el.hidden = !value;
      };

      update(get(key));

      document.addEventListener(`state:${key}`, (e) => {
        update(e.detail);
      });
    });
  };

  const init = () => {
    bindActions();
    bindState();
  };

  return { init, set, get, toggle };
})();

export default UI;


<script type="module">
  import UI from '/src/scripts/ui.js';
  UI.init();
</script>

----drop-down---

<button data-action="toggle" data-target="dropdown">
  Toggle
</button>

<div data-bind="dropdown" hidden>
  Dropdown content
</div>


----drawer----
<button data-action="open" data-target="drawer">Open</button>

<div class="drawer" data-bind="drawer" hidden>
  <button data-action="close" data-target="drawer">Close</button>
</div>


----modal----
<button data-action="open" data-target="modal">Open Modal</button>

<div class="modal" data-bind="modal" hidden>
  <div class="overlay" data-action="close" data-target="modal"></div>
  <div class="content">
    Modal content
  </div>
</div>


--tailwind--

 [data-open] {
  opacity: 1;
  pointer-events: auto;
}

[data-bind] {
  transition: opacity 0.2s ease;
}


