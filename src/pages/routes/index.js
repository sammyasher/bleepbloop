import { Home } from "../Home";
import { Sparkler } from "../Sparkler";
import { SmokeySparklerCone } from "../SmokeySparklerCone";
import { NoteMaker } from "../NoteMaker";
import { Samoji } from "../Samoji";
import { SourceAndSink } from "../SourceAndSink";
import { Route } from "react-router-dom";
import { MultiFireWork } from "../MultiFireWork";
import { CircleBounceTone } from "../CircleBounceTone";
import { useNavigate } from "react-router-dom";  

const paths = [
  { to: "/", element: <Home />, includeInNav: true, name: "Home"},
  { to: "/sparkler", element: <Sparkler />, includeInNav: true, name: "Sparkler"},
  { to: "/smokeysparkler-cone", element: <SmokeySparklerCone />, includeInNav: true, name: "SmokeySparklerCone"},
  { to: "/notemaker", element: <NoteMaker />, includeInNav: true, name: "NoteMaker"},
  { to: "/samoji", element: <Samoji />, includeInNav: true, name: "Samoji"},
  { to: "/sourceandsink", element: <SourceAndSink />, includeInNav: true, name: "SourceAndSink"},
  { to: "/multifirework", element: <MultiFireWork />, includeInNav: true, name: "MultiFireWork"},
  { to: "/circlebouncetone", element: <CircleBounceTone />, includeInNav: false, name: "CircleBounceTone"},
];

const Dropdown = () => {
  const navigate = useNavigate(); 

  return (
    <select onChange={(event) => {navigate(event.target.value)}}>   
      {paths.filter((path) => path.includeInNav).map((path) => (
          <option value={path.to}>{path.name}</option> 
        ))}
    </select>
  );
};

const navLinks = <Dropdown />;

const routes = paths.map((path) => (
  <Route path={path.to} element={path.element} />  
));

export { paths, navLinks, routes };
