import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';
import * as matchService from '../../services/matchService';
import * as favouriteTeamService from '../../services/favouriteTeamService';
import AuthenticationContext from '../../contexts/AuthenticationContext';

import styles from './LiveScore.module.css';

const calculateMatchTime = (matchStartTime) => {
	const halfTimePause = 15 * 60; 
    const currentTime = new Date();
    const startTime = new Date(matchStartTime);

    const timeDifference = Math.floor((currentTime - startTime) / 1000);

    let remainingMinutes, remainingSeconds;

    if (timeDifference > halfTimePause) {
        // Full-time or second half
        const adjustedTime = timeDifference - halfTimePause;
        remainingMinutes = Math.floor(adjustedTime / 60);
        remainingSeconds = adjustedTime % 60;
    } else {
        // First half or half-time
        remainingMinutes = Math.floor(timeDifference / 60);
        remainingSeconds = timeDifference % 60;
    }

    return { minutes: remainingMinutes, seconds: remainingSeconds };
};

const sortByArrayOrder = (arrayOfIds, arrayOfObjects) => {
	function customSort(obj1, obj2) {
		const id1Index =
			arrayOfIds.indexOf(obj1.homeTeam.id) !== -1
				? arrayOfIds.indexOf(obj1.homeTeam.id)
				: arrayOfIds.indexOf(obj1.awayTeam.id);

		const id2Index =
			arrayOfIds.indexOf(obj2.homeTeam.id) !== -1
				? arrayOfIds.indexOf(obj2.homeTeam.id)
				: arrayOfIds.indexOf(obj2.awayTeam.id);

		if (id1Index !== -1 && id2Index !== -1) {
			return id1Index - id2Index;
		} else if (id1Index !== -1) {
			return -1;
		} else if (id2Index !== -1) {
			return 1;
		} else {
			return 0;
		}
	}

	const sortedArray = arrayOfObjects.sort(customSort);

	return sortedArray;
}

const getLivescoreDates = (inputDate) => {
	let year = inputDate.getFullYear();
	let month = (inputDate.getMonth() + 1).toString().padStart(2, '0');
	let day = inputDate.getDate().toString().padStart(2, '0');

	const dateFrom = `${year}-${month}-${day}`;

	const lastDay = new Date(year, inputDate.getMonth() + 1, 0).getDate();

	if (day < lastDay) {
		day = (inputDate.getDate() + 1).toString().padStart(2, '0');
	} else {
		if (inputDate.getMonth() === 11) {
			year = inputDate.getFullYear() + 1;
			month = '01';
			day = '01';
		} else {
			month = (inputDate.getMonth() + 2).toString().padStart(2, '0');
			day = '01';
		}
	}

	const dateTo = `${year}-${month}-${day}`;

	return { dateFrom, dateTo };
} 

const LiveScore = () => {
	const [liveScoreMatches, setLiveScoreMatches] = useState([]);
	const [matchTimes, setMatchTimes] = useState([]);
	const [favouriteTeamIds, setFavouriteTeamIds] = useState([]);
	const [date, setDate] = useState(new Date());

	const navigate = useNavigate();

	const { authentication } = useContext(AuthenticationContext);

	useEffect(() => {
		const { dateFrom, dateTo } = getLivescoreDates(date);

		favouriteTeamService.getFavouriteTeamsForUser(authentication._id)
			.then((favouriteTeamsResult) => {
				if (favouriteTeamsResult.error)
					throw new Error(favouriteTeamsResult.error);

				const favouriteTeamsIds = favouriteTeamsResult.map(team => team.teamId);

				setFavouriteTeamIds(favouriteTeamsIds);

				matchService.getMatchesByDate(dateFrom, dateTo)
					.then((result) => {
						if (result.error)
							throw new Error(result.error);

						const matchesOrderedByFavouriteTeams = sortByArrayOrder(favouriteTeamsIds, result.matches);

						setLiveScoreMatches(matchesOrderedByFavouriteTeams);
					})
					.catch((error) => {
						console.log(error);
						navigate(`/error`);
					});
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [date]);

	useEffect(() => {
		const intervalId = setInterval(calculateTimeRemaining, 1000);
	
		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, [liveScoreMatches]);

	const calculateTimeRemaining = () => {
		const updatedMatchTimes = {};
	
		liveScoreMatches.forEach((match) => {
			if (match.score && match.status === 'IN_PLAY') {
				const { minutes, seconds } = calculateMatchTime(match.utcDate);
				updatedMatchTimes[match.id] = { minutes, seconds };
			} else if (match.score && match.status === 'PAUSED') {
				updatedMatchTimes[match.id] = { minutes: 'HT', seconds: 0 };
			} else if (match.score && match.status === 'FINISHED') {
				updatedMatchTimes[match.id] = { minutes: 'FT', seconds: 0 };
			} else {
				updatedMatchTimes[match.id] = { minutes: 0, seconds: 0 };
			}
		});
	
		setMatchTimes(updatedMatchTimes);
	};

	const matchHomeEmblemBodyTemplate = (match) => {
		return <img src={`${match.homeTeam.crest}`} className={styles['match-emblem']} alt="Missing Image" />;
	};

	const matchAwayEmblemBodyTemplate = (match) => {
		return <img src={`${match.awayTeam.crest}`} className={styles['match-emblem']} alt="Missing Image" />;
	};

	const handleMatchDetailsClick = (match) => {
		navigate(`/matches/${match.id}`);
	}

	const matchDateBodyTemplate = (match) => {
		return <p>{formatUTCDateToLocal(match.utcDate)}</p>
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

	const scoreData = (match) => {
		if (match.score && match.status !== 'TIMED' && match.status !== "SCHEDULED" && match.status !== "IN_PLAY") {
			return `${match.score?.fullTime?.home} : ${match.score?.fullTime?.away} / ${match.score?.halfTime?.home} : ${match.score?.halfTime?.away}`
		}
		else if (match.score && match.status === 'IN_PLAY') {
			return `${match.score?.fullTime?.home} : ${match.score?.fullTime?.away}`
		}

		return '';
	};

	const minuteData = (match) => {
		 if (match.score && (match.status === 'IN_PLAY' || match.status === 'PAUSED')) {
			return `${matchTimes[match.id]?.minutes || ''} : ${matchTimes[match.id]?.seconds || ''}`;
		 }

		 return '';
	};

	const favouriteTeamTemplate = (match) => {
		if (favouriteTeamIds.includes(match.homeTeam.id) || favouriteTeamIds.includes(match.awayTeam.id)) {
			return (
				<p>⭐</p>
			)
		}
		else {
			return null;
		}
	};

	return (
		<div className={`${styles['livescore-section']}`}>
			<h1 className={`${styles['livescore-title']}`}>Live Score</h1>
			<div className={`${styles['livescore-calendar']} flex justify-content-center`}>
				<Calendar value={date} onChange={(e) => setDate(e.value)} showIcon />
			</div>
			<div className={styles['widget-header']}>
				<DataTable
					value={liveScoreMatches}
					sortMode="multiple"
					paginator
					rows={5}
					rowsPerPageOptions={[5, 10, 15, 20, 50]}
					totalRecords={liveScoreMatches?.length}
				>
					<Column field="id" header="ID" sortable />
					<Column body={favouriteTeamTemplate} header="Favourite" />
					<Column field="homeTeam.name" header="Home Team Name" filterPlaceholder="Search by Home Team Name" filter sortable />
					<Column header="Home Team Emblem" body={matchHomeEmblemBodyTemplate} />
					<Column field="score" header="Result" body={scoreData} />
					<Column field="minute" header="Minute" body={minuteData} />
					<Column header="Away Team Emblem" body={matchAwayEmblemBodyTemplate} />
					<Column field="awayTeam.name" header="Away Team Name" sortable filterPlaceholder="Search by Away Team Name" filter />
					<Column field="status" header="Status" sortable filterPlaceholder="Search by Status" filter />
					<Column header="Date" body={matchDateBodyTemplate} sortable filter filterPlaceholder="Search by Match Date" />
					<Column header="Options" body={optionsBodyTemplate} />
				</DataTable>
			</div>
		</div>
	);
};

export default LiveScore;