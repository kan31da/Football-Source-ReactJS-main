import { useState } from "react";

import Map from '../Map/Map';

import styles from './Contacts.module.css';

const Contacts = () => {
	const [contacts, setContacts] = useState({
		email: 'footballsource@fs.com',
		phone: '+1 (123) 456-7890',
		address: '85 Park Avenue London'
	});

	return (
		<div className={`${styles['contacts-section']}`}>
			<div className={`${styles['contact-style']}`}>
				<ul className={`${styles['contact-list']}`}>
					<li className={`${styles['contact-item']}`}>
						<strong>Email:</strong> {contacts.email}
					</li>
					<li className={`${styles['contact-item']}`}>
						<strong>Phone:</strong> {contacts.phone}
					</li>
					<li className={`${styles['contact-item']}`}>
						<strong>Address:</strong> {contacts.address}
					</li>
				</ul>
			</div>
			<div className='map-location'>
				<Map address={contacts.address} />
			</div>
		</div>
	);
};

export default Contacts;