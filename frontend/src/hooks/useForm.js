import { useState, useCallback } from "react";

const useForm = (initialValues = {}, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Handle input change
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setValues((prev) => ({ ...prev, [name]: value }));

      if (touched[name] && validate) {
        const errs = validate({ ...values, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: errs[name] }));
      }
    },
    [values, touched, validate]
  );

  // Handle blur (field touched)
  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));

      if (validate) {
        const errs = validate(values);
        setErrors((prev) => ({ ...prev, [name]: errs[name] }));
      }
    },
    [values, validate]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit) => (e) => {
      e.preventDefault();

      if (validate) {
        const errs = validate(values);
        setErrors(errs);
        setTouched(
          Object.keys(values).reduce((acc, k) => ({ ...acc, [k]: true }), {})
        );

        if (Object.keys(errs).some((k) => errs[k])) return;
      }

      onSubmit(values);
    },
    [values, validate]
  );

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // Set single field value
  const setValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setValue,
    setValues,
  };
};

export default useForm;
