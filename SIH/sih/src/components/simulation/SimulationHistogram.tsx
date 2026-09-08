import React from 'react';
import { SimulationChart, SimulationChartProps } from './SimulationChart';

export type SimulationHistogramProps = SimulationChartProps;

export const SimulationHistogram: React.FC<SimulationHistogramProps> = (props) => {
  return <SimulationChart {...props} />;
};

export default SimulationHistogram;
