import { ProgressSpinner } from 'primereact/progressspinner';

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
	return (
		<div className={styles['loading-spinner-container']}>
			<ProgressSpinner />
		</div>
	);
};

export default LoadingSpinner;