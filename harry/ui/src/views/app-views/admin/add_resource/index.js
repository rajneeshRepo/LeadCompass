import {React,useEffect, useState} from 'react';
import { Input, Form, Row, Col, Typography,Button,Spin} from 'antd';
import { useParams, useLocation,useNavigate } from 'react-router-dom';
import ApiService from 'services/ApiService';

const layout = {
    labelCol: { span: 4 },  // Reduce the label column width
    wrapperCol: { span: 21 }, // Adjust wrapper column accordingly
  };

  const { Title } = Typography;
const title_layout = {
    height: '48px',
    fontFamily: "Lexend",
    fontSize: '32px',
    fontWeight: 400,
    lineHeight: '48px',
    textAlign: 'left',
    color: '#171A1F',
};

const buttonStyle = {
    width: '84px',
    height: '36px',
    padding: '7px 12px',
    gap: '0px',
    opacity: '0px',
    transform: 'rotate(0deg)',
};







const AddNewResource = () => {
    const { type } = useParams();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const emailExists = async(email) => { 
        let data =  await ApiService.harryBackendApi("auth/check_email","get",{"email":email},null)
        return data["exists"];
    };
    const rules = {
        first_name: [
            { 
                required: true,
                message: 'Please input your first name'
            }
        ],
        username:[
            { 
                required: true, 
                message: 'Please input your username!' 
              },
    
        ],
        roles: [
            { 
                required: true,
                message: 'Please input your role'
            }
        ],
        email: [
            { 
                required: true,
                message: 'Please input your email address'
            },
            { 
                type: 'email',
                message: 'Please enter a validate email!'
            },
            ({ getFieldValue }) => ({
                validator: async (_, value) => {
                    // Replace this with the actual function to check if the email exists
                    if (await emailExists(value)) {
                        return Promise.reject('Email already exists!');
                    }
                    return Promise.resolve();
                },
            })
        ],
        password: [
            { 
                required: true,
                message: 'Please input your password',
                
            },
            {
                min: 8,
                message: 'Password should be at least 8 characters',
            }
        ],
        confirm: [
            { 
                required: true,
                message: 'Please confirm your password!'
            },
            ({ getFieldValue }) => ({
                validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject('Passwords do not match!');
                },
            })
        ]
    }
    
    
    
    const handleAddNew = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
            let data =  await ApiService.harryBackendApi("auth/register","post",null,values);
            if (data["message"] == "User added successfully"){
                alert("Resource added successfully");
                navigate(`/app/resource_info`);
            }
    
            // Here you can handle the form values, e.g., send them to an API
        } catch (errorInfo) {
          alert("Resource failed to add");
            console.log('Failed:', errorInfo);
        }
    };

    const handleCancel = () => {
      navigate(`/app/resource_info`);
    }
    
   const  handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
            let data =  await ApiService.harryBackendApi(`auth/update-user/${id}`,"put",null,values);
            if (data["message"] == "User updated successfully"){
                alert("Resource updated successfully");
                navigate(`/app/resource_info`);
            }
    
            // Here you can handle the form values, e.g., send them to an API
        } catch (errorInfo) {
          alert("Resource update failed");
            console.log('Failed:', errorInfo);
        }
    }
    const fetchOldData = async (id) => {
        setLoading(true);
        let data =  await ApiService.harryBackendApi(`auth/user/${id}`,"get",null,null);
        form.setFieldsValue({
            first_name: data["result"]["first_name"],
            last_name: data["result"]["last_name"],
            role: data["result"]["role"],
            email: data["result"]["email"],
        });
        setLoading(false);
      };
    
    useEffect(() => {
        if (type === 'add') {
          // Add new resource
        } else if (type === 'edit' && id) {
          // Fetch data for the old resource
          fetchOldData(id);
        }
      }, [type, id]);
  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingLeft:"10px" }}>
    <Title style={title_layout}>Add a New Resource</Title>
    <Spin spinning={loading}>
    <Form form={form} layout="vertical">
        <Form.Item>
            <div style={{ width: '96px', height: '96px', padding: '24px 32px 24px 33px', gap: '0px', borderRadius: '4px 0px 0px 0px', opacity: '0px', background: '#9095A0' }}>
                <span style={{ fontFamily: 'Manrope', fontSize: '48px', fontWeight: 400, lineHeight: '48px', textAlign: 'left', width: '31px', height: '48px', gap: '0px', opacity: '0px', color:"#FFFFFF" }}>A</span>
            </div>
        </Form.Item>
      <Row>
        <Col span={12}>
          <Form.Item label="First Name" name={"first_name"} {...layout} rules={rules.first_name} hasFeedback>
            <Input placeholder='Enter first name' style={{ width: '520px', height: '35px',padding: '7px 398px 6px 12px', borderRadius:"0px",backgroundColor: '#F3F4F6' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Last Name" {...layout} name={"last_name"}>
            <Input placeholder='Enter last name' style={{ width: '520px', height: '35px', padding: '7px 398px 6px 12px',borderRadius:"0px",backgroundColor: '#F3F4F6' }} />
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={24}>
          <Form.Item label="Role" name={"role"} {...layout} rules={rules.roles} hasFeedback>
            <Input placeholder='Enter Resource Role' style={{ width: '1230px', height: '35px', padding: '7px 951px 6px 12px',borderRadius:"0px",backgroundColor: '#F3F4F6' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="Email" name={"email"} {...layout} rules={type === 'edit' ? [] : rules.email} hasFeedback>
            <Input disabled={type === 'edit'} placeholder='example.email@gmail.com' style={{ width: '1230px', height: '35px', padding: '7px 951px 6px 12px',borderRadius:"0px",backgroundColor: '#F3F4F6' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="Password" name={"password"} {...layout}
              rules={rules.password}
              hasFeedback
          >
            <Input placeholder='Enter at least 8+ characters' style={{ width: '1230px', height: '35px', padding: '7px 951px 6px 12px',borderRadius:"0px",backgroundColor: '#F3F4F6' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
    <Col span={24} style={{ textAlign: 'right' }}>
        <Form.Item {...layout}>
            <Button type="link" style={{...buttonStyle, backgroundColor:'#F3F4F6', color:'#565E6D', borderRadius:'0px', marginRight:'4px'}} onClick={handleCancel}>Cancel</Button>
            {type === 'edit' ? (
                <Button style={{...buttonStyle, backgroundColor:'#565E6D',color:'#FFFFFF',borderRadius:'0px',marginLeft:'4px'}} onClick={handleUpdate}>Update</Button>
            ) : (
                <Button style={{...buttonStyle, backgroundColor:'#565E6D',color:'#FFFFFF',borderRadius:'0px',marginLeft:'4px'}} onClick={handleAddNew}>Add New</Button>
            )}
        </Form.Item>
    </Col>
</Row>
    </Form>
    </Spin>
    </div>
  );
};

export default AddNewResource;
