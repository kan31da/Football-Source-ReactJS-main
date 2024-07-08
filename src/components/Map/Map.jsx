import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import * as locationService from '../../services/locationService';

import styles from './Map.module.css'
import 'leaflet/dist/leaflet.css';

function Map({ address }) {
	const [position, setPosition] = useState([]);
	const zoom = 10;

	const navigate = useNavigate();

	useEffect(() => {
		locationService.getLocationByAddress(address)
			.then((result) => {
				if (result.error)
					throw new Error(result.error);

					const position = [ result.results[0]?.geometry?.lat, result.results[0]?.geometry?.lng];
					setPosition(position);
			  })
			.catch((error) => {
				console.log(error);
				navigate(`/error`);
			  });
	}, []);

	if (position?.length > 0) {
		return (
			<div className={styles['map-section']}>
				<h1 className={styles['map-location-title']}>Map Location</h1>
				<MapContainer center={[position[0], position[1]]} zoom={zoom} style={{ height: '500px', width: '100%' }} scrollWheelZoom={true}>
					<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
					<Marker position={position}>
						<Popup>
							<strong>Adress:</strong> {address}
						</Popup>
					</Marker>
				</MapContainer>
			</div>
		);
	}
	else {
		return null;
	}
}

export default Map;