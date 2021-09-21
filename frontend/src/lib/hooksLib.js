import { useState } from 'react';

export function useFormFields(initialState) {
  const [fields, setValues] = useState(initialState);

  const handleChange = (e) => {
    const { id, value } = e.target;

    setValues({
      ...fields,
      [id]: value,
    });
  };

  return [fields, handleChange];
}
