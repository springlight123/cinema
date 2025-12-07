import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
  TimePicker,
  Upload,
  message,
} from "antd";
import promotionApi from "../../api/promotionApi";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import dayjs from "dayjs";
import productApi from "../../api/productApi";
import { KM_MONEY, KM_PERCENT, KM_PRODUCT, TYPE_FOOD_PRODUCT, TYPE_SEAT_PRODUCT } from "../../constant";
import * as yup from 'yup';
import { MESSAGE_REQUIRE_NAME, MESSAGE_WITHOUT_SPECIAL } from "../../utils/constants";
const newDateFormat = "YYYY-MM-DD";
const { RangePicker } = DatePicker;

let schema = yup.object().shape({
  promotionCode: yup.string().required(MESSAGE_REQUIRE_NAME('CTKM')).matches(/^[a-zA-Z\s0-9]{1,}$/g, MESSAGE_WITHOUT_SPECIAL('Tên CTKM')),
});

function checkBetween(date1, date2, date3) {
  return moment(date1).isBetween(date2, date3);
}

export const yupSync = {
  async validator({ field }, value) {
    await schema.validateSyncAt(field, { [field]: value });
  },
};

const useModelPromotionLine = ({
  isShowModelDetail,
  setIsShowModelDetail,
  startDateDb,
  endDateDb,
  idPromotionLine,
  setIdPromotionLine
}) => {
  const [form] = Form.useForm();
  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);
  const [type, setType] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [listProductSeat, setListProductSeat] = useState([]);
  const [listProduct, setListProduct] = useState([]);
  const [promotionLine, setPromotionLine] = useState(null);
  const [isEnable, setIsEnable] = useState(true);
  const [promtionDetails, setPromotionDetails] = useState(null)
  
  const [category, setCategory] = useState(0);
  const [qtyBuy, setQtyBuy] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  
  const [moneyBought, setMoneyBought] = useState(0);
  const [percentDiscount, setPercentDiscount] = useState(0);
  const [maxMoneyPercent, setMaxMoneyPercent] = useState(0);

  const [productBuy, setProductBuy] = useState(0);
  const [productReceive, setProductReceive] = useState(0);
  const [qtyReceive, setQtyReceive] = useState(0);

  const onClose = () => {
    setIsShowModelDetail(false);
  };

//   //handle submit form create new customer...
  const handleSubmit = (val) => {
    console.log("val", val);
    console.log("======= MoneyPromotion =========");
    console.log("category", category);
    console.log("qtyBuy", qtyBuy);
    console.log("totalDiscount", totalDiscount);

    console.log("======= Percent =========");
    console.log("moneyBought", moneyBought);
    console.log("percentDiscount", percentDiscount);
    console.log("maxMoneyPercent", maxMoneyPercent);

    console.log("======= Product =========");
    console.log("productBuy", productBuy);
    console.log("productReceive", productReceive);
    console.log("qtyReceive", qtyReceive);
    console.log("qtyBuy", qtyBuy);




    // const payloadLine = {
    //   desc: val.desc,
    //   startDate: startDate,
    //   endDate: endDate,
    //   status: val.status,
    // }

    // try {
    //   const updateProLine = async () => {
    //     const rs = await promotionApi.updateLine(idPromotionLine, payloadLine);
    //     if (rs) {
    //       message.success("Cập nhật thành công");
    //       depatch(setReload(!reload));
    //       onClose();
    //     } else {
    //       message.error("Cập nhật thất bại");
    //     }
    //   }
    //   updateProLine();
    // } catch (error) {
    //   message.error("Cập nhật thất bại");
    //   console.log("error", error);
    // }
    
  };

  const handleChangeTypePro = (value) => {
    setType(value);
  };

  const onChangeDate = (date, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
  };

  useEffect(() => {
    const fetchProductSeats = async () => {
      try {
        const response = await productApi.getListProductByType(TYPE_SEAT_PRODUCT);
        const options = response.map((item) => ({
          value: item.id,
          label: item.productName,
        }));
        setListProductSeat(options);
      } catch (error) {
        console.log("error", error);
      }
    };
    const fetchAllProduct = async () => {
      try {
        const response = await productApi.getListProductByType(TYPE_FOOD_PRODUCT);
        const options = response.map((item) => ({
          value: item.id,
          label: item.productName,
        }));
        setListProduct(options);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchAllProduct();
    fetchProductSeats();
  }, []);

  useEffect(()=>{
    const fetchPromotionLine = async (id) => {
      try {
        const response = await promotionApi.getPromotionLineById(id)
        setStartDate(dayjs(response.startDate, newDateFormat))
        setEndDate(dayjs(response.endDate, newDateFormat))
        form.setFieldsValue({
          id: response.id,
          promotionCode: response.promotionCode,
          namePromotion: response.namePromotion,
          desc: response.desc,
          type: Number(response.type),
          budget: response.budget,
          maxUsePerCustomer: response.max_qty_per_customer_per_day,
          maxUse: response.max_qty,
          date: [
            dayjs(response.startDate, newDateFormat),
            dayjs(response.endDate, newDateFormat),
          ],
          status: response.status,
        
        });
        setPromotionLine(response)

        //fetch promotion details by id promotion line
        const data = await promotionApi.getPromotionDetailsByLineId(response.id)
        if(data){
          setPromotionDetails(data)
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    fetchPromotionLine(idPromotionLine)

  }, [])
  
  useEffect(() =>{
    let date1 = moment();
    let date2 = moment(startDate);
    let difference = date1.diff( date2, "seconds" );
    if(difference <= 0){
      setIsEnable(false);
    }
  }, [startDate])

  return {
    form,
    reload,
    type,
    startDate,
    endDate,
    listProductSeat,
    listProduct,
    onClose,
    handleSubmit,
    onChangeDate,
    handleChangeTypePro,
    promotionLine,
    yupSync,
    isEnable,
    promtionDetails,
    setStartDate,
    setEndDate,
    setCategory,
    setQtyBuy,
    setTotalDiscount,
    setMoneyBought,
    setPercentDiscount,
    setMaxMoneyPercent,
    setProductBuy,
    setProductReceive,
    setQtyReceive,
  };
};

export default useModelPromotionLine;
