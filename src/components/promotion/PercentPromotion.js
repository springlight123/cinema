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

const PercentPromotion = (props) => {
  const [form] = Form.useForm();
  const { disabled, promtionDetails } = props;
  const onFinish = (values) => {
    console.log("values", values);
    props.handleSubmit(values);
  };

  const newDateFormat = "YYYY-MM-DD";
  const currentDate = dayjs().format(newDateFormat);

  useEffect(() => {
    if (promtionDetails) {
      form.setFieldsValue({
        id: promtionDetails.id,
        moneyBought: promtionDetails?.total_purchase_amount || 0,
        percent: promtionDetails?.percent_reduction || 0,
        maxMoneyPercent: promtionDetails?.max_money_reduction || 0
      });
    }
  }, [promtionDetails]);

  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        id="myFormAddLinePro"
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="moneyBought"
              label="Số tiền Mua"
              rules={[
                {
                  required: true,
                  message: "Nhập số  tiền Mua...",
                },
              ]}
            >
              <InputNumber
                disabled= {
                  props.statusDb === 1 ? true : false
                  || currentDate > dayjs(props.startDate).format(newDateFormat) ? true : false
                }
                style={{ width: "100%" }}
                formatter={(value) =>
                  `VNĐ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\VNĐ\s?|(,*)/g, "")}
                // onChange={onChange}
                placeholder="Nhập số tiền Mua.."
                name="moneyTotal"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="percent"
              label="Phần trăm giảm"
              rules={[
                {
                  required: true,
                  message: "Nhập số phần trăm giảm...",
                },
              ]}
            >
              <InputNumber
                min={1}
                disabled= {
                  props.statusDb === 1 ? true : false
                  || currentDate > dayjs(props.startDate).format(newDateFormat) ? true : false
                }
                style={{ width: "100%" }}
                max={100}
                placeholder="Nhập số phần trăm giảm.."
                formatter={(value) => `% ${value}`}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="maxMoneyPercent"
              label="Số tiền KM tối đa"
              rules={[
                {
                  required: true,
                  message: "Nhập số tiền...",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                formatter={(value) =>
                  `VNĐ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\VNĐ\s?|(,*)/g, "")}
                // onChange={onChange}
                placeholder="Nhập số tiền..."
                disabled= {
                  props.statusDb === 1 ? true : false
                  || currentDate > dayjs(props.startDate).format(newDateFormat) ? true : false
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default PercentPromotion;
