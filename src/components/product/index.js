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
import TableProduct from "./TableProduct";
import ModelAddProduct from "./ModelAddProduct";
import { useRoleHook } from "../../utils/useRoleHook.js";

const { Title, Text } = Typography;
const IndexProduct = () => {
  const [showModalAddProduct, setShowModalAddProduct] = useState(false);
  const [keyword, setKeyword] = useState("");
  const {isEmployee} = useRoleHook()
  const showModal = () => {
    setShowModalAddProduct(true);
  };

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Quản lý sản phẩm
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={21}>
          <Input
            placeholder="Nhập tên, mã sản phẩm"
            prefix={<SearchOutlined />}
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                setKeyword(e.target.value);
              }
            }}
            style={{ width: "50%" }}
          />
        </Col>

        {/* <Col span={9}>
        </Col> */}

        <Col span={3}>
          {" "}
          {
            isEmployee ? null : 
          <Button type="primary" icon={<UserAddOutlined />} onClick={showModal}>
            Thêm
          </Button>
          }
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
          <TableProduct keyword={keyword} />
        </Col>
      </Row>
      {showModalAddProduct ? (
        <ModelAddProduct
          showModalAddProduct={showModalAddProduct}
          setShowModalAddProduct={setShowModalAddProduct}
        />
      ) : null}
    </div>
  );
};
export default IndexProduct;
