
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Separator } from '@/components/ui/separator';
import { MapPin, Mail, Phone, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const AboutPage = () => {
  const teamMembers = [
    {
      name: 'Surya',
      role: 'CEO & Founder',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'Surya has over 15 years of experience in the hospitality industry and founded StayHaven with a vision to revolutionize hotel booking experiences.',
    },
    {
      name: 'Srinu',
      role: 'CTO',
      image: 'https://randomuser.me/api/portraits/men/42.jpg',
      bio: 'Srinu leads our technology team, constantly innovating and improving our platform to provide seamless experiences for guests and hotels alike.',
    },
    {
      name: 'Leela',
      role: 'CMO',
      image: 'https://randomuser.me/api/portraits/men/62.jpg',
      bio: 'Leela oversees our marketing strategies, ensuring that StayHaven reaches travel enthusiasts worldwide with compelling campaigns.',
    },
    {
      name: 'Sreekanth',
      role: 'COO',
      image: 'https://randomuser.me/api/portraits/men/72.jpg',
      bio: 'Sreekanth manages day-to-day operations, focusing on customer satisfaction and operational excellence across all our services.',
    },
    {
      name: 'Abhi',
      role: 'CFO',
      image: 'https://randomuser.me/api/portraits/men/82.jpg',
      bio: 'Abhi keeps our finances in check, driving sustainable growth and ensuring StayHaven remains a profitable and investor-friendly company.',
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <div className="relative h-80 md:h-96 bg-hotel-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-hotel-900 to-hotel-700 opacity-90"></div>
          <div className="absolute inset-0 flex items-center">
            <div className="container-custom text-center md:text-left">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">About StayHaven</h1>
              <p className="text-lg md:text-xl max-w-2xl md:max-w-3xl">
                We're reimagining the hotel booking experience with a focus on simplicity, 
                transparency, and exceptional customer service.
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  Founded in 2018, StayHaven emerged from a simple idea: hotel booking shouldn't be complicated. 
                  Our founders experienced firsthand the frustrations of traditional booking platforms - hidden fees, 
                  confusing interfaces, and poor customer support.
                </p>
                <p className="text-muted-foreground mb-4">
                  With a small team and big ambitions, we set out to create a platform that prioritizes transparency, 
                  user experience, and genuine value for both travelers and hotel partners.
                </p>
                <p className="text-muted-foreground">
                  Today, StayHaven connects thousands of travelers with exceptional hotels around the world, 
                  while maintaining our core values of simplicity, honesty, and outstanding service.
                </p>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Hotel lobby" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Mission Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              To create meaningful connections between travelers and exceptional hotels, 
              empowering both through technology that's intuitive, transparent, and reliable.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-hotel-100 text-hotel-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Simplicity</h3>
                <p className="text-muted-foreground">
                  We believe in keeping things straightforward. Our platform is designed to be 
                  intuitive and easy to use, eliminating unnecessary complexity.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-hotel-100 text-hotel-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust</h3>
                <p className="text-muted-foreground">
                  Transparency is at our core. We provide clear, honest information about hotels, 
                  pricing, and policies, so you can book with confidence.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-hotel-100 text-hotel-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We foster meaningful connections between travelers and hotels, creating 
                  a global community of hospitality and adventure.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Leadership Team Section */}
        <section className="py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-2 text-center">Our Leadership Team</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Meet the dedicated individuals who guide StayHaven's vision and operations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-hotel-600 text-sm mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <p className="text-muted-foreground mb-8">
                  Have questions, feedback, or just want to say hello? We'd love to hear from you. 
                  Reach out to our team through any of the methods below.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-hotel-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Visit Us</h3>
                      <p className="text-muted-foreground">
                        123 Booking Street, Suite 101<br />
                        San Francisco, CA 94103
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-hotel-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Email Us</h3>
                      <p className="text-muted-foreground">
                        info@stayhaven.com<br />
                        support@stayhaven.com
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-hotel-600 mt-0.5 mr-3" />
                    <div>
                      <h3 className="font-semibold">Call Us</h3>
                      <p className="text-muted-foreground">
                        +1 (123) 456-7890<br />
                        Monday - Friday, 9am - 6pm PT
                      </p>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-8" />
                
                <div>
                  <h3 className="font-semibold mb-4">Connect With Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-hotel-600 transition-colors">
                      <Instagram className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-hotel-600 transition-colors">
                      <Twitter className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-hotel-600 transition-colors">
                      <Facebook className="h-6 w-6" />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-hotel-600 transition-colors">
                      <Linkedin className="h-6 w-6" />
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden h-[400px]">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d201064.44309501422!2d-122.57606548246375!3d37.75866358654958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2suk!4v1650456422454!5m2!1sen!2suk" 
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
