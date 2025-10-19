import React from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import AdminLogin from "./auth/login";
import AdminPanel from "./auth/admin";

export default function App(){
  return(
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPanel/>} />
        <Route path="/login" element={<AdminLogin/>} />
        <Route path="/" element={<HomePage/>} />

      </Routes>
      </BrowserRouter>
    </div>
  )
}