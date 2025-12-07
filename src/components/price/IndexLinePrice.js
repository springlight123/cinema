import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  Typography,
  Tag,
  Table,
  Breadcrumb,
  message,
} from "antd";

import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import ModelAddPromoLine from "./ModelAddPromoLine";
import priceApi from "../../api/priceApi";
import moment from "moment";
import cinemaApi from "../../api/cinemaApi";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ModelDetailCustomer from "./ModelCustomerDetail";

dayjs.extend(customParseFormat);

const { TextArea } = Input;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
const { Option } = Select;

const { Title, Text } = Typography;
const newDateFormat = "YYYY-MM-DD";


const IndexLinePrice = ({ setTab, selectedIdHeader }) => {
  const [showModalAddCustomer, setShowModalAddCustomer] = useState(false);

  const [form] = Form.useForm();
  const [status, setStatus] = useState(0);
  const [applyTo, setApplyTo] = useState(0);
  const [listCinema, setListCinema] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [applyToHall, setApplyToHall] = useState([]);
  const [listPriceLine, setListPriceLine] = useState([]);
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);


  const [dataUpdate, setDataUpdate] = useState({});
  const currentDate = moment().format(newDateFormat);
  const [startDateDb, setStartDateDb] = useState("");
  const [endDateDb, setEndDateDb] = useState("");
  const [statusDb, setStatusDb] = useState(0);
  const [idPriceLine, setIdPriceLine] = useState(0);
  const [selectedId, setSelectedId] = useState([]);
  const [showModalDetailCustomer, setShowModalDetailCustomer] = useState(false);
  const user = useSelector((state) => state.user);

  const { RangePicker } = DatePicker;


  const columns = [
    {
      title: "Mã Sản phẩm",
      dataIndex: "productCode",
      // render: (val,recod) => {
      //   return (
      //     <a
      //       onClick={() => {
      //         showModalDetail(recod);
      //       }}
      //     >
      //       {val}
      //     </a>
      //   );
      // },
    },
    {
      title: "Tên Sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Giá bán",
      dataIndex: "price",
      align: "right",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      dataIndex:"id",
      render: (text, record) => (
        currentDate < startDate && statusDb === 0 ? 
        (
          <Button style={{
            border: "none",
            width: "100%",
          }}
          onClick={() => {
            setIsModalOpenDelete(true);
            setIdPriceLine(record.id);
          }}
           danger icon={<MinusCircleOutlined color="red" />}>
          
           </Button>
        )
        : null
      ),
    },
  ];

  const showModalDetail = (e) => {
    setShowModalDetailCustomer(true);
    setIdPriceLine(e.id);
    
  };

  const handleOkDelete = async() => {
    console.log("idPriceLine",idPriceLine);
    setIsModalOpenDelete(false);
    try {
      const response = await priceApi.deletePriceLineById(idPriceLine);
      console.log(response);
      if (response) {
        depatch(setReload(!reload));
        message.success("Xóa thành công");
      }
    } catch (error) {
      message.error("Xóa thất bại");
    }
  };



  const onChangeStatus = (value) => {
    setStatus(value);
  };

  const onChangeApplyTo = (value) => {
    setApplyTo(value);
  };

  const onChangeStartDate = (date, dateString) => {
    setStartDate(dateString);
    
  };

  const onChangeEndDate = (date, dateString) => {
    setEndDate(dateString);
  };

  const onChangeApplyToHall = (value) => {
    setApplyToHall(value);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  const handleRouter = (value) => {
    setTab(0);
  };

  const handleOpenModel = () => {
    setShowModalAddCustomer(true);
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    console.log(dateString);
    if (dateString[0] === "") {
      setStartDate(moment().format(newDateFormat));
      return;
    }
    if (dateString[1] === "") {
      setEndDate(moment().format(newDateFormat));
      return;
    }
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  const handleSubmit = async (val) => {
    const data = {
      name: val.namePrice,
      startDate: startDate,
      endDate: endDate,
      status: val.status,
      note: val.note,
      userUpdate: user.id
    };
    if (
      currentDate > startDateDb &&
      currentDate < endDateDb &&
      statusDb === true
    ) {
      showModal(data);
    } else {
      try {
        const response = await priceApi.updatePriceHeaderById(
          selectedIdHeader,
          data
        );
        if (response[0] === 1) {
          console.log(response);
          depatch(setReload(!reload));
          message.success("Cập nhật thành công");
          handleRouter();
        }
      } catch (error) {
        const { data } = error.response;
        let messageError;
        if (data.status === 409) {
          console.log(data.data[0].PriceHeader);
          messageError = `Thêm thất bại: Sản phẩm đã được áp dụng cho bảng giá:
           Mã: ${data.data[0].PriceHeader.priceCode} - Tên: ${data.data[0].PriceHeader.name} - (${data.data[0].PriceHeader.startDate} - ${data.data[0].PriceHeader.endDate} )`;
        }
        message.error(messageError, 7);
      }
    }
  };

  // price detail
  useEffect(() => {
    const getPriceLine = async () => {
      console.log(selectedIdHeader);
      try {
        const line = await priceApi.getPriceLineByHeader(selectedIdHeader);
        if (line) {
          console.log('line',line);
          const data = line.lines.map((item) => {
            return {
              id: item.id,
              productCode: item.Product.productCode,
              name: item.Product.productName,
              price: item.price,
            };
          });
          setListPriceLine(data);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    const getPriceHeaderDetail = async () => {
      try {
        const response = await priceApi.getPriceHeaderById(selectedIdHeader);
        if (response) {
          console.log(response);
          setApplyTo(response.applyTo);
          setStatus(response.status);
          setStartDate(moment(response.startDate).format("YYYY-MM-DD"));
          setEndDate(moment(response.endDate).format("YYYY-MM-DD"));
          setApplyToHall(response.applyToHall);
          setStartDateDb(response.startDate);
          setEndDateDb(response.endDate);
          setStatusDb(response.status);
          form.setFieldsValue({
            priceCode: response.priceCode,
            namePrice: response.name,
            status: response.status,
            applyTo: response.applyTo,
            applyToHall: response.applyToHall,
            date: [dayjs(response.startDate, newDateFormat), dayjs(response.endDate, newDateFormat)],
            note: response.note,
          });
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    const getCinema = async () => {
      try {
        const response = await cinemaApi.getCinemas();
        if (response) {
          const newArr = response.map((val) => {
            return { value: val.id, label: val.name };
          });
          setListCinema(newArr);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    getCinema();
    getPriceHeaderDetail();
    getPriceLine();
  }, [selectedIdHeader, reload]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };
  const showModal = (data) => {
    setIsModalOpen(true);
    setDataUpdate(data);
  };


  const handleOk = async () => {
    setIsModalOpen(false);
    try {
      const response = await priceApi.updatePriceHeaderById(
        selectedIdHeader,
        dataUpdate
      );
      if (response[0] === 1) {
        console.log(response);
        depatch(setReload(!reload));
        message.success("Cập nhật thành công");
        handleRouter();
      }
    } catch (error) {
      console.log("Failed to login ", error);
    }
  };


  console.log("start", startDate);
  console.log("cr", currentDate);

  return (
    <div className="site-card-wrapper" style={{ minWidth: "100vh" }}>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Breadcrumb style={{ marginBottom: "1rem", marginTop: "1rem" }}>
            <Breadcrumb.Item>
              <a onClick={handleRouter}>Bảng giá</a>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Chỉnh sửa</Breadcrumb.Item>
          </Breadcrumb>

          <Button
            type="primary"
            form="myForm"
            htmlType="submit"
            style={{
              marginBottom: "1rem",
              marginTop: "1rem",
              marginRight: "1rem",
            }}
          >
            Cập nhật
          </Button>
        </div>
      </div>

      <Form
        style={{
          background: "white",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
        }}
        id="myForm"
        onFinish={handleSubmit}
        form={form}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="priceCode" label="Mã bảng giá">
              <Input
                disabled={true}
                placeholder="Hãy nhập tên CT khuyến mãi..."
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="namePrice"
              label="Tên bảng giá"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập chi tiết CTKH...",
                },
              ]}
            >
              <Input
                disabled={statusDb === 1 ? true : false}
                placeholder="Hãy nhập tên bảng giá..."
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
                name="date"
                label="Thời gian hoạt động"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời gian hoạt động...",

                  },
                ]}
              >
                <RangePicker 
                  placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                  
                  onChange={onChangeDate}
                  disabledDate={
                    (current) => {
                      return current && current < moment().endOf('day');
                    }
                  }
                  disabled={ statusDb === 1
                    ? true
                    : false || [moment().diff( moment(startDate), "seconds" ) > 0 ? true : false, false]}
                />
                  
              </Form.Item>
            </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: "Hãy chọn trạng thái...",
                },
              ]}
            >
              <Select
                placeholder="Chọn trạng thái"
                style={{
                  width: "100%",
                }}
                onChange={onChangeStatus}
                options={[
                  {
                    value: 0,
                    label: "Ngưng hoạt động",
                  },
                  {
                    value: 1,
                    label: "Hoạt động",
                  },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="note" label="Ghi chú">
              <TextArea
                disabled={statusDb === 1 ? true : false}
                rows={3}
                placeholder="Nhập ghi chú bảng giá"
                // maxLength={6}
              />
            </Form.Item>
          </Col>
        </Row>


      </Form>
      {/* table */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <Space>
            <span
              style={{
                fontSize: "1rem",
                fontWeight: "bold",
              }}
            >
              Danh sách giá
            </span>
          </Space>
          { currentDate < startDate && statusDb === 0  ? (
            <Button
              type="primary"
              onClick={() => handleOpenModel()}
              style={{
                marginRight: "1rem",
                marginBottom: "1rem",
                width: "100px",
              }}
            >
              Thêm
            </Button>
          ) : null}
        </div>
        <Table
          pagination={false}
          columns={columns}
          dataSource={listPriceLine}
        />
      </div>
      <Modal
        title="Cập nhật trạng thái bảng giá"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Bảng giá đang trong thời gian hoạt động. Bạn có chắc muốn ngưng không?
        </p>
      </Modal>
      <Modal
        title="Xóa sản phẩm khỏi bảng giá"
        open={isModalOpenDelete}
        onOk={handleOkDelete}
        onCancel={handleCancelDelete}
      >
        <p>
          Bạn có chắc muốn xóa sản phẩm khỏi bảng giá không?
        </p>
      </Modal>
      {showModalAddCustomer ? (
        <ModelAddPromoLine
          showModalAddCustomer={showModalAddCustomer}
          setShowModalAddCustomer={setShowModalAddCustomer}
          selectedIdHeader={selectedIdHeader}
        />
      ) : null}
      {showModalDetailCustomer ? (
        <ModelDetailCustomer
          showModalDetailCustomer={showModalDetailCustomer}
          setShowModalDetailCustomer={setShowModalDetailCustomer}
          selectedId={idPriceLine}
          selectedIdHeader={selectedIdHeader}

        />
      ) : null}
    </div>
  );
};
export default IndexLinePrice;
