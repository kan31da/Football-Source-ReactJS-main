import { Button } from "primereact/button";

import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
	return (
		<div className={styles['pagination-section']}>
			<div className={`${styles['pagination-controls']}`}>
				<Button
					icon="pi pi-chevron-left"
					onClick={() => handlePageChange(currentPage - 1)}
					disabled={currentPage === 1}
					className="p-button-rounded p-button-text"
				/>
				<span className={styles['pages']}>{`Page ${currentPage} of ${totalPages}`}</span>
				<Button
					icon="pi pi-chevron-right"
					onClick={() => handlePageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="p-button-rounded p-button-text"
				/>
			</div>
		</div>
	)
}

export default Pagination;