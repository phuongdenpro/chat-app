import { createSlice, configureStore } from '@reduxjs/toolkit'
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";


const userSlice = createSlice({
  name: 'user',
  initialState: {},
  reducers: {
    setUser: (state, value) => {
      state.info = value.payload
    },
    getUser: state => state
  }
})

const pageSlice = createSlice({
  name: 'page',
  initialState: {
    info: "conversation"
  },
  reducers: {
    setPage: (state, value) => {
      state.info = value.payload
    },
    getPage: state => state
  }
})

const currentConvSlice = createSlice({
  name: 'currentConv',
  initialState: {},
  reducers: {
    setStoreCurentConv: (state, value) => {
      state.info = value.payload
    }
  }
})

const infoConversationModalSlice = createSlice({
  name: 'isOpenInfoConversationModal',
  initialState: {
    value: "false"
  },
  reducers: {
    setOpenInfoConversationModal: (state, value) => {
      // console.log("setOpenInfoConversationModal", state, value)
      state.value = value.payload
    }
  }
})

const rootReducer = combineReducers({
  user: userSlice.reducer,
  page: pageSlice.reducer,
  currentConv: currentConvSlice.reducer,
  isOpenInfoConversationModal: infoConversationModalSlice.reducer
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer
})

export default store;
export const { setUser, getUser } = userSlice.actions
export const { setPage, getPage } = pageSlice.actions
export const { setStoreCurentConv } = currentConvSlice.actions
export const { setOpenInfoConversationModal } = infoConversationModalSlice.actions
