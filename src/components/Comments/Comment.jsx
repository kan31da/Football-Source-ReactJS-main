import { useContext } from "react";

import { Card } from "primereact/card";
import { Button } from "primereact/button";

import { CommentContext } from "../../contexts/CommentContext";
import AuthenticationContext from "../../contexts/AuthenticationContext";
import { formatUTCDateToLocal } from "../../utils/dateTimeUtils";

import styles from "./Comment.module.css";

const Comment = ({
	_id,
	_ownerId,
	username,
	text,
	dateCreated,
	lastModifiedOn,
}) => {
	const { editCommentHandlerClick, deleteCommentHandlerClick } = useContext(CommentContext);

	const { authentication } = useContext(AuthenticationContext);

	const cardFooter = (authentication._id === _ownerId || authentication.isAdmin) ? (
		<div>
			<Button
				icon="pi pi-pencil"
				className="p-button-rounded p-button-text"
				onClick={() => { editCommentHandlerClick(_id) }}
			/>
			<Button
				icon="pi pi-trash"
				className="p-button-rounded p-button-text p-button-danger"
				onClick={() => { deleteCommentHandlerClick(_id) }}
			/>
		</div>
	) : null;

	return (
		<div className={styles["comment-section"]}>
			<Card
				className={[styles["comment-card"]]}
				title={`Username: ${username}`}
				subTitle={`Created On: ${formatUTCDateToLocal(dateCreated)}`}
				footer={cardFooter}
			>
				<p>{text}</p>
				<small>Last Modified On: {formatUTCDateToLocal(lastModifiedOn)}</small>
			</Card>
		</div>
	);
};

export default Comment;