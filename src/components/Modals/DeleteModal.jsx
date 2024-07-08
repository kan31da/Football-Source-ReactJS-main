import { useEffect } from "react";

import Modal from "react-modal";
import { Button } from "primereact/button";

import styles from "./DeleteModal.module.css";

const DeleteModal = ({ isOpen, closeDeleteModal, onConfirm, _id }) => {
	useEffect(() => {
		if (isOpen) {

			document.body.classList.add(styles["modalOpen"]);
		} else {
			document.body.classList.remove(styles["modalOpen"]);
		}

		return () => {
			document.body.classList.remove(styles["modalOpen"]);
		};
	}, [isOpen]);

	return <Modal
		className={styles["modal"]}
		isOpen={isOpen}
		onRequestClose={closeDeleteModal}
		ariaHideApp={false}
	>
		<div className="delete-modal-section">
			<h3 className={styles["delete-modal-title"]}>Are you sure you want to delete this record?</h3>
			<div>
				<Button
					icon="pi pi-check"
					className="p-button-rounded p-button-text"
					onClick={() => onConfirm(_id)}
				/>
				<Button
					icon="pi pi-times"
					className="p-button-rounded p-button-text p-button-danger"
					onClick={closeDeleteModal}
				/>
			</div>
		</div>
	</Modal>;
}

export default DeleteModal;