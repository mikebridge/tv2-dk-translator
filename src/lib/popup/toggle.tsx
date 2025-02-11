import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';

interface ToggleProps {
  initialValue: boolean
  onToggle: (enabled: boolean) => void
}

export default function Toggle({ initialValue = false, onToggle }: ToggleProps) {
  const [enabled, setEnabled] = useState(initialValue);

  useEffect(() => {
    setEnabled(initialValue);
  }, [initialValue]);

  const handleChange = (newValue: boolean) => {
    setEnabled(newValue);
    if (onToggle) {
      onToggle(newValue);
    }
  };

  return (
    <Switch
      checked={enabled}
      onChange={handleChange}
      className={`group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
        enabled ? "bg-red-500" : "bg-gray-200"
      } focus:ring-2 focus:ring-red-500 focus:ring-offset-2`}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </Switch>
  );
}
