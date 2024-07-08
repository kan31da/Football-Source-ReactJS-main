import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

import * as competitionService from "../../services/competitionService";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import styles from "./Competitions.module.css";

const Competitions = () => {
	const [competitions, setCompetitions] = useState([]);

	const navigate = useNavigate();

	useEffect(() => {
		competitionService
			.getAllCompetitions()
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setCompetitions(result.competitions);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

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

	const optionsBodyTemplate = (competition) => {
		return (
			<div className={styles["details-btn"]}>
				<Button
					label="Competition Details"
					onClick={() => handleCompetitionDetailsClick(competition)}
					icon="pi pi-info"
				/>
			</div>
		);
	};

	return (
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
					<Column header="Options" body={optionsBodyTemplate} />
				</DataTable>
			</div>
		</div>
	);
};

export default Competitions;
