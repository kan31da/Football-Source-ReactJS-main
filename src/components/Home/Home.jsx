import ResultOnFocus from '../ResultOnFocus/ResultOnFocus'
import FixtureOnFocus from '../FixtureOnFocus/FixtureOnFocus'
import UpcomingEvent from '../UpcomingEvent/UpcomingEvent';

const Home = () => {
	return (
		<div className='home-section'>
			<UpcomingEvent />
			<ResultOnFocus />
			<FixtureOnFocus />
		</div>
	)
}

export default Home;