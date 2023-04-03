import AppShellComp from "@components/AppShell";
import { Outlet } from "react-router-dom";

const Root = () => (
  <AppShellComp>
    <Outlet />
  </AppShellComp>
)

export default Root
