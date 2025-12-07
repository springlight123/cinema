import React, { useState } from "react";
import { Input, Col, Row, Typography, Button, Modal, Breadcrumb,DatePicker } from "antd";

import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import TableCustomer from "../customer/TableCustomer";
import ModelAddCustomer from "../customer/ModelAddCustomer";
import TableFilms from "./TableFilms";
import ModelAddFilm from "./ModelAddFilm";

const { Title, Text } = Typography;
const IndexTicketRefund = () => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const { RangePicker } = DatePicker;
  const [startDatePicker, setStartDatePicker] = useState("");
  const [endDatePicker, setEndDatePicker] = useState("");
  const [keyword, setKeyword] = useState("");

  const showModal = () => {
    setShowModalAddCustomer(true);
  };

  const onChangeDate = (date, dateString) => {
    setStartDatePicker(dateString[0]);
    setEndDatePicker(dateString[1]);
  };

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem", marginTop:"1rem" }}>
        Vé trả
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={19}>
        <RangePicker 
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            onCalendarChange={onChangeDate}
            style={{ minWidth: "50%" }}
            allowClear={true}
          />
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
          <TableFilms start_date= {startDatePicker} end_date = {endDatePicker} />
        </Col>
      </Row>
      {showModalAddCustomer ? (
        <ModelAddFilm
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
        />
      ) : null}
    </div>
  );
};
export default IndexTicketRefund;
