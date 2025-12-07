import React, { useEffect,useState } from "react";
import { Button, Table, Modal, Tag, Image, message,Badge } from "antd";
import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import staffApi from "../../api/staffApi";
import openAddressApi from "../../api/openApi";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import roleApi from "../../api/roleApi";
const onClick=(e)=>{
  console.log("evet",e)
}


const TableEmployee = ({searchText}) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listStaff, setListStaff] = useState([]);
  const [staffsTemplate, setStaffsTemplate] = useState([])
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const [selectedId, setSelectedId] = useState([]);

  const showModalDetail = (e) => {
    //setShowModalDetailCustomer(true);
    setSelectedId(e);
  };

  useEffect(() => {
    if(!searchText){
      setListStaff(staffsTemplate);
      return;
    }
    const newArr = listStaff.filter((val) => {
      return val?.name.toLowerCase().search(searchText.toLowerCase()) !== -1
    });
    setListStaff(newArr);
  }, [searchText]);

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
      
    // },
    {
      title: "Mã nhân viên",
      dataIndex: "code",
      render: (val) => {
        return (
          <a
            onClick={() => {
              showModalDetail(val);
            }}
          >
            {val}
          </a>
        );
      },
    },
    {
      title: "Họ và Tên",
      dataIndex: "name",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      render: (position) => {
        let color = "green";
        let roleName ='';
        if (position === "NV") {
          color = "green";
          roleName = "Nhân viên"
        }if (position === "HC") {
          color = "cyan";
          roleName = "Hậu cần"
        }
        if (position === "QL") {
          color = "blue";
          roleName = "Quản lý"
        }
        return (
          <Tag color={color} key={position}>
            {roleName}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        let color = "green";
        let statusName ='';
        if (status === "1") {
          color = "green";
          statusName = "Hoạt động"
        }if (status === "0") {
          color = "red";
          statusName = "Không hoạt động"
        }
        return (
          <Badge text={statusName} color={color}
          />
        );
      },
    },
    // {
    //   title: "Hình ảnh",
    //   dataIndex: "image",
    //   render: (image) => <Image width={30} src={image} />,
    //   width: 50,
    // },
  ];

  useEffect(() => {
    const fetchListStaff = async () => {
      try {
        const response = await staffApi.getStaffs();
        const data = await Promise.all(
          response.map(async(item, index) => {
            const ward = await openAddressApi.getWardByCode(item.ward_id);
            const district = await openAddressApi.getDistrictByCode(
              item.district_id
            );
            const city = await openAddressApi.getProvinceByCode(item.city_id);
            const role = await roleApi.getRoleById(item.position);
            item.ward_id = ward.name;
            item.district_id = district.name;
            item.city_id = city.name;
            item.position = role.nameRole;
            return {
              key: index,
              id: item.id,
              name: `${item.firstName} ${item.lastName}`,
              phone: item.phone,
              gender: item.gender,
              dob: item.dob.substring(0, 10),
              address: ` ${item?.ward_id + " /"} ${item?.district_id + " /"} ${
                item?.city_id
              }`,
              email: item.email,
              position: item.position,
              status: item.status,
              maneger: item.Staffs[0]?.firstName + item.Staffs[0]?.lastName,
              image: item.image,
              code: item.code,
            };
          })
        );
        setListStaff(data);
        setStaffsTemplate(data)
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchListStaff();
  }, [reload]);

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

  //handle update customer in here ....
  const handleUpdate = () => {
    setLoading(true);
    // ajax request after empty completing
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    const fetchDeleteStaff = async () => {
      try {
        const response = await staffApi.deleteStaff(selectedId);
        if (response == 1) {
          depatch(setReload(!reload));
        } else {
          setTimeout(() => {
            message.success("Xóa thất bại");
          }, 1000);
        }
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchDeleteStaff();
    setTimeout(() => {
      message.success("Xóa thành công");
    }, 1000);
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
        {/* <Button
          type="primary"
          danger
          onClick={handleDelete}
          disabled={!hasSelected}
          loading={loading}
          icon={<DeleteOutlined />}
          style={{ marginRight: "1rem" }}
        >
          Xóa
        </Button> */}
        {/* <Button
          type="primary"
          onClick={handleUpdate}
          disabled={!selectedOne}
          loading={loading}
          icon={<ToolOutlined />}
        >
          Cập nhật
        </Button> */}
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        columns={columns} dataSource={listStaff} />
      <Modal
        title="Xóa nhân viên"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Bạn muốn xóa nhân viên không?</p>
      </Modal>
    </div>
  );
};
export default TableEmployee;
