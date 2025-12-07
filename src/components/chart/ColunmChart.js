import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";

const ColumnChart = ({data}) => {
  const config = {
    data,
    xField: "date",
    yField: "revenue",
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      label: {
        formatter: function formatter(v) {
          return "".concat(v).replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
            return "".concat(s, ",");
          });
        }
      }
    },
    meta: {
      date: {
        alias: "类别",
      },
      revenue: {
        alias: "Doanh thu",
      },
    },
    tooltip: {
      showMarkers: false,
      formatter: (datum) => {
        return { name: 'Doanh thu', value: datum.revenue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") };
      }
    },
    minColumnWidth: 20,
    maxColumnWidth: 20,
  };
  return <Column {...config} />;
};

export default ColumnChart;
