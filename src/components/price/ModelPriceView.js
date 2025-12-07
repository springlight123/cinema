import React, { useEffect, useState } from "react";
import { PlusOutlined,
   UploadOutlined,
   FileExcelOutlined,
   
} from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Upload,
  Table
} from "antd";
import openAddressApi from "../../api/openApi";
import customerApi from "../../api/customerApi";
import moment from "moment";
import TableCustomer from "./TableCustomer";
import priceApi from "../../api/priceApi";

const { Option } = Select;

const ModelPriceView = ({
  showModalPriceView,
  setShowModalPriceView,
  selectedId,
}) => {

  const [form] = Form.useForm();
  const [priceDetail, setPriceDetail] = useState({});
  const [priceLine, setPriceLine] = useState([]);


  const columns = [
    {
      title: "Mã Sản phẩm",
      dataIndex: "productCode",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Tên Sản phẩm",
      dataIndex: "productName",
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      render:(val) => {
        if (val) {
          return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        } else {
          return 0;
        }
      }
    },
  ];

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalPriceView(false);
  };

  const handleExportExcel = () => {
    console.log("priceLine",priceLine);
  };

  

  useEffect(() => {
    const fetchPriceDetail = async () => {
      console.log("selectedId", selectedId);
        const res = await priceApi.getPriceLineByHeader(selectedId);
        if (res) {
          setPriceDetail({
            ...res.priceHeader,
            user_update_name: res.priceHeader.user_update ? res.priceHeader.user_update.firstName + res.priceHeader.user_update.lastName : "",
          });
          const data = res.lines.map((item) => {
            return {
              productCode: item.Product.productCode,
              productName: item.Product.productName,
              price: item.price,
            };
          });
          setPriceLine(data);
        }
    };
    
    fetchPriceDetail();
  }, []);


  return (
    <>
      <Drawer
        title="Thông tin bảng giá"
        width={720}
        onClose={onClose}
        open={showModalPriceView}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={16} style={{ marginBottom:'5px' }}>
            <Col span={12}>
              <span style={{
                fontSize: "20px",
                fontWeight: "bold",
              }} >Thông tin cơ bản</span>
            </Col>
            <Col span={12}>
              {/* {priceLine.length > 0 && (
                <Button
                style={{ float: "right" }}
                onClick={handleExportExcel}
                icon={<FileExcelOutlined />}
              >
                Xuất excel
              </Button>
              )} */}
            </Col>
          </Row> 
        </Space>
        <Space
          direction="vertical"
          style={{ 
            width: "100%",
            marginBottom:'5px',
            display:'flex',
            justifyContent:'space-between',
            alignItems:'center',
          }}
        >
          <p style={{ fontSize: "20px" }}>{priceDetail?.name}</p>
        </Space>
        <Form form={form} id="myForm" layout="vertical">
          <Row gutter={16} style={{ marginBottom:'10px' }} >
            <Col span={12}>
              <span
              >
                Mã bảng giá:
                <span> {priceDetail?.priceCode} </span>
              </span>
            </Col>
            <Col span={12}>
              <span>
                Trạng thái:
                <span>{priceDetail?.status === true ? " Đang hoạt động" : " Ngừng hoạt động"}</span>
              </span>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <span>
                Ngày bắt đầu:
                <span> {priceDetail?.startDate} </span>
              </span>
            </Col>
            <Col span={12}>
            <span>
                Ngày kết thúc:
                <span> {priceDetail?.endDate} </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "30px" }} >
            <Col span={12}>
            <span 
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
             > Danh sách giá sản phẩm</span>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }}>
            <Col span={24}>
              <Table columns={columns} dataSource ={priceLine} pagination={false}/>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "30px" }} >
            <Col span={12}>
            <span 
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
             > Thông tin lịch sử</span>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }} gutter={16}>
            <Col span={12}>
              <span>
                Ngày tạo:
                <span> {moment(priceDetail?.createdAt).format('YYYY-MM-DD : HH:mm')} </span>
              </span>
            </Col>
            <Col span={12}>
            <span>
                Người tạo:
                <span> {priceDetail?.user_create?.firstName + priceDetail?.user_create?.lastName } </span>
              </span>
            </Col>
          </Row>
          <Row style={{ marginTop: "20px" }} gutter={16}>
            <Col span={12}>
              <span>
                Ngày cập nhật:
                <span> {moment(priceDetail?.updatedAt).format('YYYY-MM-DD : HH:mm')} </span>
              </span>
            </Col>
            <Col span={12}>
            <span>
                Người cập nhật:
                <span> {priceDetail.user_update_name } </span>
              </span>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default ModelPriceView;
