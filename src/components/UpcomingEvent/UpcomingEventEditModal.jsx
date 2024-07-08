import { useContext, useEffect } from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import Modal from "react-modal";

import { formatDateToIsoDate } from "../../utils/dateTimeUtils";
import { useForm } from "../../hooks/useForm";
import { UpcomingEventContext } from "../../contexts/UpcomingEventContext";

import styles from "./UpcomingEventEditModal.module.css";

const UpcomingEventEditModal = ({ isOpen, currentEvent }) => {
	const { closeEditModal, saveEditedEventHandler } = useContext(UpcomingEventContext);
	const { formValues, handleInputChange, handleSubmit, resetForm, setForm } = useForm({
		_id: '',
		name: '',
		description: '',
		startDate: '',
		imageUrl: '',
	}, saveEditedEventHandler);

	useEffect(() => {
		if (isOpen) {

			resetForm();
			setForm(currentEvent);

			document.body.classList.add(styles["modalOpen"]);
		} else {
			document.body.classList.remove(styles["modalOpen"]);
		}

		return () => {
			document.body.classList.remove(styles["modalOpen"]);
		};
	}, [isOpen, currentEvent]);

	return (
		<Modal
			className={styles["modal"]}
			isOpen={isOpen}
			onRequestClose={closeEditModal}
			ariaHideApp={false}
		>
			<div className="edit-event-section">
				<h3 className={styles["edit-event-title"]}>Edit {currentEvent?.name}</h3>
				<form className={styles['edit-event-form']} onSubmit={handleSubmit}>
					<div className="p-fluid">
						<div className="p-field">
							<label htmlFor="name">Event Name:</label>
							<InputText
								id="name"
								name="name"
								value={formValues.name}
								onChange={handleInputChange}
							/>
						</div>

						<div className="p-field">
							<label htmlFor="description">Description:</label>
							<InputTextarea
								id="description"
								name="description"
								rows={5}
								cols={100}
								autoResize
								value={formValues.description}
								onChange={handleInputChange}
							/>
						</div>

						<div className="p-field">
							<label htmlFor="startDate">Start Date:</label>
							<Calendar
								id="startDate"
								name="startDate"
								value={new Date(formatDateToIsoDate(formValues.startDate))}
								onChange={handleInputChange}
								dateFormat="dd/mm/yy"
							/>
						</div>

						<div className="p-field">
							<label htmlFor="imageUrl">Image Url:</label>
							<InputText
								id="imageUrl"
								name="imageUrl"
								value={formValues.imageUrl}
								onChange={handleInputChange}
							/>
						</div>
					</div>
					<div>
						<Button
							icon="pi pi-check"
							className="p-button-rounded p-button-text"
							type="submit"
						/>
						<Button
							icon="pi pi-times"
							className="p-button-rounded p-button-text p-button-danger"
							onClick={closeEditModal}
						/>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default UpcomingEventEditModal;