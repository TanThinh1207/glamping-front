import thumb from "../assets/thumb.jpg";
import feature1 from "../assets/feature1.jpg";
import feature2 from "../assets/feature2.jpg";
import feature3 from "../assets/feature3.jpg";
import feature4 from "../assets/feature4.jpg";
import feature5 from "../assets/feature5.jpg";
import feature6 from "../assets/feature6.jpg";
import feature7 from "../assets/feature7.jpg";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  return (
    <div>
      <div className="thumb flex relative justify-center w-full">
        <img src={thumb} className="w-full h-auto" alt="Thumbnail" />
      </div>
      <SearchBar />
      <div className="featured px-4">
        <p className="uppercase text-2xl font-semibold pt-5 pb-5">featured properties</p>
        <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-screen">
          <div className="left-container flex flex-col w-full lg:w-1/2">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature1} alt="Tent Bagolaro" />
              <div className="absolute font-canto inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">Tent Bagolaro</p>
                <p className="text-xl italic text-white">Da Lat</p>
              </div>
            </div>
          </div>
          <div className="right-container flex flex-col w-full lg:w-1/2 space-y-6">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature2} alt="The Swimmingpool" />
              <div className="absolute font-canto inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Swimmingpool</p>
                <p className="text-xl italic text-white">Quy Nhon</p>
              </div>
            </div>
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature3} alt="The Pines" />
              <div className="absolute font-canto inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Pines</p>
                <p className="text-xl italic text-white">Sa Pa</p>
              </div>
            </div>
          </div>
        </div>
        <p className="uppercase flex justify-center text-2xl pt-8 pb-8 font-light">BOOK YOUR UNFORGETTABLE EXPERIENCE</p>
        <div className="flex flex-col lg:flex-row gap-6 min-h-screen">
          <div className="left-container flex flex-col w-full lg:w-1/2 space-y-6">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature4} alt="The Luxury" />
              <div className="absolute font-canto inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Luxury</p>
                <p className="text-xl italic text-white">Da Nang</p>
              </div>
            </div>
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature5} alt="The Isveita" />
              <div className="absolute font-canto inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">The Isveita</p>
                <p className="text-xl italic text-white">Phu Quoc</p>
              </div>
            </div>
          </div>
          <div className="right-container flex w-full lg:w-1/2">
            <div className="relative flex-1 flex items-stretch">
              <img className="w-full h-full object-cover" src={feature6} alt="Tent Aminta" />
              <div className="absolute font-canto inset-0 justify-center items-center flex flex-col">
                <p className="text-2xl uppercase text-white pb-10">Tent Aminta</p>
                <p className="text-xl italic text-white">Nha Trang</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-4">
        <div>
          <h1 className="text-2xl font-semibold uppercase tracking-wide pt-5 pb-5">
            Featured Glamping Destination
          </h1>
        </div>
        <div className="flex flex-col w-full lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6">
          <div className="lg:w-2/3 w-full">
            <img src={feature7} alt="Glamping Destination" className="w-full h-auto shadow-md" />
          </div>
          <div className="lg:w-1/3 p-4 bg-white border-2 border-blue-200">
            <div className="bg-white p-4 shadow-md border-2 border-blue-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-2 uppercase">
                South America
              </h2>
              <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase">
                South of the Equator Adventures
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                Stretching from steaming Amazonian jungles to the penguin playgrounds near Antarctica, South America represents incredible opportunities for eco-adventures, cultural learning, and otherwise exploring a unique part of the earth. Whether your desire is to chase down a blue-footed booby on the Galapagos Islands, walk where the Inca did on Machu Picchu, or explore the vast wonders of the Andes, glamping provides some excellent basecamps. From unmatched luxury in a posh Patagonian lodge, to astronomy-focused lodgings in Chile, from eco-luxury in Ecuador to the beautiful beaches of Brazil, glamping puts you in touch with this intriguing continent in ways no other type of travel ever could.
              </p>
              <button className="bg-transparent uppercase text-black border border-black w-1/2 py-2 px-6 text-sm hover:bg-blue-400 hover:text-white hover:border-white transition duration-200">
                View Destination
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
