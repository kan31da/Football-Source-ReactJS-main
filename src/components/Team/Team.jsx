import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from "react-router-dom";

import { Card } from 'primereact/card';
import Map from '../Map/Map'
import Squad from '../Squad/Squad';
import RunningCompetitions from '../RunningCompetitions/RunningCompetitions';
import Coach from '../Coach/Coach';
import Matches from '../Matches/Matches';
import CommentsList from "../Comments/CommentsList";
import ClubColor from '../ClubColor/ClubColor';

import AuthenticationContext from '../../contexts/AuthenticationContext';
import * as teamService from '../../services/teamService';

import styles from './Team.module.css';

const Team = () => {
	const [team, setTeam] = useState(null);

	const { id } = useParams();

	const navigate = useNavigate();

	const { isAuthenticated } = useContext(AuthenticationContext);

	useEffect(() => {
		teamService.getTeamById(id)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setTeam(result);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const cardHeader = (
		<img src={`${team?.crest}`} className={styles['card-image']} alt="Missing Image" />
	);

	const cardSubtitle = (
		<div className={styles['card-subtitle']}>
			<p>{team?.area?.name}</p>
			<img src={`${team?.area?.flag}`} className={styles['card-image']} alt="Missing Image" />
		</div>
	);

	if (team) {
		return (
			<div className={styles['team-section']}>
				<h1 className={styles['team-title']}>{team.name} Details</h1>
				<div className={styles['card-container']}>
					<Card className={`md-w-25rem ${styles['card']}`} title={team.name} subTitle={cardSubtitle} header={cardHeader}>
						<p><strong>Founded:</strong> {team.founded}</p>
						<p><strong>Address:</strong> {team.address}</p>
						<p><strong>Club Colors:</strong> <ClubColor text={team.clubColors} /></p>
						<p><strong>Stadium:</strong> {team.venue}</p>
						<p><strong>Website:</strong> <a href={team.website}>{team.website}</a></p>
					</Card>
				</div>
				<Matches id={team.id} type={'team'} />
				<Squad squad={team.squad} />
				<RunningCompetitions runningCompetitions={team.runningCompetitions} />
				<Coach coach={team.coach} />
				<Map address={team.address} />
				{isAuthenticated ? (<CommentsList entityId={team.id} type='team' />) : (<h3>Login to see comments!</h3>)}
			</div>
		);
	} else {
		return null;
	}
}

export default Team;