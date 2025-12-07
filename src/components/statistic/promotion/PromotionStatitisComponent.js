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
import promotionApi from "../../../api/promotionApi";
import statitisApi from "../../../api/statitisApi";
import { exportExcel } from "../../export-excel/statistics/reveneu-promotion";
import { useDispatch, useSelector } from "react-redux";

const { Title, Text } = Typography;

const { RangePicker } = DatePicker;
const dateFormat = "YYYY/MM/DD";
const dateFormatRq = "YYYY-MM-DD";

const PromotionStatitisComponent = () => {
  const user = useSelector((state) => state.user);
  
  const [type, setType] = useState("");
  const [code, setCode] = useState("");

  const [startDate, setStartDate] = useState(
     moment().startOf("month").format(dateFormatRq),
  );
  const [endDate, setEndDate] = useState(
    moment().format(dateFormatRq),
);
  const [listCode, setListCode] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchListCode = async () => {
      const res = await promotionApi.getAllPromotionLine();
      console.log(res);
      if (res) {
        const newListCode = res.map((item) => {
          return {
            value: item.promotionCode,
            label: item.promotionCode,
          };
        });
        setListCode(newListCode);
      }
      
    };
    fetchListCode();
  }, []);

  useEffect(() => {
    const fetchListData = async () => {
      console.log(startDate, endDate, type, code);
      const res = await statitisApi.getRevenuePromotion({
        start_date: startDate,
        end_date: endDate,
        promotion_type: type,
        promotion_code: code,
      })
      console.log(res);
      if (res) {
        const newLs = res.map((item) => {
          const budgetLeft = item.PromotionLine.budget - item.totalUsed;
          return {
            promotionCode:item.PromotionLine.promotionCode,
            desc: item.PromotionLine.desc,
            startDate: item.PromotionLine.startDate,
            endDate: item.PromotionLine.endDate,
            budget: item.PromotionLine.budget,
            budgetLeft: budgetLeft,
            discount: item.discount ? item.discount : 0,
            totalUsed: item.totalUsed,
            count: item.count
          };
        });
        console.log(newLs);
        setData(newLs);
      }

    };
    fetchListData();
  }, [type, code, dayjs(startDate).format('DD/MM/YYYY'), dayjs(endDate).format('DD/MM/YYYY')]);

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

  const handleChangeCode = (e) => {
    console.log(e);
    setCode(e.value);
  };

  const handleExportExcel = () => {
    console.log(data);
     exportExcel(data, startDate, endDate, user);
  };
    
  return (
    <div className="site-card-wrapper">
      <Title level={5} style={{ marginBottom: "1rem" }}>
        Thống kê CTKM
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
        <Col span={8}>
          <RangePicker
            placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
            style={{ minWidth: "100%" }}
            onChange={onChangeDate}
            defaultValue={[
              dayjs(moment().startOf("month").format(dateFormat), dateFormat),
              dayjs(moment().format(dateFormat), dateFormat),
            ]}
            format={dateFormat}
            
          />
        </Col>
        <Col span={4}>
          <Select
            placeholder="Chọn loai khuyến mãi"
            style={{
              width: "200px",
              margin: "0 1rem",
            }}
            options={[
              { value: 1, label: "Tặng ghế" },
              { value: 2, label: "Giảm tiền" },
              { value: 3, label: "Ck phầm trăm" },
            ]}
            allowClear
            onChange={handleChangeType}
           // onChange={handleChangeEmployee}
          />
        </Col>
        {/* <Col span={6}>
          <Select
            placeholder="Chọn mã khuyến mãi"
            style={{
              width: "200px",
              margin: "0 1rem",
            }}
            options={listCode}
            allowClear
            onChange={handleChangeCode}
           // onChange={handleChangeEmployee}
          />
        </Col> */}
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
          <TableData data={data} />
        </Col>
      </Row>
    </div>
  );
};
export default PromotionStatitisComponent;
