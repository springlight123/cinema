import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie } from '@ant-design/plots';

const PieChart = ({data}) => {
  const config = {
    appendPadding: 10,
    data,
    angleField: 'percent',
    colorField: 'title',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };
  return <Pie {...config} />;
};
 export default PieChart