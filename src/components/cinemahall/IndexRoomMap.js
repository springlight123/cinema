import React, { useEffect, useState } from "react";
import {
  Input,
  Col,
  Row,
  Typography,
  Button,
  Modal,
  Breadcrumb,
  DatePicker,
  Select,
  notification
} from "antd";
import "./IndexRoomMap.scss";
import cinemaHallApi from "../../api/cinemaHallApi";
import { MdChair, MdOutlineSignalCellularNull } from "react-icons/md";
import { useSelector } from "react-redux";
import ModelSeat from "./ModelSeat";
import { notifySucess } from "../../utils/Notifi";
import { MESSAGE_UPDATE_SEAT_SUCCESS } from "../../constant";

const arrColumn = ["B", "C", "D", "E", "F", "G", "H", "I", "K"];
const arrRow = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const IndexCinemaMap = ({ setTab }) => {
  const [seats, setSeats] = useState([]);
  const idCinemaHall = useSelector((state) => state.cinemaHallId);
  const [seat, setSeat] = useState(null);
  const [possition, setPossition] = useState("");
  const [open, setOpen] = useState(false);
  const [changeSeat, setChangeSeat] = useState(false);

  useEffect(() => {
    const getSeats = async () => {
      try {
        const response = await cinemaHallApi.getCinemaHallSeatById(
          idCinemaHall
        );
        if (response) {
         
          setSeats(response);
        }
      } catch (error) {
        console.log("Featch erro: ", error);
      }
    };
    getSeats(idCinemaHall);
  }, [changeSeat]);

  const handleShowModel = (val, idx, seat) => {
    //call api get seat
    const getSeatById = async (id) => {
      try {
        const response = await cinemaHallApi.getSeatById(id);
        if (response) {
          setSeat(response);
          setPossition(val + "-" + idx);
          setOpen(true);
        }
      } catch (error) {
        console.log("Featch erro: ", error);
      }
    };
    getSeatById(seat.id);
  };

  const handleRouter = (value) => {
    setTab(value);
  };

  const handleLogic = () =>{
    setSeat(null);
    setOpen(false)
    setChangeSeat(!changeSeat)
  }
  return (
    <div className="site-card-wrapper">
      <Breadcrumb style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <Breadcrumb.Item> <a onClick={()=> handleRouter(0)}> Rạp</a> </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={()=> handleRouter(1)} > Phòng chiếu </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          Sơ đồ phòng chiếu
        </Breadcrumb.Item>
      </Breadcrumb>

      <Row
        gutter={{
          xs: 8,
          lg: 32,
        }}
        style={{ minHeight: "100vh", background: "", padding: "1rem" }}
      >
        <Col
          span={20}
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
            <text style={{ color: "white", fontWeight: "700" }}>Màn Hình</text>
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
                {arrColumn.map((val, idx) => {
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
                          let tmp = idx + 1
                          if (seat.seatColumn === val) {
                            return (
                              <>
                              {
                                seat?.Product.typeSeat === 3 ? 
                              <td
                                onClick={() => handleShowModel(val, idx + 1, seat)}
                                title={seat?.statusSeat ? val + tmp : val + tmp + " ghế bảo trì"}
                                key={seat.createdAt}
                                style={seat?.statusSeat ? {background:"red"} : {}}
                              >
                                <span>
                                  <MdChair />
                                  <MdChair />
                                </span>
                              </td> : 
                               <td
                               onClick={() => handleShowModel(val, idx + 1, seat)}
                               title={seat?.statusSeat ? val + tmp : val + tmp + " ghế bảo trì"}
                               key={seat.createdAt}
                               style={seat?.statusSeat ? {background:"red"} : {}}
                             >
                               <span>
                                 <MdChair />
                               
                               </span>
                             </td>
                              }
                              
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
        <Col span={4} className="block-content-details">
          <Row style={{ marginTop: "16px" }}>
            <Col span={16}>
              <p>Tổng số vị trí:</p>{" "}
            </Col>
            <Col span={8} className="block-span">
              <span>81</span>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <p>Tổng số ghế:</p>{" "}
            </Col>
            <Col span={8} className="block-span">
              <span>{seats.length}</span>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <p style={{ fontSize: "16px", color: "blue" }}>
              <MdChair />
              </p>{" "}
            </Col>
            <Col span={14} className="block-span">
              <span>Ghế đơn</span>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <p style={{ fontSize: "16px", color: "blue" }}>
              <MdChair />
              <MdChair />
              </p>{" "}
            </Col>
            <Col span={14} className="block-span">
              <span>Ghế đôi</span>
            </Col>
          </Row>
        </Col>
      </Row>
      
      {
        open ? <ModelSeat  seat={seat} possition={possition} handleLogic={handleLogic}/> : null
      }
      
    </div>
  );
};
export default IndexCinemaMap;
