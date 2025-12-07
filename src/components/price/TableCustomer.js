import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Modal,
  Tag,
  Image,
  Alert,
  Space,
  message,
  Badge,
} from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  ReloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import customerApi from "../../api/customerApi";
import ModelAddCustomer from "./ModelAddCustomer";
import ModelDetailCustomer from "./ModelCustomerDetail";
import ModelPriceView from "./ModelPriceView";
import openAddressApi from "../../api/openApi";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import priceApi from "../../api/priceApi";
import moment from "moment";

const TableCustomer = ({ setTab, setSelectedIdHeader,startDatePicker,endDatePicker }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listCustomer, setListCustomer] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [showModalDetailCustomer, setShowModalDetailCustomer] = useState(false);
  const [showModalPriceView, setShowModalPriceView] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const currentDay = moment().format("YYYY-MM-DD");


  const showModalDetail = (e) => {
    setTab(1);
    setSelectedIdHeader(e);
  };

  const showModalPriceViewDetail = (e) => {
    setShowModalPriceView(true);
    setSelectedId(e);
  };

  const columns = [
    {
      title: "Mã bảng giá",
      dataIndex: "priceCode",
      render: (val, recod) => {
        return (
          <a
            onClick={() => {
              showModalDetail(recod.id);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: "Tên bảng giá",
      dataIndex: "name",
      
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
      dataIndex: "status",
      render: (status) => {
        let color;
        let name;
        if (status === 1) {
          color = "success";
          name = "Hoạt động";
        } else if (status === 0) {
          color = "error";
          name = "Ngưng hoạt động";
        }
        return <Badge status={color} text={name} />;
      },
    },
    {
      dataIndex: "id",
      align: "center",
      render: (val,record) => {
        return (
          <Space size="middle">
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                showModalPriceViewDetail(val);
              }}
            ></Button>
            <Button
              disabled={ currentDay >= moment(record.startDate).format("YYYY-MM-DD") || record.status === 1 ? true : false }
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

  useEffect(() => {
    //get list customer in here
    const fetchListCustomer = async () => {
      try {
        const data = await priceApi.getPriceHeader({
          startDate: startDatePicker,
          endDate: endDatePicker,
        });
        setListCustomer(data);
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchListCustomer();
  }, [reload,startDatePicker,endDatePicker]);

  const handleShowDetail = (val) => {
    console.log(val);
  };

  //handle delete customer in here...
  const handleDelete = () => {
    showModal();
  };

  const handleRefresh = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
      setRefreshKey((oldKey) => oldKey + 1);
      message.success("Tải lại thành công");
    }, 1000);
  };

  //handle update customer in here ....
  const handleUpdate = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 500);
  };

  //model
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    const fetchDeleteCustomer = async () => {
      try {
        console.log(selectedId);
        const response = await priceApi.delete(selectedId)
        if (response) {
          depatch(setReload(!reload));
          message.success("Xóa thành công");
        } else {
          message.success("Xóa thất bại");
        }
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchDeleteCustomer();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      ></div>
      <Table columns={columns} dataSource={listCustomer} />
      <Modal
        title="Xóa bảng giá"
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
        <p>Bạn muốn xóa bảng giá này không?</p>
      </Modal>
      {showModalDetailCustomer ? (
        <ModelDetailCustomer
          showModalDetailCustomer={showModalDetailCustomer}
          setShowModalDetailCustomer={setShowModalDetailCustomer}
          selectedId={selectedId}
        />
      ) : null}

      {showModalPriceView ? (
        <ModelPriceView
          showModalPriceView={showModalPriceView}
          setShowModalPriceView={setShowModalPriceView}
          selectedId={selectedId}
        />
      ) : null}
    </div>
  );
};
export default TableCustomer;
