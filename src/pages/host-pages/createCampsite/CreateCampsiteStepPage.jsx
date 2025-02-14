import { useParams } from "react-router-dom";
import Overview from "../createCampsite/Overview";
import AboutYourPlace from "../createCampsite/AboutYourPlace";
import Location from "../createCampsite/Location";
import CampType from "../createCampsite/CampType";
import Services from "../createCampsite/Services";
import Receipt from "../createCampsite/Receipt";


const CreateCampsiteStepPage = () => {
  const { step } = useParams();

  const stepComponents = {
    overview: <Overview />,
    "about-your-place": <AboutYourPlace />,
    services: <Services />,
    location: <Location />,
    "camp-type": <CampType />,
    receipt: <Receipt />,
  };

  return (
    <div>
      {stepComponents[step] }
    </div>
  );
};

export default CreateCampsiteStepPage;
