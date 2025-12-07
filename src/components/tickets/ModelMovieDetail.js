import React, { useEffect, useState, useRef } from "react";

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
import ReactToPrint from "react-to-print";
import "./index.scss";
import "./Telidon Hv Italic.ttf";
import QRCode from "react-qr-code";

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
  let componentRef = useRef();
  let componentRef2 = useRef();

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

  const [seatNomal, setSeatNomal] = useState([]);
  const [seatVip, setSeatVip] = useState([]);

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
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
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
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
      },
    },
  ];

  const columnsPromotion = [
    {
      title: "Mã khuyến mãi",
      dataIndex: "promotionCode",
    },
    {
      title: "Mô tả",
      dataIndex: "name",
    },
    {
      title: "Tiền giảm",
      dataIndex: "discount",
      render: (val) => {
        return `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
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
          const name = res.Customer?.firstName + res.Customer?.lastName;
          let nameStaff = res.Staff?.firstName + res.Staff?.lastName;
          // res.totalPrice = res.totalPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          const totatBefore =Number(res.totalPrice) + Number(res.totalDiscount);

          const { duration } = res.ShowMovie.Show.Movie;
          const { showTime } = res.ShowMovie.ShowTime;
          const startTime = moment(showTime, "HH:mm");
          const endTime = moment(startTime).add(duration, "minutes");
          res.endTime = moment(endTime).format("HH:mm");

          res.totatBefore = totatBefore;
          if (name === "NN") {
            res.customerName = "Khách vãng lai";
          }
          if (res.Staff === null) {
            nameStaff = "Online";
          }
          res.staffName = nameStaff;

          setOrder(res);
        }
      } catch (err) {
        console.log(err);
      }
    };
    const fetchOrderDetail = async () => {
      const res = await orderApi.getDetail(selectedId);
      if (res) {
        console.log("orderDetail", res);
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
              productCode: item?.Product?.productCode,
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
        const listNormal = listSeat.filter(
          (item) => item.productCode === "PRD001"
        );
        const listVip = listSeat.filter(
          (item) => item.productCode === "PRD003"
        );
        setSeatNomal(listNormal);
        setSeatVip(listVip);
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

  console.log("vip", seatVip);

  const handleSubmit = async () => {
    const data = {
      nameMovie: nameMovie,
      cast: cast,
      director: director,
      linkTrailer: linkTrailer,
      idCategoryMovie: category,
      duration: time,
      releaseDate: releaseDate,
      idCinema: 1,
      desc: desc,
      classify: classify,
      endDate: endDate,
      status: status,
      image: image,
    };
    console.log(data);
    const rs = await movieApi.updateMovie(selectedId, data);
    console.log(rs);
    if (rs) {
      setShowModalDetailMovie(false);
      setTimeout(() => {
        message.success("Cập nhật phim thành công");
      }, 500);
    }
  };
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

  const handleExportExcel = () => {
    console.log("export excel");
  };

  // console.log("id", selectedId);

  const PrintTemplate = () => {
    return (
      <>
        <div className="print-template">
          <div
            className="print-template__header"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "50px",
            }}
          >
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              HỆ THỐNG RẠP CHIẾU PHIM CINEMA HUB
            </span>
            <span
              style={{
                marginTop: "10px",
                fontSize: "20px",
              }}
            >
              123 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh
            </span>
            <span
              style={{
                fontSize: "20px",
              }}
            >
              Điện thoại: 1900.545.436
            </span>
            <span
              style={{
                fontSize: "30px",
                fontWeight: "bold",
              }}
            >
              HÓA ĐƠN THANH TOÁN
            </span>
          </div>
          <div
            className="print-template__body"
            style={{
              marginTop: "10px",
            }}
          >
            <div
              className="print-template__body__info"
              style={{
                marginRight: "50px",
                marginLeft: "50px",
              }}
            >
              <Row gutter={16} style={{ marginBottom: "10px" }}>
                <Col span={24}>
                  <span className="info">
                    Phim:
                    <span> {order?.ShowMovie?.Show?.Movie?.nameMovie} </span>
                  </span>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: "10px" }}>
                <Col span={12}>
                  <span className="info">
                    Mã hoán đơn:
                    <span> {order?.code}</span>
                  </span>
                </Col>
                <Col span={12}>
                  <span className="info">
                    Ngày tạo:
                    <span> {order?.createdAt} </span>
                  </span>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: "10px" }}>
                <Col span={12}>
                  <span className="info">
                    Nhân viên:
                    <span>
                      {order?.Staff
                        ? +" " +
                          order?.Staff?.firstName +
                          order?.Staff?.lastName
                        : " KH đặt Online"}
                    </span>
                  </span>
                </Col>
                <Col span={12}>
                  <span className="info">
                    Khách hàng:
                    <span>
                      {" "}
                      {order?.customerName
                        ? order?.customerName
                        : order?.Customer?.firstName +
                          " " +
                          order?.Customer?.lastName}
                    </span>
                  </span>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: "10px" }}>
                <Col span={12}>
                  <span className="info">
                    Rạp:
                    <span> {order?.ShowMovie?.Show?.Cinema?.name} </span>
                  </span>
                </Col>
                <Col span={12}>
                  <span className="info">
                    Phòng chiếu:
                    <span> {order?.ShowMovie?.Show?.CinemaHall?.name} </span>
                  </span>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginBottom: "10px" }}>
                <Col span={12}>
                  <span className="info">
                    Ngày chiếu:
                    <span> {order?.showDate} </span>
                  </span>
                </Col>
                <Col span={12}>
                  <span className="info">
                    Suất chiếu:
                    <span> {order?.ShowMovie?.ShowTime?.showTime} </span>
                  </span>
                </Col>
              </Row>
              <Row gutter={16} style={{ marginTop: "30px" }}>
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
                    size={"middle"}
                    pagination={false}
                    bordered={true}
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
                        size={"middle"}
                        pagination={false}
                        bordered={true}
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
                        size={"middle"}
                        pagination={false}
                        bordered={true}
                      />
                    </Col>
                  </Row>
                </>
              )}
              <Row gutter={16} style={{ marginTop: "20px" }}>
                <Col span={18}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Tổng tiền trước CK:
                  </span>
                </Col>
                <Col span={6}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {order?.totatBefore
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    VNĐ
                  </span>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={18}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Chiết khấu
                  </span>
                </Col>
                <Col span={6}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {order?.totalDiscount
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    VNĐ
                  </span>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={18}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    Tổng tiền
                  </span>
                </Col>
                <Col span={6}>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {order?.totalPrice
                      ?.toString()
                      ?.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                    VNĐ
                  </span>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </>
    );
  };

  const PrintTemplateTicket = () => {
    return (
      <>
        <div
          className=" print_ticket"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            fontFamily: "Telidon",
          }}
        >
          <div
            className="print print-top"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "10px" }}>THE VAO</span>
            <span style={{ fontSize: "10px" }}>PHONG CHIEU PHIM</span>
            <span
              style={{
                fontSize: "10px",
                marginLeft: "10px",
                marginTop: "10px",
              }}
            >
              {order?.ShowMovie?.Show?.Cinema?.name}
            </span>
          </div>
          <Row className="print-content">
            <span>{order?.ShowMovie?.Show?.Cinema?.address}</span>
          </Row>
          <Row className="print-content">
            <span>{order?.createdAt}</span>
          </Row>
          <Row className="print-content">
            <span>Nhân viên:</span>
            <span>
              {order?.Staff
                ? +" " + order?.Staff?.firstName + order?.Staff?.lastName
                : " KH đặt Online"}
            </span>
          </Row>
          <Row className="print-content">
            <span>===================================================</span>
          </Row>
          <Row className="print-content content-body">
            <span>{order?.ShowMovie?.Show?.Movie?.nameMovie}</span>
            <span style={{ marginLeft: "5px" }}>
              [{order?.ShowMovie?.Show?.Movie?.classify?.substring(0, 3)}]
            </span>
          </Row>
          <Row className="print-content">
            <span>{order?.showDate}</span>
            <span style={{ marginLeft: "5px" }}>
              {order?.ShowMovie?.ShowTime?.showTime} - {order?.endTime}
            </span>
          </Row>
          <Row className="print-content content-body">
            <span>Room-{order?.ShowMovie?.Show?.CinemaHall?.type}</span>
            <span style={{ marginLeft: "5px" }}>
              {order?.ShowMovie?.Show?.CinemaHall?.name}
            </span>
          </Row>
          {seatNomal && seatNomal.length > 0 && (
            <>
              <Row className="print-content">
                <span>===================================================</span>
              </Row>
              <Row
                className="print-content content-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "normal",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {seatNomal.map((item, index) => (
                      <>
                        {item?.position}
                        {index < seatNomal.length - 1 ? ", " : ""}
                      </>
                    ))}
                  </span>
                  <span>{seatNomal[0]?.productCode}</span>
                  <span>{seatNomal[0]?.price * seatNomal.length}</span>
                </div>
              </Row>
              <Row className="print-content">
                <span>--------------------------------------------------</span>
              </Row>
            </>
          )}
          {seatVip && seatVip.length > 0 && (
            <>
              <Row
                className="print-content content-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "normal",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {seatVip.map((item, index) => (
                      <>
                        {item?.position}
                        {index < seatVip.length - 1 ? ", " : ""}
                      </>
                    ))}
                  </span>
                  <span>{seatVip[0]?.productCode}</span>
                  <span>{seatVip[0]?.price * seatVip.length}</span>
                </div>
              </Row>
              <Row className="print-content">
                <span>===================================================</span>
              </Row>
            </>
          )}
          <Row
            className="print-content"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <QRCode
              size={50}
              value={selectedId.toString()}
              viewBox={`0 0 256 256`}
            />
          </Row>
          <Row
            className="print-content"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              fontSize: "5px",
            }}
          >
            <span>www.cinema-start.vn - Hotline: 0943220476</span>
            <span>THANK YOU FOR CHOOSING US TODAY !</span>
          </Row>
        </div>
        {/* <PageBreakWrapper>&nbsp;</PageBreakWrapper> */}
      </>
    );
  };

  class ComponentToPrint extends React.Component {
    render() {
      return (
        <div>
          <PrintTemplate />
        </div>
      );
    }
  }

  class ComponentToPrintTicket extends React.Component {
    render() {
      return (
        <div>
          <PrintTemplateTicket />
        </div>
      );
    }
  }

  return (
    <>
      <Drawer
        title="Thông tin chi tiết hoá đơn"
        width={720}
        onClose={onClose}
        open={showModalDetailMovie}
        bodyStyle={{
          paddingBottom: 80,
        }}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row gutter={16} style={{ marginBottom: "20px" }}>
            <Col span={15}>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Thông tin cơ bản
              </span>
            </Col>
            <Col span={3}>
              <ReactToPrint
                trigger={() => <Button type="default">In vé</Button>}
                content={() => componentRef2}
                pageStyle="@page {
              size: 52mm 74mm;
              }
              @media print {
              @page {  size: a8 landscape;
                  margin: 0mm !important;
              }
              @media all {
                              .pagebreak {
                                overflow: visible; 
                              }
                          }
                      }
              }`;"
              />
            </Col>
            <Col span={3}>
              <ReactToPrint
                trigger={() => <Button type="primary">Xuất hóa đơn</Button>}
                content={() => componentRef}
              />
            </Col>

            <div style={{ display: "none" }}>
              <ComponentToPrint ref={(el) => (componentRef = el)} />
            </div>
            <div style={{ display: "none" }}>
              <ComponentToPrintTicket ref={(el) => (componentRef2 = el)} />
            </div>
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
              <span style={{ textTransform: "capitalize" }}>
                Nhân viên:
                <span>
                  {order?.Staff
                    ? " " +
                      order?.Staff?.firstName +
                      " " +
                      order?.Staff?.lastName
                    : " Khách đặt online"}
                </span>
              </span>
            </Col>
            <Col span={8}>
              <span>
                Khách hàng:
                <span>
                  {" "}
                  {order?.customerName
                    ? order?.customerName
                    : order?.Customer?.firstName +
                      " " +
                      order?.Customer?.lastName}
                </span>
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
                <span style={{ textTransform: "capitalize" }}>
                  {" "}
                  {order?.ShowMovie?.Show?.Movie?.nameMovie.toLowerCase()}{" "}
                </span>
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
                  {order?.totatBefore
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"}
                </span>
              </span>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}></Col>
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
          </Row>
          <Row gutter={16} style={{ marginBottom: "10px" }}>
            <Col span={16}></Col>
            <Col span={8}>
              <span>
                Tổng tiền sau CK:
                <span>
                  {" "}
                  {order?.totalPrice
                    ?.toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ"}
                </span>
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
