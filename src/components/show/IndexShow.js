import React, { useState } from "react";
import { Input, Col, Row, Typography, Button, Modal, Breadcrumb } from "antd";

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
import TableShows from "./TableShows";
import ModelAddShow from "./ModelAddShow";

const { Title, Text } = Typography;
const IndexShow = ({ setTab }) => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  
  const showModal = () => {
    setShowModalAddCustomer(true);
  };

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Quản lý lịch chiếu
      </Title>
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
          <TableShows
            setTab={setTab}
            showModalAddCustomer={showModalAddCustomer}
            setShowModalAddCustomer={setShowModalAddCustomer}
          />
        </Col>
      </Row>
      {showModalAddCustomer ? (
        <ModelAddShow
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
        />
      ) : null}
    </div>
  );
};
export default IndexShow;
