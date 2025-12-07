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
} from "antd";
import openAddressApi from "../../api/openApi";
import productApi from "../../api/productApi";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";

const { Option } = Select;

const ModelDetailCustomer = ({
  showModalDetailProduct,
  setShowModalDetailProduct,
  selectedId,
}) => {
  const [productInfo, setProductInfo] = useState({});
  const [form] = Form.useForm();
  const [image, setImage] = useState("");
  const [type, setType] = useState("");
  const [typeHall, setTypeHall] = useState("");
  const [imagePicker, setImagePicker] = useState([]);

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onChangeType = (value) => {
    setType(value);
  };

  const onChangeHall  = (value) => {
    setTypeHall(value);
  };

  const onClose = () => {
    setShowModalDetailProduct(false);
  };

  const handleSubmit = async (val) => {
    console.log("submit", val);
    
    const { id, productCode, productName, type, desc, image } = val;
    const data = new FormData();
    data.append("productCode", productCode);
    data.append("productName", productName);
    data.append("type", type);
    data.append("desc", desc);
    if (imagePicker) {
      if (imagePicker.length === 0){
        console.log("image no");
      } else {
        data.append("image", image[0].originFileObj);
      }
    } else {
      data.append("image", image);
    }

    try {
      const res = await productApi.updateProduct(id, data);
      if (res) {
        console.log("res", res);
        onClose();
        depatch(setReload(!reload));
        message.success("Cập nhật thành công");
      }
    } catch (error) {
      console.log(error);
      message.error("Cập nhật thất bại", error);
    }
  };

  useEffect(() => {
    const fetchProductInfo = async (id) => {
      try {
        const response = await productApi.getProductById(id);

        if (response) {
          console.log("res", response);
          setImage(response.image);
          setType(response.type);
          setTypeHall(response.typeHall);
          form.setFieldsValue({
            ...response,
            image: [
              {
                uid: "rc-upload-1681828335338-25",
                name: response.image,
                status: "done",
                url: response.image,
              },
            ],
          });
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    console.log("selectedId", selectedId);
    fetchProductInfo(selectedId);
  }, []);
  // rc-upload-1681828335338-18


  const dummyRequest = ({ file, onSuccess }) => {
    setImage(file);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  return (
    <>
      <Drawer
        title="Thông tin khách hàng"
        width={720}
        onClose={onClose}
        open={showModalDetailProduct}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button form="myForm" htmlType="submit" type="primary">
              Cập nhật
            </Button>
          </Space>
        }
      >
        <Form form={form} onFinish={handleSubmit} id="myForm" layout="vertical">
          <Row gutter={16}>
          <Col span={12}>
              <Form.Item name="productCode" label="Mã sản phẩm">
                <Input disabled={true}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="type" label="Loại sản phẩm">
                <Select
                  disabled={true}
                  placeholder="Chọn loại sản phẩm"
                  style={{
                    width: "100%",
                  }}
                  
                  onChange={onChangeType}
                  options={[
                    {
                      value: "Ghe",
                      label: "Ghế",
                    },
                    {
                      value: "SP",
                      label: "Sản phẩm",
                    },
                    {
                      value: "CB",
                      label: "Combo",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
              <Form.Item name="productName" label="Tên sản phẩm">
                <Input />
              </Form.Item>
            </Col>
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
                  onChange={(e) => {
                    setImagePicker(e.fileList[0]);
                  }
                  }
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
            
            {/* <Col span={12}></Col> */}
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
export default ModelDetailCustomer;
