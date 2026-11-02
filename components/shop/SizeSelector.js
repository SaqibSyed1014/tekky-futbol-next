'use client';

import { useId } from 'react';
import { SIZE_OPTIONS } from '@/data/productSpecs';

/**
 * Compact size picker for a product card. Built on native radio inputs so
 * keyboard (arrow keys / tab) and screen-reader behavior come for free.
 *
 * @param {Object} props
 * @param {string} props.value             — selected size, '' when none
 * @param {(size: string) => void} props.onChange
 * @param {string[]} [props.sizes]
 * @param {boolean} [props.invalid]        — show the "select a size" hint
 * @param {string} [props.className]
 */
export default function SizeSelector({ value, onChange, sizes = SIZE_OPTIONS, invalid = false, className = '' }) {
  const groupName = useId();

  return (
    <fieldset className={`size-select${invalid ? ' is-invalid' : ''}${className ? ` ${className}` : ''}`}>
      <legend className="size-select__legend">Size</legend>
      <div className="size-select__options">
        {sizes.map((size) => (
          <label key={size} className="size-select__option">
            <input
              type="radio"
              name={groupName}
              value={size}
              checked={value === size}
              onChange={() => onChange(size)}
            />
            <span>{size}</span>
          </label>
        ))}
      </div>
      {invalid && (
        <p className="size-select__hint" role="alert">
          Select a size to continue
        </p>
      )}
    </fieldset>
  );
}
