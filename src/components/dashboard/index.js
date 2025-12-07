import React from "react";
import { Col, Row, Typography } from "antd";

// import {
//   InfoCircleOutlined,
//   UserOutlined,
//   LockOutlined,
// } from "@ant-design/icons";
import { 
  CardDashboard_Revenue,
  CardDashboard_NewCus,
  CardDashboard_Ticket,
  CardDashboard_Refund,
 } from "./CardDashboard";
import ColumnChart from "../chart/ColunmChart";
import PieChart from "../chart/PieChart";
import { TableTopMovie, TableTopCus } from "../table/TableTopMovie";
import statitisApi from "../../api/statitisApi";

const { Title, Text } = Typography;
const IndexDashboard = () => {
  const [data, setData] = React.useState([]);
  const [dataPie, setDataPie] = React.useState([]);
  const [dataTopMovie, setDataTopMovie] = React.useState([]);
  const [dataTopCustomer, setDataTopCustomer] = React.useState([]);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalTicket, setTotalTicket] = React.useState(0);
  const [totalCustomer, setTotalCustomer] = React.useState(0);
  const [totalRefund, setTotalRefund] = React.useState(0);
  const [ratioRevenue, setRatioRevenue] = React.useState(0);
  const [ratioTicket, setRatioTicket] = React.useState(0);
  const [ratioCustomer, setRatioCustomer] = React.useState(0);
  const [ratioRefund, setRatioRefund] = React.useState(0);
  const [rsRevenue, setRsRevenue] = React.useState(0);
  const [rsTicket, setRsTicket] = React.useState(0);
  const [rsCustomer, setRsCustomer] = React.useState(0);
  const [rsRefund, setRsRefund] = React.useState(0);

  React.useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await statitisApi.getRevenueInWeek();
        setData(response);
      } catch (error) {
        console.log("Failed to fetch revenue by customer: ", error);
      }
    };
    const fetchPercent = async () => {
      try {
        const response = await statitisApi.getPersenUser();
        setDataPie(response);
      } catch (error) {
        console.log("Failed to fetch percent: ", error);
      }
    };
    const fetchTopMovie = async () => {
      try {
        const response = await statitisApi.getTopMovie();
        response.map((item, index) => {
          item.key = index + 1;
          return item;
        });
        const newData = response.sort((a, b) => {
          return b.totalPrice - a.totalPrice;
      });
        console.log(newData);
        setDataTopMovie(newData);
      } catch (error) {
        console.log("Failed to fetch top movie: ", error);
      }
    };
    const fetchTopCustomer = async () => {
      try {
        const response = await statitisApi.getTopCustomer();
        const newList = response.map((item, index) => {
          item.key = index + 1;
          return {
            name: item.Customer.firstName + " " + item.Customer.lastName,
            rank: item.Customer.Rank.nameRank,
            code: item.Customer.code,
            ...item,
          }
        });
        console.log(newList);
        setDataTopCustomer(newList);
      } catch (error) {
        console.log("Failed to fetch top customer: ", error);
      }
    };
    const fetchRatio = async () => {
      try {
        const response = await statitisApi.getRatio();
        setTotalRevenue(response.statistic_revenue);
        setTotalTicket(response.qty_ticket);
        setTotalCustomer(response.qty_new_user);
        setTotalRefund(response.qty_order_refund);
        setRatioRevenue(response.ratio_revenue);
        setRatioTicket(response.ratio_ticket);
        setRatioCustomer(response.ratio_new_user);
        setRatioRefund(response.ratio_order_refund);
        setRsRevenue(response.rs_revenue);
        setRsTicket(response.rs_ticket);
        setRsCustomer(response.rs_new_user);
        setRsRefund(response.rs_order_refund);
      } catch (error) {
        console.log("Failed to fetch ratio: ", error);
      }
    };

    fetchRatio();
    fetchTopCustomer();
    fetchTopMovie();
    fetchPercent();
    fetchRevenue();
  }, []);
  return (
    <div className="site-card-wrapper">
      <Title level={5}>Dashboard</Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={6}>
          <CardDashboard_Revenue total={totalRevenue} ratio={ratioRevenue} rs= {rsRevenue}/>
        </Col>
        <Col span={6}>
          <CardDashboard_NewCus total={totalCustomer}  ratio= {ratioCustomer} rs= {rsCustomer} />
        </Col>
        <Col span={6}>
          <CardDashboard_Ticket total={totalTicket} ratio={ratioTicket} rs= {rsTicket} />
        </Col>
        <Col span={6}>
          <CardDashboard_Refund total={totalRefund} ratio={ratioRefund}  rs= {rsRefund} />
        </Col>
      </Row>
      <Row
        style={{ margin: "4rem 0" }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={11}>
          <ColumnChart data={data} />
        </Col>
        <Col span={2}></Col>
        <Col span={11}>
          <PieChart data={dataPie}/>
        </Col>
      </Row>

      <Row
        style={{ margin: "4rem 0 2rem 0" }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={14}>
          <TableTopMovie title={"Top 5 bộ phim có doanh thu cao nhất"} data={dataTopMovie} />
        </Col>
        <Col span={10}>
          <TableTopCus title={"Top 5 khách hàng thân thiết"}  data={dataTopCustomer}/>
        </Col>
      </Row>
    </div>
  );
};
export default IndexDashboard;
