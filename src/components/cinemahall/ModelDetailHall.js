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

import { PlusOutlined } from "@ant-design/icons";
import promotionApi from "../../api/promotionApi";
import cinameApi from "../../api/cinemaApi";

import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import { notifyError,
  notifySucess
} from "../../utils/Notifi";
import cinemaHallApi from "../../api/cinemaHallApi";

const ModelDetailHall = ({
  showModalAddCustomer,
  setShowModalAddCustomer,
  selectedIdHall,
  selectedIdCinema,
}) => {
 // const handleCancel = () => setPreviewOpen(false);
  const [form] = Form.useForm();
  const [cinemaInfo, setCinemaInfo] = useState({});

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);


  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalAddCustomer(false);
  };


  useEffect(() => {
    const fetchCinemaInfo = async () => {
      try {
        const response = await cinameApi.getCinemaById(selectedIdCinema);
        if (response) {
          setCinemaInfo(response);
          form.setFieldsValue({
            nameCinema: response.name,
          });
        }
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    const fetchCinemaHallInfo = async () => {
      try {
        const response = await cinemaHallApi.getById(selectedIdHall);
        if (response) {
          form.setFieldsValue({
            name: response.name,
            type: response.type,
            totalSeats: response.totalSeats,
          });
        }
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };

    fetchCinemaHallInfo();
    fetchCinemaInfo();
  }, [selectedIdHall, selectedIdCinema]);

  //handle submit form create new customer...
  const handleSubmit = async (val) => {
    delete val.nameCinema;
    try {
      const response = await cinemaHallApi.update(selectedIdHall, val);
      if (response) {
        notifySucess("Cập nhật thành công!");
        depatch(setReload(!reload));
        onClose();
      }
    } catch (error) {
      notifyError("Cập nhật thất bại!");
      console.log("Failed to fetch product list: ", error);
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
        title="Chỉnh sửa phòng chiếu"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
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
        <Form layout="vertical" onFinish={handleSubmit} id="myForm" form={form}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="nameCinema" label="Chi nhánh">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên phòng chiếu"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên phòng chiếu...",
                  },
                ]}
              >
                <Input placeholder="Hãy nhập tên phòng chiếu..." />
              </Form.Item>
            </Col>
          </Row>

          <Row style={{ marginBottom: "26px" }} gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại phòng"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn loại phòng...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn loại phòng"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangePosition}
                  options={[
                    {
                      value: "2D",
                      label: "Phòng 2D",
                    },
                    {
                      value: "3D",
                      label: "Phòng 3D",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="totalSeats"
                label="Số ghế"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn số ghế...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn số ghế"
                  style={{
                    width: "100%",
                  }}
                  // onChange={handleChangePosition}
                  options={[
                    {
                      value: 81,
                      label: "Big - 81 ghế( 72 - 9 )",  
                    }
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default ModelDetailHall;
