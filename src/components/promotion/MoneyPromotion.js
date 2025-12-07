import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Upload,
} from "antd";
import dayjs from "dayjs";

import { PlusOutlined, UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const MoneyPromotion = ({
  setCategory,
  setQtyBuy,
  setTotalDiscount,
  handleClick,
  handleSubmit,
  showModalAddCustomer,
  disabled,
  setShowModalAddCustomer,
  listProductSeat,
  promtionDetails,
  startDate,
  statusDb,
}) => {
  const [form] = Form.useForm();

  const newDateFormat = "YYYY-MM-DD";
  const currentDate = dayjs().format(newDateFormat);
  useEffect(() => {
    if (promtionDetails) {
      form.setFieldsValue({
        id: promtionDetails.id,
        category: promtionDetails?.IdProduct_buy || 0,
        totalDiscount: promtionDetails?.money_received || 0,
        qtyBuy: promtionDetails?.qty_buy || 0,
      });
    }
  }, []);

  const onFinish = (values) => {
    console.log("values", values);
    handleSubmit(values);
  };

  const onChangeCategory = (value) => {
    // console.log(`selected ${value}`);
    setCategory(value);
  };

  const onChangeQty = (value) => {
    console.log(`selected ${value}`);
    // setQtyBuy(value);
  }


  return (
    <>
      <Form
        form={form}
        // id="myFormAddLinePro"
        // onFinish={ onFinish }
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="category"
              label="Chọn sản phẩm mua "
              rules={[
                {
                  required: true,
                  message: "Hãy chọn sản phẩm mua...",
                },
              ]}
            >
              <Select
                onChange={onChangeCategory}
                disabled= {
                  statusDb === 1 ? true : false
                  || currentDate > dayjs(startDate).format(newDateFormat) ? true : false
                }
                placeholder="Chọn sản phẩm mua"
                style={{
                  width: "100%",
                }}
                // onChange={handleChangePosition}
                options={listProductSeat}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="qtyBuy"
              label="Số lượng mua"
              style={{ width: "100%" }}
              rules={[
                {
                  required: true,
                  message: "Nhập số lượng mua...",
                },
              ]}
            >
              <InputNumber
               onChange={onChangeQty}
                disabled= {
                  statusDb === 1 ? true : false
                  || currentDate > dayjs(startDate).format(newDateFormat) ? true : false
                }
                style={{ width: "100%" }}
                min={1}
                max={10}
                defaultValue={1}
                placeholder="Nhập số lượng mua.."
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="totalDiscount"
              label="Số tiền KM"
              rules={[
                {
                  required: true,
                  message: "Nhập số  tiền KM...",
                },
              ]}
            >
              <InputNumber
              onBlur={e => {
                setTotalDiscount(Number(e.target.value.replace(/\VNĐ\s?|(,*)/g, "")))
              }}
                disabled= {
                  statusDb === 1 ? true : false
                  || currentDate > dayjs(startDate).format(newDateFormat) ? true : false
                }
                style={{ width: "100%" }}
                formatter={(value) =>
                  `VNĐ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\VNĐ\s?|(,*)/g, "")}
                // onChange={onChange}
                placeholder="Nhập số tiền KM.."
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default MoneyPromotion;
