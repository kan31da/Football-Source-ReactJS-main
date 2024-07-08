import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';

import * as competitionService from '../../services/competitionService';

import styles from './GoalScorers.module.css';

const GoalScorers = () => {
	const [goalScorers, setGoalScorers] = useState([]);
	const [competitionName, setCompetitionName] = useState('');

	const { alias, limit } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		competitionService.getCompetitionTopScorersByAlias(alias, limit)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setGoalScorers(result.scorers);
				setCompetitionName(result.competition.name);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const handlePlayerDetailsClick = (scorer) => {
		navigate(`/people/${scorer.player.id}`);
	}

	const teamEmblemBodyTemplate = (scorer) => {
		return <img src={`${scorer.team.crest}`} className={styles['team-emblem']} alt="Missing Image" />;
	};

	const optionsBodyTemplate = (scorer) => {
		return (
			<div className={styles['details-btn']}>
				<Button
					label="Player Details"
					onClick={() => handlePlayerDetailsClick(scorer)}
					icon="pi pi-info"
				/>
			</div>
		)
	};

	return (
		<div className={styles['goal-scorers-section']}>
			<h2 className={styles['goal-scorers-title']}>All {competitionName} Goal Scorers</h2>
			<div className={styles['widget-header']}>
				<DataTable
					value={goalScorers}
					sortMode="multiple"
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 15, 20, 50]}
					totalRecords={goalScorers?.length}
				>
					<Column field="player.id" header="ID" sortable />
					<Column field="player.name" header="Player" sortable filter filterPlaceholder="Search by Player Name" />
					<Column header="Date of Birth" field='player.dateOfBirth' sortable filter filterPlaceholder="Search by Date Of Birth" />
					<Column field="player.nationality" header="Nationality" sortable filter filterPlaceholder="Search by Nationality" />
					<Column header="Position" field='player.section' sortable filter filterPlaceholder="Search by Player Position" />
					<Column field="team.name" header="Team" sortable filter filterPlaceholder="Search by Player Team" />
					<Column header="Emblem" body={teamEmblemBodyTemplate} />
					<Column field="playedMatches" header="Played Matches" sortable filter filterPlaceholder="Search by Played Matches" />
					<Column field="goals" header="Goals" sortable filter filterPlaceholder="Search by Goals" />
					<Column field="assists" header="Assists" sortable filter filterPlaceholder="Search by Assists" />
					<Column field="penalties" header="Penalties" sortable filter filterPlaceholder="Search by Penalties" />
					<Column header="Options" body={optionsBodyTemplate} />
				</DataTable>
			</div>
		</div>
	);
}

export default GoalScorers;