require('dotenv').config();
import { createStore } from "vuex";
import _axios from "axios";
const {
  API_LOGIN_URL = '/users/login',
  API_SIGNUP_URL = '/users/signup',
  API_TRANSACTIONS_URL = '/transactions',
  API_BALANCE_URL = '/transactions/balance',
  API_GET_USERS_URL = '/users',
  API_CREATE_TRANSACTIONS_URL = '/transactions/create',
  API_BASE_URL = 'http://localhost:3000'
} = process.env;
const axios = _axios.create({ baseURL: API_BASE_URL })

const initialState = JSON.stringify({
  authenticated: false,
  user: null,
  dashboard: null,
  notification: { type: '', message: '' },
  loading: false
})
const state = JSON.parse(getCredential('state') || initialState);

export default createStore({
  state,
  mutations: {
    loadingPage(state, value) {
      state.loading = value;
    },
    authenticate(state, user) {
      state.authenticated = true;
      state.user = user;
    },
    unauthenticate(state) {
      state.dashboard = null;
      state.authenticated = false;
      state.user = null;
    },
    storeDashboard(state, dash) {
      state.dashboard = dash;
    },
    notify(state, text) {
      state.notification = text;
    },
  },
  actions: {
    async login({ dispatch, commit }, opts) {
      try {
        console.log('df', API_BASE_URL, API_LOGIN_URL)
        const { data } = await axios.post(API_LOGIN_URL, opts)
        storeCredentials('token', data.token);
        storeCredentials('user', JSON.stringify(data.user));
        commit('authenticate', data.user)
        dispatch('cache')
        console.log(data)
        return data;
      } catch(e) {
        console.log(e);
        return null;
      }
    },
    async signup(_, opts) {
      try {
        const { data } = await axios.post(API_SIGNUP_URL,  opts)
        return data;
      } catch(e) {
        return null;
      }
    },
    logout({ dispatch, commit }) {
      commit('unauthenticate')
      clearCredentials();
      dispatch('cache')
      return true;
    },
    authenticated() {
      return getCredential('token') && getCredential('user')
    },
    async dashboard_details({ dispatch, commit, state }) {
      // if(state.dashboard) return state.dashboard
      commit('loadingPage', true);
      const ax = axios.create({ headers: { 'Authorization': `Bearer ${getCredential('token')}` }})
      
      const [
        { data: { message: transactions }},
        { data: { message: balance }},
        { data: { message: users }}
      ] = await Promise.all([
        ax.get(API_TRANSACTIONS_URL),
        ax.get(API_BALANCE_URL),
        ax.get(API_GET_USERS_URL)
      ]);
      const dashboard = { transactions, balance, users }

      commit('loadingPage', false);
      commit('storeDashboard', dashboard)
      dispatch('cache')
      return dashboard;
    },
    async create_transaction(_, opts) {
      const transaction = await axios
        .create({ headers: { 'Authorization': `Bearer ${getCredential('token')}` }})
        .post(API_CREATE_TRANSACTIONS_URL, opts)

      return transaction.data;
    },
    notify({ dispatch, commit }, text) {
      commit('notify', text)
      dispatch('cache')
    },
    clearNotification({ dispatch, commit }) {
      commit('notify', { type: '', message: '' })
      dispatch('cache')
    },
    // this is to persist the store... on localstorage
    cache({ state }) {
      storeCredentials('state', JSON.stringify(state))
    }
  },
});

function storeCredentials(key, credentials) {
  return window.localStorage.setItem(key, credentials);
}

function clearCredentials() {
  return window.localStorage.clear();
}

function getCredential(key) {
  return window.localStorage.getItem(key);
}
