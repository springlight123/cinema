import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
  Table,
  InputNumber
} from "antd";

import productApi from "../../api/productApi";
import moment from "moment";
import { setReload } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

const { Option } = Select;

const ModelAddProduct = ({
  showModalAddProduct,
  setShowModalAddProduct,
}) => {
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const [form] = Form.useForm();
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [typeHall, setTypeHall] = useState("");

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productCode",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
    }
  ];

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onChangeType = (value) => {
    setType(value);
    setTypeHall("");
    if(type){
      form.setFieldsValue({
        typeHall: "",
      });
    }
  };

  const onChangeHall  = (value) => {
    setTypeHall(value);
    if(type === "SP"){
      form.setFieldsValue({
        typeHall: "",
      });
    }
  };

  const onClose = () => {
    setShowModalAddProduct(false);
  };

  const handleSubmit = async (val) => {
    console.log("submit", val);
    const { productName, productCode, type, typeHall,desc,image } = val;
    console.log("name", productCode.valueAsNumber);

    const data = new FormData();
    data.append("type", "SP");
    data.append("productCode", productCode? productCode : "");
    data.append("productName", productName ? productName : "");
    data.append("typeHall", typeHall ? typeHall : "");
    data.append("desc", desc ? desc : "");
    if (image) {
      data.append("image", image[0].originFileObj ? image[0].originFileObj : "");
    }
    try {
      const response = await productApi.createProduct(data);
      console.log(response);
      if (response) {
        onClose();
        depatch(setReload(!reload));
        form.resetFields();
          message.success("Thêm sản phẩm thành công!");
      }
    } catch (error) {
      console.log(error);
      message.error("Mã sản phẩm đã tồn tại!");
    }
  };




  const dummyRequest = ({ file, onSuccess }) => {
    setImage(file);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  

  return (
    <>
      <Drawer
        title="Thêm sản phảm"
        width={720}
        onClose={onClose}
        open={showModalAddProduct}
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
            <Col span={12}>
              <Form.Item name="productCode" label="Mã sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mã sản phẩm",
                  },
                ]}
              >
                <Input placeholder="Hãy nhập mã sản phẩm" 
                  addonBefore="PRD"
                  min={1}
                  maxLength={5}
                  showCount
                  style={{ width: "100%"}}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="productName" label="Tên sản phẩm"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên sản phẩm",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            
            <Col span={12}>
            <Form.Item
                name="image"
                label="Hình ảnh"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="Chỉ chấp nhận file ảnh"
                type="file"
              >
                <Upload
                  name="image"
                  customRequest={dummyRequest}
                  listType="picture"
                  maxCount={1}
                  accept=".jpg,.jpeg,.png"
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <Row  gutter={16}>
            <Col span={24}>
              <Form.Item name="desc" label="Mô tả">
                <Input.TextArea rows={4} placeholder="Nhập mô tả..." />
              </Form.Item>
            </Col>
          </Row>
          
        </Form>
      </Drawer>
    </>
  );
};
export default ModelAddProduct;
