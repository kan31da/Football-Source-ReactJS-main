import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import PredictionEditModal from "./PredictionEditModal";
import PredictionCreateModal from "./PredictionCreateModal";
import DeleteModal from "../Modals/DeleteModal";

import * as predictionService from "../../services/predictionService";
import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';
import AuthenticationContext from '../../contexts/AuthenticationContext';
import { PredictionContext } from "../../contexts/PredictionContext";
import { useModal } from "../../hooks/useModal";

import styles from "./Predictions.module.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

const Predictions = () => {
	const [predictions, setPredictions] = useState([]);
	const {
		setSelectedItem,
		openCreateModal,
		closeCreateModal,
		openEditModal,
		closeEditModal,
		openDeleteModal,
		closeDeleteModal,
		selectedItem,
		isCreateModalOpen,
		isEditModalOpen,
		isDeleteModalOpen
	} = useModal()

	const navigate = useNavigate();

	const { authentication, showSuccess, showError } = useContext(AuthenticationContext);

	const validatePrediction = (prediction, mode) => {

		if (!prediction.competition && mode === 'NEW') {
			showError(`'Competition' is required`)

			return false
		}

		if (!prediction.date && mode === 'NEW') {
			showError(`'Date' is required`)

			return false
		}

		if (!prediction.match && mode === 'NEW') {
			showError(`'Match' is required`)

			return false
		}

		if (!prediction.homePrediction && prediction.homePrediction != 0 && mode === 'NEW') {
			showError(`'Home Prediction' is required`)

			return false
		}

		if (!prediction.awayPrediction && prediction.awayPrediction != 0 && mode === 'NEW') {
			showError(`'Away Prediction' is required`)

			return false
		}

		const isMatchDatePast = new Date(prediction.date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

		if (mode === 'NEW' && isMatchDatePast) {

			showError('Cannot create prediction for finished matches')

			return false
		}

		const isEntitiyDatePast = new Date(prediction.entityDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

		if (mode === 'EDIT' && isEntitiyDatePast) {
			
			showError('Cannot edit prediction for finished matches')
			
			return false
		}

		if (prediction.homePrediction < 0 || prediction.awayPrediction < 0) {
			showError('Score prediction cannot be less than 0')

			return false
		}

		const isPredictionForThisMatchAlreadyMake = predictions.some(obj => obj.matchId === prediction.match.id && prediction._id != obj._id);

		if (isPredictionForThisMatchAlreadyMake) {
			showError(`Prediction for this match already exists`)

			return false
		}

		return true;
	}

	useEffect(() => {
		predictionService
			.getAllPredictions()
			.then((result) => {
				if (result) {
					setPredictions(result.sort((a, b) => b._createdOn - a._createdOn));
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const handlePredictionDetailsClick = (prediction) => {
		navigate(`/predictions/${prediction._id}`);
	};

	const deletePrediction = async (_id) => {
		await predictionService.remove(_id);

		setPredictions((state) =>
			state.filter((currentPrediction) => {
				return currentPrediction._id !== _id;
			}));

		closeDeleteModal();

		showSuccess('Successfully deleted prediction');
	};

	const handlePredictionDeleteClick = async (prediction) => {
		setSelectedItem(prediction);
		openDeleteModal();
	};

	const handlePredictionEditClick = (prediction) => {
		setSelectedItem(prediction);

		openEditModal();
	};

	const optionsBodyTemplate = (prediction) => {
		return (
			<div className={styles["details-btn"]}>
				<Button
					onClick={() => handlePredictionDetailsClick(prediction)}
					icon="pi pi-info"
					className="p-button-rounded p-button-text"
					title="Details"
				/>
				{(authentication._id === prediction._ownerId || authentication.isAdmin) && <>
					<Button
						icon="pi pi-pencil"
						className="p-button-rounded p-button-text"
						title="Edit"
						onClick={() => handlePredictionEditClick(prediction)}
					/>
					<Button
						icon="pi pi-trash"
						className="p-button-rounded p-button-text p-button-danger"
						title="Delete"
						onClick={() => handlePredictionDeleteClick(prediction)}
					/>
				</>}
			</div>
		);
	};

	const matchHomeEmblemBodyTemplate = (rowData) => {
		return <img src={`${rowData?.match?.homeTeam?.crest}`} className={styles['match-emblem']} alt="Missing Image" />;
	};

	const matchAwayEmblemBodyTemplate = (rowData) => {
		return <img src={`${rowData?.match?.awayTeam?.crest}`} className={styles['match-emblem']} alt="Missing Image" />;
	};

	const matchDateBodyTemplate = (rowData) => {
		return <p>{formatUTCDateToLocal(rowData?.entityDate)}</p>
	}

	const predictionData = (rowData) => {
		if (rowData?.prediction) {
			return `${rowData?.prediction?.homeTeamScore} : ${rowData?.prediction?.awayTeamScore}`
		}

		return '';
	};

	const saveEditedPredictionHandler = async (prediction) => {
		if (validatePrediction(prediction, 'EDIT') == true) {

			closeEditModal();

			const currentDate = new Date();

			const pred = {
				homeTeamScore: prediction.homePrediction ?? selectedItem.prediction.homeTeamScore,
				awayTeamScore: prediction.awayPrediction ?? selectedItem.prediction.awayTeamScore
			}

			const updatedPrediction = await predictionService.update(prediction._id, selectedItem.matchId, selectedItem.match, pred, prediction.notes, selectedItem.entityDate, selectedItem.dateCreated, currentDate);

			setPredictions((prevPredictions) =>
				prevPredictions.map((pr) =>
					pr._id === prediction._id
						? {
							...pr,
							prediction: updatedPrediction.prediction,
							notes: updatedPrediction.notes
						}
						: pr
				)
			);

			showSuccess('Successfully edited prediction');
		}
	}

	const saveNewPredictionHandler = async (prediction) => {
		if (validatePrediction(prediction, 'NEW') == true) {
			closeCreateModal();

			const currentDate = new Date();

			const match = {
				homeTeam: {
					name: prediction.match.homeTeam.name,
					crest: prediction.match.homeTeam.crest
				},
				awayTeam: {
					name: prediction.match.awayTeam.name,
					crest: prediction.match.awayTeam.crest
				}
			}

			const pred = {
				homeTeamScore: prediction.homePrediction ?? 0,
				awayTeamScore: prediction.awayPrediction ?? 0
			}

			const createdPrediction = await predictionService.create(prediction.match.id, match, pred, prediction.notes, prediction.match.utcDate, currentDate, currentDate);

			setPredictions((state) => [createdPrediction, ...state]);

			showSuccess('Successfully added new prediction');
		}
	}

	const predicitonContextValue = {
		closeCreateModal,
		closeEditModal,
		saveEditedPredictionHandler,
		saveNewPredictionHandler
	}

	return (
		<PredictionContext.Provider value={predicitonContextValue}>
			<div className={styles["predictions-section"]}>
				<h2 className={styles["predictions-title"]}>All Predictions</h2>
				<div className={styles["widget-header"]}>
					<DataTable
						value={predictions}
						sortMode="multiple"
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 15, 20, 50]}
						totalRecords={predictions?.length}
					>
						<Column field="matchId" header="Match ID" sortable />
						<Column field="match.homeTeam.name" header="Home Team Name" sortable filter />
						<Column body={matchHomeEmblemBodyTemplate} header="Home Team Emblem" />
						<Column body={predictionData} header="Prediction" />
						<Column body={matchAwayEmblemBodyTemplate} header="Away Team Emblem" filter />
						<Column field="match.awayTeam.name" header="Away Team Name" sortable />
						<Column body={matchDateBodyTemplate} header="Date" sortable filter />
						<Column field="owner.username" header="User" sortable filter />
						<Column header="Options" body={optionsBodyTemplate} />
					</DataTable>
				</div>
				<div>
					<PredictionEditModal
						isOpen={isEditModalOpen}
						currentPrediction={selectedItem}
					/>
				</div>
				<div>
					<PredictionCreateModal
						isOpen={isCreateModalOpen}
					/>
				</div>
				<div>
					<DeleteModal
						isOpen={isDeleteModalOpen}
						closeDeleteModal={closeDeleteModal}
						onConfirm={deletePrediction}
						_id={selectedItem?._id}
					/>
				</div>
				<div>
					<Button
						label=' Add New Prediction Event'
						icon="pi pi-plus"
						className="p-button-rounded"
						onClick={openCreateModal}
					/>
				</div>
			</div>
		</PredictionContext.Provider>
	);
};

export default Predictions;