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

import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
// import ProductPromotion from "./ProductPromotion";
// import MoneyPromotion from "./MoneyPromotion";
// import PercentPromotion from "./PercentPromotion";
import priceApi from "../../api/priceApi";
import moment from "moment";
import productApi from "../../api/productApi";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";

const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ModelAddPromoLine = ({
  showModalAddCustomer,
  setShowModalAddCustomer,
  selectedIdHeader,
}) => {

  const [form] = Form.useForm();
  const [priceHeader, setPriceHeader] = useState({});
  const [listProduct, setListProduct] = useState([]);
  const [productSelected, setProductSelected] = useState(0);
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);


  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalAddCustomer(false);
  };

  //handle submit form create new customer...
  const handleSubmit = (val) => {
    console.log("values:", val);
    //write code in here...
    const data = {
      price: val.price,
      idProduct: val.product,
      idPriceHeader: val.id,
    };
    const fetchAddPromoLine = async () => {
      try {
        const res = await priceApi.addPriceLine(data);
        if (res.status === 200) {
          message.success("Thêm thành công");
          depatch(setReload(!reload));
          onClose();
        }
      } catch (error) {
        console.log('err',error);
        const {data} = error.response;
        let messageError ;
        if(data.status === 409){
          messageError 
          = `Thêm thất bại: Sản phẩm đang được áp dụng cho bảng giá:
           Mã: ${data.data[0].PriceHeader.id} - Tên: ${data.data[0].PriceHeader.name} - Ngày kết thúc: ${data.data[0].PriceHeader.endDate}`
        }
        if(data.status === 400){
          messageError 
          = `Thêm thất bại: Sản phẩm đã tồn tại trong bảng giá`
        }
        console.log('messageError',messageError);
        message.error(messageError, 7);
      }
    };

    fetchAddPromoLine();
  };

  const onChangeProduct = (value) => {
    setProductSelected(value);
  };



  useEffect(() => {
    const fetchDetailPriceHeader = async () => {
      const res = await priceApi.getPriceHeaderById(selectedIdHeader);
      const data = {
        priceHeaderId: res.priceCode,
        startDate: moment(res.startDate),
        endDate: moment(res.endDate),
        id: res.id,
      }
      form.setFieldsValue(data);
    };

    const fetchListProduct = async () => {
      const res = await productApi.getProducts("");
      setListProduct(res);
    };

    fetchListProduct();
    fetchDetailPriceHeader();
  }, []);

  return (
    <>
      <Drawer
        title="Thêm Sản phẩm vào bảng giá"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button  form="myFormLine" htmlType="submit" type="primary">
              Thêm
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          onFinish={handleSubmit}
          id="myFormLine"
        layout="vertical">
          <Row gutter={16}>
            <Form.Item name="id" hidden={true}>
              <Input />
            </Form.Item>
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
        {/* <RenderType /> */}
      </Drawer>
    </>
  );
};
export default ModelAddPromoLine;
