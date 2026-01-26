const dev = {
  url: {
    HOST: 'http://localhost:8000',
  },
};

const prod = {
  url: {
    HOST: '',
    PORT: '',
  },
};

const apiUrl = {
  API_URL_LOGIN: '/api/user/token/',
  API_URL_ARQUITECTOS: '/api/tariff/architects/',
  API_URL_PROYECTOS: '/api/tariff/projects/',
  API_URL_ARANCELES: '/api/tariff/headers/',
  PDF_URL: '/api/tariff/pdf/',
};

export const config = process.env.NODE_ENV === 'development' ? dev : prod;
export const api = apiUrl;
