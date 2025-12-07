import React from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Col,
  Row,
  Typography,
  Tooltip,
  Space,
  Card,
} from "antd";
import "./DashBoardStyle.scss";
import { LineChartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const CardDashboard_Revenue = ({ total, ratio, rs }) => {
  return (
    <Card>
      <Text className="card_title">Doanh thu</Text>
      <div className="card_content">
        <Text className="card_content_text">
          { total ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} đ 
        </Text>
        <div className="card_content-div">
          <LineChartOutlined />
          <span>{ratio || 0}%</span>
        </div>
      </div>
      <Text className="card_extra">
        Tăng thêm{" "}
        <span
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {" "}
          {rs ?  rs ? rs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0 :0}đ
        </span>{" "}
        trong tháng này
      </Text>
    </Card>
  );
};

const CardDashboard_NewCus = ({ total, ratio, rs }) => {
  return (
    <Card>
      <Text className="card_title">Khách hàng mới</Text>
      <div className="card_content">
        <Text className="card_content_text">
          { total ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} KH
        </Text>
        <div className="card_content-div">
          <LineChartOutlined />
          <span>{ratio|| 0}%</span>
        </div>
      </div>
      <Text className="card_extra">
        Tăng thêm{" "}
        <span
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {" "}
          { rs ? rs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0} KH
        </span>{" "}
        trong tháng này
      </Text>
    </Card>
  );
};

const CardDashboard_Ticket = ({ total, ratio, rs }) => {
  return (
    <Card>
      <Text className="card_title">Tổng số vẽ bán ra</Text>
      <div className="card_content">
        <Text className="card_content_text">
          { total ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} Vé
        </Text>
        <div className="card_content-div">
          <LineChartOutlined />
          <span>{ratio || 0}%</span>
        </div>
      </div>
      <Text className="card_extra">
        Tăng thêm{" "}
        <span
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {" "}
          { rs ? rs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0}{" "} Vé
        </span>{" "}
        trong tháng này
      </Text>
    </Card>
  );
};

const CardDashboard_Refund = ({ total, ratio , rs }) => {
  return (
    <Card>
      <Text className="card_title">Tổng số vé trả</Text>
      <div className="card_content">
        <Text className="card_content_text">
          { total ? total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 0} Vé
        </Text>
        <div className="card_content-div">
          <LineChartOutlined />
          <span>{ratio|| 0}%</span>
        </div>
      </div>
      <Text className="card_extra">
        Tăng thêm{" "}
        <span
          style={{
            color: "#1890ff",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          {" "}
          { rs ? rs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","):0} Vé
        </span>{" "}
        trong tháng này
      </Text>
    </Card>
  );
};
export {
  CardDashboard_Revenue,
  CardDashboard_NewCus,
  CardDashboard_Ticket,
  CardDashboard_Refund,
};
