import { useContext, useEffect, useState } from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import Picker from "@emoji-mart/react";
import Modal from "react-modal";

import { CommentContext } from "../../contexts/CommentContext";
import { useForm } from "../../hooks/useForm";

import styles from "./EditCommentModal.module.css";

const EditCommentModal = ({ isOpen, comment }) => {
	const [showPicker, setShowPicker] = useState(false);
	const { saveEditedCommentHandlerClick, closeEditModal } = useContext(CommentContext);

	useEffect(() => {
		if (isOpen) {
			resetForm();
			setForm({ text: comment });

			document.body.classList.add(styles["modalOpen"]);
		} else {
			document.body.classList.remove(styles["modalOpen"]);
		}

		return () => {
			document.body.classList.remove(styles["modalOpen"]);
		};
	}, [isOpen, comment]);

	const handleEmojiSelect = (emoji) => {
		setForm({ text: formValues.text + emoji.native });
	};

	const saveEditCommentHandler = async (values) => {
		await saveEditedCommentHandlerClick(values.text);
	};

	const { formValues, handleInputChange, resetForm, setForm, handleSubmit } = useForm({ text: '' }, saveEditCommentHandler);

	return (
		<Modal
			className={styles["modal"]}
			isOpen={isOpen}
			onRequestClose={closeEditModal}
			ariaHideApp={false}
		>
			<div className="edit-comment-section">
				<h3 className={styles["edit-comment-title"]}>Edit Comment</h3>
				<div className={styles["emoji-section"]}>
					<label>Emojis: </label>
					<button onClick={() => setShowPicker(!showPicker)}>😊</button>
				</div>
				{showPicker && (
					<div className={styles["emoji-picker-container"]}>
						<Picker onEmojiSelect={handleEmojiSelect} />
					</div>
				)}
				<form className={styles["form"]} onSubmit={handleSubmit}>
					<InputTextarea
						rows={5}
						cols={100}
						autoResize
						name="text"
						value={formValues.text}
						onChange={handleInputChange}
					/>
					<div className={styles["buttons-container"]}>
						<Button
							className="p-button-rounded p-button-text p-button-success pi pi-check"
							type="submit"
						/>
						<Button
							className="p-button-rounded p-button-text p-button-secondary pi pi-delete-left"
							onClick={closeEditModal}
						/>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default EditCommentModal;