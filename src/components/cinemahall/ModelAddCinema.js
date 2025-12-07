import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Upload,
} from "antd";

import { notifyError,
  notifySucess
} from "../../utils/Notifi";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";


import { PlusOutlined } from "@ant-design/icons";

import openAddressApi from "../../api/openApi";
import cinameApi from "../../api/cinemaApi";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const { Option } = Select;

const ModelAddCinema = ({ showModalAddCustomer, setShowModalAddCustomer }) => {
 // const handleCancel = () => setPreviewOpen(false);
  const [form] = Form.useForm();

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const [province, setProvince] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provincePicked, setProvincePicked] = useState(0);
  const [districtPicked, setDistrictPicked] = useState(0);
  const [wardPicked, setWardPicked] = useState(0);

  const onChangeProvince = (value) => {
    setProvincePicked(value.value);
  };
  const onChangeDistrict = (value) => {
    console.log(`selected ${value}`);
    setDistrictPicked(value.value);
  };

  const onChangeWard = (value) => {
    console.log(`selected ${value}`);
    setWardPicked(value.value);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await openAddressApi.getList("/p");
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
      //console.log("run");
      const fetchConversations = async (id) => {
        try {
          const response = await openAddressApi.getList(`/p/${id}?depth=2`);
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

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalAddCustomer(false);
  };

  //handle submit form create new customer...
  const handleSubmit = async (val) => {
    const street = val?.street ? val.street + "/" : "";
    const ward = val?.ward ? val.ward.label + "/" : "";
    const district = val?.district ? val.district.label + "/" : "";
    const province = val?.province ? val.province.label : "";
    const address = street + ward + district + province;

    const payload = {
      name: val.name,
      codeCinema: val.codeCinema,
      city_id: val.province.value,
      district_id: val.district.value,
      ward_id: val.ward.value,
      street: val?.street,
      address
    };
    
    try {
      const response = await cinameApi.create(payload);
      if (response) {
        notifySucess("Tạo Rạp thành công");
        onClose();
        depatch(setReload(!reload));
      }
    } catch (error) {
      console.log("Failed to fetch product list: ", error);
      notifyError("Tạo rạp thất bại! Lỗi: " + error?.response?.data?.message );
    }
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    console.log(dateString);
  };

  //choise date start worling
  const onChangeEndDate = (date, dateString) => {
    console.log(dateString);
  };

  useEffect(() => {
    form.setFieldsValue({
      namePromotion: "",
      desc: "",
    });
  }, []);
  return (
    <>
      <Drawer
        title="Tạo rạp"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>

            <Button form="myFormCinema" htmlType="submit" type="primary">
              Thêm
            </Button>
          </Space>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          id="myFormCinema"
          form={form}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="codeCinema"
                label="Mã rạp"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mã rạp tối đa 5 ký tự...",
                  },
                ]}
              >
                <Input
                  placeholder="Hãy nhập mã rạp tối đa 5 ký tự..."
                  addonBefore="CIN"
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
              <Form.Item name="name" label="Tên rạp"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên rạp...",
                  },
                ]}
              >
                <Input placeholder="Hãy nhập tên rạp..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="province" label="Tỉnh thành"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn tỉnh thành...",
                  },
                ]}
              >
                <Select
                  showSearch
                  labelInValue
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
                  options={province}
                  
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="district" label="Quận huyện"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn quận huyện...",
                  },
                ]}
              >
                <Select
                  showSearch
                  labelInValue
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
                  options={districts}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="ward" label="Xã phường"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn phường xã...",
                  },
                ]}
              >
                <Select
                  showSearch
                  labelInValue
                  placeholder="Chọn phường/xã"
                  optionFilterProp="children"
                  onChange={onChangeWard}
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
            <Col span={12}>
              <Form.Item name="street" label="Địa chỉ">
                <Input placeholder="Hãy nhập địa chỉ..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default ModelAddCinema;
