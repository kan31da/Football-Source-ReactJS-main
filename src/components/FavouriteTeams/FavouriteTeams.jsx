import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import FavouriteTeamEditModal from "./FavouriteTeamEditModal";
import FavouriteTeamCreateModal from "./FavouriteTeamCreateModal";
import DeleteModal from "../Modals/DeleteModal";
import Pagination from "../Pagination/Pagination";

import { useModal } from "../../hooks/useModal";
import { usePagination } from "../../hooks/usePagination";
import { FavouriteTeamContext } from "../../contexts/FavouriteTeamContext";
import AuthenticationContext from '../../contexts/AuthenticationContext';
import * as favouriteTeamService from '../../services/favouriteTeamService';

import styles from './FavouriteTeams.module.css';

const FavouriteTeams = () => {
	const [favouriteTeams, setFavouriteTeams] = useState([]);
	const {
		setSelectedItem,
		openCreateModal,
		closeCreateModal,
		openEditModal,
		closeEditModal,
		openDeleteModal,
		closeDeleteModal,
		selectedItem,
		isCreateModalOpen,
		isEditModalOpen,
		isDeleteModalOpen
	} = useModal()
	const { currentPage, itemsPerPage, totalPages, totalCount, handlePageChange, setTotalCount } = usePagination()

	const navigate = useNavigate();

	const { authentication, showSuccess, showError } = useContext(AuthenticationContext);

	const validateFavouriteTeam = (team) => {
		if (!team.competition) {
			showError(`'Competition' is required`)

			return false
		}

		if (!team.team) {
			showError(`'Team' is required`)

			return false
		}

		const isTeamIdPresent = favouriteTeams.some(obj => obj.teamId === team.team.id);

		if (isTeamIdPresent) {
			showError(`'${team.team.name}' is already added as a favourite team`)

			return false
		}

		return true;
	}

	useEffect(() => {
		favouriteTeamService.getFavouriteTeamsForUser(authentication._id, (currentPage * itemsPerPage) - itemsPerPage, itemsPerPage)
			.then((result) => {
				if (result) {
					setFavouriteTeams(result);
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [currentPage, totalCount]);

	useEffect(() => {
		favouriteTeamService
			.getTotalCountForUser(authentication._id)
			.then((result) => {
				if (result) {
					setTotalCount(result);
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [authentication._id]);

	const cardHeader = (team) => (
		<img src={`${team?.teamCrest}`} alt="Missing Image" className={`${styles['card-image']}`} />
	);

	const cardSubtitle = (team) => (
		<div className={`${styles['card-subtitle']}`}>
			<p>{team?.teamCompetitonName}</p>
			<img src={`${team?.teamCompetitionEmblem}`} alt="Missing Image" className={`${styles['card-image']}`} />
		</div>
	);

	const cardFooter = (team) => (
		<div>
			<div>
				<Button
					label="Team Details"
					onClick={() => handleTeamDetailsClick(team)}
					icon="pi pi-info"
				/>
			</div>
			<div>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-text"
					onClick={() => { editFavouriteTeamHandlerClick(team.teamId) }}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-text p-button-danger"
					onClick={() => { deleteFavouriteTeamHandlerClick(team.teamId) }}
				/>
			</div>
		</div>
	);

	const deleteFavouriteTeamHandlerClick = async (_id) => {
		setSelectedItem(favouriteTeams.find(team => team.teamId === _id));

		openDeleteModal();
	};

	const editFavouriteTeamHandlerClick = async (_id) => {
		setSelectedItem(favouriteTeams.find(team => team.teamId === _id));

		openEditModal();
	};

	const deleteFavouriteTeamHandler = async (_id) => {
		await favouriteTeamService.remove(_id);

		setFavouriteTeams((state) =>
			state.filter((team) => {
				return team._id !== _id;
			})
		);

		closeDeleteModal();

		if (favouriteTeams.length == 1) {
			handlePageChange(currentPage - 1);
		} 

		setTotalCount((prevCount) => prevCount - 1)		
	
		showSuccess('Successfully deleted favourite team');
	}

	const handleTeamDetailsClick = (team) => {
		navigate(`/teams/${team.teamId}`);
	}

	const saveEditedFavouriteTeamHandlerClick = async (values) => {
		closeEditModal();

		await favouriteTeamService.update(values._id, values.teamId, values.teamName, values.teamCrest, values.teamCompetitionAlias, values.teamCompetitonName, values.teamCompetitionEmblem, values.description);

		setFavouriteTeams((prevTeams) =>
			prevTeams.map((team) =>
				team._id === values._id
					? {
						...values
					}
					: team
			)
		);

		showSuccess('Successfully edited favourite team');
	}

	const saveNewFavouriteTeamHandler = async (team) => {
		if (validateFavouriteTeam(team) == true) {

			closeCreateModal();

			const createdFavouriteTeam = await favouriteTeamService.create(team.team.id, team.team.name, team.team.crest, team.competition.code, team.competition.name, team.competition.emblem, team.description);

			setFavouriteTeams((state) => [createdFavouriteTeam, ...state]);

			setTotalCount((prevCount) => prevCount + 1)

			showSuccess('Successfully added new favourite team');
		}
	};

	const favouriteTeamContextValue = {
		closeCreateModal,
		saveNewFavouriteTeamHandler,
		saveEditedFavouriteTeamHandlerClick,
		closeEditModal,
		cardHeader,
		cardSubtitle
	};

	if (favouriteTeams) {
		return (
			<FavouriteTeamContext.Provider value={favouriteTeamContextValue}>
				<div className={`${styles['favourite-teams-section']}`}>
					<h1 className={`${styles['favourite-teams-title']}`}>All Favourite Teams</h1>
					<div className={`${styles['favourite-teams-container']}`}>
						{favouriteTeams.map((team) => (
							<div className={`${styles['card-container']}`} key={team._id}>
								<Card className={`${styles['card']}`} subTitle={cardSubtitle(team)} footer={cardFooter(team)} header={cardHeader(team)} title={team.teamName}>
									<div className={styles['card-content']}>
										<p><strong>Description: </strong><br></br> {team.description}</p>
									</div>
								</Card>
							</div>
						))}
						<div>
							<FavouriteTeamCreateModal
								isOpen={isCreateModalOpen}
							/>
						</div>
						<div>
							<FavouriteTeamEditModal
								isOpen={isEditModalOpen}
								team={selectedItem}
							/>
						</div>
						<div>
							<DeleteModal
								isOpen={isDeleteModalOpen}
								closeDeleteModal={closeDeleteModal}
								onConfirm={deleteFavouriteTeamHandler}
								_id={selectedItem?._id}
							/>
						</div>
					</div>
					{favouriteTeams.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange}/>}
					<div>
						<Button
							label=' Add New Favourite Team'
							icon="pi pi-plus"
							className="p-button-rounded"
							onClick={openCreateModal}
						/>
					</div>
				</div>
			</FavouriteTeamContext.Provider>
		);
	}
	else {
		return null;
	}
}

export default FavouriteTeams;