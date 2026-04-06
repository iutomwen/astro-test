export function spring({
  from = 0,
  to = 0,
  stiffness = 0.1,
  damping = 0.8,
  onUpdate,
}) {
  let value = from;
  let velocity = 0;

  function frame() {
    const force = (to - value) * stiffness;
    velocity = velocity * damping + force;
    value += velocity;

    onUpdate(value);

    if (Math.abs(velocity) > 0.001 || Math.abs(to - value) > 0.001) {
      requestAnimationFrame(frame);
    }
  }

  frame();
}