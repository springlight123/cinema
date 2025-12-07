//test1
import React, { useEffect, useState } from "react";
import { Input, Col, Row, Button, notification } from "antd";
import "../cinemahall/IndexRoomMap.scss";
import "./index.scss";
import { useDispatch, useSelector } from "react-redux";
import cinemaHallApi from "../../api/cinemaHallApi";
import {
  MdAlternateEmail,
  MdChair,
  MdOutlineSignalCellularNull,
} from "react-icons/md";
import priceApi from "../../api/priceApi";
import { GHE_DOI, GHE_THUONG, MESSAGE_PICK_SEAT, VND } from "../../constant";
import ItemProduct from "./ItemProduct";
import ModelCustomer from "./ModelCustomer";
import { notifyError, notifyWarn } from "../../utils/Notifi";
import { setBooking, setIsBooking } from "../../redux/actions";
import {
  createReservationData,
  getReservationData,
} from "../../services/ReservationFetch";
import { getCinemaHallById } from "../../services/CinemaFetch";

const arrColumn = ["B", "C", "D", "E", "F", "G", "H", "I", "K"];

const arrRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const PickSeatComponent = ({ next }) => {
  const [seats, setSeats] = useState([]);
  const [listPrice, setListPrice] = useState([]);
  const depatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const cinema = useSelector((state) => state.cinema);
  const [totalPrice, setTotalPrice] = useState(0);
  //0 : pick seat
  //1: pick combo
  const [tab, setTab] = useState(0);
  const [pickProducts, setPickProducts] = useState([]);
  const [seatPicked, setSeatPicked] = useState([]);
  const [showModel, setShowMode] = useState(false);
  const user = useSelector((state) => state.user);
  const isBooking = useSelector((state) => state.isBooking);
  // console.log("---", booking?.hall?.name);
  useEffect(() => {
    getCinemaHallById(booking?.show?.Show?.idCinemaHall).then((data) => {
      depatch(setBooking({ ...booking, hall: data }));
    });
    const getSeats = async (_id) => {
      try {
        const response = await cinemaHallApi.getCinemaHallSeatById(_id);

        if (response) {
          const { show } = booking;
          console.log("show", show.id);

          getReservationData(show?.id)
            .then((result) => {
              const dataClear = result.filter((seat) => {
                return seat?.status === 0;
              });

              const finalSeat = response.map((val) => {
                const searchIndex = dataClear.findIndex(
                  (item) => item.id === val.id
                );
                if (searchIndex != -1) {
                  return { ...val, status: 0 };
                }
                return val;
              });
              console.log(finalSeat);
              setSeats(finalSeat);
            })
            .catch(() => {
              notifyError("Lỗi hệ thống không lấy được danh sách ghế đã đặt.");
            });
        }
      } catch (error) {
        console.log("Featch erro: ", error);
      }
    };
    const getPrice = async () => {
      try {
        const response = await priceApi.getPriceProduct();
        if (response) {
          const data = response?.filter((val) => {
            return val?.price > 0;
          });

          setListPrice(data);
        }
      } catch (error) {
        console.log("Featch erro: ", error);
      }
    };
    getPrice();
    getSeats(booking?.show?.Show?.idCinemaHall);
  }, []);

  const handleShowModel = (val, idx, seat) => {
    if (!seat.status) {
      return;
    }

    const isFound = seatPicked.some((element) => {
      if (element.id === seat.id) {
        return true;
      }
      return false;
    });
    if (isFound) {
      const newArr = seatPicked.filter((val) => {
        if (val?.id != seat?.id) {
          return val;
        }
      });
      setSeatPicked(newArr);
    } else {
      if (seat.Product.typeSeat === 3) {
        //double seat
        //featch price
        const array = listPrice.filter((val) => {
          return val.productName == GHE_DOI;
        });
        setSeatPicked([...seatPicked, { ...seat, price: array[0]?.price }]);
      } else if (seat.Product.typeSeat === 1) {
        const array = listPrice.filter((val) => {
          return val.productName == GHE_THUONG;
        });
        setSeatPicked([...seatPicked, { ...seat, price: array[0]?.price }]);
      }
    }
  };
  const onChange = (e, value) => {
    if (e === 0 || e === null) {
      let newArr = pickProducts.filter((val) => {
        return val?.id != value?.id;
      });
      setPickProducts(newArr);
      return;
    }
    const item = { ...value, quatity: e };
    const isFound = pickProducts.some((element) => {
      if (element.id === value.id) {
        return true;
      }
      return false;
    });
    if (isFound) {
      const newArr = pickProducts.map((val) => {
        if (val?.id === value?.id) {
          return { ...val, quatity: e };
        }
        return val;
      });
      setPickProducts(newArr);
    } else {
      setPickProducts([...pickProducts, { ...item }]);
    }
  };

  const totalPriceProduct = pickProducts.reduce((value, item) => {
    return value + item?.price * item?.quatity;
  }, 0);

  const handleChangeTab = () => {
    if (seatPicked.length === 0) {
      notifyWarn(MESSAGE_PICK_SEAT);
      return;
    }
    if (tab === 0) {
      depatch(setBooking({ ...booking, seats: seatPicked }));
      setTab(1);
    } else {
      depatch(setBooking({ ...booking, products: pickProducts }));

      const { show, film, seats } = booking;
      const listSeatId = seats.map((seat) => {
        return seat?.id;
      });
      const dataPayload = {
        showTime_id: show?.id,
        staff_id: user?.id,
        seats: [...listSeatId],
      };
      createReservationData(dataPayload)
        .then(() => {
          //depatch(setIsBooking(true))
          next();
        })
        .catch(() => {
          notifyError("Hệ thống đang có lỗi.");
        });
    }
  };
  useEffect(() => {
    const sumWithInitial = seatPicked.reduce((total, item) => {
      // console.log(value);
      return 10000 + total;
    }, 0);

    const sumProducts = pickProducts.reduce((total, item) => {
      // console.log(value);
      return item?.price * item?.quatity + total;
    }, 0);
    //console.log(sumWithInitial);
    setTotalPrice(sumWithInitial + sumProducts);
  }, [seatPicked, pickProducts]);

  return (
    <div className="pick_seat site-card-wrapper">
      <Row
        gutter={{
          xs: 8,
          lg: 32,
        }}
        style={{ padding: "1rem", minHeight: "80vh" }}
      >
        {tab === 0 ? (
          <>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: "1rem",
                marginBottom: "1rem",
              }}
            >
              <div className="blocks-remine">
                <div className="blocks-remine">
                  <span
                    className="block-remine_block"
                    style={{ backgroundColor: "red" }}
                  ></span>
                  <span className="blocks-remine_text">Ghế bảo trì</span>
                </div>
              </div>
              <div className="blocks-remine">
                <div className="blocks-remine">
                  <span
                    className="block-remine_block"
                    style={{ backgroundColor: "#BDBDD7" }}
                  ></span>
                  <span className="blocks-remine_text">Ghế đã đặt</span>
                </div>
              </div>
              <div className="blocks-remine">
                <div className="blocks-remine">
                  <MdChair />
                  <span className="blocks-remine_text">Ghế đơn</span>
                </div>
              </div>
              <div className="blocks-remine">
                <div className="blocks-remine">
                  <MdChair />
                  <MdChair />
                  <span className="blocks-remine_text">Ghế đôi</span>
                </div>
              </div>
            </div>
            <Col
              span={16}
              style={{
                background: "",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "80%",
                  height: "24px",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  background: "orange",
                  borderRadius: "4px",
                }}
              >
                <text style={{ color: "white", fontWeight: "700" }}>
                  Màn Hình
                </text>
              </div>
              <div className="block-cinema">
                <div className="cinemaHall_left">
                  <span>STT</span>
                  <span>B</span>
                  <span>C</span>
                  <span>D</span>
                  <span>E</span>
                  <span>F</span>
                  <span>G</span>
                  <span>H</span>
                  <span>I</span>
                  <span>K</span>
                </div>
                <table id="cinema-hall">
                  <tr>
                    {arrRow.map((val) => {
                      return <td>{val}</td>;
                    })}
                  </tr>
                  <>
                    {seats &&
                      arrColumn.map((val, idx) => {
                        let number = 1;
                        let agg = 1;
                        const newArr = seats.filter((seat) => {
                          if (seat.seatColumn === val) {
                            return seat;
                          }
                        });

                        return (
                          <>
                            <tr>
                              {newArr.map((seat, idx) => {
                                let tmp = idx + 1;
                                const index = seatPicked.findIndex(
                                  (element) => {
                                    if (element.id === seat?.id) {
                                      return true;
                                    }
                                    return false;
                                  }
                                );

                                if (index !== -1) {
                                  // 👉️ object is contained in the array
                                  return (
                                    <>
                                      {seat?.Product?.typeSeat === 3 ? (
                                        <td
                                          onClick={() =>
                                            handleShowModel(val, idx + 1, seat)
                                          }
                                          title={
                                            seat?.status
                                              ? val + tmp
                                              : val + tmp + " ghế đã đặt"
                                          }
                                          key={seat?.createdAt}
                                          style={{ backgroundColor: "gray" }}
                                        >
                                          <span>
                                            <MdChair />
                                            <MdChair />
                                          </span>
                                        </td>
                                      ) : (
                                        <td
                                          onClick={() =>
                                            handleShowModel(val, idx + 1, seat)
                                          }
                                          title={
                                            seat?.status
                                              ? val + tmp
                                              : val + tmp + " ghế đã đặt"
                                          }
                                          key={seat?.createdAt}
                                          style={{ backgroundColor: "gray" }}
                                        >
                                          <span>
                                            <MdChair />
                                          </span>
                                        </td>
                                      )}
                                    </>
                                  );
                                }
                                if (seat?.seatColumn === val) {
                                  return (
                                    <>
                                      {seat?.Product?.typeSeat === 3 ? (
                                        <>
                                          {seat?.statusSeat ? (
                                            <td
                                              //onClick={() => handleShowModel(val, idx + 1, seat)}
                                              title={
                                                seat?.statusSeat
                                                  ? val + tmp
                                                  : val + tmp + " ghế  bảo trì"
                                              }
                                              key={seat?.createdAt}
                                              style={
                                                seat?.statusSeat
                                                  ? {
                                                      background: "red",
                                                      cursor: "not-allowed",
                                                    }
                                                  : {}
                                              }
                                            >
                                              <span>
                                                <MdChair />
                                                <MdChair />
                                              </span>
                                            </td>
                                          ) : (
                                            <td
                                              onClick={() =>
                                                handleShowModel(
                                                  val,
                                                  idx + 1,
                                                  seat
                                                )
                                              }
                                              title={
                                                seat?.status
                                                  ? val + tmp
                                                  : val + tmp + " ghế đã đặt"
                                              }
                                              key={seat?.createdAt}
                                              style={
                                                !seat?.status
                                                  ? {
                                                      background: "#BDBDD7",
                                                      color: "white",
                                                      cursor: "not-allowed",
                                                    }
                                                  : {}
                                              }
                                            >
                                              <span>
                                                <MdChair />
                                                <MdChair />
                                              </span>
                                            </td>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          {seat?.statusSeat ? (
                                            <td
                                              // onClick={() => handleShowModel(val, idx + 1, seat)}
                                              title={
                                                seat?.statusSeat
                                                  ? val + tmp
                                                  : val + tmp + " ghế  bảo trì"
                                              }
                                              key={seat?.createdAt}
                                              style={
                                                seat?.statusSeat
                                                  ? {
                                                      background: "red",
                                                      cursor: "not-allowed",
                                                    }
                                                  : {}
                                              }
                                            >
                                              <span>
                                                <MdChair />
                                              </span>
                                            </td>
                                          ) : (
                                            <td
                                              onClick={() =>
                                                handleShowModel(
                                                  val,
                                                  idx + 1,
                                                  seat
                                                )
                                              }
                                              title={
                                                seat?.status
                                                  ? val + tmp
                                                  : val + tmp + " ghế đã đặt"
                                              }
                                              key={seat?.createdAt}
                                              style={
                                                !seat?.status
                                                  ? {
                                                      background: "#BDBDD7",
                                                      color: "white",
                                                      cursor: "not-allowed",
                                                    }
                                                  : {}
                                              }
                                            >
                                              {/* booking_content-top */}
                                              <span>
                                                <MdChair />
                                              </span>
                                            </td>
                                          )}
                                        </>
                                      )}
                                    </>
                                  );
                                }
                                return (
                                  <td
                                    onClick={() => handleShowModel(val, agg++)}
                                    title={val + number}
                                  ></td>
                                );
                              })}
                            </tr>
                          </>
                        );
                      })}
                  </>
                </table>
              </div>
            </Col>
          </>
        ) : (
          <Col span={16}>
            <h3>Chọn bắp/ nước</h3>
            {listPrice.length === 2 ? (
              <p>Hiện không có bắp nước.</p>
            ) : (
              <div className="products">
                <div className="header_text">
                  <span style={{ width: "45%", textAlign: "left" }}>Combo</span>
                  <span style={{ width: "20%", textAlign: "end" }}>
                    Số lượng
                  </span>
                  <span style={{ width: "20%", textAlign: "end" }}>
                    Đơn giá (VNĐ)
                  </span>
                  <span style={{ width: "15%", textAlign: "end" }}>
                    Tổng (VNĐ)
                  </span>
                </div>
                <div className="products_list">
                  {listPrice?.map((val) => {
                    if (
                      val?.productName === GHE_DOI ||
                      val?.productName === GHE_THUONG
                    ) {
                      return null;
                    }
                    const index = pickProducts.findIndex((product) => {
                      return product?.id === val?.id;
                    });
                    if (index != -1) {
                      const totalPrice =
                        pickProducts[index]?.price *
                        pickProducts[index]?.quatity;
                      return (
                        <ItemProduct
                          val={val}
                          handleOnChange={onChange}
                          totalPrice={totalPrice}
                        />
                      );
                    }

                    return (
                      <ItemProduct
                        val={val}
                        handleOnChange={onChange}
                        totalPrice={0}
                      />
                    );
                  })}
                </div>
                <p className="total_price">
                  Tiền sản phẩm: <span>{VND.format(totalPriceProduct)}</span>
                </p>
              </div>
            )}
          </Col>
        )}
        <Col span={8}>
          <div className="booking_content">
            <div className="booking_content-top">
              <img src={booking?.film?.image} />
              <h3>{booking?.film?.nameMovie}</h3>
            </div>

            <div className="booking_content-bottom">
              <p className="p-custom">
                Rạp: <span>{cinema?.name}</span>
              </p>
              <p className="p-custom">
                Phòng: <span>{booking?.hall?.name}</span>
              </p>
              <p>
                Suất chiếu:{" "}
                <span>
                  {booking?.show?.ShowTime?.showTime +
                    " - " +
                    booking?.show?.showDate}
                </span>
              </p>
              <p>
                Combo:{" "}
                {pickProducts.length > 0 ? (
                  pickProducts.map((val) => {
                    return (
                      <span>{val?.quatity + " - " + val?.productName}, </span>
                    );
                  })
                ) : (
                  <span>Không có sản phẩm.</span>
                )}{" "}
              </p>
              <p>
                Ghế:{" "}
                <span>
                  {seatPicked.length > 0
                    ? seatPicked.map((val) => {
                        return val?.seatColumn + "-" + val?.seatRow + ", ";
                      })
                    : "Chưa chọn ghế."}
                </span>
              </p>

              <p>
                Tổng:{" "}
                <span className="total_price">{VND.format(totalPrice)}</span>
              </p>
            </div>
            <div style={{ display: "flex" }}>
              {tab === 1 ? (
                <Button
                  type="primary"
                  onClick={() => {
                    setTab(0);
                  }}
                  style={{ marginTop: "12px", marginRight: "12px" }}
                >
                  Quay lại
                </Button>
              ) : null}
              <Button
                type="primary"
                onClick={() => handleChangeTab()}
                style={{ marginTop: "12px" }}
              >
                Tiếp tục
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default PickSeatComponent;
