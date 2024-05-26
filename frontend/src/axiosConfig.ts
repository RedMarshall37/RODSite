import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Замените на ваш базовый URL
});

export default instance;