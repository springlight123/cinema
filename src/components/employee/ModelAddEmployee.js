import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
import openAddressApi from "../../api/openApi";
import useEmployeeHook from "./useEmployeeHook";

const ModelAddEmployee = ({
  showModalAddCustomer,
  setShowModalAddCustomer,
}) => {
  const {
    form,
    province,
    districts,
    wards,
    provincePicked,
    districtPicked,
    onChangeDistrict,
    onChangeProvince,
    onSearch,
    onClose,
    handleSubmit,
    onChangeDate,
    handleChangePosition,
    yupSync,
  } = useEmployeeHook(showModalAddCustomer, setShowModalAddCustomer);

  return (
    <>
      <Drawer
        title="Thêm nhân viên"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button form="myFormAddLinePro" htmlType="submit" type="primary">
              Lưu
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          id="myFormAddLinePro"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="first_name"
                label="Họ và tên đệm"
                rules={[yupSync]}
              >
                <Input placeholder="Hãy nhập họ và tên đệm nhân viên..." />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item name="last_name" label="Tên" rules={[yupSync]}>
                <Input placeholder="Hãy nhập tên nhân viên..." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                rules={[yupSync]}
                name="phone"
                label="Hãy nhập số điện thoại"
              >
                <Input placeholder="Hãy nhập số điện thoại..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item rules={[yupSync]} name="email" label="Hãy nhập email">
                <Input placeholder="Hãy nhập email..." />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "26px" }} gutter={16}>
            <Col span={12}>
              <Form.Item rules={[yupSync]} name="position">
                <Select
                  placeholder="Chọn chức vụ"
                  style={{
                    width: "100%",
                  }}
                  rules={[yupSync]}
                  onChange={handleChangePosition}
                  options={[
                    {
                      value: "3",
                      label: "Quản lý",
                    },
                    {
                      value: "2",
                      label: "Nhân viên",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <DatePicker
                onChange={onChangeDate}
                style={{ width: "100%" }}
                name="start_date"
                placeholder="Chọn ngày vào làm"
              />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item rules={[yupSync]} name="tinh">
                <Select
                  showSearch
                  placeholder="Chọn tỉnh thành"
                  optionFilterProp="children"
                  onChange={onChangeProvince}
                  onSearch={onSearch}
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  name="tinh"
                  options={province}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item rules={[yupSync]} name="quan">
                <Select
                  rules={[yupSync]}
                  showSearch
                  placeholder="Chọn quận huyện"
                  optionFilterProp="children"
                  onChange={onChangeDistrict}
                  onSearch={onSearch}
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  name="quan"
                  options={districts}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "24px" }}>
            <Col span={12}>
              <Form.Item rules={[yupSync]} name="huyen">
                <Select
                  showSearch
                  placeholder="Chọn phường/xã"
                  optionFilterProp="children"
                  // onChange={onChange}
                  onSearch={onSearch}
                  style={{ width: "100%" }}
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={wards}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default ModelAddEmployee;
