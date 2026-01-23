export function trackFormBehavior() {
  let mouseMovements = 0;
  let keystrokes = 0;
  const start = Date.now();

  const onMouseMove = () => mouseMovements++;
  const onKeyDown = () => keystrokes++;

  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener("keydown", onKeyDown);

  return () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("keydown", onKeyDown);

    return {
      mouseMovements,
      keystrokes,
      submissionTime: Date.now() - start,
    };
  };
}