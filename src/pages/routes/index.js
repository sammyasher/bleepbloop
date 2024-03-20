import { useNavigate } from "react-router-dom";

import { Home } from "../Home";
import { Sparkler } from "../Sparkler";
import { SmokeySparklerCone } from "../SmokeySparklerCone";
import { NoteMaker } from "../NoteMaker";
import { Samoji } from "../Samoji";
import { SourceAndSink } from "../SourceAndSink";
import { Route } from "react-router-dom";
import { MultiFireWork } from "../MultiFireWork";
import { CircleBounceTone } from "../CircleBounceTone/CircleBounceTone";
import { BeanBoy } from "../BeanBoy";
import { GlowTone } from "../GlowTone";
import { Glorp } from "../Glorp";
import { SpringThing } from "../SpringThing";
import { HyperStimulus } from "../HyperStimulus";
import { Demolition } from "../Demolition";
import { Tethered2 } from "../Tethered2";
import { Tethered } from "../Tethered";
import { BOING } from "../Boing/Boing";
import { Counterpoint } from "../Counterpoint/Counterpoint";
import { Species } from "../Species/Species";
import { SoftTouch } from "../SoftTouch/SoftTouch";

const paths = [
  { to: "/", element: <Home />, includeInNav: true, name: "Home" },
  {
    to: "/sparkler",
    element: <Sparkler />,
    includeInNav: true,
    name: "Sparkler",
  },
  {
    to: "/smokeysparkler-cone",
    element: <SmokeySparklerCone />,
    includeInNav: true,
    name: "SmokeySparklerCone",
  },
  {
    to: "/notemaker",
    element: <NoteMaker />,
    includeInNav: true,
    name: "NoteMaker",
  },
  { to: "/samoji", element: <Samoji />, includeInNav: true, name: "Samoji" },
  {
    to: "/sourceandsink",
    element: <SourceAndSink />,
    includeInNav: true,
    name: "SourceAndSink",
  },
  {
    to: "/multifirework",
    element: <MultiFireWork />,
    includeInNav: true,
    name: "MultiFireWork",
  },
  {
    to: "/circlebouncetone",
    element: <CircleBounceTone />,
    includeInNav: true,
    name: "CircleBounceTone",
  },
  { to: "/beanboy", element: <BeanBoy />, includeInNav: true, name: "BeanBoy" },
  {
    to: "/glowtone",
    element: <GlowTone />,
    includeInNav: false,
    name: "GlowTone",
  },
  { to: "/Glorp", element: <Glorp />, includeInNav: true, name: "Glorp" },
  {
    to: "/springthing",
    element: <SpringThing />,
    includeInNav: true,
    name: "SpringThing",
  },
  {
    to: "/hyperstimulus",
    element: <HyperStimulus />,
    includeInNav: true,
    name: "HyperStimulus",
  },
  {
    to: "/demolition",
    element: <Demolition />,
    includeInNav: true,
    name: "Demolition",
  },
  {
    to: "/tethered",
    element: <Tethered />,
    includeInNav: true,
    name: "Tethered",
  },
  {
    to: "/tethered2",
    element: <Tethered2 />,
    includeInNav: true,
    name: "Tethered2",
  },
  {
    to: "/boing",
    element: <BOING />,
    includeInNav: true,
    name: "BOING",
  },
  {
    to: "/Counterpoint",
    element: <Counterpoint />,
    includeInNav: true,
    name: "Counterpoint",
  },
  {
    to: "/Species",
    element: <Species />,
    includeInNav: true,
    name: "Species",
  },
  {
    to: "/SoftTouch",
    element: <SoftTouch />,
    includeInNav: true,
    name: "SoftTouch",
  },


];

const Dropdown = () => {
  const navigate = useNavigate();

  return (
    <select
      onChange={(event) => {
        navigate(event.target.value);
      }}
    >
      {paths
        .filter((path) => path.includeInNav)
        .map((path) => (
          <option key={path.name} value={path.to}>
            {path.name}
          </option>
        ))}
    </select>
  );
};

const navLinks = <Dropdown />;

const routes = paths.map((path) => (
  <Route key={path.name} path={path.to} element={path.element} />
));

export { paths, navLinks, routes };
