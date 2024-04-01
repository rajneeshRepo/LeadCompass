import React, { useState, useEffect } from 'react'
import PageHeaderAlt from 'components/layout-components/PageHeaderAlt'
import { Tabs, Form, Button, message } from 'antd';
import Flex from 'components/shared-components/Flex'
import GeneralField from './GeneralField'
import ProductListData from "assets/data/product-list.data.json"
// import UserService from 'services/UserService';
import { useNavigate } from "react-router-dom";
import AuthService from 'services/AuthService';
import UserService from 'services/UserService';

const ADD = 'ADD'
const EDIT = 'EDIT'

const UserForm = props => {
	const navigate = useNavigate()
	const { mode = ADD } = props

	const [form] = Form.useForm();
	const [submitLoading, setSubmitLoading] = useState(false)
	const [user, setUser] = useState({});

	const onFinish = () => {
		form.validateFields().then(async values => {
			setSubmitLoading(true)
			try{
				if(mode === ADD){
					const response = await AuthService.register(values)
					message.success(`Created ${values.email} to user list`);
					navigate(`/app/users/list`)
				}else{
					console.log(user);
					const response = await UserService.updateUser({...values, id: user.id})
					message.success(`Updated ${values.email} successfully`)
				}
			}catch(info){
				setSubmitLoading(false)
				console.log(info.response.data.detail);
				if(info.response.data.detail){
					message.error(`An account exists with email`);
				}
			}	
			setSubmitLoading(false)
		})
	};

	const getCurrentUser = async () => {
		const response = await AuthService.userDetails();
		form.setFieldsValue(response.user);
		setUser(response.user);
	};

	useEffect(() => {
		if(mode === EDIT) {
			getCurrentUser();
		}
	}, [])

	return (
		<div style={{paddingLeft: '20px'}}>
			<Form
				layout="vertical"
				form={form}
				name="advanced_search"
				className="ant-advanced-search-form"
				initialValues={{
					'status': 'enabled'
				}}
			>
				<PageHeaderAlt className="border-bottom" overlap>
					<div className={mode == EDIT? '' : "container"}>
						<Flex className="py-2" mobileFlex={false} justifyContent="space-between" alignItems="center">
							<h2 className="mb-3">{mode === 'ADD'? 'Add New User' : `Edit User`} </h2>
							<div className="mb-3">
								<Button className="mr-2" onClick={() => form.resetFields()}>Discard</Button>
								<Button type="primary" onClick={() => onFinish()} htmlType="submit" loading={submitLoading} >
									{mode === 'ADD'? 'Add' : `Save`}
								</Button>
							</div>
						</Flex>
					</div>
				</PageHeaderAlt>
				<div className={mode == EDIT? '' : "container"}>
					<Tabs 
						defaultActiveKey="1" 
						style={{marginTop: 30}}
						items={[
							{
								label: 'General',
								key: '1',
								children: <GeneralField mode={mode}/>,
							}
						]}
					/>
				</div>
			</Form>
		</div>
	)
}

export default UserForm
