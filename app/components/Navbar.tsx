import React from "react";
import { Link } from "react-router-dom";
import { AppShell, AppShellNavbar, Anchor, Title } from "@mantine/core";
import { createStyles } from "@mantine/styles";

const useStyles = createStyles((theme) => ({
  link: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[7],
    display: "block",
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
    borderRadius: theme.radius.sm,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
  header: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderBottom: `1px solid ${theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[2]}`,
  },
}));

const Navbar: React.FC = () => {
  const { classes } = useStyles();

  return (
    <AppShellNavbar>
      <AppShell.Section className={classes.header}>
        <Title order={3}>Kubernetes GUI</Title>
      </AppShell.Section>
      <AppShell.Section grow>
        <Anchor component={Link} to="/" className={classes.link}>
          Home
        </Anchor>
        <Anchor component={Link} to="/pods" className={classes.link}>
          Pods
        </Anchor>
        <Anchor component={Link} to="/services" className={classes.link}>
          Services
        </Anchor>
        <Anchor component={Link} to="/deployments" className={classes.link}>
          Deployments
        </Anchor>
      </AppShell.Section>
    </AppShellNavbar>
  );
};

export default Navbar;
