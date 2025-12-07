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
import customerApi from "../../api/customerApi";
import moment from "moment";
import dayjs from "dayjs";
import { setReload } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";


const { Option } = Select;

const ModelDetailCustomer = ({
  showModalDetailCustomer,
  setShowModalDetailCustomer,
  selectedId,
}) => {
  const [province, setProvince] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provincePicked, setProvincePicked] = useState(0);
  const [districtPicked, setDistrictPicked] = useState(0);
  const [wardPicked, setWardPicked] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({});
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [image, setImage] = useState("");

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onChangeProvince = (value) => {
    console.log(`selected ${value}`);
    setProvincePicked(value);
  };
  const onChangeDistrict = (value) => {
    console.log(`selected ${value}`);
    setDistrictPicked(value);
  };

  const onChangeWard = (value) => {
    console.log(`selected ${value}`);
    setWardPicked(value);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalDetailCustomer(false);
  };

  const handleSubmit = async (val) => {
    console.log("submit", val);
    const { id, firstName, lastname, phone, email, address, dob, note, image } =
      val;
    const data = new FormData();
    data.append("firstName", firstName);
    data.append("lastName", lastname);
    data.append("phone", phone);
    // data.append("dob", dob);
    // data.append("note", note);
    if ( provincePicked !== 0  || districtPicked !== 0 || wardPicked !== 0 || address || email ) {
      data.append("city_id", provincePicked  );
      data.append("district_id", districtPicked   );
      data.append("ward_id", wardPicked   );
      data.append("address", address);
      data.append("street", address);
      data.append("email", email );


    }
    if ( image.length > 0 && image[0].uid !== "-1"  ) {
      console.log(image[0].originFileObj);
      data.append("image", image[0].originFileObj);
    } 
    if (image.length === 0) {
      data.append("image", image);
    }

    try {
      const response = await customerApi.updateCustomer(id, data);
      console.log(response);
      if (response) {
        onClose();
          message.success("Cập nhật thành công");
        depatch(setReload(!reload));
      }
    } catch (error) {
      const err_mess = error.response.data.message;
      message.error("Cập nhật thất bại: " + err_mess + " ");

    }
  };

  useEffect(() => {
    const fetchCustomerInfo = async (id) => {
      try {
        const response = await customerApi.getCustomer(id);

        if (response) {
          console.log("res", response);
          setCustomerInfo(response);
          setProvincePicked(Number(response.city_id));
          setDistrictPicked(Number(response.district_id));
          setWardPicked(Number(response.ward_id));
          setImage(response.image);
          console.log("file", response.image);

          form.setFieldsValue({
            id: response.id,
            code: response.code,
            firstName: response.firstName,
            lastname: response.lastName,
            phone: response.phone,
            email: response.email ? response.email : undefined,
            dob: response.dob ? dayjs(response?.dob, "YYYY-MM-DD") : undefined,
            address: response.address ? response.address : undefined,
            province: response.province ? response.province : undefined,
            district: response.district ? response.district : undefined,
            ward: response.ward ? response.ward : undefined,
            image: [
              {
                uid: "-1",
                name: response.image,
                status: "done",
                url: response?.image,
              },
            ],
          });
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    fetchCustomerInfo(selectedId);
  }, []);
  console.log("customerInfo", customerInfo);
  console.log("fileList", fileList);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await openAddressApi.getList("/p");

        //console.log(response);
        if (response) {
          const newResponse = response.map((val) => {
            return {
              value: val.code,
              label: val.name,
            };
          });
          setProvince(newResponse);
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (provincePicked !== 0) {
      console.log("run");
      const fetchConversations = async (id) => {
        try {
          const response = await openAddressApi.getList(`/p/${id}?depth=2`);

          console.log(response);
          if (response) {
            const { districts } = response;
            const newDistricts = districts.map((val) => {
              return {
                value: val.code,
                label: val.name,
              };
            });
            setDistricts(newDistricts);
          }
        } catch (error) {
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      fetchConversations(provincePicked);
    }
  }, [provincePicked]);

  useEffect(() => {
    if (districtPicked !== 0) {
      const fetchConversations = async (id) => {
        try {
          const response = await openAddressApi.getList(`/d/${id}?depth=2`);

          console.log(response);
          if (response) {
            const { wards } = response;
            const newWards = wards.map((val) => {
              return {
                value: val.code,
                label: val.name,
              };
            });
            setWards(newWards);
          }
        } catch (error) {
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      fetchConversations(districtPicked);
    }
  }, [districtPicked]);

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
        open={showModalDetailCustomer}
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
              <Form.Item name="id" label="ID" hidden={true}>
                <Input />
              </Form.Item>
              <Form.Item name="code" label="Mã khách hàng">
                <Input disabled={true} />
              </Form.Item>
            </Col>

            <Col span={12}></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" label="Họ"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập họ",
                },
              ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastname" label="Tên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên",
                },
              ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}></Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại",
                },
              ]}
              >
                <Input 
                maxLength={10}
                showCount
                onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="email" label="Email">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Select
                showSearch
                placeholder="Chọn tỉnh thành"
                optionFilterProp="children"
                value={provincePicked === 0 ? undefined : provincePicked}
                onChange={onChangeProvince}
                onSearch={onSearch}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={province}
              />
            </Col>
            <Col span={12}>
              <Select
                showSearch
                placeholder="Chọn quận huyện"
                optionFilterProp="children"
                onChange={onChangeDistrict}
                onSearch={onSearch}
                value={districtPicked === 0 ? undefined : districtPicked}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={districts}
              />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "24px" }}>
            <Col span={12}>
              <Select
                showSearch
                placeholder="Chọn phường/xã"
                optionFilterProp="children"
                onChange={onChangeWard}
                value={wardPicked === 0 ? undefined : wardPicked}
                onSearch={onSearch}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={wards}
              />
            </Col>
            <Col span={12}>
              <Form.Item name="address">
                <Input
                  style={{
                    width: "100%",
                  }}
                  placeholder="Nhập địa chỉ khách hàng..."
                />
              </Form.Item>
            </Col>
            {/* <Col span={12}>
              <Form.Item name="dob" label="Ngày sinh" >
                <DatePicker
                  placeholder="Chọn ngày sinh"
                  // value={moment(customerInfo?.dob)}
                  style={{
                    width: "100%",
                  }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col> */}
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
            <Col span={12}></Col>
          </Row>

          {/* <Row style={{ marginTop: "16px" }} gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="Ghi chú">
                <Input.TextArea rows={4} placeholder="Nhập ghi chú..." />
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Drawer>
    </>
  );
};
export default ModelDetailCustomer;
