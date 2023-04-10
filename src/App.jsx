import React, { useState } from "react";
import RegisterPage from "./pages/Register/";
// import LoginForm from "./pages/Login/LoginForm";
import useFetch from "./hooks/useFetch";
import Navbar from "./components/Navbar";
// import NewTopicForm from "./pages/Forum/NewTopic/NewTopicForm";
import TextCard from "./components/TextCard/TextCard";
import styles from '../src/App.module.css'

import Navbar from "./components/Navbar";

function App() {
  return (
    <div>
      <Navbar />
      <div className={styles.body}>
        <TextCard/>
        {/* <NewTopicForm /> */}
        {/* <LoginForm/> */}
        {/* <RegisterPage /> */}
      </div>
      {/*<LoginForm/>*/}
      {/*<RegisterPage/>*/}
    </div>
  );
}
export default App;
