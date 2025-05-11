import { Field, useFormikContext } from 'formik';
import React from 'react';

interface BooleanCheckboxProps {
  name: string;
  label: string;
  [key: string]: any; // Allow other props to be passed through
}

function BooleanCheckbox({ name, label, ...props }: BooleanCheckboxProps) {
  return (
    <div className="form-control">
      <label>
        <Field type="checkbox" name={name} {...props} />
        {label}
      </label>
    </div>
  );
}

export default BooleanCheckbox;