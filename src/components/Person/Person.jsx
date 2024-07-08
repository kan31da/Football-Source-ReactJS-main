import { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import Matches from '../Matches/Matches';
import ClubColor from '../ClubColor/ClubColor';

import * as personService from '../../services/personService';

import styles from './Person.module.css';

const Person = () => {
	const [person, setPerson] = useState(null);

	const { id } = useParams();

	const navigate = useNavigate();

	useEffect(() => {
		personService.getPersonById(id)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

				setPerson(result);
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const personCardHeader = (
		<img src={person?.section ? '/images/person.jpg' : '/images/default_coach_background.jpg'} className={styles['card-main-image']} alt="Missing Image" />
	);

	const teamCardHeader = (
		<img src={`${person?.currentTeam?.crest}`} className={styles['card-image']} alt="Missing Image" />
	);

	const teamCardSubTitle = (
		<div className={styles['card-subtitle']}>
			<p>{person?.currentTeam?.area?.name}</p>
			<img src={`${person?.currentTeam?.area?.flag}`} className={styles['card-image']} alt="Missing Image" />
			<p><strong>Contract from:</strong> {person?.currentTeam?.contract?.start} <strong>To:</strong> {person?.currentTeam?.contract?.until}</p>
		</div>
	);

	const teamCardFooter = (
		<div>
			<Button
				label="Team Details"
				onClick={() => handleCurrentTeamDetailsClick()}
				icon="pi pi-info"
			/>
		</div>
	);

	const handleCurrentTeamDetailsClick = () => {
		navigate(`/teams/${person?.currentTeam?.id}`);
	}

	if (person) {
		return (
			<div className={styles['person-section']}>
				<h1 className={styles['red']}>{person.name} Details</h1>
				<div className={styles['card-container']}>
					<Card title={person.name} header={personCardHeader} className='md-w-25rem'>
						<p><strong>Name:</strong> {person.name}</p>
						<p><strong>Date of Birth:</strong> {person.dateOfBirth}</p>
						<p><strong>Nationality:</strong> {person.nationality}</p>
						<p><strong>Position:</strong> {person.section ?? 'Coach' }</p>
						<br></br>
						<p><strong>Current Team:</strong></p>
						<Card style={{ backgroundColor: 'salmon' }} footer={teamCardFooter} subTitle={teamCardSubTitle} title={person.currentTeam.name} header={teamCardHeader} className='md-w-25rem'>
							<p><strong>Founded:</strong> {person.currentTeam.founded}</p>
							<p><strong>Address:</strong> {person.currentTeam.address}</p>
							<p><strong>Club Colors:</strong> <ClubColor text={person.currentTeam.clubColors} /></p>
							<p><strong>Stadium:</strong> {person.currentTeam.venue}</p>
							<p><strong>Website:</strong> <a href={person.currentTeam.website}>{person.currentTeam.website}</a></p>
						</Card>
					</Card>
				</div>
				<Matches id={person.id} type={'person'} />
			</div>
		)
	}
	else {
		return null;
	}
}

export default Person;