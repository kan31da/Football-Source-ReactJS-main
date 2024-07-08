import { useState } from "react";
import { Link } from "react-router-dom";

const TopCompetitions = () => {
	const [topCompetitions, setTopCompetitions] = useState([
		{
			name: "Premier League",
			alias: "PL",
		},
		{
			name: "Bundesliga",
			alias: "BL1",
		},
		{
			name: "La Liga",
			alias: "PD",
		},
		{
			name: "Ligue 1",
			alias: "FL1",
		},
		{
			name: "Seria A",
			alias: "SA",
		},
		{
			name: "Champions League",
			alias: "CL",
		},
	]);

	return (
		<div className="top-competitions-section">
			<h3>Top Competitions</h3>
			<ul className="list-unstyled links">
				{topCompetitions.map((competition) => (
					<li className="competition" key={competition.name}>
						<Link to={`/competitions/${competition.alias}`}>
							{competition.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TopCompetitions;