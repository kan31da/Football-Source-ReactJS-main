import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom"

import { Card } from 'primereact/card';
import { SplitButton } from 'primereact/splitbutton';

import * as competitionService from '../../services/competitionService';

import styles from './Competition.module.css';

const Competition = () => {
	const [competition, setCompetition] = useState(null);

	const navigate = useNavigate();

	const { alias } = useParams();

	useEffect(() => {
		competitionService.getCompetitionByAlias(alias)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setCompetition(result);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const cardHeader = (
		<img src={`${competition?.emblem}`} alt="Missing Image" className={styles['card-header']} />
	);

	const cardSubtitle = (
		<div className={styles['subtitle']}>
			<p>{competition?.area?.name}</p>
			<img src={`${competition?.area?.flag}`} alt="Missing Image" className={styles['subtitle-image']} />
		</div>
	);

	const cardDetailItems = [
		{
			label: 'Standings',
			icon: 'pi',
			command: (s) => {
				navigate(`/competitions/${competition.code}/standing/full`);
			}
		},
		{
			label: 'Matches',
			icon: 'pi',
			command: () => {
				navigate(`/competitions/${competition.code}/matches`);
			}
		},
		{
			label: 'Teams',
			icon: 'pi',
			command: () => {
				navigate(`/competitions/${competition.code}/teams`);
			}
		},
		{
			label: 'Goal Scorers',
			icon: 'pi',
			command: () => {
				const maxLimitSize = 1000;
				navigate(`/competitions/${competition.code}/goalscorers/${maxLimitSize}`);
			}
		}
	];

	const cardFooter = (
		<div>
			<SplitButton label="Information" icon="pi" model={cardDetailItems} outlined />
		</div>
	);

	if (competition) {
		return (
			<div className={styles['competition-section']}>
				<h1 className={styles['competition-title']}>{competition.name} Details</h1>
				<div className={styles['card-container']}>
					<Card
						title={competition.name}
						subTitle={cardSubtitle}
						footer={cardFooter}
						header={cardHeader}
						className={styles['card']}
					>
						<p><strong>Current Season Start Date:</strong> {competition.currentSeason.startDate}</p>
						<p><strong>Current Season End Date:</strong> {competition.currentSeason.endDate}</p>
						<p><strong>Current Matchday:</strong> {competition.currentSeason.currentMatchday}</p>
					</Card>
				</div>
			</div>
		);
	} else {
		return null;
	}
};

export default Competition;