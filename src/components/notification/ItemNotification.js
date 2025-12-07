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
} from "antd";

import {
  InfoCircleOutlined,
  UserOutlined,
  LockOutlined,
  FileImageOutlined,
} from "@ant-design/icons";

import "./ItemNotificationStyle.scss";

const { Title, Text } = Typography;
const ItemNotification = () => {
  //console.log("render re");
  return (
    <div className="item_notification">
      <div>
        <div className="item_notification_iconBlock">
          <FileImageOutlined style={{ color: "#0190f3" }} />
        </div>
      </div>
      <div className="item_notification_content">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Text>Anh Nguyen vua dat ve xem phim</Text>
          <Text style={{ fontSize: "12px", color: "#72808e" }}>1 min ago</Text>
        </div>
      </div>
      <div>
        {" "}
        <Text style={{ fontSize: "12px", color: "#72808e" }}>3:00 PM</Text>
      </div>
    </div>
  );
};
export default ItemNotification;
