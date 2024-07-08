import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Timer from '../Timer/Timer';
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import UpcomingEventEditModal from './UpcomingEventEditModal';
import UpcomingEventCreateModal from './UpcomingEventCreateModal';
import DeleteModal from '../Modals/DeleteModal';
import Pagination from '../Pagination/Pagination';

import { useModal } from '../../hooks/useModal';
import { usePagination } from '../../hooks/usePagination';
import { formatDateForTimer } from '../../utils/dateTimeUtils'
import * as eventService from '../../services/eventService';
import { UpcomingEventContext } from "../../contexts/UpcomingEventContext";
import AuthenticationContext from '../../contexts/AuthenticationContext';

import styles from './UpcomingEventsAdminPage.module.css';

const UpcomingEventsAdminPage = () => {
	const [upcomingEvents, setUpcomingEvents] = useState([]);
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
	const { currentPage, itemsPerPage, totalCount, totalPages, handlePageChange, setTotalCount } = usePagination()

	const navigate = useNavigate();

	const { showSuccess, showError } = useContext(AuthenticationContext);

	const validateEvent = (event, mode) => {
		if (event.name.trim() == '') {
			showError(`'Name' is required`)

			return false
		}

		if (event.description.trim() == '') {
			showError(`'Description' is required`)

			return false
		}

		if (!event.startDate) {
			showError(`'Start Date' is required`)

			return false
		}

		const isStartDatePast = new Date(event.startDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

		if (isStartDatePast) {
			showError('Cannot create event in the past')

			return false
		}

		const isThereEventOnTheSameDate = upcomingEvents.some(obj =>
			new Date(obj.startDate).toLocaleDateString() === new Date(event.startDate).toLocaleDateString() && event._id != obj._id
		);

		if (isThereEventOnTheSameDate) {
			showError(`There is already event set for '${event.startDate}'`)

			return false
		}

		return true;
	}

	useEffect(() => {
		eventService
			.getAllUpcomingEvent((currentPage * itemsPerPage) - itemsPerPage, itemsPerPage)
			.then((result) => {
				if (result) {
					setUpcomingEvents(result);
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, [currentPage, totalCount]);

	useEffect(() => {
		eventService
			.getAllUpcomingEventCount()
			.then((result) => {
				if (result) {
					setTotalCount(result);
				}
			})
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			});
	}, []);

	const cardHeader = (event) => (
		<img src={`${event?.imageUrl}`} alt="Missing Image" className={`${styles['card-image']}`} />
	);

	const editEventHandlerClick = (event) => {
		setSelectedItem(event);

		openEditModal();
	};

	const saveEditedEventHandler = async (event) => {
		if (validateEvent(event) == true) {

			closeEditModal();

			const updatedEvent = await eventService.update(event._id, event.name, event.imageUrl, event.description, event.startDate);

			setUpcomingEvents((prevEvents) =>
				prevEvents.map((ev) =>
					ev._id === event._id
						? {
							...ev,
							name: updatedEvent.name,
							description: updatedEvent.description,
							startDate: updatedEvent.startDate,
							imageUrl: updatedEvent.imageUrl
						}
						: ev
				)
			);

			showSuccess('Successfully edited event');
		}
	};

	const saveNewEventHandler = async (event) => {
		if (validateEvent(event) == true) {
			closeCreateModal();

			const createdEvent = await eventService.create(event.name, event.imageUrl, event.description, event.startDate);

			setUpcomingEvents((state) => [createdEvent, ...state]);

			setTotalCount((prevCount) => prevCount + 1)

			showSuccess('Successfully added new event');
		}
	};

	const deleteEventHandlerClick = async (event) => {
		setSelectedItem(event);
		
		openDeleteModal();
	};

	const deleteEventHandler = async (_id) => {
		await eventService.remove(_id);

		setUpcomingEvents((state) =>
			state.filter((currentEvent) => {
				return currentEvent._id !== _id;
			})
		);

		closeDeleteModal();
	
		if (upcomingEvents.length == 1) {
			handlePageChange(currentPage - 1);
		} 

		setTotalCount((prevCount) => prevCount - 1)

		showSuccess('Successfully deleted event');
	};

	const cardFooter = (event) => (
		<div id="date-countdown">
			<Timer deadline={formatDateForTimer(event?.startDate)} />
			<div>
				<Button
					icon="pi pi-pencil"
					className="p-button-rounded p-button-text"
					onClick={() => editEventHandlerClick(event)}
				/>
				<Button
					icon="pi pi-trash"
					className="p-button-rounded p-button-text p-button-danger"
					onClick={() => deleteEventHandlerClick(event)}
				/>
			</div>
		</div>
	);

	const upcomingEventsContextValue = {
		closeCreateModal,
		closeEditModal,
		saveEditedEventHandler,
		saveNewEventHandler
	};

	return (
		<UpcomingEventContext.Provider value={upcomingEventsContextValue}>
			<div className={`${styles['upcoming-events-section']}`}>
				<h1 className={`${styles['upcoming-events-title']}`}>All Upcoming Events</h1>
				<div className={`${styles['upcoming-events-container']}`}>
					{upcomingEvents.map((event) => (
						<div className={`${styles['card-container']}`} key={event._id}>
							<Card className={`${styles['card']}`} footer={cardFooter(event)} header={cardHeader(event)} title={event.name}>
								<div className={`${styles['card-content']}`}>
									<p className="text-black">
										{event?.description}
									</p>
								</div>
							</Card>
						</div>
					))}
					<div>
						<UpcomingEventEditModal
							isOpen={isEditModalOpen}
							currentEvent={selectedItem}
						/>
					</div>
					<div>
						<UpcomingEventCreateModal
							isOpen={isCreateModalOpen}
						/>
					</div>
					<div>
						<DeleteModal
							isOpen={isDeleteModalOpen}
							closeDeleteModal={closeDeleteModal}
							onConfirm={deleteEventHandler}
							_id={selectedItem?._id}
						/>
					</div>
				</div>
				{upcomingEvents.length > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />}
				<div>
					<Button
						label=' Add New Upcoming Event'
						icon="pi pi-plus"
						className="p-button-rounded"
						onClick={openCreateModal}
					/>
				</div>
			</div>
		</UpcomingEventContext.Provider>
	)
}

export default UpcomingEventsAdminPage;