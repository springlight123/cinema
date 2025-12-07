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
import cinameApi from "../../api/cinemaApi";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import { notifyError, notifySucess } from "../../utils/Notifi";

const ModelDetailCinema = ({
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
  const [form] = Form.useForm();
  const [addressDb, setAddressDb] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [wardName, setWardName] = useState("");

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const onChangeProvince = (value) => {
    setProvincePicked(value.value);
    setProvinceName(value.label);
    form.setFieldsValue({
      district: "",
      ward: "",
    });
    setDistricts("");
    setWards("");
  };
  const onChangeDistrict = (value) => {
    setDistrictPicked(value.value);
    setDistrictName(value.label);
    setWards("");
    form.setFieldsValue({
      ward: "",
    });
  };

  const onChangeWard = (value) => {
    setWardPicked(value.value);
    setWardName(value.label);
  };

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalDetailCustomer(false);
  };

  const handleSubmit = async (val) => {
    console.log("submit", val);
    const street = val?.street ? val.street + "/" : "";
    const ward = wardName + "/";
    const district = districtName + "/";
    const province = provinceName;
    const address = street + ward + district + province;
    const payload = {
      codeCinema: val.codeCinema,
      status: val.status,
      name: val.name,
      city_id: val.province.value,
      district_id: val.district.value,
      ward_id: val.ward.value,
      street: val.street,
      address: address,
    };
    try {
      const response = await cinameApi.update(selectedId, payload);
      if (response) {
        notifySucess("Cập nhật thành công");
        depatch(setReload(!reload));
        setShowModalDetailCustomer(false);
      }
    } catch (error) {
      notifyError("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    const fetchCinemaInfo = async (id) => {
      try {
        const response = await cinameApi.getCinemaById(id);
        if (response) {
          console.log("res", response);
          setProvincePicked(Number(response.city_id));
          setDistrictPicked(Number(response.district_id));
          setWardPicked(Number(response.ward_id));
          setAddressDb(response.address);
          setProvinceName(response?.address?.split("/")[3]);
          setDistrictName(response?.address?.split("/")[2]);
          setWardName(response?.address?.split("/")[1]);
          form.setFieldsValue({
            id: response.id,
            codeCinema: response.codeCinema,
            status: response.status,
            name: response.name,
            email: response.email,
            province: Number(response.city_id),
            district: Number(response.district_id),
            ward: Number(response.ward_id),
            street: response.street,
          });
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };
    fetchCinemaInfo(selectedId);
  }, []);

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

  return (
    <>
      <Drawer
        title="Thông tin rạp"
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
              <Form.Item name="codeCinema" label="Mã rạp">
                <Input disabled={true} />
              </Form.Item>
            </Col>
            
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên rạp"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên rạp...",
                  },
                ]}
              >
                <Input />
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
                  options={[
                    {
                      value: 1,
                      label: "Hoạt động",
                    },
                    {
                      value: 0,
                      label: "Ngừng hoạt động",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="province"
                label="Tỉnh thành"
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
                  value={provincePicked}
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
              <Form.Item
                name="district"
                label="Quận huyện"
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
                  value={districtPicked}
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
              <Form.Item
                name="ward"
                label="Xã phường"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn phường xã...",
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  placeholder="Chọn phường/xã"
                  optionFilterProp="children"
                  onChange={onChangeWard}
                  onSearch={onSearch}
                  value={wardPicked}
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
export default ModelDetailCinema;
