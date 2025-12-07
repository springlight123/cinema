import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
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
  Upload,
  message,
} from "antd";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import priceApi from "../../api/priceApi";
import moment from "moment";
const { Option } = Select;
const { RangePicker } = DatePicker;

const ModelAddCustomer = ({
  showModalAddCustomer,
  setShowModalAddCustomer,
}) => {
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const user = useSelector((state) => state.user);
  const [startDatePicked, setStartDatePicked] = useState("");
  const [endDatePicked, setEndDatePicked] = useState("");
  const [form] = Form.useForm();

  const onClose = () => {
    setShowModalAddCustomer(false);
  };

  const onChangeDate = (date, dateString) => {
    setStartDatePicked(dateString[0]);
    setEndDatePicked(dateString[1]);
  };

  // const onChangeDate = (date, dateString) => {
  //   setStartDatePicked(dateString);
  // };

  const onChangeDateEnd = (date, dateString) => {
    setEndDatePicked(dateString);
  };

  //handle submit form create new customer...
  const handleSubmit = async (values) => {
    console.log("values:", values);
    console.log("user:", user);
    const data = {
      name: values.name,
      startDate: startDatePicked,
      endDate: endDatePicked,
      note: values.note,
      userCreate: user.id,
      priceCode: values.priceCode,
    };
    try {
      const res = await priceApi.createPriceHeader(data);
      console.log("res:", res);
      if (res) {
        message.success("Tạo mới bảng giá thành công!");
        depatch(setReload(!reload));
        onClose();
      }
    } catch (error) {
      console.log("error:", error);
      message.error("Mã bảng giá đã tồn tại!");
    }
  };

  return (
    <>
      <Drawer
        title="Tạo mới bảng giá"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button form="myForm" htmlType="submit" type="primary">
              Lưu
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={handleSubmit} id="myForm" layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Tên bảng giá"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên bảng giá...",
                  },
                ]}
              >
                <Input placeholder="Hãy nhập tên bảng giá..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="priceCode"
                label="Mã Bảng giá"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mã bảng giá...",
                  },
                ]}
              >
                <Input
                  placeholder="Hãy nhập mã bảng giá tối đa 5 ký tự"
                  addonBefore="PRI"
                  min={1}
                  maxLength={5}
                  showCount
                  style={{ width: "100%" }}
                  // onChange={handleChangeCode}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Thời gian họat động"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời gian cho bảng giá...",
                  },
                ]}
              >
                <RangePicker
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  onChange={onChangeDate}
                  style={{ width: "100%" }}
                  disabledDate={(current) => {
                    return current && current < moment().endOf("day");
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginTop: "16px" }} gutter={16}>
            <Col span={24}>
              <Form.Item name="note" label="Ghi chú">
                <Input.TextArea rows={4} placeholder="Nhập ghi chú..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default ModelAddCustomer;
