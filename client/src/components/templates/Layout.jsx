import { Outlet } from "react-router-dom";

import Sidebar from "../molecules/Sidebar";

const Layout = () => {
  return (
    <>
      <Sidebar>
        <main>
          <Outlet />
        </main>
      </Sidebar>
    </>
  );
};

export default Layout;
