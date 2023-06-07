const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  username: state => state.user.userInfo.username,
  userId: state => state.user.userInfo.userId,
  name: state => state.user.name,
  staffPhoto: state => state.user.userInfo.staffPhoto
}
export default getters
