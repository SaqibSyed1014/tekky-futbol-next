import SilverGlyph from './SilverGlyph';

/**
 * Structured "tactical" info block for the homepage — replaces the standard
 * glass info cards. Metallic-silver glyph plate, silver subheader, monospaced
 * system tag, slate body copy.
 *
 * @param {Object} props
 * @param {'crosshair'|'position'|'hexagon'} props.glyph
 * @param {string} props.title
 * @param {string} props.tag      — system tag text; rendered inside literal [ ] brackets
 * @param {React.ReactNode} [props.children] — optional body copy
 */
export default function TacticalBlock({ glyph, title, tag, children }) {
  return (
    <article className="tactical-block">
      <div className="tactical-block__plate">
        <SilverGlyph kind={glyph} />
      </div>
      <h3 className="tactical-block__title">{title}</h3>
      <p className="tactical-block__tag">[{tag}]</p>
      {children && <p className="tactical-block__copy">{children}</p>}
    </article>
  );
}
