import React from "react";
// import { useState } from "react";
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="container">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Your main content goes here */}
        <h1 className="text-2xl font-bold">Welcome to the Kubernetes GUI</h1>
      </div>
    </div>
  );
}

export default App;
