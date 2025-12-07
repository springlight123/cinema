import React, { useState } from "react";
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
import "./LoginForm.scss";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import userApi from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SuccesFormPage from "./SuccesFormPage";
import { MdEmail, MdOutlineMailOutline } from "react-icons/md";
import { sendEmailGetPassword } from "../../services/AuthService";
function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [userName, setUserName] = React.useState("");
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [messErro, setMessErro] = useState("");
  const [isSuccess, setIsSucess] = useState(false)
  const setOnChangeUserName = (e) => {
    setUserName(e.target.value);
    setMessErro('')
  };

  //handle submit to login user
  const handleSubmitForm = () => {
    if (!userName) {
      setMessErro("Email không được để trống.");
      return;
    } else if (!validateEmail(userName)) {
      setMessErro("Email không đúng định dạng.");
      return;
    }
    sendEmailGetPassword(userName).then(() => {
      setMessErro("");
      setIsSucess(true)
    }).catch(error => {
      alert(error.message)
      console.log(error);
    })
  };

  if(isSuccess){
    return <SuccesFormPage text="Đã gửi link đổi mật khẩu vào email."/>
  }
  return (
    <Row style={{ height: "100vh" }} className="login">
      <Col span={8}></Col>
      <Col span={8} style={{ height: "100%", padding: "0 12px" }}>
        <div className="login_form">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h1 style={{ color: "white", fontSize: "2.2rem", margin: 0 }}>
              CineStar Hub
            </h1>
            <p
              style={{
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
                color: "#9f9f9f",
                textTransform: "capitalize",
              }}
            >
              Gửi yêu cầu để lấy lại mật khẩu
            </p>
          </div>
          <form
            onSubmit={() => handleSubmitForm()}
            style={{
              borderRadius: "",
              padding: "2rem 2rem",
            }}
          >
            {messErro ? (
              <span
                style={{
                  color: "red",
                  fontSize: "14px",
                  fontWeight: "400",
                  marginBottom: "12px",
                }}
              >
                Email không đúng định dạng.
              </span>
            ) : null}
            <Input
              size="large"
              placeholder="Nhập email để lấy lại mật khẩu."
              onChange={(e) => setOnChangeUserName(e)}
              prefix={<MdOutlineMailOutline />}
              style={{
                fontSize: "14px",
                marginBottom: "24px",
                marginTop: "12px",
                padding: "10px",
              }}
            />

            {userName ? (
              <Button
                onClick={() => handleSubmitForm()}
                type="primary"
                style={{
                  width: "100%",
                  color: "white",
                  borderColor: "#058dd9",
                  backgroundColor: "#058dd9",
                  height: "40px",
                  marginBottom: "1rem",
                }}
                loading={loadingStatus}
              >
                Gửi Yêu Cầu
              </Button>
            ) : (
              <Button
                onClick={() => handleSubmitForm()}
                disabled
                type="primary"
                style={{
                  width: "100%",
                  color: "white",
                  borderColor: "#058dd9",
                  backgroundColor: "#058dd9",
                  height: "40px",
                  marginBottom: "1rem",
                }}
              >
                Gửi Yêu Cầu
              </Button>
            )}
            <p onClick={() => navigate("/login")} className="forgetPassword">Đăng nhập ngay</p>
          </form>
        </div>
      </Col>
      <Col span={8}></Col>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Row>
  );
}
