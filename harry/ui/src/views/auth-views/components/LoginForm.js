import React, { useEffect,useState } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Divider, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { GoogleSVG, FacebookSVG } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon'
import { 
	signIn, 
	showLoading, 
	showAuthMessage, 
	hideAuthMessage, 
	signInWithGoogle, 
	signInWithFacebook 
} from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import './login.css';

export const LoginForm = props => {
	const [rememberMe, setRememberMe] = useState(localStorage.getItem('rememberMe')=='true'?true:false);
	const [email, setEmail] = useState(localStorage.getItem('email') ||null);
	const [password, setPassword] = useState(localStorage.getItem('password') || null);
	const navigate = useNavigate();
	
	const { 
		otherSignIn, 
		showForgetPassword, 
		hideAuthMessage,
		onForgetPasswordClick,
		showLoading,
		signInWithGoogle,
		signInWithFacebook,
		extra, 
		signIn, 
		token, 
		loading,
		redirect,
		showMessage,
		message,
		allowRedirect = true
	} = props



	const emailInputStyle = {
		width: '496px',
		height: '51px',
		position: 'absolute',
		top: '211px',
		left: '96px',
		padding: '3.5px 313px 2.5px 12px',
		gap: '0px',
		opacity: '0',
	  };

	const onLogin = values => {
		if (rememberMe) {
			localStorage.setItem('rememberMe', rememberMe);
			localStorage.setItem('email', values.email);
			localStorage.setItem('password', values.password);
		}
		else if (!rememberMe) {
			localStorage.removeItem('rememberMe');
			localStorage.removeItem('email');
			localStorage.removeItem('password');
		}
		showLoading()
		signIn(values);
	};

	const handleRememberMeChange = (event) => {
		setRememberMe(event.target.checked);
	  };

	
	useEffect(() => {
		if (token !== null && allowRedirect) {
			navigate(redirect)
		}
		if (rememberMe) {
			setEmail(localStorage.getItem('email') ||null);
			setPassword(localStorage.getItem('password') ||null);
		  }
		if (showMessage) {
			const timer = setTimeout(() => hideAuthMessage(), 3000)
			return () => {
				clearTimeout(timer);
			};
		}
	});
	
	return (
		<>
			<motion.div 
				initial={{ opacity: 0, marginBottom: 0 }} 
				animate={{ 
					opacity: showMessage ? 1 : 0,
					marginBottom: showMessage ? 20 : 0 
				}}> 
				<Alert type="error" showIcon message={message}></Alert>
			</motion.div>
			<Form 
				layout="vertical" 
				name="login-form" 
				onFinish={onLogin}
				initialValues={{ email: email, password: password }}
			>

				<Form.Item 
					name="email" 
					label="Email" 
					rules={[
						{ 
							required: true,
							message: 'Please input your email',
						},
						{ 
							type: 'email',
							message: 'Please enter a validate email!'
						}
					]}
					>
					<Input prefix={<MailOutlined className="text-primary" />} style={{width:"496px", borderRadius:0}} />
				</Form.Item>

				<Form.Item 
				
					name="password" 
					label={
						<div className={`${showForgetPassword? 'd-flex justify-content-between w-100 align-items-center' : ''}`}>
							<span>Password</span>
							{
								showForgetPassword && 
								<span 
									onClick={() => onForgetPasswordClick} 
									className="cursor-pointer font-size-sm font-weight-normal text-muted"
								>
									Forget Password?
								</span>
							} 
						</div>
					} 
					rules={[
						{ 
							required: true,
							message: 'Please input your password',
						}
					]}
				>
					<Input.Password prefix={<LockOutlined className="text-primary" />} style={{width:"496px", borderRadius:0}}/>
				</Form.Item>
				<Form.Item>
					<label style={{ display: 'flex', alignItems: 'center' }}>
						<input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} style={{ marginRight: '8px' }} />
						<span>Remember Me</span>
					</label>
				</Form.Item>
				<Form.Item>
					<Button htmlType="submit" block loading={loading} style={{width:"496px", borderRadius:0, background:"#565E6D", color:"#FFFFFF"}}>
						Sign In
					</Button>
				</Form.Item>
				{/* {
					otherSignIn ? renderOtherSignIn : null
				} */}
				{ extra }
			</Form>
		</>
	)
}

LoginForm.propTypes = {
	otherSignIn: PropTypes.bool,
	showForgetPassword: PropTypes.bool,
	extra: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.element
	]),
};

LoginForm.defaultProps = {
	otherSignIn: true,
	showForgetPassword: false
};

const mapStateToProps = ({auth}) => {
	const {loading, message, showMessage, token, redirect} = auth;
  return {loading, message, showMessage, token, redirect}
}

const mapDispatchToProps = {
	signIn,
	showAuthMessage,
	showLoading,
	hideAuthMessage,
	signInWithGoogle,
	signInWithFacebook
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
