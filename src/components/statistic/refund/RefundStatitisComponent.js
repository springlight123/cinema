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
} from "antd";
import RevenueTable from "../table/RevenueTable";
import dayjs from "dayjs";
import moment from "moment";
import useRevenueComponentHook from "../useRevenueComponentHook";
import useCustomerComponentHook from "./useCustomerComponentHook";
import TableData from "./TableData";
import statitisApi from "../../../api/statitisApi";
import TableExpand from "./TableExpand";
import { exportExcel } from "../../export-excel/statistics/reveneu-refund";

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const dateFormatRq = "YYYY-MM-DD";

const RefundStatitisComponent = () => {
  const [start_date, setStartDate] = useState( moment().startOf("month").format(dateFormatRq));
  const [end_date, setEndDate] = useState(moment().format(dateFormatRq),);
  const [type, setType] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchListData = async () => {
      console.log(start_date, end_date, type);
      const res = await statitisApi.getRefundStatitis({
        start_date,
        end_date,
        type,
      });
      if (res) {
        const newListData = res.map((item) => {
          const totalBeforeDiscount = item.totalPrice + item.totalDiscount;
          return {
            ...item,
            createdAt: dayjs(item.createdAt).format("YYYY-MM-DD HH:mm"),
            refundDate: dayjs(item.refundDate).format("YYYY-MM-DD HH:mm"),
            totalBeforeDiscount,
          }
        });
        console.log(newListData);

        setData(newListData);
      }
    };
    fetchListData();
  }, [start_date, end_date, type]);

  const onChangeDate = (date, dateString) => {
    setStartDate(dateString[0].replaceAll('/', '-'));
    setEndDate(dateString[1].replaceAll('/', '-'));
  };

  const handleChangeType = (value) => {
    if (value === undefined) {
      setType("");
      return;
    }
    setType(value);
  };

  const handleExportExcel = async () => {
    console.log(data);
    await exportExcel(data, dayjs(start_date).format('DD/MM/YYYY'), dayjs(end_date).format('DD/MM/YYYY'));
  };

  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Thống kê trả vé
      </Title>
      <Row
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
        style={{ marginLeft: 0, marginRight: 0 }}
      >
        <Col span={6}>
          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            style={{ minWidth: "50%" }}
            onChange={onChangeDate}
            defaultValue={[
              dayjs(moment().startOf("month").format(dateFormat), dateFormat),
              dayjs(moment().format(dateFormat), dateFormat),
            ]}
            format={dateFormat}
          />
        </Col>
        <Col span={12}>
          <Select
            placeholder="Chọn loại ghế"
            style={{
              width: "200px",
              margin: "0 1rem",
            }}
            options={[
              { value: 1, label: "Ghế thường" },
              { value: 3, label: "Ghế VIP" },
            ]}
            onChange={handleChangeType}
            allowClear
            // onChange={handleChangeEmployee}
          />
        </Col>
        <Col span={4} style={{ position: "absolute", right: "2.5%" }}>
          <Button type="primary" title="Xuất file"
            onClick={handleExportExcel}
          >
            Xuất báo cáo
          </Button>
        </Col>
      </Row>

      <Row
        style={{ margin: "1rem 0 1rem 0" }}
        gutter={{
          xs: 8,
          sm: 16,
          md: 16,
          lg: 16,
        }}
      >
        <Col span={24}>
          <TableData  data={data} />
        </Col>
      </Row>
    </div>
  );
};
export default RefundStatitisComponent;
