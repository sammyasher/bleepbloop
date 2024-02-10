import { Home } from "../Home";
import { Sparkler } from "../Sparkler";
import { SmokeySparklerCone } from "../SmokeySparklerCone";
import { NoteMaker } from "../NoteMaker";
import { Link, Route } from "react-router-dom";

const paths = [
  { to: "/", element: <Home />, includeInNav: true },
  { to: "/sparkler", element: <Sparkler />, includeInNav: true },
  {
    to: "/smokeysparkler-cone",
    element: <SmokeySparklerCone />,
    includeInNav: true,
  },
  { to: "/notemaker", element: <NoteMaker />, includeInNav: true },
];

const navLinks = paths
  .filter((link) => link.includeInNav)
  .map((link) => (
    <li key={link.to}>
      <Link style={{ color: "brown" }} to={link.to} includeInNav={link.element}>
        {link.element.type.name}
      </Link>
    </li>
  ));

const routes = paths.map((link) => (
  <Route key={link.to} path={link.to} element={link.element} />
));

export { paths, navLinks, routes };
