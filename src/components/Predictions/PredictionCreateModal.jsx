import { useContext, useEffect, useState } from "react";

import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import Modal from "react-modal";
import { ListBox } from "primereact/listbox";

import { useForm } from "../../hooks/useForm";
import { PredictionContext } from "../../contexts/PredictionContext";
import * as competitionService from "../../services/competitionService";

import styles from "./PredictionCreateModal.module.css";

const getMatchesDates = (inputDate) => {
	let year = inputDate.getFullYear();
	let month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
	let day = inputDate.getDate().toString().padStart(2, '0');

	const dateFrom = `${year}-${month}-${day}`;

	const dateTo = dateFrom;

	return { dateFrom, dateTo };
} 

const PredictionCreateModal = ({ isOpen }) => {
	const { closeCreateModal, saveNewPredictionHandler } = useContext(PredictionContext);
	const [competitions, setCompetitions] = useState({});
	const [matches, setMatches] = useState([]);
	const { formValues, handleInputChange, handleSubmit, resetForm } = useForm({
		competition: null,
		match: null,
		homePrediction: null,
		awayPrediction: null,
		date: null,
		notes: '',
	}, saveNewPredictionHandler);

	useEffect(() => {
		if (isOpen) {

			resetForm();

			document.body.classList.add(styles["modalOpen"]);
		} else {
			document.body.classList.remove(styles["modalOpen"]);
		}

		return () => {
			document.body.classList.remove(styles["modalOpen"]);
		};
	}, [isOpen]);

	useEffect(() => {
		competitionService
			.getAllCompetitions()
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setCompetitions(result.competitions);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [])

	useEffect(() => {
		if (formValues?.competition && formValues?.date) {

			const {dateFrom, dateTo} = getMatchesDates(formValues.date);

			competitionService.getCompetitionMatchesByAliasFiltered(formValues.competition.code, dateFrom, dateTo)
				.then((result) => {
					if (result.error)
						throw new Error(result.error);

					setMatches(result.matches);
				})
				.catch((error) => {
					console.log(error);
					navigate(`/error`);
				});
		}
	}, [formValues.competition, formValues.date])

	const competitionsTemplate = (option) => {
		return (
			<div className="flex align-items-center">
				<img alt="Missing Image" src={option.emblem} className="flag" style={{ width: '1.25rem', marginRight: '.5rem' }} />
				<div>{option.name}</div>
			</div>
		);
	};

	const matchesTemplate = (option) => {
		return (
			<div className="flex justify-content">
				{option.homeTeam.name}
				<img alt="Missing Image" src={option.homeTeam.crest} className="flag" style={{ width: '1.25rem', marginRight: '.15rem' }} />
				<span>VS</span>
				<img alt="Missing Image" src={option.awayTeam.crest} className="flag" style={{ width: '1.25rem', marginLeft: '.15rem' }} />
				{option.awayTeam.name}
			</div>
		);
	};

	return (
		<Modal
			className={styles["modal"]}
			isOpen={isOpen}
			onRequestClose={closeCreateModal}
			ariaHideApp={false}
		>
			<div className="create-prediction-section">
				<h3 className={styles["create-prediction-title"]}>Create New Prediction</h3>
				<form className={styles['create-prediction-form']} onSubmit={handleSubmit}>
					<div className="p-fluid">
						<div className="p-field">
							<label htmlFor="competition">Competitions:</label>
							<ListBox
								value={formValues.competition}
								onChange={handleInputChange}
								options={competitions}
								filter
								optionLabel="name"
								itemTemplate={competitionsTemplate}
								className="w-full md:w-14rem"
								id="competition"
								name="competition"
								listStyle={{ maxHeight: '250px' }}
							/>
						</div>

						{formValues.competition && <div className="p-field">
							<label htmlFor="date">Date</label>
							<Calendar
								id="date"
								name="date"
								dateFormat='dd/mm/yy'
								placeholder={new Date().toDateString('dd/mm/yy')}
								value={formValues.date}
								onChange={handleInputChange} showIcon
							/>
						</div>}

						{(formValues.competition && formValues.date) && <div className="p-field">
							<label htmlFor="match">Matches:</label>
							<ListBox
								value={formValues.match}
								onChange={handleInputChange}
								options={matches}
								filter
								optionLabel="homeTeam.name"
								itemTemplate={matchesTemplate}
								className="w-full md:w-14rem"
								id="match"
								name="match"
								listStyle={{ maxHeight: '250px' }}
							/>
						</div>}

						{(formValues.competition && formValues.date && formValues.match) && <div className="p-field">
							<label htmlFor="homePrediction">Home Team Prediction Score:</label>
							<InputNumber
								value={formValues.homePrediction}
								onValueChange={handleInputChange}
								showButtons
								id="homePrediction"
								name="homePrediction"
							/>
						</div>}

						{(formValues.competition && formValues.date && formValues.match) && <div className="p-field">
							<label htmlFor="awayPrediction">Away Team Prediction Score:</label>
							<InputNumber
								value={formValues.awayPrediction}
								onValueChange={handleInputChange}
								showButtons
								id="awayPrediction"
								name="awayPrediction"
							/>
						</div>}

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
							onClick={closeCreateModal}
						/>
					</div>
				</form>
			</div>
		</Modal>
	);
};

export default PredictionCreateModal;