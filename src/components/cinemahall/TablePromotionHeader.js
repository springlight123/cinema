import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space } from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  FormOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import movieApi from "../../api/movieApi";
import promotionApi from "../../api/promotionApi";
import { setCinemaHall, setPromotionHeader } from "../../redux/actions";
import cinemaHallApi from "../../api/cinemaHallApi";
import { MdOutlineChair } from "react-icons/md";
import { setReload } from "../../redux/actions";
import ModelDetailHall from "./ModelDetailHall";
import { notifySucess, notifyError } from "../../utils/Notifi";

const TablePromotionHeader = ({ setTab, selectedIdCinema, statusDb , keyword}) => {
  const [loading, setLoading] = useState(false);
  const [promotionHeaderList, setPromotionHeaderList] = useState([]);
  const dispatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const [selectedIdHall, setSelectedIdHall] = useState(0);



  const showModalDetail = (e) => {
    setShowModalAddCustomer(true);
    setSelectedIdHall(e);
  };
  
  //handle delete customer in here...
  const handleDelete = () => {
    showModal();
  };

  // //handle show details of promotion header
  // const handeShowDetailsPromotion = () => {
  //   dispatch(setPromotionHeader());
  //   setTab(1);
  // };

  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async() => {
    setIsModalOpen(false);
    try {
      const response = await cinemaHallApi.delete(selectedIdHall);
      if (response) {
        notifySucess("Xóa thành công");
        dispatch(setReload(!reload));
      }
    } catch (error) {
      notifyError("Xóa thất bại");
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    //load
    const getListPromotionHeader = async () => {
      try {
        const response = await cinemaHallApi.getCinemaHalls(selectedIdCinema,keyword);
        if (response) {
          //handle data

          setPromotionHeaderList(response);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    getListPromotionHeader();
  }, [reload, keyword]);

  const handleOnclik = (id) => {
    console.log(id);
    dispatch(setCinemaHall(id));
    setTab(2);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số ghế",
      dataIndex: "totalSeats",
    },
    {
      title: "Loại rạp",
      dataIndex: "type",
    },

    {
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Button
            title="Chỉnh sửa"
            type="default"
            icon={<FormOutlined />}
            onClick={() => {
              showModalDetail(record.id);
            }}
          ></Button>
          <Button
            title="Xem sơ đồ ghế"
            type="default"
            icon={
              <MdOutlineChair
                size={20}
              />
            }
            onClick={()=> handleOnclik(record.id)}
          ></Button>
          <Button
            disabled={statusDb === 1 ? true : false}
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedIdHall(record.id);
              handleDelete();
            }}
            danger
          ></Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={promotionHeaderList} />
      <Modal
        title="Xóa rạp"
        open={isModalOpen}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" danger type="primary" onClick={handleOk}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn muốn xóa rạp này không?</p>
      </Modal>
      {setShowModalAddCustomer ? (
        <ModelDetailHall
        showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
          selectedIdHall={selectedIdHall}
          selectedIdCinema={selectedIdCinema}
        />
      ) : null}
    </div>
  );
};
export default TablePromotionHeader;
