import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import MobileMenu from "./components/MobileMenu/MobileMenu";
import Header from "../src/components/Header/Header";
import Footer from "./components/Footer/Footer";
import Competitions from "./components/Competitions/Competitions";
import Competition from "./components/Competition/Competition";
import Home from "./components/Home/Home";
import Contacts from "./components/Contacts/Contacts";
import Livescore from './components/LiveScore/LiveScore';
import MatchesPage from "./components/Matches/MatchesPage";
import NotFound from "./components/Error/NotFound";
import StandingPage from "./components/Standing/StandingPage";
import Teams from "./components/Teams/Teams";
import GoalScorers from "./components/GoalScorers/GoalScorers";
import Team from "./components/Team/Team";
import MatchPage from "./components/Match/MatchPage";
import Person from "./components/Person/Person";
import SomethingWentWrong from "./components/Error/SomethingWentWrong";
import Login from "./components/Authentication/Login";
import Register from "./components/Authentication/Register";
import SearchResult from "./components/Search/SearchResult";
import FavouriteTeams from "./components/FavouriteTeams/FavouriteTeams";
import AccessDenied from "./components/Error/AccessDenied";
import Logout from "./components/Authentication/Logout";
import Predictions from "./components/Predictions/Predictions";
import Prediction from "./components/Predictions/Prediction";
import Profile from "./components/Profile/Profile";
import AuthGuard from "./components/Guards/AuthGuard";
import AdminGuard from "./components/Guards/AdminGuard";
import LoggedInGuard from "./components/Guards/LoggedInGuard";
import LoadingSpinner from "./components/LoadingSpinner/LoadingSpinner";

const UpcomingEventsAdminPage = lazy(() => import("./components/UpcomingEvent/UpcomingEventsAdminPage"));

import { AuthenticationProvider } from './contexts/AuthenticationContext';

import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import 'primeicons/primeicons.css';

function App() {
	return (
		<AuthenticationProvider>
			<div className="site-wrap">
				<MobileMenu />
				<Header />
				<Suspense fallback={<LoadingSpinner />}>
					<Routes>
						<Route path="*" element={<NotFound />} />
						<Route path="/home" element={<Home />} />
						<Route path="/" element={<Home />} />
						<Route path="/error" element={<SomethingWentWrong />} />
						<Route path="/access-denied" element={<AccessDenied />} />
						<Route element={<LoggedInGuard />}>
							<Route path="/login" element={<Login />} />
							<Route path="/register" element={<Register />} />
						</Route>
						<Route path="/logout" element={<Logout />} />
						<Route path="/search/:phrase" element={<SearchResult />} />
						<Route path="/competitions" element={<Competitions />} />
						<Route path="/competitions/:alias" element={<Competition />} />
						<Route path="/competitions/:alias/standing/:type" element={<StandingPage />} />
						<Route path="/competitions/:alias/matches" element={<MatchesPage />} />
						<Route path="/competitions/:alias/teams" element={<Teams />} />
						<Route path="/competitions/:alias/goalscorers/:limit" element={<GoalScorers />} />
						<Route path="/teams/:id/" element={<Team />} />
						<Route path="/matches/:id/" element={<MatchPage />} />
						<Route path="/livescore" element={<Livescore />} />
						<Route path="/contacts" element={<Contacts />} />
						<Route path="/people/:id/" element={<Person />} />
						<Route element={<AuthGuard />}>
							<Route element={<AdminGuard />}>
								<Route path="/upcoming-events/" element={<UpcomingEventsAdminPage />} />
							</Route>
							<Route path="/my-teams/" element={<FavouriteTeams />} />
							<Route path="/predictions" element={<Predictions />} />
							<Route path="/predictions/:id/" element={<Prediction />} />
							<Route path="/my-profile" element={<Profile />} />
						</Route>
					</Routes>
				</Suspense>
				<Footer />
			</div>
		</AuthenticationProvider>
	);
}

export default App;