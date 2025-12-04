import { Outlet } from "react-router-dom";

import Sidebar from "../molecules/sidebar";

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
