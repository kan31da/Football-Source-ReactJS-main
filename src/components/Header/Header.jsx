import { Link, useLocation, useNavigate  } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';

import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';

import AuthenticationContext from '../../contexts/AuthenticationContext';

import styles from './Header.module.css';

const Header = () => {

	const [activeItem, setActiveItem] = useState('home');
	const [searchPhrase, setSearchPhrase] = useState('');

	const location = useLocation();

	const navigate = useNavigate();

	const { isAuthenticated, authentication, isAdmin } = useContext(AuthenticationContext);

	useEffect(() => {
		const pathName = location.pathname;

		const keywordMapping = {
			'/competitions': 'competitions',
			'/livescore': 'livescore',
			'/contacts': 'contacts',
			'/people': 'competitions',
			'/teams': 'competitions',
			'/login': 'login',
			'/register': 'register',
			'/upcoming-events': 'upcoming-events',
			'/my-teams': 'my-teams',
			'/predictions': 'predictions'
		};

		for (const keyword in keywordMapping) {
			if (pathName.includes(keyword)) {
				setActiveItem(keywordMapping[keyword]);
				return;
			}
		}

		setActiveItem('home');
	}, [location]);

	const toggleClass = (itemName) => {
		if (activeItem === itemName) {
			setActiveItem('home');
		} else {
			setActiveItem(itemName);
		}
	};

	const handleSearchChange = (e) => {
		const { value } = e.target;
		setSearchPhrase(value);
	};

	const handleSearch = () => {
		navigate(`/search/${searchPhrase}`);
	};

	const handleBack = () => {
		navigate(-1);
	};

	return (
		<header className={`site-navbar py-4 ${styles['header-section']}`} role="banner">
			<div className="container">
				<div className="d-flex align-items-center">
					<div className="site-logo">
						<Link to="/"><img src="/images/site-logo.png" className={styles['logo']} alt="Logo" /></Link>
					</div>
					<div className="ml-auto">
						<nav className="site-navigation position-relative text-right" role="navigation">
							<ul className="site-menu main-menu js-clone-nav mr-auto d-none d-lg-block">
								{/* <li onClick={() => toggleClass('home')} className={`nav-link ${activeItem === 'home' ? 'active' : ''}`}>
									<Link to="/">Home</Link>
								</li> */}
								<li onClick={() => toggleClass('competitions')} className={`nav-link ${activeItem === 'competitions' ? 'active' : ''}`}>
									<Link to="/competitions">Competitions</Link>
								</li>
								<li onClick={() => toggleClass('livescore')} className={`nav-link ${activeItem === 'livescore' ? 'active' : ''}`}>
									<Link to="/livescore">LiveScore</Link>
								</li>
								<li onClick={() => toggleClass('contacts')} className={`nav-link ${activeItem === 'contacts' ? 'active' : ''}`}>
									<Link to="/contacts">Contacts</Link>
								</li>
								{!isAuthenticated && <>
									<li onClick={() => toggleClass('login')} className={`nav-link ${styles['authentication']} ${activeItem === 'login' ? 'active' : ''}`}>
										<Link to="/login">Login</Link>
									</li>
									<li onClick={() => toggleClass('register')} className={`nav-link ${activeItem === 'register' ? 'active' : ''}`}>
										<Link to="/register">Register</Link>
									</li>
								</>}

								{isAuthenticated && <>
									<li onClick={() => toggleClass('predictions')} className={`nav-link ${activeItem === 'predictions' ? 'active' : ''}`}>
										<Link to="/predictions">Predictions</Link>
									</li>
									<Link to="/my-profile"><span>{authentication.username}</span></Link>
									{isAdmin && <li onClick={() => toggleClass('upcoming-events')} className={`nav-link ${activeItem === 'upcoming-events' ? 'active' : ''}`}>
										<Link to="/upcoming-events">Events</Link>
									</li>}
									{!isAdmin && <li onClick={() => toggleClass('my-teams')} className={`nav-link ${activeItem === 'my-teams' ? 'active' : ''}`}>
										<Link to="/my-teams">My Teams</Link>
									</li>}
									<li onClick={() => toggleClass('logout')} className={`nav-link ${activeItem === 'logout' ? 'active' : ''}`}>
										<Link to="/logout">Logout</Link>
									</li>
								</>}
							</ul>
						</nav>
						<a href="#" className="d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black float-right text-white">
							<span className="icon-menu h3 text-white"></span>
						</a>
					</div>
				</div>
				<div className={styles['controls']}>
					<Button className={styles['back-btn']} icon="pi pi-step-backward" severity="danger" aria-label="Back" label='Back' onClick={handleBack} />
					<span className="p-input-icon-right">
						<i className="pi pi-search" />
						<InputText placeholder="Search" onChange={handleSearchChange} />
						<Button className={styles['search-btn']} icon="pi pi-search" severity="success" aria-label="Search" label='Search' onClick={handleSearch} />
					</span>
				</div>
			</div>
		</header>
	);
}

export default Header;