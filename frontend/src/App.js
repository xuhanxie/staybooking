import { Layout, Dropdown, Menu, Button } from "antd";  // antd design是一个component library，帮助实现有用的功能组件
import { UserOutlined } from "@ant-design/icons";
import React from "react";
import LoginPage from "./components/LoginPage";
import HostHomePage from "./components/HostHomePage";
import GuestHomePage from "./components/GuestHomePage";

 
const { Header, Content } = Layout;
 
class App extends React.Component {
  state = {
    authed: false,
    asHost: false,
  };
 
  // life cycle event
  componentDidMount() {
    const authToken = localStorage.getItem("authToken");
    const asHost = localStorage.getItem("asHost") === "true";
    // 大括号意味着新建一个instance, 覆盖了之前的authed, asHost, 执行merge，老的property保留，新的property加上
    this.setState({
      authed: authToken !== null,
      asHost,
    });
  }
 
  // event handler
  handleLoginSuccess = (token, asHost) => {
    localStorage.setItem("authToken", token);   // keep logged in
    localStorage.setItem("asHost", asHost);
    this.setState({
      authed: true,
      asHost,
    });
  };
 
  handleLogOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("asHost");
    this.setState({
      authed: false,
    });
  };
 
  renderContent = () => {
    if (!this.state.authed) {
      return <LoginPage handleLoginSuccess={this.handleLoginSuccess} />;
    }

    if (this.state.asHost) {
      return <HostHomePage />;
    }


    if (!this.state.authed) {
      return <div>login page</div>;
    }
 
    if (this.state.asHost) {
      return <div>host home page</div>;
    }
 
    return <GuestHomePage/>;
  };
 
  userMenu = (
    <Menu>
      <Menu.Item key="logout" onClick={this.handleLogOut}>
        Log Out
      </Menu.Item>
    </Menu>
  );
 
  render() {
    return (  // vh是view height的缩写
      <Layout style={{ height: "100vh" }}>   
        <Header style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: "white" }}>
            Stays Booking
          </div>
          {this.state.authed && (
            <div>
              <Dropdown trigger="click" overlay={this.userMenu}>
                <Button icon={<UserOutlined />} shape="circle" />
              </Dropdown>
            </div>
          )}
        </Header>
        <Content
          style={{ height: "calc(100% - 64px)", margin: 20, overflow: "auto" }}
        >
          {this.renderContent()}
        </Content>
      </Layout>
    );
  }
}
 
export default App;