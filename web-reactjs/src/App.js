import logo from './logo.svg';
import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Loading from './components/basics/loading';
import 'antd/dist/antd.min.css';
import './App.css';

const ForgotPassword = lazy(() => import("./pages/account/forgot"));
const Login = lazy(() => import("./pages/account/login"));
const Register = lazy(() => import("./pages/account/register"));
const ChangePassword = lazy(() => import("./pages/account/change_password"));
const HomePage = lazy(() => import("./pages/home"));
const FriendPage = lazy(() => import("./pages/conversation/friend"));
const MainPage = lazy(() => import("./pages/main"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
          <Route path="dang-nhap" element={<Login />} />
          <Route path="dang-ky" element={<Register />} />
          <Route path="quen-mat-khau" element={<ForgotPassword />} />
          <Route path="doi-mat-khau/phoneNumber=:phoneNumber" element={<ChangePassword />} />
          <Route path="" element={<MainPage />} />
          {/* <Route path="ban-be" element={<FriendPage />} /> */}
      </Routes>
    </Suspense>
  );
}

export default App;
