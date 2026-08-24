import bg from '@/assets/background.svg';

/**
 * Signature ChaiUI Backdrop
 * Hexagon glow centered at top, masked to fade out, warm in light and dark
 */
export function Backdrop() {
  return (
    <img
      src={bg}
      alt=""
      aria-hidden="true"
      className="chai-backdrop"
      fetchPriority="high"
      decoding="async"
    />
  );
}
