import { useRef, useLayoutEffect, useCallback } from 'react';

/**
 * Custom hook to filter controlled text inputs while preserving cursor position.
 * Prevents triggering searches or state updates when invalid characters are typed or pasted.
 *
 * @param {Object} options
 * @param {string} options.value Current value
 * @param {Function} options.setValue State setter for value
 * @param {Function} options.filterFn Filter function (e.g., keepLetters, keepLoginCharacters)
 * @param {number} [options.maxLength] Maximum allowed length
 * @param {Function} [options.onValidChange] Callback invoked only when value actually changes
 * @returns {{ inputRef: React.RefObject, handleChange: Function }}
 */
export function useFilteredInput({
  value,
  setValue,
  filterFn,
  maxLength,
  onValidChange,
}) {
  const inputRef = useRef(null);
  const cursorRef = useRef(null);

  useLayoutEffect(() => {
    if (cursorRef.current !== null && inputRef.current) {
      const { start, end } = cursorRef.current;
      try {
        inputRef.current.setSelectionRange(start, end);
      } catch {
        // Element does not support setSelectionRange (e.g. type="email" in some browsers)
      }
      cursorRef.current = null;
    }
  });

  const handleChange = useCallback(
    (e) => {
      const raw = e.target.value;
      let rawCursor = raw.length;
      try {
        if (typeof e.target.selectionStart === 'number') {
          rawCursor = e.target.selectionStart;
        }
      } catch {
        rawCursor = raw.length;
      }
      const rawBeforeCursor = raw.slice(0, rawCursor);
      const filteredBeforeCursor = filterFn(rawBeforeCursor);
      const targetCursor = filteredBeforeCursor.length;

      let filtered = filterFn(raw);
      if (maxLength && filtered.length > maxLength) {
        filtered = filtered.slice(0, maxLength);
      }

      const finalCursor = Math.min(targetCursor, filtered.length);

      // If the filtered result is identical to the current value, an invalid character
      // was typed or pasted. Revert DOM input immediately and do not trigger a search.
      if (filtered === value) {
        e.target.value = value;
        try {
          e.target.setSelectionRange(finalCursor, finalCursor);
        } catch {
          // ignore
        }
        return;
      }

      cursorRef.current = { start: finalCursor, end: finalCursor };
      setValue(filtered);
      if (onValidChange) {
        onValidChange(filtered);
      }
    },
    [value, setValue, filterFn, maxLength, onValidChange]
  );

  return { inputRef, handleChange };
}

export default useFilteredInput;
