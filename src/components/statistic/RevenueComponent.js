import React, { useState } from "react";
import {
  Input,
  Col,
  Row,
  Typography,
  Button,
  Modal,
  Breadcrumb,
  DatePicker,
  Select,
} from "antd";
import RevenueTable from "./table/RevenueTable";
import dayjs from "dayjs";
import moment from "moment";
import useRevenueComponentHook from "./useRevenueComponentHook";
import { exportExcel } from "../export-excel/statistics/reveneu-staff";
const { Title, Text } = Typography;


const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const RevenueComponent = () => {
  const { revenues, onChangeDate, handleChangeEmployee, idStaff, staffs, start_date, end_date } =
    useRevenueComponentHook();

  const handleExportExcel = () => {
    console.log(revenues);
    // console.log(dayjs(start_date).format('DD/MM/YYYY') , end_date)
    exportExcel(revenues, dayjs(start_date).format('DD/MM/YYYY'), dayjs(end_date).format('DD/MM/YYYY'));

  };
    
  return (
    <div className="site-card-wrapper">
     <Title level={5} style={{ marginBottom: "1rem" }}>
        Thống kê doanh thu theo nhân viên
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Col span={6}>
          <RangePicker

            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            style={{ minWidth: "50%" }}
            onChange={onChangeDate}
            defaultValue={[
              dayjs(moment().startOf("month").format(dateFormat), dateFormat),
              dayjs(moment().format(dateFormat), dateFormat),
            ]}
            format={dateFormat}
          />
        </Col>
        <Col span={12}>
          <Select
            placeholder="Thống kê theo nhân viên"
            style={{
              width: "200px",
              margin: "0 1rem",
            }}
            onChange={handleChangeEmployee}
            options={staffs}
          />
        </Col>
        <Col span={4} style={{ position: "absolute", right: "2.5%" }}>
          <Button type="primary" title="Xuất file"
            onClick={handleExportExcel}
          >
            Xuất báo cáo
          </Button>
        </Col>
      </Row>

      <Row
        style={{ margin: "1rem 0 1rem 0" }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={24}>
          <RevenueTable idStaff={idStaff} revenues={revenues} />
        </Col>
      </Row>
    </div>
  );
};
export default RevenueComponent;
