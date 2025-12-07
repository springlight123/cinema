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
import TablePromotionHeader from "./TablePromotionHeader";
import moment from "moment";
import ModelAddPromotionHeader from "./ModelAddPromotionHeader";
const { Title, Text } = Typography;
const dateFormat = "YYYY/MM/DD";
const IndexCinemaHall = ({ setTab, selectedIdCinema, statusDb }) => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const [keyword, setKeyword] = useState("");

  const showModal = () => {
    setShowModalAddCustomer(true);
  };

  const handleRouter = (value) => {
    setTab(value);
  };

  return (
    <div className="site-card-wrapper">
      <Breadcrumb style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <Breadcrumb.Item> <a onClick={()=>{handleRouter(0)}}> Rạp </a></Breadcrumb.Item>
        <Breadcrumb.Item>
          Phòng chiếu
        </Breadcrumb.Item>
      </Breadcrumb>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={10}>
          <Input
            placeholder="Nhập tên phòng chiếu hoặc loại phòng"
            prefix={<SearchOutlined />}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                setKeyword(e.target.value);
              }
            }}
          />
        </Col>
        <Col span={8}>
          {" "}
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showModal}
            title="Thêm mới rạp"
          >
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
          <TablePromotionHeader keyword={keyword} setTab={setTab} selectedIdCinema={selectedIdCinema} statusDb={statusDb} />
        </Col>
      </Row>
      {showModalAddCustomer ? (
        <ModelAddPromotionHeader
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
          selectedIdCinema={selectedIdCinema}
        />
      ) : null}
    </div>
  );
};
export default IndexCinemaHall;
