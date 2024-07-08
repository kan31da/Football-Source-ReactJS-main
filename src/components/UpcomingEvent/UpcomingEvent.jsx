import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Timer from '../Timer/Timer';

import { formatDateForTimer } from '../../utils/dateTimeUtils'
import * as eventService from '../../services/eventService';

import styles from './UpcomingEvent.module.css';

const UpcomingEvent = () => {
	const [upcomingEvent, setUpcomingEvent] = useState(null);

	const navigate = useNavigate();

	useEffect(() => {
		eventService
			.getLatestUpcomingEvent()
			.then((result) => {
				if (result) {
					setUpcomingEvent(result[0]);
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	if (upcomingEvent) {
		return (
			<div className={`${styles['upcoming-event-section']}`}>
				<div className={`hero ${styles['main-background']}`}>
					<div className="container">
						<div className="row align-items-center">
							<div className="col-lg-5 ml-auto">
								<h1 className="text-black">{upcomingEvent?.name}</h1>
								<p className="text-black">
									{upcomingEvent?.description}
								</p>
								<div id="date-countdown">
									<Timer deadline={formatDateForTimer(upcomingEvent?.startDate)} />
								</div>
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

export default UpcomingEvent;