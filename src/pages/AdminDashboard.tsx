
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';
import AdminBookings from './admin/AdminBookings';
import AdminUsers from './admin/AdminUsers';

const AdminDashboard = () => {
  const { state } = useAuth();
  const { user, loading } = state;
  const [activeTab, setActiveTab] = useState('users');

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-hotel-500" />
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-16 md:pt-20 pb-10">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage all aspects of your hotel system.</p>
            </div>
            
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline">Export Data</Button>
              <Button className="bg-hotel-500 hover:bg-hotel-600">System Settings</Button>
            </div>
          </div>
          
          <Tabs 
            defaultValue={activeTab} 
            value={activeTab}
            onValueChange={setActiveTab}
            className="mt-6"
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-5 mb-8">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="hotels">Hotels</TabsTrigger>
              <TabsTrigger value="rooms">Rooms</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="moderators">Moderators</TabsTrigger>
            </TabsList>
            
            <TabsContent value="users" className="space-y-4">
              <AdminUsers />
            </TabsContent>
            
            <TabsContent value="hotels" className="space-y-4">
              <div className="grid">
                <h2 className="text-xl font-semibold mb-4">Hotel Management</h2>
                <p>Hotel management interface will be implemented here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="rooms" className="space-y-4">
              <div className="grid">
                <h2 className="text-xl font-semibold mb-4">Room Management</h2>
                <p>Room management interface will be implemented here.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="bookings" className="space-y-4">
              <AdminBookings />
            </TabsContent>
            
            <TabsContent value="moderators" className="space-y-4">
              <div className="grid">
                <h2 className="text-xl font-semibold mb-4">Moderator Management</h2>
                <p>Moderator management interface will be implemented here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
