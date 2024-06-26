const dev = {
  API_ENDPOINT_URL: 'http://127.0.0.1:8000'
};

const prod = {
	API_ENDPOINT_URL: 'http://20.150.214.47:8000'
	// API_ENDPOINT_URL: 'http://127.0.0.1:8000'
};

const test = {
  API_ENDPOINT_URL: '/api'
};

const getEnv = () => {
	switch (process.env.NODE_ENV) {
		case 'development':
			return dev
		case 'production':
			return prod
		case 'test':
			return test
		default:
			break;
	}
}

export const env = getEnv()
