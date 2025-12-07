import React, { useEffect, useState } from "react";
import { Input, Col, Row, Typography, Button, Modal,Table,DatePicker } from "antd";

import {
  SearchOutlined,
  PlusSquareFilled,
  UserAddOutlined,
  ToolOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  TableOutlined
} from "@ant-design/icons";
import TableCustomer from "./TableCustomer";
import ModelAddCustomer from "./ModelAddCustomer";
import productApi from "../../api/productApi";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";

const { Title, Text } = Typography;
const IndexCustomer = ({ setTab ,setSelectedIdHeader}) => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);
  const [isShowTable, setIsShowTable] = useState(true);
  const [listProduct, setListProduct] = useState([]);
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const { RangePicker } = DatePicker;
  const [startDatePicker, setStartDatePicker] = useState("");
  const [endDatePicker, setEndDatePicker] = useState("");

  const showModal = () => {
    setShowModalAddCustomer(true);
  };

  const onChangeDate = (date, dateString) => {
    setStartDatePicker(dateString[0]);
    setEndDatePicker(dateString[1]);
  };

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productCode",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      align: "right",
      render:(val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
    },
  ];

  useEffect(() => {
    const fetchListProduct = async () => {
      try {
        const response = await productApi.getAllPriceProduct();
        const data = response.map((item) => {
          return {
            productCode: item.productCode,
            productName: item.productName,
            price: item.price || 0,
          };
        });
        setListProduct(data);
      } catch (error) {
        console.log("Failed to fetch product list: ", error);
      }
    };
    fetchListProduct();
  }, [reload]);

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Quản lý bảng giá 
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={19}>
        <RangePicker 
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            onCalendarChange={onChangeDate}
            style={{ width: "50%" }}
          />
        </Col>
        
        <Col style={{
          marginLeft: "3rem"
        }} span={1}>
          <Button type="primary" icon={<TableOutlined />} onClick={() => {
            setIsShowTable(!isShowTable)
          }} 
            title="Danh sách giá sản phẩm hiện tại"
          > 
          </Button>
        </Col>
        <Col span={1}>
          <Button type="primary" icon={<UserAddOutlined />} onClick={showModal}>
            Thêm
          </Button>
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
        <Col span={24} style = {{
          
        }}>
          {isShowTable ? <TableCustomer setTab={setTab} setSelectedIdHeader={setSelectedIdHeader} startDatePicker={startDatePicker} endDatePicker={endDatePicker}  /> :
           <Table
           columns={columns}
           dataSource={listProduct}
           style={{ width: "80%" }}
            />
           }
          
        </Col>
      </Row>
      {showModalAddCustomer ? (
        <ModelAddCustomer
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
        />
      ) : null}
    </div>
  );
};
export default IndexCustomer;
