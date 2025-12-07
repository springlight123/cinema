import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Space, Badge, message } from "antd";
import promotionApi from "../../api/promotionApi";
import { setPromotionHeader } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import moment from "moment";
import {
  DeleteOutlined,

} from "@ant-design/icons";

const TablePromotionHeader = ({
  setTab,
  valueStatusPick,
  searchText,
  startDatePicker,
  endDatePicker,
}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promotionHeaderList, setPromotionHeaderList] = useState([]);

  const [promotionHeaderListTmp, setPromotionHeaderListTmp] = useState([]);
  const dispatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const [selectedId, setSelectedId] = useState([]);


  //handle delete customer in here...
  const handleDelete = () => {
    showModal();
  };
  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    const deletePro = async () => {
      try {
        const rs = await promotionApi.delete(selectedId);
        if (rs) {
          message.success("Xóa thành công!");
          dispatch(setReload(!reload));
        } else {
          message.error("Xóa thất bại!");
        }
      } catch (error) {
        message.error("Xóa thất bại!");
        console.log("Failed to fetch product list: ", error);
      }
    };
    deletePro();
    //handle code for log out in here
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    //load
    const getListPromotionHeader = async () => {
      try {
        const response = await promotionApi.getPromotionHeader({
          startDate: startDatePicker,
          endDate: endDatePicker,
        });
        if (response) {
          console.log(response);
          //handle data
          const sortRes = response.sort((a, b) => {
            return moment(b.startDate).diff(a.startDate);
          });
          const newList = sortRes.map((item) => {
            item.startDate = item.startDate.substring(0, 10);
            item.endDate = item.endDate.substring(0, 10);
            item.statusPromotion = item.statusPromotion;
            return item;
          });
          setPromotionHeaderListTmp(newList);
          setPromotionHeaderList(newList);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    getListPromotionHeader();
  }, [reload, startDatePicker, endDatePicker]);

  useEffect(() => {
    if (valueStatusPick === 2) {
      const newArr = promotionHeaderListTmp.filter((val) => {
        return val?.statusPromotion === true;
      });
      setPromotionHeaderList(newArr);
      return;
    } else if (valueStatusPick === 3) {
      const newArr = promotionHeaderListTmp.filter((val) => {
        return val?.statusPromotion === false;
      });
      setPromotionHeaderList(newArr);
      return;
    }
    setPromotionHeaderList(promotionHeaderListTmp);
  }, [valueStatusPick]);

  useEffect(() => {
    if (!searchText) {
      setPromotionHeaderList(promotionHeaderListTmp);
      return;
    }
    const newArr = promotionHeaderListTmp.filter((val) => {
      return (
        val?.promotionCode.toLowerCase().search(searchText.toLowerCase()) !== -1
      );
    });
    setPromotionHeaderList(newArr);
  }, [searchText]);

  const handleOnclik = (id) => {
    dispatch(setPromotionHeader(id));
    setTab(1);
  };
  const currentDay = moment().format("YYYY-MM-DD");

  const columns = [
    {
      title: "Mã CT khuyễn mãi",
      dataIndex: "promotionCode",
      render: (text, record) => (
        <a
          onClick={() => handleOnclik(record.id)}
        >
          {text}
        </a>
      ),
    },
    {
      title: "Tên CT khuyễn mãi",
      dataIndex: "namePromotion",
      key: "name",
      // render: (text, record) => (
      //   <a
      //     style={{ textTransform: "capitalize" }}
      //     onClick={() => handleOnclik(record.id)}
      //   >
      //     {text.toLowerCase()}
      //   </a>
      // ),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "endDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "statusPromotion",
      render: (text) => {
        if (text === 1) {
          return <Badge status="success" text="Hoạt động" />;
        } else {
          return <Badge status="error" text="Ngưng hoạt đông" />;
        }
      },
      filters: [
        {
          text: "Hoạt động",
          value: 1,
        },
        {
          text: "Ngưng hoạt động",
          value: 0,
        }
      ],
      onFilter: (value, record) => record.statusPromotion === value,
    },
    {
      dataIndex: "id",
      align: "center",
      render: (val, record) => {
        return (
          <Space size="middle">
            <Button
              disabled={
                currentDay >= moment(record.startDate).format("YYYY-MM-DD") ||
                record.statusPromotion === 1
                  ? true
                  : false
              }
              icon={<DeleteOutlined />}
              onClick={() => {
                setSelectedId(record.id);
                handleDelete();
              }}
              danger
            ></Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={promotionHeaderList} />
      <Modal
        title="Xóa chương trình khuyến mãi"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" danger onClick={handleOk}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn muốn xóa chương trình khuyến mãi này không?</p>
      </Modal>
    </div>
  );
};
export default TablePromotionHeader;
