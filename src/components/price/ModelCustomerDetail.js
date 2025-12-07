import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Upload,
} from "antd";
import moment from "moment";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import priceApi from "../../api/priceApi";
import productApi from "../../api/productApi";

const { Option } = Select;

const ModelDetailCustomer = ({
  showModalDetailCustomer,
  setShowModalDetailCustomer,
  selectedId,
  selectedIdHeader
}) => {
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const [form] = Form.useForm();
  const [listProduct, setListProduct] = useState([]);


  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalDetailCustomer(false);
  };

  const handleSubmit = async (val) => {
    console.log("submit", val);
    const {price} = val;
    try {
      const res = await priceApi.updatePriceLineById(selectedId, {price});
      if(res[0]===1){
        message.success("Cập nhật thành công");
        depatch(setReload(!reload));
        onClose();
      }
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
   
  };

  const onChangeProduct = (value) => {
   // setProductSelected(value);
  };

  useEffect(() => {
    const fetchDetailPriceHeader = async () => {
      const res = await priceApi.getPriceHeaderById(selectedIdHeader);
      const data = {
        priceHeaderId: res.id,
        startDate: moment(res.startDate),
        endDate: moment(res.endDate),
      }
      form.setFieldsValue(data);
    };

    const fetchListProduct = async () => {
      const res = await productApi.getProducts();
      setListProduct(res);
    };

    const fetchDetailPriceLine = async () => {
      console.log("selectedId", selectedId);
      const res = await priceApi.getLineById(selectedId);
      console.log("res", res);
      if(res){
        form.setFieldsValue({
          product: res.idProduct,
          price: res.price,
        });
      }
    };

    fetchDetailPriceLine();
    fetchListProduct();
    fetchDetailPriceHeader();
  }, []);

 

  return (
    <>
      <Drawer
        title="Thông tin gía sản phẩm"
        width={720}
        onClose={onClose}
        open={showModalDetailCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button form="myFormDetailLine" htmlType="submit" type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={handleSubmit} id="myFormDetailLine" layout="vertical">
        <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="priceHeaderId" label="Mã bảng giá">
                <Input disabled={true} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Ngày bắt đầu"
               
              >
                <DatePicker disabled={true} style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12} style={{}}>
              <Form.Item
                name="endDate"
                label="Ngày kết thúc"
              >
                <DatePicker style={{ width: "100%" }} disabled={true} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: "26px" }} gutter={16}>
          
            <Col span={12}>
              <Form.Item
                name="product"
                label="Chọn sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn sản phẩm...",
                  },
                ]}
              >
                <Select
                  disabled={true}
                  placeholder="Chọn sản phẩm..."
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeProduct}
                  options={listProduct.map((item) => {
                    return {
                      value: item.id,
                      label: item.productName,
                    };
                  })
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
              name="price"
              label="Giá bán"
              rules={[
                {
                  required: true,
                  message: "Nhập giá bán...",
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
                placeholder="Nhập giá bán..."
              />
            </Form.Item>
          </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default ModelDetailCustomer;
