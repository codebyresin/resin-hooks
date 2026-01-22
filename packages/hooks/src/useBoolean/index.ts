import { useState, useCallback, useMemo } from 'react';

export interface UseBooleanActions {
  setTrue: () => void;
  setFalse: () => void;
  set: (value: boolean) => void;
  toggle: () => void;
}

export function useBoolean(
  initialValue: boolean = false,
): [boolean, UseBooleanActions] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  const set = useCallback((val: boolean) => {
    setValue(val);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const actions: UseBooleanActions = useMemo(
    () => ({
      setTrue,
      setFalse,
      set,
      toggle,
    }),
    [setTrue, setFalse, set, toggle],
  );

  return [value, actions] as const;
}
