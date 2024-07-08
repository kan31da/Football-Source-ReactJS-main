import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import HeadToHead from "../HeadToHead/HeadToHead";
import CommentsList from "../Comments/CommentsList";
import Standing from "../Standing/Standing";

import AuthenticationContext from '../../contexts/AuthenticationContext';
import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';

import styles from "./Match.module.css";

const Match = ({match, title, type}) => {
	const navigate = useNavigate();

	const { isAuthenticated } = useContext(AuthenticationContext);

	const handleMatchDetailsClick = (match) => {
		navigate(`/matches/${match.id}`);
	};

	const handleHomeTeamDetailsClick = (match) => {
		navigate(`/teams/${match.homeTeam.id}`);
	}

	const handleAwayTeamDetailsClick = (match) => {
		navigate(`/teams/${match.awayTeam.id}`);
	}

	if (match) {
		let modifiedTitle = title ?? `${match.homeTeam.name} - ${match.awayTeam.name}`;
		
		return (
			<div className={styles["match-section"]}>
				<div className="widget-header">
					<div className="widget-title">
						<h3 className={styles["match-title"]}>{modifiedTitle}</h3>
					</div>
					<div className="widget-body mb-3">
						<div className="widget-vs">
							<div className="d-flex align-items-center justify-content-around justify-content-between w-100">
								<div className="team-1 text-center">
									<img className={styles['home-team-image']} src={`${match.homeTeam.crest}`} alt="Missing Image" />
									<h3>{match.homeTeam.name}</h3>
									<div className={styles['details-btn']}>
										<Button
											label="Home Details"
											onClick={() => handleHomeTeamDetailsClick(match)}
											icon="pi pi-info"
										/>
									</div>
								</div>
								<div>
									<span className="vs">
										{match.status == 'FINISHED' && <span className={styles['home-team-result']}>{match.score.fullTime.home}</span>}
										<span>VS</span>
										{match.status == 'FINISHED' && <span className={styles['away-team-result']}>{match.score.fullTime.away}</span>}
									</span>
								</div>
								<div className="team-2 text-center">
									<img className={styles['away-team-image']} src={`${match.awayTeam.crest}`} alt="Missing Image" />
									<h3>{match.awayTeam.name}</h3>
									<div className={styles['details-btn']}>
										<Button
											label="Away Details"
											onClick={() => handleAwayTeamDetailsClick(match)}
											icon="pi pi-info"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="text-center widget-vs-contents mb-4">
						<h4>{match.competition.name}</h4>
						<p className="mb-5">
							<span className="d-block">{formatUTCDateToLocal(match.utcDate)}</span>
							<strong className="text-primary">{match.venue}</strong>
							<span className="d-block">{match?.referees?.length > 0 ?? match.referees[0].name}</span>
						</p>
						<div id="date-countdown2" className="pb-1" />
					</div>
						{
							type === 'short' && <div className="text-center mb-2 match-details">
								<Button
									label="Match Details"
									onClick={() => handleMatchDetailsClick(match)}
									icon="pi pi-info"
								/>
							</div>
						}			
				</div>
					{type === 'full' && <Standing alias={match.competition.code} type="short" homeTeamName={match.homeTeam.name} awayTeamName={match.awayTeam.name}/> }
				  	{type === 'full' && <HeadToHead matchId={match.id} />}
					{isAuthenticated && type === 'full' ? (<CommentsList entityId={match.id} type='match' />) : type === 'full' ? (<h3>Login to see comments!</h3>) : <></>}
			</div>
		);
	} else {
		return null;
	}
};

export default Match;