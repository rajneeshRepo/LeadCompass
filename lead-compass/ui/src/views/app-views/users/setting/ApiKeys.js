import React, { Component, useEffect } from "react";
import {
  Table,
  Button,
  Tooltip,
  Form,
  Modal,
  Input,
  Row,
  Col,
  Flex,
  Select,
  message,
} from "antd";
import {
  DeleteOutlined,
  KeyOutlined,
  CalendarOutlined,
  QuestionCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { ROW_GUTTER } from "constants/ThemeConstant";
import ApiKeysService from "services/ApiKeysService";

const { Column } = Table;

const SOURCES = [
  {
    label: "Forecasa",
    value: "forecasa",
  },
  {
    label: "Black Knight",
    value: "black_knight",
  },
  {
    label: "Tracer",
    value: "tracer",
  },
];

const CardForm = ({source, visible, onCreate, onCancel, mode }) => {
  const EDIT = "EDIT";
  const ADD = "ADD";
  const [form] = Form.useForm();

  useEffect(() => {
    if(mode == EDIT){
        console.log(source);
        form.setFieldsValue(source)
    }
  }, [])

  return (
    <Modal
      title={mode == ADD? "Add new key" : "Update key"}
      open={visible}
      okText="Save key"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onCreate(values);
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} name="addKeyForm" layout="vertical">
        <Form.Item
          label="Source"
          name="source"
          rules={[
            {
              require: true,
              message: "Please select source!",
            },
          ]}
        >
          <Select placeholder="select">
            {SOURCES.map((source) => (
              <Select.Option key={source["value"]} value={source["value"]}>
                {source["label"]}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Api Key"
          name="api_key"
          rules={[
            {
              require: true,
              message: "Please enter api key!",
            },
          ]}
        >
          <Input suffix={<KeyOutlined />} placeholder="Enter key value" />
        </Form.Item>
      </Form>
      {/* {JSON.stringify(source)} */}
    </Modal>
  );
};

export class ApiKeys extends Component {
  state = {
    apiKeys: [
    ],
    modalVisible: false,
    mode: 'ADD',
    selectedSourceForUpdate: null
  };

  constructor(){
    super()
    this.getKeys()
  }

  getKeys = async () => {
    const response = await ApiKeysService.keys({business_id: 1});
    this.setState({apiKeys: response.business});
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({ selectedRowKeys });
  };

  showModal = () => {
    this.setState({
      modalVisible: true,
    });
  };

  closeModal = () => {
    this.setState({
      modalVisible: false,
      selectedSourceForUpdate: null
    });
  };

  addCard = async (values) => {
    console.log(values);
    // this.setState({apiKeys: [...this.state.apiKeys, values]})
    if(this.state.mode == 'ADD'){
      try {
        const response = await ApiKeysService.addKey({...values, business_id: 1});
        message.success('Key Added Successfully')
      } catch (error) {
        message.error("Couldn't add key")
      }
    }else{
      try {
        const response = await ApiKeysService.updateKey({...values, business_id: this.state.selectedSourceForUpdate.business_id});
        message.success('Key Updated Successfully')
      } catch (error) {
        message.error("Couldn't update key")
      }
    }
    this.getKeys();
    this.closeModal();
  };

  render() {
    const { apiKeys, modalVisible, mode, selectedSourceForUpdate} = this.state;

    const locale = {
      emptyText: (
        <div className="text-center my-4">
          {/* <img
            src="/img/others/img-7.png"
            alt="Add credit card"
            style={{ maxWidth: "90px" }}
          /> */}
          <h3 className="mt-3 font-weight-light">Please add a api key!</h3>
        </div>
      ),
    };

    return (
      <>
        <h2 className="mb-4">Api Keys</h2>
        <Table
          locale={locale}
          dataSource={apiKeys}
          pagination={false}
          rowKey="source"
        >
          <Column
            title="Source"
            key="source"
            render={(text, record) => (
              <>
                <span className="ml-2 text-capitalize">{record.source.split("_").join(" ")}</span>
              </>
            )}
          />
          <Column title="Api Key" dataIndex="api_last_four" key="api_last_four" render={(text) => `•••• •••• •••• ${text}`}/>
          <Column
            title=""
            key="actions"
            className="text-right"
            render={(text, record) => ( 
              <Flex justify="end">
                <Tooltip title="Update key">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<EditOutlined />}
                    onClick={() => {
                        this.setState({mode: "EDIT", selectedSourceForUpdate: record});
                        this.showModal()
                    }}
                  />
                </Tooltip>
                {/* <Tooltip title="Remove key">
                  <Button
                    type="text"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={() => {
                      const newApiKeys = [...apiKeys];
                      this.setState({
                        apiKeys: newApiKeys.filter(
                          (item) => item.source !== record.source
                        ),
                      });
                    }}
                  />
                </Tooltip> */}
              </Flex>
            )}
          />
        </Table>
        <div className="mt-3 text-right">
          <Button type="primary" onClick={this.showModal}>
            Add new key
          </Button>
        </div>
        {modalVisible && <CardForm
          source={selectedSourceForUpdate}
          mode={mode}
          visible={modalVisible}
          onCreate={this.addCard}
          onCancel={this.closeModal}
        />}
      </>
    );
  }
}

export default ApiKeys;
