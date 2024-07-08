import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';

import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';
import * as competitionService from '../../services/competitionService';
import * as teamService from '../../services/teamService';
import * as personService from '../../services/personService';

import styles from './Matches.module.css';

const Matches = ({ id, type, alias }) => {
	const [matches, setMatches] = useState([]);
	const [competitionName, setCompetitionName] = useState('');

	const navigate = useNavigate();

	useEffect(() => {

		switch (type) {
			case 'competition':

				competitionService.getCompetitionMatchesByAlias(alias)
					.then((result) => {
						if (result.error)
							throw new Error(result.error);

						setMatches(result.matches);
						setCompetitionName(result.competition.name);
					})
					.catch((error) => {
						console.log(error);
						navigate(`/error`);
					});

				break;
			case 'team':

				teamService.getTeamMatchesById(id)
					.then((result) => {
						if (result.error)
							throw new Error(result.error);

						setMatches(result.matches);
					})
					.catch((error) => {
						console.log(error);
						navigate(`/error`);
					});

				break;
			case 'person':

				personService.getPersonMatchesById(id)
					.then((result) => {
						if (result.error)
							throw new Error(result.error);

						setMatches(result.matches);
					})
					.catch((error) => {
						console.log(error);
						navigate(`/error`);
					});

				break;
			default:
				break;
		}
	}, []);

	const matchHomeEmblemBodyTemplate = (match) => {
		return <img src={`${match.homeTeam.crest}`} className={styles['match-emblem']} alt="Missing Image" />;
	};

	const matchAwayEmblemBodyTemplate = (match) => {
		return <img src={`${match.awayTeam.crest}`} className={styles['match-emblem']} alt="Missing Image" />;
	};

	const handleMatchDetailsClick = (match) => {
		navigate(`/matches/${match.id}`);
	}

	const optionsBodyTemplate = (match) => {
		return (
			<div className={styles['details-btn']}>
				<Button
					label="Match Details"
					onClick={() => handleMatchDetailsClick(match)}
					icon="pi pi-info"
				/>
			</div>
		)
	};

	const refereData = (match) => {
		if (match.referees && match.referees?.length > 0) {
			return match.referees[0].name;
		}
		return '';
	};

	const scoreData = (match) => {
		if (match.score && match.status !== 'TIMED' && match.status !== "SCHEDULED") {
			return `${match.score?.fullTime?.home} : ${match.score?.fullTime?.away} / ${match.score?.halfTime?.home} : ${match.score?.halfTime?.away}`
		}
		return '';
	};

	const matchDateBodyTemplate = (match) => {
		return <p>{formatUTCDateToLocal(match.utcDate)}</p>
	}

	return (
		<div className={styles['matches-section']}>
			<h2 className={styles['matches-title']}>All {competitionName} Matches</h2>
			<div className={styles['widget-header']}>
				<DataTable
					value={matches}
					sortMode="multiple"
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 15, 20, 50]}
					totalRecords={matches?.length}
				>
					<Column field="id" header="ID" sortable />
					<Column field="homeTeam.name" header="Home Team Name" sortable filter filterPlaceholder="Search by Home Team Name" />
					<Column header="Home Team Emblem" body={matchHomeEmblemBodyTemplate} />
					<Column field="score" header="Result" body={scoreData} />
					<Column header="Away Team Emblem" body={matchAwayEmblemBodyTemplate} />
					<Column field="awayTeam.name" header="Away Team Name" sortable filter filterPlaceholder="Search by Away Team Name" />
					<Column field="referees" header="Referee" body={refereData} filter filterPlaceholder="Search by Referee Name" />
					<Column field="status" header="Status" sortable filter filterPlaceholder="Search by Status" />
					<Column body={matchDateBodyTemplate} header="Date" sortable filter filterPlaceholder="Search by Date" />
					<Column header="Options" body={optionsBodyTemplate} />
				</DataTable>
			</div>
		</div>
	);
}

export default Matches;