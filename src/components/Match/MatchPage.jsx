import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Match from "./Match";

import * as matchService from '../../services/matchService';

const MatchPage = () => {
	const { id } = useParams();

	const [match, setMatch] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		matchService
			.getMatchById(id)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setMatch(result);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	return (
		<div className='match-page-section'>
			<Match match={match} type="full" />
		</div>
	)
};

export default MatchPage;