import React, {useEffect, useState} from 'react';
import { Table, Button, Typography,Spin } from 'antd';
import {EditOutlined} from '@ant-design/icons';
import ApiService from 'services/ApiService';
import { useNavigate,Link } from 'react-router-dom';
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
  height: '36px',
  padding: '7px 12px',
  gap: '0px',
  opacity: '0px',
  transform: 'rotate(0deg)',
};







const ListOfResources = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const columns = [
  
    {
      title: 'NAME',
      dataIndex: 'id',
      render: () => (
          <img src="/img/others/profileNoImage.png" alt="image" style={{ width: '20px', height: '20px' }} />
      )
    },
    {
      title: '',
      dataIndex: 'full_name'
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Edit Details',
      dataIndex: 'id',
      render: (record) => {
       return <EditOutlined style={{ fontSize: '20px', cursor:'pointer'}} onClick={() => handleEdit(record)} />
      },
    },
  ];


  const handleEdit = (id) => {
    navigate(`/app/resource_info/edit?id=${id}`);
   };


useEffect(() => {
  fetchData();
}, []);

const fetchData = async() => {
  const data = await ApiService.harryBackendApi('api/admin/resources_info','get',null, null);
  setDataSource(data);
  setLoading(false);
}


  return (
    <div style={{ backgroundColor: '#FFFFFF', paddingLeft:"10px" }}>
        <Title style={title_layout}>List of Resources</Title>
        <div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', marginRight:"20px" }}>
      <Link to="/app/resource_info/add">
        <Button style={{...buttonStyle, backgroundColor:'#565E6D',color:'#FFFFFF',borderRadius:'0px',marginLeft:'4px'}}>Add Resource</Button>
      </Link>
      </div>
    </div>
        {loading ? <Spin /> : <Table dataSource={dataSource} columns={columns} pagination={false} />}
    </div>
  );
};

export default ListOfResources;
