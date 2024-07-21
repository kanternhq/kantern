import React from "react";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

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
        <div>Helloooooooooo</div>
      </AppShell.Header>

      <h1>Hello</h1>
      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>
        <h1>Hello</h1>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;
