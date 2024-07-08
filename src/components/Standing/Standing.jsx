import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';

import * as competitionService from '../../services/competitionService';

import styles from './Standing.module.css';

const Standing = ({ alias, type, homeTeamName, awayTeamName }) => {
	const [isMultipleGroups, setIsMultipleGroups] = useState(false);
	const [standing, setStanding] = useState(null);
	const [competitionName, setCompetitionName] = useState("");

	const navigate = useNavigate();

	useEffect(() => {
		competitionService.getCompetitionStandingsByAlias(alias)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				if (result.standings.length == 1) {
					setStanding(result.standings[0].table);
				}
				else if (result.standings.length > 1) {
					setStanding(result.standings);
					setIsMultipleGroups(true);
				}

				setCompetitionName(result.competition.name);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const emblemBodyTemplate = (rowData) => {
		return (
			<img
				src={`${rowData.team.crest}`}
				className={styles['emblem']}
				alt="Missing Image"
			/>
		);
	};

	const optionsBodyTemplate = (rowData) => {
		return (
			<div className={styles['details-btn']}>
				<Button
					label="Team Details"
					onClick={() => handleTeamDetailsClick(rowData)}
					icon="pi pi-info"
				/>
			</div>
		);
	};

	const teamNameBodyTemplate = (rowData) => {
		return (
			<span className={(rowData.team.name == homeTeamName || rowData.team.name == awayTeamName) ? styles['highlighted-team-name'] : ''} >{rowData.team.name}</span>
		)
	}

	const handleTeamDetailsClick = (rowData) => {
		navigate(`/teams/${rowData.team.id}/`);
	};

	const handleCompetitionStandingClick = () => {
		navigate(`/competitions/${alias}/standing/full`);
	};

	if (standing) {
		if (type === "short") {
			return (
				<div className={styles['standing-section']}>
					<div className={styles['widget-header']}>
						<DataTable
							value={standing}
							sortMode="multiple"
							paginator
							rows={5}
							rowsPerPageOptions={[5, 10, 15, 20, 50]}
							totalRecords={standing?.length}
						>
							<Column field="position" header="P" headerTooltip="Position" sortable />
							<Column body={teamNameBodyTemplate} header="Team" headerTooltip="Team Name" sortable />
							<Column field="playedGames" header="PG" headerTooltip="Played Games" sortable />
							<Column field="won" header="W" headerTooltip="Wins" sortable />
							<Column field="draw" header="D" headerTooltip="Draws" sortable />
							<Column field="lost" header="L" headerTooltip="Losses" sortable />
							<Column field="points" header="PTS" headerTooltip="Points" sortable />
						</DataTable>
					</div>
					<div className={styles['details-btn']}>
						<Button
							label="Detailed Standing"
							onClick={handleCompetitionStandingClick}
							icon="pi pi-info"
						/>
					</div>
				</div>
			);
		} else {
			if (isMultipleGroups == true) {
				return (
					<div className={styles['standing-section']}>
						<h1 className={styles['standing-title']}>{competitionName} Standing</h1>
						{standing.map((s) => (
							<div key={s.group} className={styles['widget-header']}>
								<h3 className={styles['group-title']}>{s.group} Standing</h3>
								<DataTable
									value={s.table}
									sortMode="multiple"
									paginator
									rows={5}
									rowsPerPageOptions={[5, 10, 15, 20, 50]}
									totalRecords={s?.table?.length}
								>
									<Column field="position" header="Position" sortable />
									<Column field="team.name" header="Team Name" sortable filter filterPlaceholder="Search by Team Name" />
									<Column body={emblemBodyTemplate} header="Team Emblem" />
									<Column field="playedGames" header="Played Games" sortable filter filterPlaceholder="Search by Played Games" />
									<Column field="won" header="Won" sortable filter filterPlaceholder="Search by Won Games" />
									<Column field="draw" header="Draw" sortable filter filterPlaceholder="Search by Drawn Games" />
									<Column field="lost" header="Lost" sortable filter filterPlaceholder="Search by Lost Games" />
									<Column field="points" header="Points" sortable filter filterPlaceholder="Search by Points" />
									<Column field="goalsFor" header="Goals Scored" sortable filter filterPlaceholder="Search by Goals Scored" />
									<Column field="goalsAgainst" header="Goals Conceded" sortable filter filterPlaceholder="Search by Goals Conceded" />
									<Column field="goalDifference" header="Goal Difference" sortable filter filterPlaceholder="Search by Goal Difference" />
									<Column field="points" header="Points" sortable filter filterPlaceholder="Search by Won Points" />
									<Column header="Options" body={optionsBodyTemplate} />
								</DataTable>
							</div>
						))}
					</div>
				);
			}
			else {
				return (
					<div className={styles['standing-section']}>
						<h1 className={styles['standing-title']}>{competitionName} Standing</h1>
						<div className={styles['widget-header']}>
							<DataTable
								value={standing}
								sortMode="multiple"
								paginator
								rows={5}
								rowsPerPageOptions={[5, 10, 15, 20, 50]}
								totalRecords={standing?.length}
							>
								<Column field="position" header="Position" sortable />
								<Column field="team.name" header="Team Name" sortable filter filterPlaceholder="Search by Team Name" />
								<Column body={emblemBodyTemplate} header="Team Emblem" />
								<Column field="playedGames" header="Played Games" sortable filter filterPlaceholder="Search by Played Games" />
								<Column field="won" header="Won" sortable filter filterPlaceholder="Search by Won Games" />
								<Column field="draw" header="Draw" sortable filter filterPlaceholder="Search by Drawn Games" />
								<Column field="lost" header="Lost" sortable filter filterPlaceholder="Search by Lost Games" />
								<Column field="points" header="Points" sortable filter filterPlaceholder="Search by Points" />
								<Column field="goalsFor" header="Goals Scored" sortable filter filterPlaceholder="Search by Goals Scored" />
								<Column field="goalsAgainst" header="Goals Conceded" sortable filter filterPlaceholder="Search by Goals Conceded" />
								<Column field="goalDifference" header="Goal Difference" sortable filter filterPlaceholder="Search by Goal Difference" />
								<Column field="points" header="Points" sortable filter filterPlaceholder="Search by Won Points" />
								<Column header="Options" body={optionsBodyTemplate} />
							</DataTable>
						</div>
					</div>
				)
			}
		}
	} else {
		return null;
	}
};

export default Standing;