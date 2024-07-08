import { useContext, useEffect } from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import Modal from "react-modal";
import { Card } from "primereact/card";

import { FavouriteTeamContext } from "../../contexts/FavouriteTeamContext";
import { useForm } from "../../hooks/useForm";

import styles from "./FavouriteTeamEditModal.module.css";

const FavouriteTeamEditModal = ({ isOpen, team }) => {
	const { saveEditedFavouriteTeamHandlerClick, closeEditModal, cardHeader, cardSubtitle } = useContext(FavouriteTeamContext);
	const { formValues, handleInputChange, handleSubmit, resetForm, setForm } = useForm(team, saveEditedFavouriteTeamHandlerClick);

	useEffect(() => {
		if (isOpen) {

			resetForm();
			setForm(team);

			document.body.classList.add(styles["modalOpen"]);
		} else {
			document.body.classList.remove(styles["modalOpen"]);
		}

		return () => {
			document.body.classList.remove(styles["modalOpen"]);
		};
	}, [isOpen, team]);

	return (
		<Modal
			className={styles["modal"]}
			isOpen={isOpen}
			onRequestClose={closeEditModal}
			ariaHideApp={false}
		>
			<div className="edit-favourite-team-section">
				<h3 className={styles["edit-favourite-team-title"]}>Edit Favourite Team</h3>
				<form className={styles["form"]} onSubmit={handleSubmit}>
					<div className={`${styles['card-container']}`} key={team?.teamId}>
						<Card className={`${styles['card']}`} subTitle={cardSubtitle(team)} header={cardHeader(team)} title={team?.teamName}>
							<div className={styles['card-content']}>
							<div className="p-fluid">
								<div className="p-field">
									<label htmlFor="description">Description:</label>
									<InputTextarea
										rows={5}
										cols={100}
										autoResize
										id="description"
										name="description"
										value={formValues?.description}
										onChange={handleInputChange}
									/>
								</div>
								</div>
							</div>
						</Card>
					</div>
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

export default FavouriteTeamEditModal;