
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-hotel-50 py-12 md:py-16">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">About StayHaven</h1>
              <p className="text-muted-foreground mb-8">
                Revolutionizing the way people discover and book accommodations around the world.
              </p>
            </div>
          </div>
        </section>
        
        {/* Our Story */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  StayHaven was founded in 2023 with a simple mission: to make finding and booking the perfect accommodation as effortless as possible.
                </p>
                <p className="text-muted-foreground mb-4">
                  What started as a small project has grown into a platform trusted by thousands of travelers worldwide. We believe that where you stay is more than just a place to sleep—it's an integral part of your travel experience.
                </p>
                <p className="text-muted-foreground">
                  Today, we're proud to offer a curated selection of hotels, resorts, apartments, and unique stays across hundreds of destinations, with a focus on quality, value, and exceptional service.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3" 
                  alt="Luxury hotel lobby" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Values</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-hotel-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hotel-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Trust & Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in honest, accurate information. No hidden fees, no surprises—just straightforward details to help you make informed decisions.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-hotel-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hotel-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-muted-foreground">
                  Your satisfaction is our priority. We're committed to providing exceptional service and support at every step of your journey.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-hotel-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-hotel-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Global Perspective</h3>
                <p className="text-muted-foreground">
                  We celebrate diversity and embrace different cultures, offering accommodations that cater to a wide range of preferences and needs.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-12 md:py-16">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Leadership Team</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3" 
                    alt="CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Michael Chen</h3>
                <p className="text-hotel-600 mb-2">CEO & Co-Founder</p>
                <p className="text-muted-foreground text-sm">
                  With over 15 years in hospitality and tech, Michael leads our vision and strategy.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3" 
                    alt="COO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Sarah Johnson</h3>
                <p className="text-hotel-600 mb-2">COO & Co-Founder</p>
                <p className="text-muted-foreground text-sm">
                  Sarah oversees our day-to-day operations, focusing on customer experience excellence.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3" 
                    alt="CTO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">David Rodriguez</h3>
                <p className="text-hotel-600 mb-2">CTO</p>
                <p className="text-muted-foreground text-sm">
                  David leads our engineering team, building the technology that powers StayHaven.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-16 bg-hotel-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to find your perfect stay?</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied travelers who have discovered their ideal accommodations with StayHaven.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/hotels">
                <Button size="lg" variant="secondary">Browse Hotels</Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="bg-white text-hotel-600 hover:bg-gray-100">Sign Up Free</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
