import { login, getUserInfo, getUserDetailById } from '@/api/user'
// 本地缓存中的token操作
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // token 来自于 actions ->login
  SET_TOKEN: (state, token) => {
    state.token = token
    setToken(token)
  },
  REMOVE_TOKEN: (state) => {
    state.token = ''
    removeToken()
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = { ...userInfo }
  },
  REMOVE_USERINFO: (state) => {
    state.userInfo = {}
  }
}
// 就是来进行异步操作的
const actions = {
  // user login
  async login(context, data) {
    const result = await login(data) // 实际上就是一个promise  result就是执行的结果
    // axios默认给数据加了一层data

    // 表示登录接口调用成功 也就是意味着你的用户名和密码是正确的
    // 现在有用户token
    // actions 修改state 必须通过mutations
    context.commit('SET_TOKEN', result)
    setTimeStamp()
  },

  // get user info
  async getUserInfo(context) {
    const data = await getUserInfo()
    const result = await getUserDetailById(data.userId)
    const res = { ...data, ...result }
    context.commit('SET_USERINFO', res)
    return res
  },
  // user logout
  logout(context) {
    context.commit('REMOVE_USERINFO')
    context.commit('REMOVE_TOKEN')
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

