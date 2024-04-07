import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AUTH_TOKEN } from 'constants/AuthConstant';
import FirebaseService from 'services/FirebaseService';
import AuthService from 'services/AuthService';

export const initialState = {
	loading: false,
	message: '',
	showMessage: false,
	redirect: '',
	token: localStorage.getItem(AUTH_TOKEN) || null,
	user: {
		firstName: localStorage.getItem('first_name') || null,
		lastName: localStorage.getItem('last_name') || null,
		email: localStorage.getItem('email') || null,
		role: localStorage.getItem('role') || null
	}
	
}

export const signIn = createAsyncThunk('auth/login',async (data, { rejectWithValue }) => {
	const { email, password } = data
	try {
		const response = await AuthService.login({email, password});
		const userData = {
			token: response.result.password,
			role: response.result.role,
			firstName: response.result.first_name,
			lastName: response.result.last_name,
			email: email,
		  };
		const token = response.result.password;
		const role = response.result.role;
		const first_name = response.result.first_name;
		const last_name = response.result.last_name;
		localStorage.setItem(AUTH_TOKEN, token);
		localStorage.setItem('role', role);
		localStorage.setItem('first_name', first_name);
		localStorage.setItem('last_name', last_name);
		localStorage.setItem('email', email);
		return userData;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const signUp = createAsyncThunk('auth/register',async (data, { rejectWithValue }) => {
	const { email, password } = data
	try {
		const response = await AuthService.register({email, password})
		const token = response.data.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const signOut = createAsyncThunk('auth/logout',async () => {
    const response = await FirebaseService.signOutRequest()
	localStorage.removeItem(AUTH_TOKEN);
    return response.data
})

export const signInWithGoogle = createAsyncThunk('auth/signInWithGoogle', async (_, { rejectWithValue }) => {
    try {
		const response = await AuthService.loginInOAuth()
		const token = response.data.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})

export const signInWithFacebook = createAsyncThunk('auth/signInWithFacebook', async (_, { rejectWithValue }) => {
    try {
		const response = await AuthService.loginInOAuth()
		const token = response.data.token;
		localStorage.setItem(AUTH_TOKEN, token);
		return token;
	} catch (err) {
		return rejectWithValue(err.response?.data?.message || 'Error')
	}
})


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		authenticated: (state, action) => {
			state.loading = false
			state.redirect = '/'
			state.token = action.payload
		},
		showAuthMessage: (state, action) => {
			state.message = action.payload
			state.showMessage = true
			state.loading = false
		},
		hideAuthMessage: (state) => {
			state.message = ''
			state.showMessage = false
		},
		signOutSuccess: (state) => {
			state.loading = false
			state.token = null
			state.redirect = '/'
			state.user = null
		},
		showLoading: (state) => {
			state.loading = true
		},
		signInSuccess: (state, action) => {
			state.loading = false
			state.token = action.payload
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(signIn.pending, (state) => {
				state.loading = true
			})
			.addCase(signIn.fulfilled, (state, action) => {
				state.loading = true
				state.redirect = '/'
				state.token = action.payload.token
				state.user = action.payload
			})
			.addCase(signIn.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signOut.fulfilled, (state) => {
				state.loading = false
				state.token = null
				state.redirect = '/'
			})
			.addCase(signOut.rejected, (state) => {
				state.loading = false
				state.token = null
				state.user = null
				state.redirect = '/'
				
			})
			.addCase(signUp.pending, (state) => {
				state.loading = true
			})
			.addCase(signUp.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signUp.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signInWithGoogle.pending, (state) => {
				state.loading = true
			})
			.addCase(signInWithGoogle.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signInWithGoogle.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
			.addCase(signInWithFacebook.pending, (state) => {
				state.loading = true
			})
			.addCase(signInWithFacebook.fulfilled, (state, action) => {
				state.loading = false
				state.redirect = '/'
				state.token = action.payload
			})
			.addCase(signInWithFacebook.rejected, (state, action) => {
				state.message = action.payload
				state.showMessage = true
				state.loading = false
			})
	},
})

export const { 
	authenticated,
	showAuthMessage,
	hideAuthMessage,
	signOutSuccess,
	showLoading,
	signInSuccess
} = authSlice.actions

export default authSlice.reducer