import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

import * as matchService from "../../services/matchService";

import styles from "./ResultOnFocus.module.css";

const ResultOnFocus = () => {
	const [resultOnFocus, setResultOnFocus] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const id = 436092;

		matchService
			.getMatchById(id)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setResultOnFocus(result);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const handleMatchDetailsClick = (match) => {
		navigate(`/matches/${match.id}`);
	};

	if (resultOnFocus) {
		return (
			<div className={styles["result-on-focus-section"]}>
				<div className="container">
					<div className="row">
						<div className="col-lg-12">
							<div className="d-flex team-vs">
								<span className="score">
									{resultOnFocus.score.fullTime.home} :{" "}
									{resultOnFocus.score.fullTime.away}
								</span>
								<div className="team-1 w-50">
									<div className="team-details w-100 text-center">
										<img
											src={resultOnFocus.homeTeam.crest}
											alt="Missing Image"
											className="img-fluid"
										/>
										<h3>
											{resultOnFocus.homeTeam.name}
										</h3>
									</div>
								</div>
								<h4 className={styles["result-on-focus-title"]}>Result On Focus</h4>
								<div className="team-2 w-50">
									<div className="team-details w-100 text-center">
										<img
											src={resultOnFocus.awayTeam.crest}
											alt="Missing Image"
											className="img-fluid"
										/>
										<h3>
											{resultOnFocus.awayTeam.name}
										</h3>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className={`text-center mb-2 match-details ${styles['match-details-btn']}`}>
						<Button
							label="Match Details"
							icon="pi pi-info"
							onClick={() => handleMatchDetailsClick(resultOnFocus)}
						/>
					</div>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export default ResultOnFocus;