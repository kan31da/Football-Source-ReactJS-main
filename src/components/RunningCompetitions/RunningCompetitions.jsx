import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { Button } from 'primereact/button';

import styles from './RunningCompetitions.module.css';

const RunningCompetitions = ({ runningCompetitions }) => {
	const navigate = useNavigate();

	const cardHeader = (competition) => (
		<img src={`${competition?.emblem}`} className={styles['card-image']} alt="Missing Image" />
	);

	const cardFooter = (competition) => (
		<div>
			<Button
				label="Competition Details"
				onClick={() => handleCompetitionDetailsClick(competition)}
				icon="pi pi-info"
			/>
		</div>
	);

	const handleCompetitionDetailsClick = (competition) => {
		navigate(`/competitions/${competition.code}`);
	}

	if (runningCompetitions?.length > 0) {
		return (
			<div className={styles['running-competitions-section']}>
				<h1 className={styles['running-competitions-title']}>All Running Competitions</h1>
				<div className={styles['running-competitions-container']}>
					{runningCompetitions.map((competition) => (
						<div className={styles['card-container']} key={competition.id}>
							<Card className={styles['card']} footer={cardFooter(competition)} header={cardHeader(competition)} title={competition.name} />
						</div>
					))}
				</div>
			</div>
		);
	} else {
		return null;
	}
}

export default RunningCompetitions;