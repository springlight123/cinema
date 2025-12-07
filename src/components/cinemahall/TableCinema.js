import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space, Tag } from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import movieApi from "../../api/movieApi";
import promotionApi from "../../api/promotionApi";
import { setCinemaHall, setPromotionHeader } from "../../redux/actions";
import cinemaHallApi from "../../api/cinemaHallApi";
import cinameApi from "../../api/cinemaApi";
import { BsDoorClosed } from "react-icons/bs";
import { setReload } from "../../redux/actions";
import ModelDetailCinema from "./ModelCinemaDetail";
import { notifySucess } from "../../utils/Notifi";
import { useRoleHook } from "../../utils/useRoleHook.js";


const TableCinema = ({ keyword, setTab, setSelectedIdCinema, setStatusDb }) => {
  const [loading, setLoading] = useState(false);
  const [showModalDetailCustomer, setShowModalDetailCustomer] = useState(false);
  const {isEmployee} = useRoleHook()

  const dispatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const [selectedId, setSelectedId] = useState(0);
  const [listCinema, setListCinema] = useState([]);

  //handle delete customer in here...
  const handleDelete = () => {
    showModal();
  };

  // //handle show details of promotion header
  // const handeShowDetailsPromotion = () => {
  //   dispatch(setPromotionHeader());
  //   setTab(1);
  // };

  const showModalDetail = (e) => {
    setShowModalDetailCustomer(true);
    setSelectedId(e);
  };

  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);

    //handle code for log out in here
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getListCinema = async () => {
      try {
        const response = await cinameApi.getCinemas(keyword);
        if (response) {
          setListCinema(response);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    getListCinema();
  }, [keyword, reload]);

  const handleOnclik = (id) => {
    console.log(id);
    dispatch(setCinemaHall(id));
    setTab(1);
  };

  const handleRote = () => {
    setTab(1);
  }

  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Mã rạp",
      dataIndex: "codeCinema",
      key: "codeCinema",
      render: (val,record) => {
        return (
          <a
            onClick={() => {
              showModalDetail(record.id);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: "Tên rạp",
      dataIndex: "name",
      key: "name",
      // render: (text, record) => (
      //   <a onClick={() => handleOnclik(record.id)}>{text}</a>
      // ),
    },
    {
      title: "Số phòng",
      dataIndex: "countCinemaHall",
      align: "right",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text, record) => {
        let color = "green";
        let text1 = "Hoạt động";
        if (text === 1) {
          color = "green";
          text1 = "Hoạt động";
        } else {
          color = "red";
          text1 = "Ngừng hoạt động";
        }
        return (
          <Tag color={color} key={text}>
            {text1.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      align: "center",
      render: (val, record) => {
        return (
          <>
            <Space size="middle">
              <Button
                title="Xem phòng chiếu"
                type="default"
                icon={<BsDoorClosed />}
                onClick={() => {
                  handleRote();
                  setSelectedIdCinema(record.id);
                  setStatusDb(record.status);
                }}
              >
              </Button>
              {
                isEmployee ? null : 
              <Button
                disabled={record.status === 1 ? true : false}
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSelectedId(record.id);
                  handleDelete();
                }}
                danger
              ></Button>
              }
            </Space>
          </>
        );
      },
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={listCinema} />
      <Modal
        title="Xóa rạp"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button
            danger
            type="primary"
            loading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const response = await cinameApi.delete(selectedId);
                if (response) {
                  dispatch(setReload());
                  setLoading(false);
                  setIsModalOpen(false);
                  notifySucess("Xóa rạp thành công")
                }
              } catch (error) {
                console.log("Failed to login ", error);
              }
            }}
          >
            Xóa
          </Button>
        ]}
      >
        <p>Bạn muốn xóa rạp này không?</p>
      </Modal>
      {showModalDetailCustomer ? (
        <ModelDetailCinema
          showModalDetailCustomer={showModalDetailCustomer}
          setShowModalDetailCustomer={setShowModalDetailCustomer}
          selectedId={selectedId}
        />
      ) : null}
    </div>
  );
};
export default TableCinema;
