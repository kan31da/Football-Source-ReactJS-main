import { useNavigate } from 'react-router-dom';

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

import styles from './Coach.module.css';

const Coach = ({ coach }) => {
	const navigate = useNavigate();

	const cardFooter = (
		<div>
			<Button
				label="Coach Details"
				onClick={() => handleCoachDetailsClick()}
				icon="pi pi-info"
			/>
		</div>
	);

	const handleCoachDetailsClick = () => {
		navigate(`/people/${coach.id}`);
	};

	const cardHeader = (competition) => (
		<img src='/images/default_coach_background.jpg' className={styles['card-image']} alt="Missing Image" />
	);


	if (coach) {
		return (
			<div className={styles['coach-section']}>
				<h1 className={styles['coach-title']}>Coach</h1>
				<div className={styles['coach-card-container']}>
					<Card
						className={`${styles['coach-card']} md:w-25rem`}
						title={coach.name}
						header={cardHeader}
						footer={cardFooter}
					>
						<p><strong>Name:</strong> {coach.name}</p>
						<p><strong>Date of Birth:</strong> {coach.dateOfBirth}</p>
						<p><strong>Nationality:</strong> {coach.nationality}</p>
						<p><strong>Contract:</strong> from {coach.contract.start} until {coach.contract.until}</p>
					</Card>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export default Coach;