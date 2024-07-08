import { useState } from "react";

export const useForm = (initialValues, onSubmit) => {
	const [formValues, setFormValues] = useState(initialValues);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormValues({
			...formValues,
			[name]: value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		onSubmit(formValues);
	}

	const resetForm = () => {
		setFormValues(initialValues);
	};

	const setForm = (values) => {
		setFormValues(values);
	}

	return {
		formValues,
		handleInputChange,
		handleSubmit,
		resetForm,
		setForm
	};
};