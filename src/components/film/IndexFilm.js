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
} from "antd";

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
const IndexFilm = () => {
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
        Quản lý phim
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={12}>
          <Input
            placeholder="Nhập tên phim hoặc mã phim..."
            prefix={<SearchOutlined />}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </Col>
        <Col span={9}>
          {" "}
          <RangePicker 
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            onCalendarChange={onChangeDate}
          />
        </Col>
        {/* <Col style={{ margin: "0 1rem" }}>
          {" "}
          <Button type="primary" size="large" icon={<ToolOutlined />}>
            Cập nhật
          </Button>
        </Col> */}
        <Col span={1}>
          <Button type="primary" icon={<UserAddOutlined />} onClick={showModal} title="Thêm mới bộ phim">
            Thêm
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
          <TableFilms keyword={keyword} startDatePicker={startDatePicker} endDatePicker={endDatePicker} />
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
export default IndexFilm;
