import { useContext, useEffect } from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputNumber } from 'primereact/inputnumber';
import { Card } from "primereact/card";
import Modal from "react-modal";

import { useForm } from "../../hooks/useForm";
import { PredictionContext } from "../../contexts/PredictionContext";
import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';

import styles from "./PredictionEditModal.module.css";

const PredictionEditModal = ({ isOpen, currentPrediction }) => {
	const { closeEditModal, saveEditedPredictionHandler } = useContext(PredictionContext);
	const { formValues, handleInputChange, handleSubmit, resetForm, setForm } = useForm({
		prediction: {
			homeTeamScore: 0,
			awayTeamScore: 0,
		},
		notes: ''
	}, saveEditedPredictionHandler);

	useEffect(() => {
		if (isOpen) {

			resetForm();
			setForm(currentPrediction);

			document.body.classList.add(styles["modalOpen"]);
		} else {
			document.body.classList.remove(styles["modalOpen"]);
		}

		return () => {
			document.body.classList.remove(styles["modalOpen"]);
		};
	}, [isOpen, currentPrediction]);

	const cardHeader = (
		<div>
			<div>
				<img src={`${currentPrediction?.match?.homeTeam?.crest}`} alt="Missing Image" className={styles['card-header']} />
				<span>VS</span>
				<img src={`${currentPrediction?.match?.awayTeam?.crest}`} alt="Missing Image" className={styles['card-header']} />
			</div>
			<div>
				<p><strong>Date: </strong> {formatUTCDateToLocal(currentPrediction.entityDate)}</p>
			</div>
		</div>
	);

	const cardSubTitle = (
		<div>
			<p>{currentPrediction?.match?.homeTeam?.name} - {currentPrediction?.match?.awayTeam?.name}</p>
		</div>
	);

	return (
		<Modal
			className={styles["modal"]}
			isOpen={isOpen}
			onRequestClose={closeEditModal}
			ariaHideApp={false}
		>
			<div className="edit-prediction-section">
				<h3 className={styles["edit-prediction-title"]}>Edit Prediction</h3>
				<div className={`${styles['card-container']}`}>
					<Card className={`${styles['card']}`} header={cardHeader} subTitle={cardSubTitle}>
						<div className={styles['card-content']}>
							<form className={styles['edit-prediction-form']} onSubmit={handleSubmit}>
								<div className="p-fluid">

									<div className="p-field">
										<label htmlFor="homePrediction">Home Team Prediction Score:</label>
										<InputNumber
											value={formValues.prediction.homeTeamScore}
											onValueChange={handleInputChange}
											showButtons
											id="homePrediction"
											name="homePrediction"
										/>
									</div>

									<div className="p-field">
										<label htmlFor="awayPrediction">Away Team Prediction Score:</label>
										<InputNumber
											value={formValues.prediction.awayTeamScore}
											onValueChange={handleInputChange}
											showButtons
											id="awayPrediction"
											name="awayPrediction"
										/>
									</div>

									<div className="p-field">
										<label htmlFor="notes">Notes:</label>
										<InputTextarea
											id="notes"
											name="notes"
											rows={5}
											cols={100}
											autoResize
											value={formValues.notes}
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
					</Card>
				</div>
			</div>
		</Modal>
	);
};

export default PredictionEditModal;