'use client';

import { createPortal } from 'react-dom';
import {
  Children,
  forwardRef,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

export function PremiumField({ label, hint, className = '', children }) {
  return (
    <div className={`db-field ${className}`.trim()}>
      {label ? <span className="db-field__label">{label}</span> : null}
      {children}
      {hint ? <span className="db-field__hint">{hint}</span> : null}
    </div>
  );
}

export const PremiumInput = forwardRef(function PremiumInput(
  {
    className = '',
    type = 'text',
    icon,
    passwordToggle = false,
    trailing,
    style,
    ...props
  },
  ref,
) {
  const [revealed, setRevealed] = useState(false);
  const isChoice = type === 'checkbox' || type === 'radio';

  if (isChoice) {
    return (
      <input
        ref={ref}
        type={type}
        className={`db-choice ${className}`.trim()}
        style={style}
        {...props}
      />
    );
  }

  const inputType = passwordToggle ? (revealed ? 'text' : 'password') : type;
  const wrapClass = [
    'db-input-wrap',
    icon ? 'has-icon' : '',
    passwordToggle || trailing ? 'has-trailing' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapClass} style={style}>
      {icon ? <i className={`${icon} db-input__icon`} aria-hidden="true" /> : null}
      <input ref={ref} type={inputType} className="db-input" {...props} />
      {passwordToggle ? (
        <button
          type="button"
          className="db-input__trail"
          tabIndex={-1}
          aria-label={revealed ? 'Hide password' : 'Show password'}
          onClick={() => setRevealed((open) => !open)}
        >
          <i className={revealed ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'} />
        </button>
      ) : null}
      {trailing}
    </div>
  );
});

function childrenToOptions(children) {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child) => ({
      value: String(child.props.value ?? ''),
      label: child.props.children,
      disabled: Boolean(child.props.disabled),
    }));
}

/**
 * Animated, keyboard-accessible replacement for native dashboard selects.
 * Accepts either `options` or regular <option> children.
 */
export default function PremiumSelect({
  value = '',
  onChange,
  options,
  children,
  disabled = false,
  className = '',
  name,
  id,
  placeholder = 'Select an option',
  'aria-label': ariaLabel,
}) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [menuPos, setMenuPos] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const items = useMemo(
    () => options || childrenToOptions(children),
    [options, children],
  );
  const selectedIndex = items.findIndex((item) => String(item.value) === String(value));
  const selected = selectedIndex >= 0 ? items[selectedIndex] : null;
  const displayLabel = selected?.label ?? placeholder;
  const isPlaceholder = selectedIndex < 0;

  useEffect(() => {
    if (open) setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, selectedIndex]);

  useEffect(() => {
    function closeOnOutsidePointer(event) {
      const target = event.target;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function closeOnEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setRendered(true);
      return undefined;
    }
    const timeout = setTimeout(() => setRendered(false), 280);
    return () => clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    function place() {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const menuHeight = 268;
      const gap = 6;
      const openUp = window.innerHeight - rect.bottom < menuHeight && rect.top > window.innerHeight - rect.bottom;
      setMenuPos({
        left: rect.left,
        width: rect.width,
        top: openUp ? undefined : rect.bottom + gap,
        bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
      });
    }
    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [open]);

  function emit(nextValue) {
    onChange?.({ target: { value: nextValue, name } });
    setOpen(false);
  }

  function moveActive(direction) {
    if (!items.length) return;
    let next = activeIndex;
    do {
      next = (next + direction + items.length) % items.length;
    } while (items[next]?.disabled && next !== activeIndex);
    setActiveIndex(next);
  }

  function handleKeyDown(event) {
    if (disabled) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) setOpen(true);
      else moveActive(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      const item = items[activeIndex];
      if (item && !item.disabled) emit(item.value);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen((current) => !current);
    }
  }

  return (
    <div
      ref={rootRef}
      className={`db-select ${open ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`.trim()}
    >
      {name ? <input type="hidden" name={name} value={value} /> : null}
      <button
        ref={triggerRef}
        id={controlId}
        type="button"
        className="db-select__trigger"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${controlId}-listbox`}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className={isPlaceholder ? 'db-select__placeholder' : 'db-select__value'}>
          {displayLabel}
        </span>
        <span className="db-select__chevron" aria-hidden="true">
          <i className="fa-solid fa-chevron-down" />
        </span>
      </button>

      {rendered && menuPos && typeof document !== 'undefined'
        ? createPortal(
          <div
            ref={menuRef}
            className={`db-select__menu-wrap is-portaled ${open ? 'is-open' : ''}`.trim()}
            style={menuPos}
          >
            <div className="db-select__clip">
              <div
                id={`${controlId}-listbox`}
                className="db-select__menu"
                role="listbox"
                aria-labelledby={controlId}
              >
                {items.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={`${item.value}-${index}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={item.disabled}
                      className={`db-select__option ${isSelected ? 'is-selected' : ''} ${isActive ? 'is-active' : ''}`.trim()}
                      onPointerEnter={() => setActiveIndex(index)}
                      onClick={() => emit(item.value)}
                    >
                      <span>{item.label}</span>
                      {isSelected ? <i className="fa-solid fa-check" aria-hidden="true" /> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>,
          document.body,
        )
        : null}
    </div>
  );
}

export { PremiumSelect };

export const PremiumTextarea = forwardRef(function PremiumTextarea(
  { className = '', style, ...props },
  ref,
) {
  return (
    <div className={`db-input-wrap ${className}`.trim()} style={style}>
      <textarea ref={ref} className="db-input db-textarea" {...props} />
    </div>
  );
});
