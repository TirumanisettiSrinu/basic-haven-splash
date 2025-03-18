
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const PricingFeature = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center mb-4">
      <Check className="h-5 w-5 text-hotel-500 mr-2 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
};

const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20">
        {/* Hero Section */}
        <section className="bg-hotel-50 py-12 md:py-16">
          <div className="container-custom text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the perfect plan for your travel needs. No hidden fees, no surprises.
            </p>
            
            {/* Pricing Toggle */}
            <div className="inline-block mb-8">
              <Tabs defaultValue="monthly" className="w-[300px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  <TabsTrigger value="yearly">Yearly (Save 20%)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly" className="mt-4">
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">Basic</h3>
                      <div className="text-3xl font-bold mb-4">$9.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                      <p className="text-muted-foreground mb-6">Perfect for occasional travelers.</p>
                      
                      <div className="mb-6 flex-grow">
                        <PricingFeature>5 bookings per month</PricingFeature>
                        <PricingFeature>Basic customer support</PricingFeature>
                        <PricingFeature>Standard cancellation policy</PricingFeature>
                      </div>
                      
                      <Link to="/register" className="w-full">
                        <Button className="w-full" variant="outline">Get Started</Button>
                      </Link>
                    </div>
                    
                    {/* Premium Plan */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-hotel-500 flex flex-col relative">
                      <div className="absolute top-0 right-0 bg-hotel-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        POPULAR
                      </div>
                      <h3 className="text-xl font-bold mb-2">Premium</h3>
                      <div className="text-3xl font-bold mb-4">$19.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                      <p className="text-muted-foreground mb-6">Ideal for regular travelers and families.</p>
                      
                      <div className="mb-6 flex-grow">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>Priority customer support</PricingFeature>
                        <PricingFeature>Flexible cancellation policy</PricingFeature>
                        <PricingFeature>Special room upgrades</PricingFeature>
                        <PricingFeature>Early check-in when available</PricingFeature>
                      </div>
                      
                      <Link to="/register" className="w-full">
                        <Button className="w-full bg-hotel-500 hover:bg-hotel-600">Get Started</Button>
                      </Link>
                    </div>
                    
                    {/* Business Plan */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">Business</h3>
                      <div className="text-3xl font-bold mb-4">$49.99<span className="text-sm font-normal text-muted-foreground">/month</span></div>
                      <p className="text-muted-foreground mb-6">For business travelers and teams.</p>
                      
                      <div className="mb-6 flex-grow">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>24/7 dedicated support</PricingFeature>
                        <PricingFeature>Free cancellation anytime</PricingFeature>
                        <PricingFeature>Team management dashboard</PricingFeature>
                        <PricingFeature>Expense reporting tools</PricingFeature>
                        <PricingFeature>Corporate billing options</PricingFeature>
                      </div>
                      
                      <Link to="/register" className="w-full">
                        <Button className="w-full" variant="outline">Get Started</Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="yearly" className="mt-4">
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Basic Plan */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">Basic</h3>
                      <div className="text-3xl font-bold mb-4">$95.88<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                      <p className="text-muted-foreground mb-2">Perfect for occasional travelers.</p>
                      <p className="text-green-600 font-medium mb-6">Save $23.97</p>
                      
                      <div className="mb-6 flex-grow">
                        <PricingFeature>5 bookings per month</PricingFeature>
                        <PricingFeature>Basic customer support</PricingFeature>
                        <PricingFeature>Standard cancellation policy</PricingFeature>
                      </div>
                      
                      <Link to="/register" className="w-full">
                        <Button className="w-full" variant="outline">Get Started</Button>
                      </Link>
                    </div>
                    
                    {/* Premium Plan */}
                    <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-hotel-500 flex flex-col relative">
                      <div className="absolute top-0 right-0 bg-hotel-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                        POPULAR
                      </div>
                      <h3 className="text-xl font-bold mb-2">Premium</h3>
                      <div className="text-3xl font-bold mb-4">$191.88<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                      <p className="text-muted-foreground mb-2">Ideal for regular travelers and families.</p>
                      <p className="text-green-600 font-medium mb-6">Save $47.94</p>
                      
                      <div className="mb-6 flex-grow">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>Priority customer support</PricingFeature>
                        <PricingFeature>Flexible cancellation policy</PricingFeature>
                        <PricingFeature>Special room upgrades</PricingFeature>
                        <PricingFeature>Early check-in when available</PricingFeature>
                      </div>
                      
                      <Link to="/register" className="w-full">
                        <Button className="w-full bg-hotel-500 hover:bg-hotel-600">Get Started</Button>
                      </Link>
                    </div>
                    
                    {/* Business Plan */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 flex flex-col">
                      <h3 className="text-xl font-bold mb-2">Business</h3>
                      <div className="text-3xl font-bold mb-4">$479.88<span className="text-sm font-normal text-muted-foreground">/year</span></div>
                      <p className="text-muted-foreground mb-2">For business travelers and teams.</p>
                      <p className="text-green-600 font-medium mb-6">Save $119.97</p>
                      
                      <div className="mb-6 flex-grow">
                        <PricingFeature>Unlimited bookings</PricingFeature>
                        <PricingFeature>24/7 dedicated support</PricingFeature>
                        <PricingFeature>Free cancellation anytime</PricingFeature>
                        <PricingFeature>Team management dashboard</PricingFeature>
                        <PricingFeature>Expense reporting tools</PricingFeature>
                        <PricingFeature>Corporate billing options</PricingFeature>
                      </div>
                      
                      <Link to="/register" className="w-full">
                        <Button className="w-full" variant="outline">Get Started</Button>
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container-custom">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Can I cancel my subscription?</h3>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your plan until the end of your billing period.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">How do I upgrade or downgrade my plan?</h3>
                <p className="text-muted-foreground">You can upgrade or downgrade your plan at any time from your account settings. Changes will take effect on your next billing cycle.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">Is there a free trial available?</h3>
                <p className="text-muted-foreground">Yes! You can try any plan free for 14 days. No credit card required during the trial period.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-medium mb-2">What payment methods do you accept?</h3>
                <p className="text-muted-foreground">We accept all major credit cards, PayPal, and Apple Pay. For Business plans, we also offer invoice-based payments.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
