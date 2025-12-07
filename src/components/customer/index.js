import React, { useState } from "react";
import { Input, Col, Row, Typography, Button, Modal } from "antd";

import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import TableCustomer from "./TableCustomer";
import ModelAddCustomer from "./ModelAddCustomer";

const { Title, Text } = Typography;
const IndexCustomer = () => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const [keySearch, setKeySearch] = useState("");

  const showModal = () => {
    setShowModalAddCustomer(true);
  };

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Quản lý khách hàng
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
            placeholder="Nhập tên, số điện thoại hoặc email..."
            prefix={<SearchOutlined />}
            onChange={(e) => setKeySearch(e.target.value)}
          />
        </Col>
        <Col span={6}>
        </Col>
        <Col span={3}>
          
        </Col>
        <Col span={2}>
          {" "}
          {/* <Button type="primary" icon={<UserAddOutlined />} onClick={showModal}>
            Thêm
          </Button> */}
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
          <TableCustomer  keySearch ={keySearch}/>
        </Col>
      </Row>
      {showModalAddCustomer ? (
        <ModelAddCustomer
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
        />
      ) : null}
    </div>
  );
};
export default IndexCustomer;
