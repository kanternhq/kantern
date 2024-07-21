import React from "react";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

function Home() {
  return (
    <div>
      <h1>Home Page</h1>
    </div>
  );
}

function Pods() {
  return (
    <div>
      <h1>Pods Page</h1>
    </div>
  );
}

function Services() {
  return (
    <div>
      <h1>Services Page</h1>
    </div>
  );
}

function Deployments() {
  return (
    <div>
      <h1>Deployments Page</h1>
    </div>
  );
}

function App() {
  const [opened, { toggle }] = useDisclosure();
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>Header</div>
      </AppShell.Header>

      <Navbar />

      <AppShell.Main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pods" element={<Pods />} />
          <Route path="/services" element={<Services />} />
          <Route path="/deployments" element={<Deployments />} />
        </Routes>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
