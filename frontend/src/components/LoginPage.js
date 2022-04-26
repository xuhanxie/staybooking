import React from "react";
import { Form, Button, Input, Space, Checkbox, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { login, register } from "../utils";
 
class LoginPage extends React.Component {
  formRef = React.createRef();    // 必须要这么用才能用来接住某些component的reference，手动做一些事情
  state = {
    asHost: false,
    loading: false,
  };
 
  onFinish = () => {
    console.log("finish form");
  };
 
  handleLogin = async () => {
    const formInstance = this.formRef.current;
 
    try {
      await formInstance.validateFields();   // syntax sugar, 增加可读性
    } catch (error) {
      return;
    }
 
    this.setState({
      loading: true,
    });
 
    try {
      const { asHost } = this.state;
      const resp = await login(formInstance.getFieldsValue(true), asHost);
      this.props.handleLoginSuccess(resp.token, asHost);  // 这是一个来自于loginpage parent component(app.js)
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  handleRegister = async () => {
    const formInstance = this.formRef.current;
 
    try {
      await formInstance.validateFields();
    } catch (error) {
      return;
    }
 
    this.setState({
      loading: true,
    });
 
    try {
      await register(formInstance.getFieldsValue(true), this.state.asHost);
      message.success("Register Successfully");
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  handleCheckboxOnChange = (e) => {
    this.setState({
      asHost: e.target.checked,
    });
  };
 
  render() {
    return (
      <div style={{ width: 500, margin: "20px auto" }}>
        <Form ref={this.formRef} onFinish={this.onFinish}>
          <Form.Item      //规定的必须要这么写 form.item
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your Username!",
              },
            ]}
          >
            <Input
              disabled={this.state.loading}
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
              },
            ]}
          >
            <Input.Password
              disabled={this.state.loading}
              placeholder="Password"
            />
          </Form.Item>
        </Form>
        <Space>
          <Checkbox
            disabled={this.state.loading}
            checked={this.state.asHost}
            onChange={this.handleCheckboxOnChange}
          >
            As Host
          </Checkbox>
          <Button
            onClick={this.handleLogin}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Log in
          </Button>
          <Button
            onClick={this.handleRegister}
            disabled={this.state.loading}
            shape="round"
            type="primary"
          >
            Register
          </Button>
        </Space>
      </div>
    );
  }
}
 
export default LoginPage;