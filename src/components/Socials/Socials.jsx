import { useState } from 'react';

const Socials = () => {
	const [socials, setSocials] = useState([
		{
			name: 'Twitter',
			link: 'https://www.twitter.com/'
		},
		{
			name: 'Facebook',
			link: 'https://www.facebook.com/'
		},
		{
			name: 'Instagram',
			link: 'https://www.instagram.com/'
		},
		{
			name: 'Youtube',
			link: 'https://www.youtube.com/'
		}
	]);

	return (
		<div className='socials-section'>
			<h3>Socials</h3>
			<ul className="list-unstyled links">
				{socials.map((social) => (
					<li className="social" key={social.name}>
						<a href={social.link}>{social.name}</a>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Socials;