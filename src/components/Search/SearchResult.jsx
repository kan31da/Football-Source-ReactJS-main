import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import ClubColor from '../ClubColor/ClubColor';

import * as competitionService from "../../services/competitionService";
import * as teamService from "../../services/teamService";

import styles from './SearchResult.module.css';

const SearchResult = () => {
	const [competitions, setCompetitions] = useState([]);
	const [teams, setTeams] = useState([]);

	const navigate = useNavigate();

	const { phrase } = useParams();

	useEffect(() => {
		competitionService
			.getAllCompetitions()
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setCompetitions(result.competitions.filter(competition => competition.name.toLowerCase().includes(phrase.toLowerCase())));
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [phrase]);

	useEffect(() => {
		teamService.getAllTeams()
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setTeams(result.teams.filter(team => team.name.toLowerCase().includes(phrase.toLowerCase())));
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [phrase]);

	const competitionEmblemBodyTemplate = (competition) => {
		return (
			<img
				src={`${competition.emblem}`}
				className={styles["competition-emblem"]}
				alt="Missing Image"
			/>
		);
	};

	const handleCompetitionDetailsClick = (competition) => {
		navigate(`/competitions/${competition.code}`);
	};

	const competitionOptionsBodyTemplate = (competition) => {
		return (
			<div className={styles["details-btn"]}>
				<Button
					label="Competition Details"
					onClick={() => handleCompetitionDetailsClick(competition)}
					icon="pi ppi-info"
				/>
			</div>
		);
	};

	const handleTeamDetailsClick = (team) => {
		navigate(`/teams/${team.id}`);
	};

	const teamOptionsBodyTemplate = (team) => {
		return (
			<div className={styles["details-btn"]}>
				<Button
					label="Team Details"
					onClick={() => handleTeamDetailsClick(team)}
					icon="pi pi-info"
				/>
			</div>
		);
	};

	const teamEmblemBodyTemplate = (team) => {
		return (
			<img
				src={`${team.crest}`}
				className={styles["team-emblem"]}
				alt="Missing Image"
			/>
		);
	};

	const teamColorsBodyTemplate = (team) => {
		return (
			<ClubColor text={team.clubColors} />
		)
	}

	const teamWebsiteBodyTemplae = (team) => {
		return (
			<a href={team.website}>{team.website}</a>
		)
	}

	return (
		<div className={styles['saerch-result-section']}>
			<h1 className={styles['search-result-title']}>Search Result from '{phrase}'</h1>
			<div className={styles["competitions-section"]}>
				<h2 className={styles["competitions-title"]}>All Competitions</h2>
				<div className={styles["widget-header"]}>
					<DataTable
						value={competitions}
						sortMode="multiple"
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 15, 20, 50]}
						totalRecords={competitions?.length}
					>
						<Column field="id" header="ID" sortable />
						<Column field="name" header="Competition Name" sortable filter filterPlaceholder="Search by Competition Name" />
						<Column header="Competition Emblem" body={competitionEmblemBodyTemplate} />
						<Column field="code" header="Code" sortable />
						<Column field="area.name" header="Area" sortable filter filterPlaceholder="Search by Area" />
						<Column field="currentSeason.currentMatchday" header="Current Matchday" sortable filter filterPlaceholder="Search by Current Matchday" />
						<Column field="currentSeason.startDate" header="Start Date" sortable filter filterPlaceholder="Search by Start Date" />
						<Column field="currentSeason.endDate" header="End Date" sortable filter filterPlaceholder="Search by End Date" />
						<Column header="Options" body={competitionOptionsBodyTemplate} />
					</DataTable>
				</div>
			</div>
			<br></br>
			<div className={styles["teams-section"]}>
				<h2 className={styles["teams-title"]}>All Teams</h2>
				<div className={styles["widget-header"]}>
					<DataTable
						value={teams}
						sortMode="multiple"
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 15, 20, 50]}
						totalRecords={teams?.length}
					>
						<Column field="id" header="ID" sortable />
						<Column field="name" header="Team Name" sortable filter filterPlaceholder="Search by Team Name" />
						<Column header="Competition Emblem" body={teamEmblemBodyTemplate} />
						<Column field="founded" header="Founded" sortable />
						<Column field="venue" header="Stadium" sortable filter filterPlaceholder="Search by Stadium" />
						<Column header="Club Colors" body={teamColorsBodyTemplate} sortable filter filterPlaceholder="Search by Club Colors" />
						<Column body={teamWebsiteBodyTemplae} header="Website" sortable filter />
						<Column header="Options" body={teamOptionsBodyTemplate} />
					</DataTable>
				</div>
			</div>
		</div>
	);
}

export default SearchResult;