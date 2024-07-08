import { useParams } from "react-router-dom";

import Matches from "./Matches";

const MatchesPage = () => {
	const { alias } = useParams();

	return (
		<div className='matches-page-section'>
			<Matches alias={alias} type='competition' />
		</div>
	);
}

export default MatchesPage;