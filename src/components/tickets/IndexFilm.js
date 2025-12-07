import React, { useState, Component } from "react";
import {
  Input,
  Col,
  Row,
  Typography,
  Button,
  Modal,
  Breadcrumb,
  DatePicker,
} from "antd";
import QrReader from "react-qr-scanner";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  DownloadOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import TableCustomer from "../customer/TableCustomer";
import ModelAddCustomer from "../customer/ModelAddCustomer";
import TableFilms from "./TableFilms";
import ModelAddFilm from "./ModelAddFilm";

const { Title, Text } = Typography;
const IndexTicket = () => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const { RangePicker } = DatePicker;
  const [startDatePicker, setStartDatePicker] = useState("");
  const [endDatePicker, setEndDatePicker] = useState("");
  const [idScan, setIdScan] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delayScan, setDelayScan] = useState(500);
  const [isScan, setIsScan] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsScan(false);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 50);
  };

  const onChangeDate = (date, dateString) => {
    setStartDatePicker(dateString[0]);
    setEndDatePicker(dateString[1]);
  };

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem", marginTop:"1rem" }}>
        Vé đã đặt
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={10}>
          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            onCalendarChange={onChangeDate}
            style={{ minWidth: "100%" }}
            allowClear={true}
          />
        </Col>
        <Col span={2}>
          <Button
            title="Scan QR Vé"
            icon={<QrcodeOutlined />}
            onClick={() => {
              showModal();
              setIsScan(true);
            }}
          ></Button>
        </Col>
      </Row>

      <Row
        style={{ margin: "1rem 0 1rem 0" }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={24}>
          <TableFilms
            start_date={startDatePicker}
            end_date={endDatePicker}
            idScan={idScan}
          />
        </Col>
      </Row>
      <Modal
        title="Scan QR Vé"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
        ]}
      >
        {isScan && (
          <>
            <QrReader
              delay={delayScan}
              style={{ width: "100%" }}
              onError={(err) => console.log(err)}
              onScan={(data) => {
                if (data) {
                  setDelayScan(false);
                  setIdScan(Number(data.text));
                  handleCancel();
                }
              }}
            />
          </>
        )}
      </Modal>

      {showModalAddCustomer ? (
        <ModelAddFilm
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
        />
      ) : null}
    </div>
  );
};
export default IndexTicket;
