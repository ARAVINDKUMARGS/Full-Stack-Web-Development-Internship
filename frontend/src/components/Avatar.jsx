import { hueFor, initials } from '../utils/format.js';

export default function Avatar({ name, size = 40 }) {
  const h = hueFor(name);
  return (
    <span className="avatar" aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.38,
        background: `hsl(${h} 45% 90%)`, color: `hsl(${h} 55% 28%)` }}>
      {initials(name)}
    </span>
  );
}
