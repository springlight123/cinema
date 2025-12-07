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
import * as yup from "yup";
import {
  MESSAGE_REQUIRE_NAME,
  MESSAGE_WITHOUT_SPECIAL,
  NOT_EMPTY,
} from "../../utils/constants";
import { removeAscent } from "../../utils/FormatString";
import { notifyError } from "../../utils/Notifi";
import openAddressApi from "../../api/openApi";
import { createStaff } from "../../services/StaffFetch";

let schema = yup.object().shape({
  first_name: yup.string().trim().required(MESSAGE_REQUIRE_NAME("Họ")),
  last_name: yup.string().required(NOT_EMPTY),
  email: yup.string().trim().required(NOT_EMPTY).email("Email không hợp lệ."),
  phone: yup.string().trim().required(NOT_EMPTY).matches(/^\d{9,11}$/, "Sô điện thoại không hợp lệ."),
  position: yup.string().trim().required("Không được để trống."),
  tinh: yup.string().trim().required("Không được để trống."),
  quan: yup.string().trim().required("Không được để trống."),
  huyen: yup.string().trim().required("Không được để trống."),
});

export const yupSync = {
  async validator({ field }, value) {
    if (field === "namePromotion") {
      value = removeAscent(value);
    }
    await schema.validateSyncAt(field, { [field]: value });
  },
};

const useEmployeeHook = (showModalAddCustomer, setShowModalAddCustomer) => {
  const [form] = Form.useForm();
  const [province, setProvince] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [provincePicked, setProvincePicked] = useState(0);
  const [districtPicked, setDistrictPicked] = useState(0);
  const [startDate, setStartDate] = useState("");
  const depatch = useDispatch();
  const cinema = useSelector((state) => state.cinema);
  const reload = useSelector((state) => state.reload);
  const onChangeProvince = (value) => {
    console.log(`selected ${value}`);
    setProvincePicked(value);
  };
  const onChangeDistrict = (value) => {
    console.log(`selected ${value}`);
    setDistrictPicked(value);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  const onClose = () => {
    setShowModalAddCustomer(false);
  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    setStartDate(dateString);
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await openAddressApi.getList("/p");

        //console.log(response);
        if (response) {
          const newResponse = response.map((val) => {
            return {
              value: val.code,
              label: val.name,
            };
          });
          setProvince(newResponse);
        }
      } catch (error) {
        console.log("Failed to fetch conversation list: ", error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (provincePicked !== 0) {
      console.log("run");
      const fetchConversations = async (id) => {
        try {
          const response = await openAddressApi.getList(`/p/${id}?depth=2`);

          console.log(response);
          if (response) {
            const { districts } = response;
            const newDistricts = districts.map((val) => {
              return {
                value: val.code,
                label: val.name,
              };
            });
            setDistricts(newDistricts);
          }
        } catch (error) {
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      fetchConversations(provincePicked);
    }
  }, [provincePicked]);
  useEffect(() => {
    if (districtPicked !== 0) {
      const fetchConversations = async (id) => {
        try {
          const response = await openAddressApi.getList(`/d/${id}?depth=2`);

          console.log(response);
          if (response) {
            const { wards } = response;
            const newWards = wards.map((val) => {
              return {
                value: val.code,
                label: val.name,
              };
            });
            setWards(newWards);
          }
        } catch (error) {
          console.log("Failed to fetch conversation list: ", error);
        }
      };

      fetchConversations(districtPicked);
    }
  }, [districtPicked]);

  const handleSubmit = async (val) => {
    const dataPayload = {
      email: val.email,
      password: "123456789",
      phone: val.phone,
      firstName: val.first_name,
      lastName: val.last_name,
      start_date: startDate,
      status: 1,
      position: +val.position,
      city_id: val.tinh,
      ward_id: val.huyen,
      district_id: val.quan,
      cinema_id: cinema?.id || 1,
      gender: "F",
      dob: "2001-10-06",
    };

    try {
      const rs = await createStaff(dataPayload);
      console.log(rs);
      if (rs) {
        message.success("Tạo mới thành công");
        setShowModalAddCustomer(false);
        depatch(setReload(!reload))
      }
    } catch (error) {
      console.log(error);
      if("Email or Phone is exist" === error?.response?.data?.message ){
        notifyError("Email hoặc số điện thoại đã tồn tại.");
      } else{
        notifyError( error?.response?.data?.message)
      }

     
    }
  };

  return {
    form,
    province,
    districts,
    wards,
    provincePicked,
    districtPicked,
    onChangeDistrict,
    onChangeDate,
    onChangeProvince,
    onSearch,
    onClose,
    handleSubmit,
    handleChangePosition,
    yupSync,
  };
};

export default useEmployeeHook;
