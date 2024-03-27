import React from 'react'
import { Input, Row, Col, Card, Form, Upload, InputNumber, message, Select } from 'antd';
const { Option } = Select;

const validateMinLength = (_, value) => {
	value = value && value.trim()

	if(value && value.length < 3){
		return Promise.reject('Minimum length is 3 characters');
	}

	return Promise.resolve();
}

const rules = {
	name: [
		{
			required: 'true',
			message: 'Please input user name'
		},
		{
			validator: validateMinLength
		}
	],
	email: [
		{ 
			required: true,
			message: 'Please input user email',
		},
		{ 
			type: 'email',
			message: 'Please enter a valid email!'
		}
	],
	password: [
		{
			required: 'true',
			message: 'Please enter password.'
		}
	],
	phone: [],
}

const categories = ['enabled', 'disabled']

const GeneralField = ({mode}) => (
	<Row gutter={16}>
		<Col xs={24} sm={24} md={mode == 'ADD'? 17 : 24}>
			<Card title="Basic Info">
				<Form.Item name="name" label="Username" rules={rules.name}>
					<Input placeholder="Enter username" />
				</Form.Item>
				{mode === 'ADD' && <><Form.Item name="email" label="Email" rules={rules.email}>
					<Input placeholder='Enter email' type='email' rows={4} />
				</Form.Item>
				<Form.Item name="password" label="Password" rules={rules.password}>
					<Input placeholder="Enter password" />
				</Form.Item> </>}
				<Form.Item name="phone" label="Contact Number" rules={rules.phone}>
					<Input placeholder="Enter contact number" />
				</Form.Item>
			</Card>
		</Col>
		{mode === 'ADD' && <Col xs={24} sm={24} md={7}>
			<Card title="Status">
				<Form.Item name="status" label="Enabled / Disabled" >
					<Select className="text-capitalize" placeholder="Enable/Disable">
						{
							categories.map(elm => (
								<Option className='text-capitalize' key={elm} value={elm}>{elm}</Option>
							))
						}
					</Select>
				</Form.Item>
			</Card>
		</Col>}
	</Row>
)

export default GeneralField