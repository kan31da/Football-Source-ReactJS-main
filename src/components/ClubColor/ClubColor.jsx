import styles from './ClubColor.module.css';

const ClubColor = ({ text }) => {
	if (!text) {
		return null;
	}

	const colors = text.split('/').map(color => color.trim());

	if(!colors) {
		return null;
	}

	const coloredText = colors.map((color, index) => (
		<span key={index}>
			<span className={styles['color']} style={{ color }}>{color}</span>
			{index < colors.length - 1 && ' / '}
		</span>
	));

	return <>{coloredText}</>;
};

export default ClubColor