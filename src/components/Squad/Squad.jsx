import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from 'primereact/button';

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";

import styles from './Squad.module.css';

const Squad = ({ squad }) => {
	const navigate = useNavigate();

	const optionsBodyTemplate = (player) => {
		return (
			<div>
				<Button
					label="Player Details"
					onClick={() => handlePlayerClick(player)}
					icon="pi pi-info"
				/>
			</div>
		);
	};

	const handlePlayerClick = (player) => {
		navigate(`/people/${player.id}/`);
	};

	if (squad?.length > 0) {
		return (
			<div className={styles['squad-section']}>
				<h1 className={styles['squad-title']}>Squad</h1>
				<div className={styles['widget-header']}>
					<DataTable
						value={squad}
						sortMode="multiple"
						paginator
						rows={5}
						rowsPerPageOptions={[5, 10, 15, 20, 50]}
						totalRecords={squad?.length}
					>
						<Column field="id" header="ID" sortable />
						<Column field="name" header="Player Name" sortable filter filterPlaceholder="Search by Player Name" />
						<Column field="position" header="Position" sortable filter filterPlaceholder="Search by Player Position" />
						<Column field="dateOfBirth" header="Date of Birth" sortable filter filterPlaceholder="Search by Date of Birth" />
						<Column field="nationality" header="Nationality" sortable filter filterPlaceholder="Search by Nationality" />
						<Column header="Options" sortable body={optionsBodyTemplate} />
					</DataTable>
				</div>
			</div>
		);
	} else {
		return
	}
};

export default Squad;