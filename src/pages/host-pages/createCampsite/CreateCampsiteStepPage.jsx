import { useParams } from "react-router-dom";
import Overview from "../createCampsite/Overview";
import AboutYourPlace from "../createCampsite/AboutYourPlace";
import Location from "../createCampsite/Location";
import CampType from "../createCampsite/CampType";
import Services from "../createCampsite/Services";
import Receipt from "../createCampsite/Receipt";
import StandOut  from "../createCampsite/StandOut";

const CreateCampsiteStepPage = () => {
  const { step } = useParams();

  const stepComponents = {
    overview: <Overview />,
    "about-your-place": <AboutYourPlace />,
    "stand-out": <StandOut />,
    services: <Services />,
    location: <Location />,
    "camp-type": <CampType />,
  };

  return (
    <div>
      {stepComponents[step] }
    </div>
  );
};

export default CreateCampsiteStepPage;
