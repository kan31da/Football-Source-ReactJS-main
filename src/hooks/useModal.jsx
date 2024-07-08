import { useState } from "react";

export const useModal = () => {
	const [selectedItem, setSelectedItem] = useState({});
	const [isCreateModalOpen, setCreateModalOpen] = useState(false);
	const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    
	const openCreateModal = () => {
		setCreateModalOpen(true);
	};

	const closeCreateModal = () => {
		setCreateModalOpen(false);
	};

	const openEditModal = () => {
		setEditModalOpen(true);
	};

	const closeEditModal = () => {
		setEditModalOpen(false);
	};

	const openDeleteModal = () => {
		setIsDeleteModalOpen(true);
	};

	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
	};

	return {
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
	};
};