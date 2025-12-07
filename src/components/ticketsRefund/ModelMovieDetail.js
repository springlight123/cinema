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
  message,
  Table,
} from "antd";

import { useFormik } from "formik";
import {
  PlusOutlined,
  UploadOutlined,
  FileExcelOutlined,
} from "@ant-design/icons";
import categoryMovie from "../../api/categoryMovie";
import cinameApi from "../../api/cinemaApi";
import movieApi from "../../api/movieApi";
import moment from "moment";
import orderApi from "../../api/orderApi";
import promotionRsApi from "../../api/promotionRs";

const { Option } = Select;
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ModelDetailMovie = ({
  showModalDetailMovie,
  setShowModalDetailMovie,
  selectedId,
}) => {
  const [listCategory, setListCategory] = useState([]);
  const [listCinema, setListCinema] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);
  const [nameMovie, setNameMovie] = useState("");
  const [cast, setCast] = useState("");
  const [director, setDirector] = useState("");
  const [linkTrailer, setLinkTrailer] = useState("");
  const [category, setCategory] = useState("");
  const [time, setTime] = useState(0);
  const [releaseDate, setReleaseDate] = useState("");
  const [desc, setDesc] = useState("");
  const [classify, setClassify] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [movieInfo, setMovieInfo] = useState({});
  const [form] = Form.useForm();

  const [orderDetailSeat, setOrderDetailSeat] = useState([]);
  const [orderDetailProduct, setOrderDetailProduct] = useState([]);
  const [orderDetailPromotion, setOrderDetailPromotion] = useState([]);
  const [order, setOrder] = useState({});

  const columnsSeat = [
    {
      title: "Vị trí",
      dataIndex: "position",
    },
    {
      title: "Số lượng",
      dataIndex: "qty",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
    {
      title: "Loại ghế",
      dataIndex: "productType",
    },
  ];

  const columnsProduct = [
    {
      title: "Mã sản phẩm",
      dataIndex: "productCode",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Số lượng",
      dataIndex: "qtyProduct",
    },
    {
      title: "Giá",
      dataIndex: "priceProduct",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
  ];

  const columnsPromotion = [
    {
      title: "Mã khuyến mãi",
      dataIndex: "promotionCode",
    },
    {
      title: "Tên khuyến mãi",
      dataIndex: "name",
    },
    {
      title: "Tiền giảm",
      dataIndex: "discount",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      },
    },
  ];

  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalDetailMovie(false);
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };
  const handleChangeTime = (value) => {
    setTime(value);
  };
  const handleChangeCategory = (value) => {
    setCategory(value);
  };

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    setReleaseDate(dateString);
  };
  const onChangeEndDate = (date, dateString) => {
    setEndDate(dateString);
  };

  const onChangeClassify = (value) => {
    setClassify(value);
  };

  const onChangeStatus = (value) => {
    setStatus(value);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderApi.getById(selectedId);
        console.log("order", res);
        if (res) {
          res.createdAt = moment(res.createdAt).format("DD/MM/YYYY HH:mm");
          res.showDate = moment(res.ShowMovie.showDate).format("DD/MM/YYYY");
          res.refundDate = moment(res.refundDate).format("DD/MM/YYYY HH:mm");
          const name = res.Customer?.firstName + res.Customer?.lastName;
          // res.totalPrice = res.totalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          const totalPrice = res.totalPrice
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          // res.totalPrice = totalPrice;
          const totatBefore =
            Number(res.totalPrice) + Number(res.totalDiscount);
          res.totalBefore = totatBefore;
          if (name === "NN") {
            res.customerName = "Khách vãng lai";
          } else {
            res.customerName = name;
          }

          setOrder(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchOrderDetail = async () => {
      const res = await orderApi.getDetail(selectedId);
      console.log("orderDetail", res);
      if (res) {
        let listSeat = [];
        let listProduct = [];
        res.forEach((item) => {
          if (item.type === 1) {
            listSeat.push({
              position:
                item?.CinemaHallSeat?.seatColumn +
                item?.CinemaHallSeat?.seatRow,
              qty: item.qty,
              price: item.price,
              productType: item?.Product?.productName,
            });
          }
          if (item.type === 2) {
            listProduct.push({
              productCode: item?.Product?.productCode,
              name: item?.Product?.productName,
              qtyProduct: item.qtyProduct,
              priceProduct: item.priceProduct,
            });
          }
          return {
            listSeat,
            listProduct,
          };
        });
        setOrderDetailSeat(listSeat);
        setOrderDetailProduct(listProduct);
      }
    };

    const fetchPromotionRs = async () => {
      const res = await promotionRsApi.getByOrderId(selectedId);
      console.log("promotionRs", res);
      if (res) {
        let listPromotion = [];
        res.forEach((item) => {
          listPromotion.push({
            promotionCode: item?.PromotionLine?.promotionCode,
            name: item?.PromotionLine?.desc,
            discount: item.moneyDiscount,
          });
        });
        setOrderDetailPromotion(listPromotion);
      }
    };

    fetchPromotionRs();
    fetchOrder();
    fetchOrderDetail();
  }, []);

  useEffect(() => {
    //load categories
    const getCategories = async () => {
      try {
        const response = await categoryMovie.getCategory();

        console.log(response);
        //set user info
        if (response) {
          //handle data
          const newArr = response.map((val) => {
            return { value: val.id, label: val.nameCategory };
          });
          setListCategory(newArr);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    //load categories
    const getCinemas = async () => {
      try {
        const response = await cinameApi.getCinemas();

        console.log(response);
        //set user info
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
    getCinemas();
    getCategories();
  }, []);

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setImage(file);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };

  const handleExportExcel = () => {
    console.log("export excel");
  };

  console.log("d", orderDetailSeat);

  return (
    <>
      <Drawer
        title="Thông tin chi tiết hoán đơn trả hàng"
        width={720}
        onClose={onClose}
        open={showModalDetailMovie}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={12}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Thông tin cơ bản
              </span>
            </Col>
            {/* <Col span={12}>
              <Button
                style={{ float: "right" }}
                onClick={handleExportExcel}
                icon={<FileExcelOutlined />}
              >
                Xuất excel
              </Button>
            </Col> */}
          </Row>
        </Space>
        <Form form={form} id="myForm" layout="vertical">
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Mã hoán đơn:
                <span> {order?.code}</span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Ngày tạo:
                <span> {order?.createdAt} </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Nhân viên:
                <span>
                  {" "}
                  {order?.Staff?.firstName + order?.Staff?.lastName}{" "}
                </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Khách hàng:
                <span> {order?.customerName} </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Rạp:
                <span> {order?.ShowMovie?.Show?.Cinema?.name} </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Phòng chiếu:
                <span> {order?.ShowMovie?.Show?.CinemaHall?.name} </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Phim:
                <span> {order?.ShowMovie?.Show?.Movie?.nameMovie} </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Suất chiếu:
                <span> {order?.ShowMovie?.ShowTime?.showTime} </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Ngày chiếu:
                <span> {order?.showDate} </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Tổng tiền trước CK:
                <span>
                  {" "}
                  {order?.totalBefore
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"}
                </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Ngày trả:
                <span> {order?.refundDate} </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Chiết khấu:
                <span>
                  {" "}
                  {order?.totalDiscount
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"}
                </span>
              </span>
            </Col>
            {/* <Col span={8}>
              <span>
                Tổng tiền hoàn trả:
                <span> {order?.totalPrice} </span>
              </span>
            </Col> */}
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
              <span>
                Lý do hoàn trả:
                <span> {order?.note} </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Tổng tiền sau CK:
                <span>
                  {" "}
                  {order?.totalPrice
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"}{" "}
                </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}>
            </Col>
            <Col span={8}>
              <span>
                Tổng tiền hoàn trả:
                <span> {order?.totalPrice?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"} </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: "10px" }}>
            <Col span={12}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                {" "}
                Danh sách ghế mua
              </span>
            </Col>
          </Row>
          <Row style={{ marginTop: "15px" }}>
            <Col span={24}>
              <Table
                columns={columnsSeat}
                dataSource={orderDetailSeat}
                size={"small"}
                pagination={false}
              />
            </Col>
          </Row>
          {orderDetailProduct.length > 0 && (
            <>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={12}>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Danh sách sản phẩm mua
                  </span>
                </Col>
              </Row>
              <Row style={{ marginTop: "15px" }}>
                <Col span={24}>
                  <Table
                    columns={columnsProduct}
                    dataSource={orderDetailProduct}
                    size={"small"}
                    pagination={false}
                  />
                </Col>
              </Row>
            </>
          )}
          {orderDetailPromotion.length > 0 && (
            <>
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={12}>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Danh sách khuyến mãi
                  </span>
                </Col>
              </Row>
              <Row style={{ marginTop: "15px" }}>
                <Col span={24}>
                  <Table
                    columns={columnsPromotion}
                    dataSource={orderDetailPromotion}
                    size={"small"}
                    pagination={false}
                  />
                </Col>
              </Row>
            </>
          )}
        </Form>
      </Drawer>
    </>
  );
};
export default ModelDetailMovie;
