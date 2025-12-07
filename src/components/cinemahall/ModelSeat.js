
import React, { useEffect, useState } from "react";
import {
  Input,
  Col,
  Row,
  Typography,
  Button,
  Modal,
  Breadcrumb,
  DatePicker,
  Select,
  Form
} from "antd";
import "./IndexRoomMap.scss";
import cinemaHallApi from "../../api/cinemaHallApi";
import { MESSAGE_UPDATE_SEAT_SUCCESS } from "../../constant";
import { notifySucess } from "../../utils/Notifi";

const ModelSeat = ({possition, seat, handleLogic }) => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [statusSeatState, setStatusSeatState] = useState(null)
  const [statusState, setStatusState] = useState(1)

  const handleOk = () => {
    const update = async (id, data) => {
      try {
        const response = await cinemaHallApi.updateSeat(
          id, data
        );
        if (response) {
          setStatusSeatState(null)
          setStatusState(null)
          notifySucess(MESSAGE_UPDATE_SEAT_SUCCESS)
          handleLogic();
        }
      } catch (error) {
        console.log("Featch erro: ", error);
      }
    };
    update(seat.id, {statusSeat: statusSeatState});
  };

  const handleCancel = () => {
    handleLogic()
  };

  const handleChange = (value) => {
    setStatusSeatState(value)
  };

  const handleChangeStatusSeat = (value) => {

    setStatusSeatState(value)
  };
  
  useEffect(()=>{
    setStatusSeatState(seat?.statusSeat);
    
  },[])
 
  return (
      <Modal
        title="Thông tin ghế"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} id="myForm" layout="vertical">

        <Row style={{ marginBottom: "16px" }}>
          <Col span={4}>Vị trí:</Col>
          <Col span={20}>{possition}</Col>
        </Row>
        <Row >
          <Col span={4}>Trạng thái:</Col>
          <Col span={20}>      
          <Form.Item
          name="status"
          rules={[
            {
              required: true,
            },
          ]}
        >
         {
          !seat.statusSeat ? 
          <Select
             placeholder="Trạng thái"
             onChange={handleChangeStatusSeat}
             name="statusSeat"
             style={{
               width: "100%",
             }}
             defaultValue={{
              value: "0",
              label: "Sẵn sàng",
            }}
             options={[
               {
                 value: "0",
                 label: "Sẵn sàng",
               },
               {
                 value: "1",
                 label: "Bảo trì",
               },
             ]}
           /> : 
           <Select
             placeholder="Trạng thái"
             onChange={handleChangeStatusSeat}
             name="statusSeat"
             style={{
               width: "100%",
             }}
             defaultValue={{
              value: "1",
              label: "Bảo trì",
            }}
             options={[
               {
                 value: "0",
                 label: "Sẵn sàng",
               },
               {
                 value: "1",
                 label: "Bảo trì",
               },
             ]}
           /> 
         }
          </Form.Item>     
          </Col>
        </Row>
        <Row>
          <Col span={4}>Loại ghế:</Col>
          <Col span={20}>
          <Form.Item
          name="statusSeatok"
          rules={[
            {
              required: true,
            },
          ]}
        >
          {
            seat?.idProduct !== 1 ? 
            <Select
            disabled
            placeholder="Loại ghế"
            onChange={handleChangeStatusSeat}
            name="statusSeat"
            defaultValue={{
              value: "true",
              label: "Ghế đôi",
            }}
              style={{
                width: "100%",
              }}
              options={[
                {
                  value: "false",
                  label: "Ghế đơn",
                },
                {
                  value: "true",
                  label: "Ghế đôi",
                },
              ]}
            />  : 
            <Select
            disabled
            placeholder="Loại ghế"
            onChange={handleChangeStatusSeat}
            name="statusSeatOk"
            defaultValue={{
              value: "false",
                  label: "Ghế đơn",
            }}
              style={{
                width: "100%",
              }}
              options={[
                {
                  value: "false",
                  label: "Ghế đơn",
                },
                {
                  value: "true",
                  label: "Ghế đôi",
                },
              ]}
            /> 
          }

        </Form.Item>
          </Col>
        </Row>
        </Form>
      </Modal>

  );
};
export default ModelSeat;
