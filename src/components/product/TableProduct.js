import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Tag, Image, Alert, Space, message, Select } from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import productApi from "../../api/productApi";
import ModelDetailProduct from "./ModelProductDetail";
import openAddressApi from "../../api/openApi";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import { useRoleHook } from "../../utils/useRoleHook.js";

const TableProduct = ({keyword}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listProduct, setListProduct] = useState([]);
  const [selectedId, setSelectedId] = useState([]);
  const [showModalDetailProduct, setShowModalDetailProduct] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [idPick, setIdPick] = useState(0);
  const {isEmployee} = useRoleHook()

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const showModalDetail = (e) => {
    setShowModalDetailProduct(true);
    setSelectedId(e);
  };

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   width: "5%",
      
    // },
    {
      title: "Mã sản phẩm",
      dataIndex: "productCode",
      // width: "10%",
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
      title: "Thể loại",
      dataIndex: "type",
      // width: "10%",
      render: (type) => {
        let name = "";
        if (type === "SP") {
          name = "Sản phẩm";
        } else if (type === "Ghe") {
          name = "Ghế";
        }
        return name;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      // width: "30%",

    },
    {
      title: "Mô tả",
      dataIndex: "desc",
      // width: "30%",

    },
    {
      
      render: (val,record) => {
        if(isEmployee) return null
        return (
          <Button
          danger
            disabled={record.type === "Ghe" ? true : false}
            icon={<DeleteOutlined />}
            onClick={()=>{
              setIdPick(record.id)
              handleDelete()
            }}
          >
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    //get list customer in here
    const fetchListCustomer = async () => {
      try {
        const response = await productApi.getProducts(keyword);

        if (response) {
          const data = response.map((item) => {
            
            return {
              ...item,
              key: item.id,
            };
          });
          const newList = data.filter((item) => item.type === "SP");
          setListProduct(newList.reverse());
        }
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchListCustomer();
  }, [reload,keyword]);

  const onSelectChange = (selectedId) => {
    setSelectedRowKeys(selectedId);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  const selectedOne = selectedRowKeys.length === 1;

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
    const fetchDeleteProduct = async () => {
      try {
        const response = await productApi.deleteProduct(idPick);
        if (response == 1) {
          depatch(setReload(!reload));
          message.success("Xóa thành công");

        } else {
            message.success("Xóa thất bại");
        }
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchDeleteProduct();
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
      >
      </div>
      <Table
        columns={columns}
        dataSource={listProduct}
      />
      <Modal
        title="Xóa sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Hủy
          </Button>,
          <Button key="submit" danger type="primary" onClick={handleOk}>
            Xóa
          </Button>,
        ]}
      >
        <p>Bạn muốn xóa sản phẩm không?</p>
      </Modal>
      {showModalDetailProduct ? (
        <ModelDetailProduct
          showModalDetailProduct={showModalDetailProduct}
          setShowModalDetailProduct={setShowModalDetailProduct}
          selectedId={selectedId}
        />
      ) : null}
    </div>
  );
};
export default TableProduct;
