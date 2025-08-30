import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { PlantGrowthTracker } from "@/components/PlantGrowthTracker";

import { MoodChart } from "@/components/MoodChart";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
// 'Coins' icon hata diya gaya hai
import { Calendar, ArrowRight } from "lucide-react"; 

interface DashboardStats {
  streakCount: number;
  totalCheckIns: number;
  lastCheckIn: string | null;
  currentMood: string | null;
  completedJournals: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    streakCount: 0,
    totalCheckIns: 0,
    lastCheckIn: null,
    currentMood: null,
    completedJournals: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };


  const needsCheckIn = () => {
    if (!stats.lastCheckIn) return true;
    
    const lastCheckInDate = new Date(stats.lastCheckIn).setHours(0, 0, 0, 0);
    const todayDate = new Date().setHours(0, 0, 0, 0);
    
    return lastCheckInDate < todayDate;
  };

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div className="space-y-8">
        {/* Welcome Section */}
        <section>
          <div className="bg-wellness-green/10 p-6 md:flex md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-wellness-green-dark">
                Hello, {user?.name?.split(' ')[0] || 'Friend'}!
              </h2>
            </div>
              <Button 
                onClick={() => navigate('/check-in')}
                className="mt-4 md:mt-0 bg-wellness-green hover:bg-wellness-green-dark text-white"
              >
               {/*  <Mic className="mr-2 h-4 w-4" /> */}
                Daily Check-in
              </Button>
          </div>
        </section>

        {/* Plant Growth and Stats Summary */}
        <section className="ml-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlantGrowthTracker />
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-wellness-blue/10 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold text-wellness-blue-dark">Max Streak</h3>
                <p className="text-3xl font-bold mt-2">{stats.streakCount} days</p>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Keep the streak alive to grow your plant!
              </div>
            </div>
            
            <div className="bg-wellness-purple/10 rounded-lg p-5 flex flex-col justify-between mr-4">
              <div>
                <h3 className="text-lg font-semibold text-wellness-purple-dark">Total Check-ins</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalCheckIns}</p>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                You're building a great wellness routine!
              </div>
            </div>
            
            {/* Token Balance Wala Card Yahan Se Hata Diya Gaya Hai */}
            
            <div className="bg-wellness-teal/10 rounded-lg p-5 flex flex-col justify-between mr-4">
              <div>
                <h3 className="text-lg font-semibold text-wellness-teal-dark">Next Summary</h3>
                <p className="text-sm font-medium mt-2">
                  {stats.totalCheckIns >= 3 
                    ? "Ready to generate!" 
                    : `Available after ${3 - stats.totalCheckIns} more check-ins`
                  }
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/history')}
                className="mt-2 self-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                View Summaries
              </Button>
            </div>
          </div>
        </section>

        {/* Mood Chart */}
        <section className="ml-4 mr-4">
          <div className="ml-5 flex items-center justify-between mb-4">
            <h2 className=" text-xl font-semibold text-gray-800">Mood Tracking</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/history')}
              className="text-wellness-blue flex items-center"
            >
              View Detailed History
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <MoodChart />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;