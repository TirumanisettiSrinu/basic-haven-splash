
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check, Star } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PricingFeature = ({ children }) => {
  return (
    <div className="flex items-center mb-4">
      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container-custom text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Choose the perfect plan for your travel needs. No hidden fees, no surprises.
            </p>
            
            {/* Pricing Toggle */}
            <div className="mb-12">
              <Tabs defaultValue="monthly" className="w-full max-w-md mx-auto">
                <TabsList className="grid w-full grid-cols-2 bg-blue-100">
                  <TabsTrigger value="monthly" className="data-[state=active]:bg-white">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" className="data-[state=active]:bg-white">Yearly <span className="ml-1 text-xs font-bold text-green-600">Save 20%</span></TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly" className="mt-8">
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
                      <div className="p-6 border-b">
                        <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Basic</div>
                        <div className="flex items-end gap-1 mb-2">
                          <span className="text-4xl font-bold">$9.99</span>
                          <span className="text-gray-600 mb-1">/month</span>
                        </div>
                        <p className="text-gray-500">Perfect for occasional travelers.</p>
                      </div>
                      
                      <div className="p-6 flex-grow space-y-4 bg-gray-50">
                        <PricingFeature>5 bookings per month</PricingFeature>
                        <PricingFeature>Basic customer support</PricingFeature>
                        <PricingFeature>Standard cancellation policy</PricingFeature>
                      </div>
                      
                      <div className="p-6">
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Premium Plan */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full relative">
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                      
                      <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="text-sm font-semibold uppercase mb-2">Premium</div>
                        <div className="flex items-end gap-1 mb-2">
                          <span className="text-4xl font-bold">$19.99</span>
                          <span className="mb-1">/month</span>
                        </div>
                        <p className="text-blue-100">Ideal for regular travelers and families.</p>
                      </div>
                      
                      <div className="p-6 flex-grow space-y-4 bg-blue-50">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>Priority customer support</PricingFeature>
                        <PricingFeature>Flexible cancellation policy</PricingFeature>
                        <PricingFeature>Special room upgrades</PricingFeature>
                        <PricingFeature>Early check-in when available</PricingFeature>
                      </div>
                      
                      <div className="p-6">
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Business Plan */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
                      <div className="p-6 border-b">
                        <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Business</div>
                        <div className="flex items-end gap-1 mb-2">
                          <span className="text-4xl font-bold">$49.99</span>
                          <span className="text-gray-600 mb-1">/month</span>
                        </div>
                        <p className="text-gray-500">For business travelers and teams.</p>
                      </div>
                      
                      <div className="p-6 flex-grow space-y-4 bg-gray-50">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>24/7 dedicated support</PricingFeature>
                        <PricingFeature>Free cancellation anytime</PricingFeature>
                        <PricingFeature>Team management dashboard</PricingFeature>
                        <PricingFeature>Expense reporting tools</PricingFeature>
                        <PricingFeature>Corporate billing options</PricingFeature>
                      </div>
                      
                      <div className="p-6">
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="yearly" className="mt-8">
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Yearly Basic Plan */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
                      <div className="p-6 border-b">
                        <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Basic</div>
                        <div className="flex items-end gap-1 mb-2">
                          <span className="text-4xl font-bold">$95.88</span>
                          <span className="text-gray-600 mb-1">/year</span>
                        </div>
                        <p className="text-gray-500">Perfect for occasional travelers.</p>
                        <p className="text-green-600 font-semibold mt-1">Save $23.97</p>
                      </div>
                      
                      <div className="p-6 flex-grow space-y-4 bg-gray-50">
                        <PricingFeature>5 bookings per month</PricingFeature>
                        <PricingFeature>Basic customer support</PricingFeature>
                        <PricingFeature>Standard cancellation policy</PricingFeature>
                      </div>
                      
                      <div className="p-6">
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Yearly Premium Plan */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-blue-500 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full relative">
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                      </div>
                      
                      <div className="p-6 border-b bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                        <div className="text-sm font-semibold uppercase mb-2">Premium</div>
                        <div className="flex items-end gap-1 mb-2">
                          <span className="text-4xl font-bold">$191.88</span>
                          <span className="mb-1">/year</span>
                        </div>
                        <p className="text-blue-100">Ideal for regular travelers and families.</p>
                        <p className="text-blue-100 font-semibold mt-1">Save $47.94</p>
                      </div>
                      
                      <div className="p-6 flex-grow space-y-4 bg-blue-50">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>Priority customer support</PricingFeature>
                        <PricingFeature>Flexible cancellation policy</PricingFeature>
                        <PricingFeature>Special room upgrades</PricingFeature>
                        <PricingFeature>Early check-in when available</PricingFeature>
                      </div>
                      
                      <div className="p-6">
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Yearly Business Plan */}
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full">
                      <div className="p-6 border-b">
                        <div className="text-sm font-semibold text-blue-600 uppercase mb-2">Business</div>
                        <div className="flex items-end gap-1 mb-2">
                          <span className="text-4xl font-bold">$479.88</span>
                          <span className="text-gray-600 mb-1">/year</span>
                        </div>
                        <p className="text-gray-500">For business travelers and teams.</p>
                        <p className="text-green-600 font-semibold mt-1">Save $119.97</p>
                      </div>
                      
                      <div className="p-6 flex-grow space-y-4 bg-gray-50">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>24/7 dedicated support</PricingFeature>
                        <PricingFeature>Free cancellation anytime</PricingFeature>
                        <PricingFeature>Team management dashboard</PricingFeature>
                        <PricingFeature>Expense reporting tools</PricingFeature>
                        <PricingFeature>Corporate billing options</PricingFeature>
                      </div>
                      
                      <div className="p-6">
                        <Link to="/register" className="w-full">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* Compare Plans */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left border-b-2 border-gray-200">Features</th>
                    <th className="p-4 text-center border-b-2 border-gray-200">Basic</th>
                    <th className="p-4 text-center border-b-2 border-blue-200 bg-blue-50">Premium</th>
                    <th className="p-4 text-center border-b-2 border-gray-200">Business</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b border-gray-200">Monthly Bookings</td>
                    <td className="p-4 text-center border-b border-gray-200">5</td>
                    <td className="p-4 text-center border-b border-blue-200 bg-blue-50">Unlimited</td>
                    <td className="p-4 text-center border-b border-gray-200">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200">Customer Support</td>
                    <td className="p-4 text-center border-b border-gray-200">Basic</td>
                    <td className="p-4 text-center border-b border-blue-200 bg-blue-50">Priority</td>
                    <td className="p-4 text-center border-b border-gray-200">24/7 Dedicated</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200">Room Upgrades</td>
                    <td className="p-4 text-center border-b border-gray-200">-</td>
                    <td className="p-4 text-center border-b border-blue-200 bg-blue-50"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center border-b border-gray-200"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200">Early Check-in</td>
                    <td className="p-4 text-center border-b border-gray-200">-</td>
                    <td className="p-4 text-center border-b border-blue-200 bg-blue-50"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="p-4 text-center border-b border-gray-200"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200">Team Management</td>
                    <td className="p-4 text-center border-b border-gray-200">-</td>
                    <td className="p-4 text-center border-b border-blue-200 bg-blue-50">-</td>
                    <td className="p-4 text-center border-b border-gray-200"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b border-gray-200">Expense Reporting</td>
                    <td className="p-4 text-center border-b border-gray-200">-</td>
                    <td className="p-4 text-center border-b border-blue-200 bg-blue-50">-</td>
                    <td className="p-4 text-center border-b border-gray-200"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-3xl font-bold text-center mb-4">What Our Customers Say</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Thousands of travelers trust StayHaven for their accommodation needs. Here's what some of them have to say.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The Premium plan has been worth every penny. I love the flexibility of changing my bookings and the room upgrades have been fantastic!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-semibold text-blue-600">JD</span>
                  </div>
                  <div>
                    <p className="font-medium">John Doe</p>
                    <p className="text-sm text-gray-500">Premium Plan Member</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "We manage all our company travel through the Business plan. The expense reporting tools save our accounting team so much time!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-semibold text-blue-600">MS</span>
                  </div>
                  <div>
                    <p className="font-medium">Maria Smith</p>
                    <p className="text-sm text-gray-500">Business Plan Member</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <Star className="h-5 w-5 text-gray-300" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  "The Basic plan is perfect for someone like me who only travels occasionally. I might upgrade to Premium soon though for the extra perks!"
                </p>
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="font-semibold text-blue-600">RJ</span>
                  </div>
                  <div>
                    <p className="font-medium">Robert Johnson</p>
                    <p className="text-sm text-gray-500">Basic Plan Member</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container-custom">
            <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Can I cancel my subscription?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your plan until the end of your billing period.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">How do I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600">You can upgrade or downgrade your plan at any time from your account settings. Changes will take effect on your next billing cycle.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">Is there a free trial available?</h3>
                <p className="text-gray-600">Yes! You can try any plan free for 14 days. No credit card required during the trial period.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and Apple Pay. For Business plans, we also offer invoice-based payments.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust StayHaven for all their travel accommodation needs.
            </p>
            <Link to="/register">
              <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 py-6 text-lg">
                Start Your 14-Day Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
