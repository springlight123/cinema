import React, { useEffect, useState } from "react";

import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Upload,
  message,
  InputNumber,
} from "antd";

import { useFormik } from "formik";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import categoryMovie from "../../api/categoryMovie";
import { fimlValidator } from "./FilmSchema";
import cinameApi from "../../api/cinemaApi";
import movieApi from "../../api/movieApi";
import { notifyError,
  notifySucess
 } from "../../utils/Notifi";
 
 import { setReload } from "../../redux/actions";
 import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
const { Option } = Select;

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ModelAddFilm = ({ showModalAddCustomer, setShowModalAddCustomer }) => {
  const [form] = Form.useForm();

  const { RangePicker } = DatePicker;
  const [startDatePicker, setStartDatePicker] = useState("");
  const [endDatePicker, setEndDatePicker] = useState("");
  const [listCategory, setListCategory] = useState([]);
  const [listCinema, setListCinema] = useState([]);
  const [category, setCategory] = useState("");
  const [time, setTime] = useState(0);
  const [classify, setClassify] = useState("");
  const [image, setImage] = useState("");

  const currentDate = moment().format("YYYY-MM-DD");

  const depatch = useDispatch();
  const reload = useSelector((state) => state.reload);

  const onClose = () => {
    setShowModalAddCustomer(false);
  };

  const handleChangeCode = (e) => {

  };

  //change position
  const handleChangePosition = (value) => {
    console.log(`selected ${value}`);
  };
  const handleChangeTime = (value) => {
    setTime(value);
  };
  const handleChangeCategory = (value) => {
    setCategory(value);
  };

  //choise date start worling
  const onChangeDate = (date, dateString) => {
    setStartDatePicker(dateString[0]);
    setEndDatePicker(dateString[1]);
  };

  const onChangeClassify = (value) => {
    setClassify(value);
  };

  const handleSubmit = async(val) => {
    console.log(val);
    const {
      category, classify, codeMovie, 
      daoDien, description, dienVien, 
      image, link, name, time
    } = val;
    console.log(startDatePicker, endDatePicker);
    const data = new FormData();
    data.append("nameMovie", name);
    data.append("codeMovie", codeMovie);
    data.append("cast", daoDien);
    data.append("director", dienVien);
    data.append("linkTrailer", link);
    data.append("idCategoryMovie", category);
    data.append("duration", time);
    data.append("releaseDate", startDatePicker);
    data.append("desc", description);
    data.append("classify", classify);
    data.append("endDate", endDatePicker);
    if(image || (image && image.length > 0)){
      data.append("image", image[0].originFileObj);
    }
    try {
      const rs = await movieApi.createMovie(data);
      console.log(rs);
      if(rs){
        setShowModalAddCustomer(false);
        notifySucess("Thêm bộ phim thành công.")
        depatch(setReload(!reload));
      }
    } catch (error) {
      notifyError("Mã phim đã tồn tại!")
    }
   
  };
  useEffect(() => {
    //load categories
    const getCategories = async () => {
      try {
        const response = await categoryMovie.getCategory();

        console.log(response);
        //set user info
        if (response) {
          //handle data
          const newArr = response.map((val) => {
            return { value: val.id, label: val.nameCategory };
          });
          setListCategory(newArr);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };

    //load categories
    const getCinemas = async () => {
      try {
        const response = await cinameApi.getCinemas();

        console.log(response);
        //set user info
        if (response) {
          const newArr = response.map((val) => {
            return { value: val.id, label: val.name };
          });

          setListCinema(newArr);
        }
      } catch (error) {
        console.log("Failed to login ", error);
      }
    };
    getCinemas();
    getCategories();
  }, []);


  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const dummyRequest = ({ file, onSuccess }) => {
    setImage(file);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);

  };

  return (
    <>
      <Drawer
        title="Thêm bộ phim"
        width={720}
        onClose={onClose}
        open={showModalAddCustomer}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Hủy</Button>
            <Button form="myForm" htmlType="submit" type="primary">
              Lưu
            </Button>
          </Space>
        }
      >
        <Form layout="vertical"  onFinish={handleSubmit} id="myForm" form={form}>
        <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="codeMovie"
                label="Mã phim"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập mã phim...",
                  },
                ]}
              >
                <Input placeholder="Hãy nhập mã phim tối đa 5 ký tự..." 
                  addonBefore="MOV"
                  min={1}
                  maxLength={5}
                  showCount
                  style={{ width: "100%"}}
                  // onChange={handleChangeCode}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}

                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên bộ phim"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên bộ phim...",
                  },
                ]}
              >
                <Input
                  placeholder="Hãy nhập tên bộ phim..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Thể loại"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thể loại bộ phim...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn thể loại"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeCategory}
                  options={listCategory}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="time"
                label="Thời lượng"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời lượng bộ phim...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn thời lượng"
                  style={{
                    width: "100%",
                  }}
                  onChange={handleChangeTime}
                  options={[
                    {
                      value: "60",
                      label: "60 phút",
                    },
                    {
                      value: "90",
                      label: "90 phút",
                    },
                    {
                      value: "120",
                      label: "120 phút",
                    },
                    {
                      value: "180",
                      label: "180 phút",
                    },
                    {
                      value: "210",
                      label: "210 phút",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="date"
                label="Thời hạn phim"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn thời hạn bộ phim...",
                  },
                ]}
              >
                <RangePicker 
                  placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
                  onChange={onChangeDate}
                  disabledDate={
                    (current) => {
                      return current && current < moment().endOf('day');
                    }
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="classify"
                label="Độ tuổi thích hợp"
                rules={[
                  {
                    required: true,
                    message: "Hãy chọn  độ tuổi thích hợp...",
                  },
                ]}
              >
                <Select
                  placeholder="Chọn độ tuổi thích hợp"
                  style={{
                    width: "100%",
                  }}
                  onChange={onChangeClassify}
                  options={[
                    {
                      value: "C13"  ,
                      label: "C13 - 13 tuổi trở lên",
                    },
                    {
                      value: "C16",
                      label: "C16 - 16 tuổi trở lên",
                    },
                    {
                      value: "C18",
                      label: "C18 - 18 tuổi trở lên",
                    },
                    {
                      value: "C21",
                      label: "C21 - 21 tuổi trở lên",
                    },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row  gutter={16}>
            <Col span={12}>
              <Form.Item
                name="daoDien"
                label="Đạo diễn"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên đạo diễn...",
                  },
                ]}
              >
                <Input
                  placeholder="Hãy nhập tên đạo diễn..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dienVien"
                label="Diễn viên"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập tên diễn viên...",
                  },
                ]}
              >
                <Input
                  placeholder="Hãy nhập tên diễn viên..."
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="link"
                label="Link trailer"
              >
                <Input
                  placeholder="Hãy nhập link trailer..."
                />
              </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
              name="image"
              label="Hình ảnh"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              extra="Chỉ chấp nhận file ảnh"
              type="file"
            >
              <Upload name="logo" customRequest={dummyRequest}
                 listType="picture" maxCount={1} accept=".jpg,.jpeg,.png"
              >
                <Button  icon={<UploadOutlined />}> Tải ảnh lên</Button>
              </Upload>
            </Form.Item>
            </Col>
          </Row>
          <Row  gutter={16}>
            <Col span={24}>
              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  rows={4}
                  placeholder="Nhập miêu tả..."
                />
              </Form.Item>
            </Col>
          </Row>  
        </Form>
      </Drawer>
    </>
  );
};
export default ModelAddFilm;
