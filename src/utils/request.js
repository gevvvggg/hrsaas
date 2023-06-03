import axios from 'axios'
const service = axios.create()
// 注入token
service.interceptors.request.use()
service.interceptors.response.use()
export default service
