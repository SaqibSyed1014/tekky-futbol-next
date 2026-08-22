'use client';

import { useEffect, useRef } from 'react';

export default function StatCard({ label, value, icon, loading }) {
  const cardRef = useRef(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });

  useEffect(() => () => {
    cancelAnimationFrame(pos.current.raf);
  }, []);

  function tick() {
    const p = pos.current;
    const el = cardRef.current;
    p.x += (p.tx - p.x) * 0.18;
    p.y += (p.ty - p.y) * 0.18;
    if (el) {
      el.style.setProperty('--kpi-x', `${p.x}px`);
      el.style.setProperty('--kpi-y', `${p.y}px`);
    }
    if (Math.abs(p.tx - p.x) > 0.4 || Math.abs(p.ty - p.y) > 0.4) {
      p.raf = requestAnimationFrame(tick);
    } else {
      p.raf = 0;
    }
  }

  function onPointerEnter(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    pos.current.x = x;
    pos.current.y = y;
    pos.current.tx = x;
    pos.current.ty = y;
    el.style.setProperty('--kpi-x', `${x}px`);
    el.style.setProperty('--kpi-y', `${y}px`);
  }

  function onPointerMove(e) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    pos.current.tx = e.clientX - r.left;
    pos.current.ty = e.clientY - r.top;
    if (!pos.current.raf) pos.current.raf = requestAnimationFrame(tick);
  }

  return (
    <article
      ref={cardRef}
      className="ad-stat"
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
    >
      <span className="ad-stat__glow" aria-hidden="true" />
      <div className="ad-stat__icon">
        <i className={icon} />
      </div>
      <p className="ad-stat__value">{loading ? '—' : value}</p>
      <p className="ad-stat__label">{label}</p>
    </article>
  );
}
