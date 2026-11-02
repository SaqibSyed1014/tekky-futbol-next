'use client';

/**
 * A pass presented as a ticket: description on the left, price + action on a
 * perforated stub on the right (stacks on mobile). Themed entirely by the
 * enclosing `.tkt-page--*` tokens.
 *
 * `meter` → { remaining, cap } renders a live availability bar; pass
 * `remaining: null` while loading.
 */
export default function PassTicket({
  tag,
  title,
  description,
  note,
  specs = [],
  price,
  validFor,
  meter,
  ctaLabel,
  onCta,
  disabled = false,
  locked = false,
}) {
  const hasMeter = meter && meter.remaining !== null && meter.remaining !== undefined;
  const pct = hasMeter ? Math.max(0, Math.min(100, (meter.remaining / meter.cap) * 100)) : 0;
  const low = hasMeter && meter.remaining > 0 && pct <= 25;

  return (
    <article className={`tkt-pass${locked ? ' is-locked' : ''}`}>
      <div className="tkt-pass__main">
        <p className="tkt-tag">{tag}</p>
        <h2>{title}</h2>
        <p className="tkt-pass__desc">{description}</p>

        {specs.length > 0 && (
          <ul className="tkt-chips">
            {specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        )}

        {meter && (
          <div className="tkt-meter" data-low={low || undefined}>
            <div className="tkt-meter__head">
              <span className="tkt-tag">Availability</span>
              <span className="tkt-meter__count">
                {hasMeter ? `${meter.remaining} / ${meter.cap} left` : 'Loading…'}
              </span>
            </div>
            <div
              className="tkt-meter__track"
              role="progressbar"
              aria-label={`${title} availability`}
              aria-valuemin={0}
              aria-valuemax={meter.cap}
              aria-valuenow={hasMeter ? meter.remaining : undefined}
            >
              <span style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {note && <p className="tkt-pass__note">{note}</p>}
      </div>

      <div className="tkt-pass__stub">
        {validFor && <p className="tkt-tag tkt-pass__valid">{validFor}</p>}
        <p className="tkt-pass__price">{price}</p>
        <p className="tkt-tag tkt-pass__digital">Digital QR pass</p>
        <button type="button" className="cta" disabled={disabled} onClick={onCta}>
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}
