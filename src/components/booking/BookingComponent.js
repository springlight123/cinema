import React, { useEffect, useState } from "react";
import { Button, Modal, Breadcrumb, Steps, theme } from "antd";
import PickFilmComponent from "./PickFilmComponent";
import PickSeatComponent from "./PickSeatComponent";
import PickShowComponent from "./PickShowComponent";
import PayComponent from "./PayComponent";
import ResultPage from "../sucesspage/ResultPage";
import { useDispatch, useSelector } from "react-redux";
import { cancelReservationData } from "../../services/ReservationFetch";
import Title from "antd/es/typography/Title";

const BookingComponent = ({ setTab }) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [film, setFilm] = useState(null);
  const [isSucess, setIsSucess] = useState(false);
  const [idOrder, setIdOrder] = useState(0);

  const depatch = useDispatch();
  const booking = useSelector((state) => state.booking);
  const user = useSelector((state) => state.user);

  const next = (currentFilm) => {
    setCurrent(current + 1);
    setFilm(currentFilm);
  };
  const prev = () => {
    if (current === 3) {
      const { show, film, seats } = booking;
      const listSeatId = seats.map((seat) => {
        return seat?.id;
      });
      const dataPayload = {
        showTime_id: show?.id,
        staff_id: user?.id,
        seats: [...listSeatId],
      };
      cancelReservationData(dataPayload);
    }
    setCurrent(current - 1);
  };
  const steps = [
    {
      title: "Chọn phim",
      content: <PickFilmComponent next={next} />,
    },
    {
      title: "Chọn suất chiếu",
      content: <PickShowComponent next={next} />,
    },
    {
      title: "Chọn ghế",
      content: <PickSeatComponent next={next} />,
    },
    {
      title: "Thanh toán",
      content: isSucess ? (
        <ResultPage
          setIsSucess={setIsSucess}
          setCurrent={setCurrent}
          idOrder={idOrder}
          next={next}
        />
      ) : (
        <PayComponent setIsSucess={setIsSucess} setIdOrder={setIdOrder} next={next} />
      ),
    },
  ];
  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));
  const contentStyle = {
    minHeight: "260px",
    color: token.colorTextTertiary,
    backgroundColor: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: `1px dashed ${token.colorBorder}`,
    marginTop: 16,
    minHeight: "80vh",
  };
  return (
    <div className="bookingComponent">
      <Title level={5} style={{ marginBottom: "1rem", marginTop:"0rem" }}>
        Đặt vé
      </Title>
      <Steps current={current} items={items} />
      <div style={contentStyle}>{steps[current].content}</div>
      <div
        style={{
          marginTop: 24,
        }}
      >
        {current > 0 && (
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => prev()}
          >
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};
export default BookingComponent;
