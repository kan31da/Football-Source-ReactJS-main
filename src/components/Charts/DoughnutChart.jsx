import { useState, useEffect } from 'react';

import { Chart } from 'primereact/chart';

import styles from './DoughnutChart.module.css';

const DoughnutChart = ({ chartTitle, chartLabels, chartInfo }) => {
	const [chartData, setChartData] = useState({});
	const [chartOptions, setChartOptions] = useState({});

	useEffect(() => {
		const documentStyle = getComputedStyle(document.documentElement);
		const data = {
			labels: chartLabels,
			datasets: [
				{
					data: chartInfo,
					backgroundColor: [
						documentStyle.getPropertyValue('--blue-500'),
						documentStyle.getPropertyValue('--yellow-500'),
						documentStyle.getPropertyValue('--green-500')
					],
					hoverBackgroundColor: [
						documentStyle.getPropertyValue('--blue-400'),
						documentStyle.getPropertyValue('--yellow-400'),
						documentStyle.getPropertyValue('--green-400')
					]
				}
			]
		};
		const options = {
			cutout: '60%'
		};

		setChartData(data);
		setChartOptions(options);
	}, [chartTitle]);

	if (chartData) {
		return (
			<div className={styles['chart-section']}>
				<h1 className={styles['chart-title']}>{chartTitle}</h1>
				<div className="card flex justify-content-center">
					<Chart type="doughnut" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
				</div>
			</div>
		)
	}
	else {
		return null;
	}
}

export default DoughnutChart;