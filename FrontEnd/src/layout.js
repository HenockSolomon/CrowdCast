import Navbar from "./HeaderPublic";
import {Outlet} from "react-router-dom";

export default function Layout() {
  return (
    <main>
      <Navbar />
      <Outlet />
      
    </main>
  );
}