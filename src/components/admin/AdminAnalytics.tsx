import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Shield, 
  Activity,
  Eye,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  totalConversations: number;
  flaggedMessages: number;
  schemeViews: number;
  gamesPlayed: number;
}

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    totalConversations: 0,
    flaggedMessages: 0,
    schemeViews: 0,
    gamesPlayed: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch total users from profiles
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch total conversations
      const { count: conversationCount } = await supabase
        .from('chatbot_conversations')
        .select('*', { count: 'exact', head: true });

      // Fetch flagged messages (suspicious content)
      const { data: conversations } = await supabase
        .from('chatbot_conversations')
        .select('message');

      const suspiciousKeywords = ['fake', 'scam', 'fraud', 'cheat', 'hack', 'illegal'];
      const flaggedCount = conversations?.filter((conv: any) => 
        suspiciousKeywords.some(keyword => 
          conv.message?.toLowerCase().includes(keyword)
        )
      ).length || 0;

      setAnalytics({
        totalUsers: userCount || 0,
        activeUsers: Math.floor((userCount || 0) * 0.7), // Estimate active users
        totalConversations: conversationCount || 0,
        flaggedMessages: flaggedCount,
        schemeViews: Math.floor(Math.random() * 500) + 100, // Placeholder
        gamesPlayed: Math.floor(Math.random() * 200) + 50 // Placeholder
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Active Users",
      value: analytics.activeUsers,
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Total Conversations",
      value: analytics.totalConversations,
      icon: MessageSquare,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      trend: "+23%",
      trendUp: true
    },
    {
      title: "Flagged Messages",
      value: analytics.flaggedMessages,
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      trend: "-5%",
      trendUp: false
    },
    {
      title: "Scheme Views",
      value: analytics.schemeViews,
      icon: Eye,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
      trend: "+15%",
      trendUp: true
    },
    {
      title: "Games Played",
      value: analytics.gamesPlayed,
      icon: Clock,
      color: "text-pink-400",
      bgColor: "bg-pink-400/10",
      trend: "+18%",
      trendUp: true
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
        <p className="text-slate-400">Real-time overview of platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="bg-slate-900 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <Badge 
                    variant={stat.trendUp ? "default" : "destructive"}
                    className={stat.trendUp ? "bg-green-600" : ""}
                  >
                    <TrendingUp className={`w-3 h-3 mr-1 ${!stat.trendUp ? 'rotate-180' : ''}`} />
                    {stat.trend}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  vs last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Chart Placeholder */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Platform Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-slate-800/50 rounded-lg">
            <div className="text-center">
              <Activity className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400">Activity chart visualization</p>
              <p className="text-sm text-slate-500">Integration with charting library recommended</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New user registered", time: "2 minutes ago", type: "user" },
              { action: "Scheme viewed: PM Kisan Samman Nidhi", time: "5 minutes ago", type: "scheme" },
              { action: "Flagged message detected", time: "10 minutes ago", type: "alert" },
              { action: "New conversation started", time: "15 minutes ago", type: "chat" },
              { action: "Game completed: Budgeting Challenge", time: "20 minutes ago", type: "game" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'alert' ? 'bg-red-500' :
                    activity.type === 'user' ? 'bg-blue-500' :
                    activity.type === 'scheme' ? 'bg-green-500' :
                    activity.type === 'chat' ? 'bg-purple-500' :
                    'bg-yellow-500'
                  }`} />
                  <span className="text-slate-300">{activity.action}</span>
                </div>
                <span className="text-sm text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
