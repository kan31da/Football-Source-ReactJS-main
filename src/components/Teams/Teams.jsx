import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import ClubColor from "../ClubColor/ClubColor";

import * as competitionService from '../../services/competitionService';

import styles from './Teams.module.css';

const Teams = () => {
	const [teams, setTeams] = useState([]);
	const [competitionName, setCompetitionName] = useState("");

	const { alias } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		competitionService.getCompetitionTeamsByAlias(alias)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setTeams(result.teams);
				setCompetitionName(result.competition.name);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const cardHeader = (team) => (
		<img src={`${team?.crest}`} alt="Missing Image" className={`${styles['card-image']}`} />
	);

	const cardSubtitle = (team) => (
		<div className={`${styles['card-subtitle']}`}>
			<p>{team?.area?.name}</p>
			<img src={`${team?.area?.flag}`} alt="Missing Image" className={`${styles['card-image']}`} />
		</div>
	);

	const cardFooter = (team) => (
		<div>
			<Button
				label="Team Details"
				onClick={() => handleTeamDetailsClick(team)}
				icon="pi pi-info"
			/>
		</div>
	);

	const handleTeamDetailsClick = (team) => {
		navigate(`/teams/${team.id}`);
	}

	if (teams) {
		return (
			<div className={`${styles['teams-section']}`}>
				<h1 className={`${styles['teams-title']}`}>All {competitionName} Teams</h1>
				<div className={`${styles['teams-container']}`}>
					{teams.map((team) => (
						<div className={`${styles['card-container']}`} key={team.id}>
							<Card className={`${styles['card']}`} subTitle={cardSubtitle(team)} footer={cardFooter(team)} header={cardHeader(team)} title={team.name}>
								<div className={`${styles['card-content']}`}>
									<p><strong>Founded: </strong>{team.founded}</p>
									<p><strong>Address: </strong>{team.address}</p>
									<p><strong>Club Colors: </strong> <ClubColor text={team.clubColors} /></p>
									<p><strong>Stadium: </strong>{team.venue}</p>
									<p><strong>Website: </strong><a href={team.website}>{team.website}</a></p>
								</div>
							</Card>
						</div>
					))}
				</div>
			</div>
		);
	}
	else {
		return null;
	}
}

export default Teams;