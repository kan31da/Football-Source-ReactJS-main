import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Match from "../Match/Match";
import Standing from "../Standing/Standing";

import * as matchService from '../../services/matchService';

const FixtureOnFocus = () => {
	const [matchOnFocus, setMatchOnFocus] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		const id = 436108;

		matchService.getMatchById(id)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setMatchOnFocus(result);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	if (matchOnFocus) {
		return (
			<div className='fixture-on-focus-section'>
				<div className="site-section bg-dark">
					<div className="container">
						<div className="row">
							<div className="col-lg-6">
								<Match match={matchOnFocus} title="Next Fixture on Focus" type="short" />
							</div>
							<div className="col-lg-6">
								<Standing alias={matchOnFocus.competition.code} type="short" homeTeamName={matchOnFocus.homeTeam.name} awayTeamName={matchOnFocus.awayTeam.name}/>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
	else {
		return null;
	}
}

export default FixtureOnFocus;