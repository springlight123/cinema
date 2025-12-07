import React, { useEffect, useState } from "react";
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
import RevenueTable from "../table/RevenueTable";
import dayjs from "dayjs";
import moment from "moment";
import useRevenueComponentHook from "../useRevenueComponentHook";
import useCustomerComponentHook from "./useCustomerComponentHook";
import { exportExcel } from "../../export-excel/statistics/reveneu-customer";
import customerApi from "../../../api/customerApi";
const { Title, Text } = Typography;

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const CustomerStatitisComponent = () => {
  const { revenues, onChangeDate, listCinema, cinema, start_date, end_date, onChangeCustomer } =
    useCustomerComponentHook();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchListCustomer = async () => {
      const res = await customerApi.getCustomers("");
      console.log(res);
      if (res) {
        const newLs = res.map((item) => {
          return {
            value: item.id,
            label: item?.firstName + " " + item?.lastName + " - " + item?.phone,
          };
        });
        setCustomers(newLs);
      }
    };
    fetchListCustomer();
  }, []);

  const handleExportExcel = () => {
    console.log(revenues);
    // console.log(dayjs(start_date).format('DD/MM/YYYY') , end_date)
    exportExcel(revenues, dayjs(start_date).format('DD/MM/YYYY'), dayjs(end_date).format('DD/MM/YYYY'));
  }
    
  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Thống kê khách hàng
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
            placeholder="Chọn khách hàng"
            style={{
              width: "350px",
              margin: "0 1rem",
            }}
            options={customers}
            allowClear
            onChange={onChangeCustomer}
           // onChange={handleChangeEmployee}
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
          <RevenueTable tableType={1} revenues={revenues} />
        </Col>
      </Row>
    </div>
  );
};
export default CustomerStatitisComponent;
