import React, { useEffect, useState } from "react";
import {
  Input,
  Col,
  Row,
  Typography,
  Button,
  Modal,
  Breadcrumb,
  Card,
  DatePicker,
  Select,
  Form,
} from "antd";

import "./ShowChart.scss";
import moment from "moment";
import CardTime from "./CardTime";
import useShowChartHook from "./useShowChartHook.js";

const dateFormat = "YYYY/MM/DD";
const caculatorDay = (dateNumber) => {
  let day = "";
  switch (dateNumber) {
    case 0:
      day = "Chủ nhật";
      break;
    case 1:
      day = "Thứ 2";
      break;
    case 2:
      day = "Thứ 3";
      break;
    case 3:
      day = "Thứ 4";
      break;
    case 4:
      day = "Thứ 5";
      break;
    case 5:
      day = "Thứ 6";
      break;
    case 6:
      day = "Thứ bảy";
  }

  return day;
};
const ShowChart = ({ setTab }) => {
  const {
    listMovie,
    listCinema,
    cinema,
    handleChange,
    handleChangeCinema,
    dataTimes,
    movie,
    form,
    handleChangeDate,
    dateAmount,
    handeChangeDatePicker
  } = useShowChartHook();
  const [showsSang, setShowSang] = useState([]);
  const [showsChieu, setShowChieu] = useState([]);
  const [showsToi, setShowToi] = useState([]);

  useEffect(() => {
    if (dataTimes.length === 7) {
      const dataSang = dataTimes.map((val) => {
        const data = val.filter((item) => {
          const hour = +item?.showTime?.substring(0, 2);
          if (hour < 12) {
            return item;
          }
        });

        const sortData = data.sort((a, b) => {
          return +a.showTime?.substring(0, 2) - +b.showTime?.substring(0, 2);
        });
        return sortData;
      });

      const dataChieu = dataTimes.map((val) => {
        const data = val.filter((item) => {
          const hour = +item?.showTime?.substring(0, 2);
          if (hour >= 12 && hour < 18) {
            return item;
          }
        });

        const sortData = data.sort((a, b) => {
          return +a.showTime?.substring(0, 2) - +b.showTime?.substring(0, 2);
        });
        return sortData;
      });
      const dataToi = dataTimes.map((val) => {
        const data = val.filter((item) => {
          const hour = +item?.showTime?.substring(0, 2);
          if (hour >= 18 && hour < 24) {
            return item;
          }
        });

        const sortData = data.sort((a, b) => {
          return +a.showTime?.substring(0, 2) - +b.showTime?.substring(0, 2);
        });
        return sortData;
      });
      setShowChieu(dataChieu);
      setShowToi(dataToi);
      setShowSang(dataSang);
    }
  }, [dataTimes]);

  const handleReturn = () => {
    setTab(0);
  };
  return (
    <div className="site-card-wrapper">
      <Breadcrumb style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <Breadcrumb.Item onClick={() => handleReturn()}>
          {" "}
          <a>Lịch chiếu</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Biểu đồ lịch</Breadcrumb.Item>
      </Breadcrumb>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Form form={form} style={{display: "flex"}}>
          <Form.Item
            name="cinemaPick"
            style={{marginBottom: "0px"}}
          >
          <Select
            placeholder="Chọn chi nhánh"
            style={{ width: 150 }}
            options={listCinema}
            defaultValue={cinema?.id}
            onChange={handleChangeCinema}
          ></Select>
           </Form.Item>
          <Form.Item
            name="moviePick"
            style={{marginBottom: "0px"}}
          >
            <Select
            style={{ margin: "0 0.5rem", width: 300 }}
            placeholder="Chọn phim"
            options={listMovie}
            defaultValue={listMovie[0]?.value}
            onChange={handleChange}
          ></Select>
          </Form.Item>
        
        </Form>
        <div
          style={{
            justifyContent: "flex-end",
          }}
        >
          {/* <DatePicker
            defaultValue={moment()}
            format={dateFormat}
            style={{ margin: "0 0.5rem" }}
            onChange={handeChangeDatePicker}
          /> */}
          <Button type="primary" title="Lịch hiện tại" onClick={() => handleChangeDate(0)}>
            Hiện tại
          </Button>
          <Button
            type="primary"
            title="Lịch hiện tại"
            onClick={() => handleChangeDate(1)}
            style={{ margin: "0 0.5rem" }}
          >
            Trở về
          </Button>
          <Button type="primary" title="Lịch hiện tại" onClick={() => handleChangeDate(2)}>
            Tiếp
          </Button>
        </div>
      </div>

      <Row
        style={{ marginBottom: "5rem" }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={24}>
          <table id="customers">
            <tr>
              <th>Ca chiếu</th>
              <th>
                {caculatorDay(moment().startOf("week").add(1 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(1 + dateAmount, "days").format(dateFormat)}
              </th>
              <th>
                {caculatorDay(moment().startOf("week").add(2 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(2 + dateAmount, "days").format(dateFormat)}
              </th>
              <th>
                {caculatorDay(moment().startOf("week").add(3 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(3 + dateAmount, "days").format(dateFormat)}
              </th>
              <th>
                {caculatorDay(moment().startOf("week").add(4 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(4 + dateAmount, "days").format(dateFormat)}
              </th>
              <th>
                {caculatorDay(moment().startOf("week").add(5 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(5 + dateAmount, "days").format(dateFormat)}
              </th>
              <th>
                {caculatorDay(moment().startOf("week").add(6 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(6 + dateAmount, "days").format(dateFormat)}
              </th>
              <th>
                {caculatorDay(moment().startOf("week").add(7 + dateAmount, "days").day())}{" "}
                <br />
                {moment().startOf("week").add(7 + dateAmount, "days").format(dateFormat)}
              </th>
            </tr>
            <tbody className="style-table">
              <tr className="css-row">
                {" "}
                <td className="time-row">Sáng </td>
                {showsSang.length > 0 &&
                  showsSang.map((val) => {
                    return (
                      <td>
                        {val?.map((item) => {
                          return <CardTime movie={movie} item={item} />;
                        })}
                      </td>
                    );
                  })}
              </tr>
              <tr className="css-row">
                {" "}
                <td className="time-row">Chiều </td>
                {showsChieu.length > 0 &&
                  showsChieu.map((val) => {
                    return (
                      <td>
                        {val?.map((item) => {
                          return <CardTime movie={movie} item={item} />;
                        })}
                      </td>
                    );
                  })}
              </tr>
              <tr className="css-row">
                {" "}
                <td className="time-row">Tối </td>
                {showsToi.length > 0 &&
                  showsToi.map((val) => {
                    return (
                      <td>
                        {val?.map((item) => {
                          return <CardTime movie={movie} item={item} />;
                        })}
                      </td>
                    );
                  })}
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </div>
  );
};
export default ShowChart;
