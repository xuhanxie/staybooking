import {
    message,
    Tabs,
    List,
    Card,
    Image,
    Carousel,
    Modal,
    Button,
    Tooltip,
    Space
  } from "antd";
import {
    LeftCircleFilled,
    RightCircleFilled,
    InfoCircleOutlined,
  } from "@ant-design/icons";
import Text from "antd/lib/typography/Text";
import React from "react";
import { deleteStay, getReservationsByStay, getStaysByHost } from "../utils";
import UploadStay from "./UploadStay";

 
const { TabPane } = Tabs;  

// 凡是有button点开有弹窗，弹窗里有一些信息的功能，就适合拆成component，具有复用性
// 加了 export可以给别的文件用，不加就只能在该文件里用
export class StayDetailInfoButton extends React.Component {
    state = {
      modalVisible: false,
    };
   
    openModal = () => {
      this.setState({
        modalVisible: true,
      });
    };
   
    handleCancel = () => {
      this.setState({
        modalVisible: false,
      });
    };
   
    render() {
      const { stay } = this.props;  // 通过props传数据给button
      const { name, description, address, guest_number } = stay;
      const { modalVisible } = this.state;
      return (
        <>
          <Tooltip title="View Stay Details">
            <Button
              onClick={this.openModal}
              style={{ border: "none" }}
              size="large"
              icon={<InfoCircleOutlined />}
            />
          </Tooltip>
          {modalVisible && (
            <Modal
              title={name}
              centered={true}
              visible={modalVisible}
              closable={false}
              footer={null}
              onCancel={this.handleCancel}
            >
              <Space direction="vertical">
                <Text strong={true}>Description</Text>
                <Text type="secondary">{description}</Text>
                <Text strong={true}>Address</Text>
                <Text type="secondary">{address}</Text>
                <Text strong={true}>Guest Number</Text>
                <Text type="secondary">{guest_number}</Text>
              </Space>
            </Modal>
          )}
        </>
      );
    }
  }

class RemoveStayButton extends React.Component {
  state = {
    loading: false,
  };
  
  handleRemoveStay = async () => {
    const { stay, onRemoveSuccess } = this.props;
    this.setState({
      loading: true,
    });
  
    try {
      await deleteStay(stay.id);
      onRemoveSuccess();
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
  
  render() {
    return (
      <Button
        loading={this.state.loading}
        onClick={this.handleRemoveStay}
        danger={true}
        shape="round"
        type="primary"
      >
        Remove Stay
      </Button>
    );
  }
}

class ReservationList extends React.Component {
  state = {
    loading: false,
    reservations: [],
  };
 
  componentDidMount() {
    this.loadData();
  }
 
  loadData = async () => {
    this.setState({
      loading: true,
    });
 
    try {
      const resp = await getReservationsByStay(this.props.stayId);
      this.setState({
        reservations: resp,
      });
    } catch (error) {
      message.error(error.message);
    } finally {
      this.setState({
        loading: false,
      });
    }
  };
 
  render() {
    const { loading, reservations } = this.state;
 
    return (
      <List
        loading={loading}
        dataSource={reservations}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={<Text>Guest Name: {item.guest.username}</Text>}
              description={
                <>
                  <Text>Checkin Date: {item.checkin_date}</Text>
                  <br />
                  <Text>Checkout Date: {item.checkout_date}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    );
  }
}

class ViewReservationsButton extends React.Component {
  state = {
    modalVisible: false,
  };
 
  openModal = () => {
    this.setState({
      modalVisible: true,
    });
  };
 
  handleCancel = () => {
    this.setState({
      modalVisible: false,
    });
  };
 
  render() {
    const { stay } = this.props;
    const { modalVisible } = this.state;
 
    const modalTitle = `Reservations of ${stay.name}`;
 
    return (
      <>
        <Button onClick={this.openModal} shape="round">
          View Reservations
        </Button>
        {modalVisible && (
          <Modal
            title={modalTitle}
            centered={true}
            visible={modalVisible}
            closable={false}
            footer={null}
            onCancel={this.handleCancel}
            destroyOnClose={true}
          >
            <ReservationList stayId={stay.id} />
          </Modal>
        )}
      </>
    );
  }
}

  

class MyStays extends React.Component {
    state = {
        loading: false,
        data: [],
    };

    componentDidMount() {
      // 用户切回mystay会重新load 数据
        this.loadData();
    }

    // async 标志这个function里面可以使用await这个function
    // <script async> 意味着浏览器可以开始下载，并执行以下的其他代码，不加async需要等下载完在执行下面的代码
    loadData = async () => {
        this.setState({
            loading: true,
        });

        try {
            const resp = await getStaysByHost();
            this.setState({
                data: resp,
            });
        } catch (error) {
            message.error(error.message);

        } finally {
            this.setState ({
                loading: false,      // 无论怎么样 最后loading圈圈得停止转动
            });
        }
    };

    render() {
        return (
          <List
            loading={this.state.loading}
            grid={{
              gutter: 16,
              xs: 1,
              sm: 3,
              md: 3,
              lg: 3,
              xl: 4,
              xxl: 4,
            }}
            dataSource={this.state.data}
            renderItem={(item) => (
              <List.Item>
                <Card
                  key={item.id}
                  title={
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Text ellipsis={true} style={{ maxWidth: 150 }}>
                        {item.name}
                      </Text>
                      <StayDetailInfoButton stay={item} />
                    </div>
                  }
                  actions={[<ViewReservationsButton stay={item} />]}
                  extra={<RemoveStayButton stay={item} onRemoveSuccess={this.loadData} />}
                >
                  {
                    <Carousel   // 特定style in antDesign
                      dots={false}
                      arrows={true}
                      prevArrow={<LeftCircleFilled />}
                      nextArrow={<RightCircleFilled />}
                    > 
                      {item.images.map((image, index) => (  // mapping each item in the array to <Image/>
                        <div key={index}>
                          <Image src={image.url} width="100%" />
                        </div>
                      ))}
                    </Carousel>
                  }
                </Card>
              </List.Item>
            )}
          />
        );
    }

}

 
class HostHomePage extends React.Component {
  render() {
    return (  // destroy InactivetabPane  会将component从内存中删掉，而不仅仅是界面上消失
              // 如果每一个tab都是静态文字的话，就没必要destroy了（除非文字量特别大）
      <Tabs defaultActiveKey="1" destroyInactiveTabPane={true}>
        <TabPane tab="My Stays" key="1">
            <MyStays />
          <div>My Stays Content</div>
        </TabPane>
        <TabPane tab="Upload Stay" key="2">
            <UploadStay />
          <div>Upload Stays</div>
        </TabPane>
      </Tabs>
    );
  }
}
 
export default HostHomePage;