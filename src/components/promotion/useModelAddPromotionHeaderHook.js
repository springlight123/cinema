import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  Tag,
  InputNumber,
} from "antd";

import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import promotionApi from "../../api/promotionApi";
import rankApi from "../../api/rankApi";
import { CustomTagProps } from "rc-select/lib/BaseSelect";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { setReload } from "../../redux/actions";
import * as yup from 'yup';
import { MESSAGE_REQUIRE_NAME, MESSAGE_WITHOUT_SPECIAL } from "../../utils/constants";
import { removeAscent } from "../../utils/FormatString";
import { notifyError } from "../../utils/Notifi";

const normFile = (e) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const dummyRequest = ({ file, onSuccess }) => {
  setTimeout(() => {
    onSuccess("ok");
  }, 0);
};

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  let color;
  if (label === "START") {
    color = "green";
  } else if (label === "GOLD") {
    color = "gold";
  } else if (label === "DIAMOND") {
    color = "blue";
  } else if (label === "ANONYMOUS") {
    color = "geekblue";
  }
  return (
    <Tag
      color={color}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>
  );
};
///^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
let schema = yup.object().shape({
  namePromotion: yup.string().required(MESSAGE_REQUIRE_NAME('CTKM')).matches(/^[a-zA-Z\s0-9]{1,}$/g, MESSAGE_WITHOUT_SPECIAL('Tên CTKM')),
  promotionCode: yup.string().required(MESSAGE_REQUIRE_NAME('Mã KM')),
  age: yup
    .number()
    .required()
    .typeError('Number only.')
    .positive()
    .integer()
    .round(),
});

export const yupSync = {
  async validator({ field }, value) {
    if(field === 'namePromotion'){
        value = removeAscent(value)
    }
    await schema.validateSyncAt(field, { [field]: value });
  },
};


const useModelAddPromotionHeaderHook = (showModalAddCustomer, setShowModalAddCustomer) => {
    const [form] = Form.useForm();
    const [ranks, setRanks] = useState([]);
    const [rankPicked, setRankPicked] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
  
    const depatch = useDispatch();
    const reload = useSelector((state) => state.reload);
  
    const onSearch = (value) => {
      console.log("search:", value);
    };
  
    const onClose = () => {
      setShowModalAddCustomer(false);
    };
  
    useEffect(() => {
      const fetchRanks = async () => {
        const rs = await rankApi.getRanks();
        if (rs) {
          const options = rs.map((rank) => {
            return {
              label: rank.nameRank,
              value: Number(rank.id),
            };
          });
          setRanks(options);
        }
      };
      fetchRanks();
    }, []);
  
    //handle submit form create new customer...
    const handleSubmit = async (val) => {
      const data = new FormData();
      data.append("namePromotion", val.namePromotion)
      data.append("desc", val.desc)
      data.append("startDate", startDate)
      data.append("endDate", endDate)
      data.append("promotionCode", val.promotionCode)
      rankPicked.forEach((rank) => {
        data.append("rank", rank)
      })
      
      if(val.image){
        data.append("image", val.image[0].originFileObj)
      }

      try {
        const rs = await promotionApi.createPromotionHeader(data);
        if (rs) {
          depatch(setReload(!reload));
          message.success("Tạo mới thành công");
          setShowModalAddCustomer(false);
          
        }
        
      } catch (error) {
        console.log(error);
        if(error?.response?.data?.message === 'Promotion code is exist'){
          notifyError('Mã CTKM đã tồn tại.')
        }
        
      }
    };
  
    //change position
    const handleChangeRank = (value) => {
      setRankPicked(value);
    };
  
    //choise date start worling
    const onChangeDate = (date, dateString) => {
      setStartDate(dateString[0]);
      setEndDate(dateString[1]);
    };
    useEffect(() => {
      form.setFieldsValue({
        namePromotion: "",
        desc: "",
      });
    }, []);
    return {
        normFile,
        dummyRequest,
        tagRender,
        form,
        ranks,
        rankPicked,
        startDate,
        endDate,
        onSearch,
        handleChangeRank,
        handleSubmit,
        onClose,
        onChangeDate,
        yupSync
    }
}

export default useModelAddPromotionHeaderHook;