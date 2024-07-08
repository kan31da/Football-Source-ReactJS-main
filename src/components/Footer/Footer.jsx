import Copyright from "../Copyright/Copyright";
import Socials from "../Socials/Socials";
import TopCompetitions from "../TopCompetitions/TopCompetitions";

import styles from './Footer.module.css';

const Footer = () => {
	return (
		<footer className='footer-section'>
			<div className="container">
				<div className={`row ${styles['center-content']}`}>
					<div className="col-lg-3">
						<div className="widget mb-3">
							<TopCompetitions />
						</div>
					</div>
					<div className="col-lg-3">
						<div className="widget mb-3">
							<Socials />
						</div>
					</div>
				</div>
				<Copyright />
			</div>
		</footer>
	)
}

export default Footer;