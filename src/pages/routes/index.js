// import { Home } from "./pages/Home";
// import { SmokeySparkler } from "./pages/SmokeySparkler";
// import { SmokeySparklerCone } from "./pages/SmokeySparklerCone";
// import { NoteMaker } from "./pages/NoteMaker";
// import { Link, Route } from "react-router-dom";

import { Home } from "../Home";
import { SmokeySparkler } from "../SmokeySparkler";
import { SmokeySparklerCone } from "../SmokeySparklerCone";
import { NoteMaker } from "../NoteMaker";
import { Link, Route } from "react-router-dom";

const paths = [
  { to: "/", element: <Home /> },
  { to: "/smokeysparkler", element: <SmokeySparkler /> },
  { to: "/smokeysparkler-cone", element: <SmokeySparklerCone /> },
  { to: "/notemaker", element: <NoteMaker /> },
];

const navLinks = paths.map((link) => (
  <li key={link.to}>
    <Link style={{ color: "brown" }} to={link.to}>
      {link.element.type.name}
    </Link>
  </li>
));

const routes = paths.map((link) => (
  <Route key={link.to} path={link.to} element={link.element} />
));

export { paths, navLinks, routes };
