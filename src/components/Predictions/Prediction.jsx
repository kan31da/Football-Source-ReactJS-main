import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from "react-router-dom"

import { Card } from 'primereact/card';
import { Button } from "primereact/button";
import CommentsList from '../Comments/CommentsList';

import AuthenticationContext from '../../contexts/AuthenticationContext';
import * as predictionService from '../../services/predictionService';
import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';

import styles from './Prediction.module.css';

const Prediction = () => {
	const [prediction, setPrediction] = useState(null);

	const navigate = useNavigate();

	const { id } = useParams();

	const { isAuthenticated } = useContext(AuthenticationContext);

	useEffect(() => {
		predictionService.getPredictionById(id)
			.then((result) => {
				if (result) {
					setPrediction(result);
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [id]);

	const handleMatchDetailsClick = () => {
		navigate(`/matches/${prediction.matchId}`);
	};

	const cardHeader = (
		<div>
			<div>
				<img src={`${prediction?.match?.homeTeam?.crest}`} alt="Missing Image" className={styles['card-header']} />
				<span>VS</span>
				<img src={`${prediction?.match?.awayTeam?.crest}`} alt="Missing Image" className={styles['card-header']} />
			</div>
			<div className={styles["details-btn"]}>
				<Button
					label="Match Details"
					onClick={handleMatchDetailsClick}
					icon="pi pi-info"
				/>
			</div>
		</div>
	);

	const cardSubTitle = (
		<div>
			<p>{prediction?.match?.homeTeam?.name} - {prediction?.match?.awayTeam?.name}</p>
		</div>
	);

	if (prediction) {
		return (
			<div className={styles['prediction-section']}>
				<h1 className={styles['prediction-title']}>Prediction Details</h1>
				<div className={styles['card-container']}>
					<Card
						className={styles['card']}
						header={cardHeader}
						subTitle={cardSubTitle}
					>
						<div className={styles['card-content']}>
							<strong>Match Date: </strong> <p>{formatUTCDateToLocal(prediction.entityDate)}</p>
							<strong>Prediction: </strong> <p>{prediction.prediction.homeTeamScore} : {prediction.prediction.awayTeamScore}</p>
							<strong>Notes: </strong> <p>{prediction.notes}</p>
							<strong>Made by: </strong> <p>{prediction.owner.username}</p>
						</div>
					</Card>
				</div>
				{isAuthenticated ? (<CommentsList entityId={id} type='prediction' />) : (<h3>Login to see comments!</h3>)}
			</div>
		);
	} else {
		return null;
	}
};

export default Prediction;