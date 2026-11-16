import { useState, useEffect } from 'react';

/**
 * useDebounce hook delays updating the value until delay ms have passed.
 * Used across search inputs in Pet Catalog and Admin Dashboards.
 */
export const useDebounce = (value, delay = 350) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
