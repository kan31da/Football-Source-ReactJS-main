import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import DoughnutChart from "../Charts/DoughnutChart";

import { formatUTCDateToLocal } from '../../utils/dateTimeUtils';
import * as matchService from "../../services/matchService";

import styles from "./HeadToHead.module.css";

const HeadToHead = ({ matchId }) => {
	const [headToHeadMatches, setHeadToHeadMatches] = useState([]);
	const [aggregates, setAggregates] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		matchService
			.getMatchHeadToHeadById(matchId)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setHeadToHeadMatches(result.matches);
				setAggregates(result.aggregates);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const homeTeamEmblemBodyTemplate = (match) => {
		return (
			<img
				src={`${match.homeTeam.crest}`}
				className={styles["home-team-emblem"]}
				alt="Missing Image"
			/>
		);
	};

	const awayTeamEmblemBodyTemplate = (match) => {
		return (
			<img
				src={`${match.awayTeam.crest}`}
				className={styles["away-team-emblem"]}
				alt="Missing Image"
			/>
		);
	};

	const refereData = (match) => {
		if (match.referees && match.referees?.length > 0) {
			return match.referees[0].name;
		}
		return "";
	};

	const scoreData = (match) => {
		if (match.score && match.status !== "TIMED" && match.status !== "SCHEDULED") {
			return `${match.score?.fullTime?.home} : ${match.score?.fullTime?.away} / ${match.score?.halfTime?.home} : ${match.score?.halfTime?.away}`;
		}
		return "";
	};

	const matchDateBodyTemplate = (match) => {
		return <p>{formatUTCDateToLocal(match.utcDate)}</p>
	}

	if (headToHeadMatches?.length > 0 && aggregates) {
		return (
			<div className={`${styles["head-to-head-section"]}`}>
				<h1 className={`${styles["head-to-head-title"]}`}>
					{aggregates.homeTeam.name} vs {aggregates.awayTeam.name} Head To Head
					Matches
				</h1>
				<div className={styles['head-to-head-stats']}>
					<div className={styles["card-container"]}>
						<Card title={"Agregates"} className={styles["card"]}>
							<p>
								<strong>Number Of Matches:</strong> {aggregates.numberOfMatches}
							</p>
							<p>
								<strong>Total Goals:</strong> {aggregates.totalGoals}
							</p>
							<p>
								<strong>Total Wins for {aggregates.homeTeam.name}:</strong>{" "}
								{aggregates.homeTeam.wins}
							</p>
							<p>
								<strong>Total Draws for {aggregates.homeTeam.name}:</strong>{" "}
								{aggregates.homeTeam.draws}
							</p>
							<p>
								<strong>Total Losses for {aggregates.homeTeam.name}:</strong>{" "}
								{aggregates.homeTeam.losses}
							</p>
							<p>
								<strong>Total Wins for {aggregates.awayTeam.name}:</strong>{" "}
								{aggregates.awayTeam.wins}
							</p>
							<p>
								<strong>Total Draws for {aggregates.awayTeam.name}:</strong>{" "}
								{aggregates.awayTeam.draws}
							</p>
							<p>
								<strong>Total Losses for {aggregates.awayTeam.name}:</strong>{" "}
								{aggregates.awayTeam.losses}
							</p>
						</Card>
					</div>
					<DoughnutChart chartTitle="Head to Head Chart" chartLabels={[`${aggregates.homeTeam.name} Wins`, `${aggregates.awayTeam.name} Wins`, "Draws"]} chartInfo={[`${aggregates.homeTeam.wins}`, `${aggregates.awayTeam.wins}`, `${aggregates.homeTeam.draws}`]} />
				</div>
				<h3 className={`${styles["matches-title"]}`}>
					{aggregates.homeTeam.name} vs {aggregates.awayTeam.name} Previous Matches
				</h3>
				<div className={styles["widget-header"]}>
					<DataTable
						value={headToHeadMatches}
						sortMode="multiple"
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 15, 20, 50]}
						totalRecords={headToHeadMatches?.length}
					>
						<Column field="id" header="ID" sortable />
						<Column field="homeTeam.name" header="Home Team Name" sortable filter filterPlaceholder="Search by Home Team Name" />
						<Column header="Home Team Emblem" body={homeTeamEmblemBodyTemplate} />
						<Column field="score" header="Result" body={scoreData} />
						<Column header="Away Team Emblem" body={awayTeamEmblemBodyTemplate} />
						<Column field="awayTeam.name" header="Away Team Name" sortable filter filterPlaceholder="Search by Away Team Name" />
						<Column body={matchDateBodyTemplate} header="Date" sortable filter filterPlaceholder="Search by Date" />
						<Column field="referees" header="Referee" body={refereData} filter filterPlaceholder="Search by Referee Name" />
					</DataTable>
				</div>
			</div>
		);
	} else {
		return <h3 className={styles['no-head-to-head-title']}>There are not any previous matches between those teams!</h3>;
	}
};

export default HeadToHead;