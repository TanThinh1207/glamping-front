import React from 'react';
import thumb from "../assets/thumb.jpg";
import { Link } from 'react-router-dom';

const About = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-12 font-canto">
            {/* Hero Section */}
            <div className="mb-16 text-center">
                <h1 className="text-4xl font-bold mb-4">About AstroGlampé</h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Vietnam's dedicated platform connecting campers with campsite owners, enhanced with real-time weather forecasts
                </p>
            </div>

            {/* Our Mission Section */}
            <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
                <div className="md:w-1/2">
                    <img
                        src={thumb}
                        alt="Glamping in Vietnam"
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                    <p className="text-gray-700 mb-4">
                        AstroGlampé was created to solve a growing challenge in Vietnam's booming camping industry: the lack of a centralized platform connecting adventure seekers with campsite owners.
                    </p>
                    <p className="text-gray-700">
                        We're committed to making camping more accessible by eliminating the frustration of searching through scattered information across various social media platforms, while helping local campsite owners reach their target audience without high marketing costs.
                    </p>
                </div>
            </div>

            {/* For Customers Section */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-16 gap-8">
                <div className="md:w-1/2">
                    <img
                        src={thumb}
                        alt="Customer using AstroGlampé"
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">For Customers</h2>
                    <ul className="space-y-4 text-gray-700">
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-900 font-bold text-xl">✓</span>
                            <div>
                                <span className="font-semibold">Time-saving search process:</span> Access all available campsites in one place instead of browsing scattered information across social media platforms.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-900 font-bold text-xl">✓</span>
                            <div>
                                <span className="font-semibold">Enhanced user experience:</span> Filter and compare campsites based on location, amenities, tent types (glamping or traditional camping), and pricing options.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-900 font-bold text-xl">✓</span>
                            <div>
                                <span className="font-semibold">Integrated weather information:</span> Make informed decisions with accurate weather forecasts for your selected dates and locations.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* For Hosts Section */}
            <div className="flex flex-col md:flex-row items-center mb-16 gap-8">
                <div className="md:w-1/2">
                    <img
                        src={thumb}
                        alt="Campsite host managing bookings"
                        className="w-full h-auto rounded-lg shadow-lg"
                    />
                </div>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold mb-4">For Hosts</h2>
                    <ul className="space-y-4 text-gray-700">
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-900 font-bold text-xl">✓</span>
                            <div>
                                <span className="font-semibold">Effective customer outreach:</span> Reach your target audience without incurring high marketing costs on social media platforms.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-900 font-bold text-xl">✓</span>
                            <div>
                                <span className="font-semibold">Comprehensive listing management:</span> Easily list and update your campsite details including location, tent availability, and pricing options.
                            </div>
                        </li>
                        <li className="flex items-start">
                            <span className="mr-2 text-purple-900 font-bold text-xl">✓</span>
                            <div>
                                <span className="font-semibold">Revenue and booking management:</span> Monitor bookings and track revenue transparently through our user-friendly dashboard.
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="mb-16">
                <h2 className="text-3xl font-bold mb-8 text-center">How AstroGlampé Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-purple-900 text-2xl font-bold">1</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Search & Compare</h3>
                        <p className="text-gray-700">Find the perfect campsite using our powerful search filters and integrated weather forecasts.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-purple-900 text-2xl font-bold">2</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Book & Prepare</h3>
                        <p className="text-gray-700">Secure your booking with our simple reservation system and prepare for your adventure.</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-purple-900 text-2xl font-bold">3</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Enjoy & Share</h3>
                        <p className="text-gray-700">Experience the beauty of Vietnam's outdoors and share your feedback with our community.</p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gray-100 p-12 rounded-lg">
                <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Camping Experience?</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
                    Whether you're looking for your next adventure or wanting to list your campsite, AstroGlampé makes it simple.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/campsite">
                        <button className="bg-purple-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
                            Find a Campsite
                        </button>
                    </Link>
                    <Link to="/hosting">
                        <button className="border-2 border-purple-900 text-purple-900 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition">
                            List Your Property
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default About;