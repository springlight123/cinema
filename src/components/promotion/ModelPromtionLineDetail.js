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
  message,
} from "antd";
import moment from "moment";

import useModelPromotionLine from "./useModelPromotionLine";
import ProductPromotion from "./ProductPromotion";
import MoneyPromotion from "./MoneyPromotion";
import PercentPromotion from "./PercentPromotion";
import dayjs from "dayjs";

const newDateFormat = "YYYY-MM-DD";
const { RangePicker } = DatePicker;
const ModelPromtionLineDetail = ({
  isShowModelDetail,
  setIsShowModelDetail,
  startDateDb,
  endDateDb,
  idPromotionLine,
  setIdPromotionLine,
  endDateHeader,
  statusDb,
}) => {
  const {
    form,
    reload,
    type,
    startDate,
    endDate,
    listProductSeat,
    listProduct,
    onClose,
    handleSubmit,
    onChangeDate,
    handleChangeTypePro,
    promotionLine,
    isEnable,
    promtionDetails,
    setStartDate,
    setEndDate,
    setCategory,
    setQtyBuy,
    setTotalDiscount,
    setMoneyBought,
    setPercentDiscount,
    setMaxMoneyPercent,
    setProductBuy,
    setProductReceive,
    setQtyReceive,
  } = useModelPromotionLine({
    isShowModelDetail,
    setIsShowModelDetail,
    idPromotionLine,
  });

  const currentDate = dayjs().format(newDateFormat);

  const RenderDaTaType = (handleSubmit) => {
    console.log(isEnable);
    if (!promotionLine) return null;
    if (+promotionLine.type === 1) {
      return (
        <ProductPromotion
          setProductBuy={setProductBuy}
          setProductReceive={setProductReceive}
          setQtyReceive={setQtyReceive}
          setQtyBuy={setQtyBuy}

          handleSubmit={handleSubmit}
          disabled={isEnable}
          listProductSeat={listProductSeat}
          listProduct={listProduct}
          promtionDetails={promtionDetails}
          startDate={startDate}
          statusDb={statusDb}
        />
      );
    } else if (+promotionLine.type === 2) {
      return (
        <MoneyPromotion
         setCategory={setCategory}
          setQtyBuy={setQtyBuy}
          setTotalDiscount={setTotalDiscount}

          handleSubmit={handleSubmit}
          listProductSeat={listProductSeat}
          // disabled={isEnable}
          promtionDetails={promtionDetails}
          startDate={startDate}
          statusDb={statusDb}
        />
      );
    } else {
      return (
        <PercentPromotion
          setMoneyBought={setMoneyBought}
          setPercentDiscount={setPercentDiscount}
          setMaxMoneyPercent={setMaxMoneyPercent}
          handleSubmit={handleSubmit}
          disabled={isEnable}
          promtionDetails={promtionDetails}
          startDate={startDate}
          statusDb={statusDb}
        />
      );
    }
  };

  return (
    <>
      <Drawer
        title="Chi Tiết CTKM"
        width={720}
        onClose={onClose}
        open={isShowModelDetail}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          statusDb === 0 ? (
            <Space>
              <Button onClick={onClose}>Hủy</Button>
              <Button form="myFormAddLinePro" htmlType="submit" type="primary">
                Lưu
              </Button>
            </Space>
          ) : null
        }
      >
        <Form
          onFinish={handleSubmit}
          id="myFormAddLinePro"
          form={form}
          layout="vertical"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="promotionCode"
                label="Mã áp dụng"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mã áp dụng...",
                  },
                ]}
              >
                <Input
                  disabled
                  style={{ textTransform: "uppercase" }}
                  placeholder="Hãy nhập mã áp dụng..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="desc"
                label="Mô tả"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mô tả...",
                  },
                ]}
              >
                <Input
                  placeholder="Hãy nhập mô tả..."
                  disabled={statusDb === 1 ? true : false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Chọn loại khuyến mãi "
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn loại khuyến mãi...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn loại KM"
                  disabled
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeTypePro}
                  options={[
                    {
                      value: 2,
                      label: "Khuyến mãi giảm tiền",
                    },
                    {
                      value: 1,
                      label: "Khuyễn mãi tặng sản phẩm",
                    },
                    {
                      value: 3,
                      label: "Khuyễn mãi chiết khấu %",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budget"
                label="Ngân sách"
                rules={[
                  {
                    required: true,
                    message: "Nhập số tiền ngân sách...",
                  },
                ]}
              >
                <InputNumber
                  disabled={
                    statusDb === 1
                      ? true
                      : false ||
                        currentDate > dayjs(startDate).format(newDateFormat)
                      ? true
                      : false
                  }
                  style={{ width: "100%" }}
                  formatter={(value) =>
                    `VNĐ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\VNĐ\s?|(,*)/g, "")}
                  // onChange={onChange}
                  placeholder="Nhập số tiền ngân sách.."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maxUse" label="Số lượng KH áp dụng tối đa">
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={100000000}
                  disabled={
                    statusDb === 1
                      ? true
                      : false ||
                        currentDate > dayjs(startDate).format(newDateFormat)
                      ? true
                      : false
                  }
                  // defaultValue={1}
                  placeholder="Nhập số lương KH áp dụng tối đa..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="maxUsePerCustomer"
                label="Số lượng tối đa cho 1 KH trên 1 ngày"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={100000000}
                  disabled={
                    statusDb === 1
                      ? true
                      : false ||
                        currentDate > dayjs(startDate).format(newDateFormat)
                      ? true
                      : false
                  }
                  // defaultValue={1}
                  placeholder="Nhập số lần KH được sử dụng KM/ngày..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Ngày bắt đầu - Ngày kết thúc"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn ngày bắt đầu...",
                  },
                ]}
              >
                <RangePicker
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  onChange={onChangeDate}
                  disabled={
                    statusDb === 1
                      ? true
                      : false || [
                          moment().diff(moment(startDateDb), "seconds") > 0
                            ? true
                            : false,
                          false,
                        ]
                  }
                  disabledDate={(current) => {
                    return (
                      (current && current < dayjs(startDateDb)) ||
                      current > dayjs(endDate).endOf("day")
                    );
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="status"
                label="Trạng thái"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn trạng thái...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn trạng thái"
                  style={{
                    width: "100%",
                  }}
                  // onChange={handleChangePosition}
                  options={[
                    {
                      value: 0,
                      label: "Ngưng hoạt động",
                    },
                    {
                      value: 1,
                      label: "Hoạt động",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Space
            direction="vertical"
            style={{
              width: "100%",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Chi tiết loại khuyến mãi
            </span>
          </Space>
          <RenderDaTaType handleSubmit={handleSubmit} />
        </Form>

        {/* <RenderType /> */}
      </Drawer>
    </>
  );
};
export default ModelPromtionLineDetail;
