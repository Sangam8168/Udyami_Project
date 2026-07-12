import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Bell, 
  Shield, 
  Database, 
  Mail, 
  Save,
  RefreshCw
} from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Udyami - वित्त सखी",
    siteDescription: "Financial empowerment for rural women through digital literacy",
    maintenanceMode: false,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    adminAlerts: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    
    // Email Settings
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpFrom: "noreply@udyami.com",
    
    // System Settings
    enableChatbot: true,
    enableFraudDetection: true,
    enableGames: true,
    maxConversationsPerDay: 100,
    
    // Contact Info
    supportEmail: "support@udyami.com",
    supportPhone: "+91-1800-XXX-XXXX"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully",
      });
    }, 1000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      setSettings({
        siteName: "Udyami - वित्त सखी",
        siteDescription: "Financial empowerment for rural women through digital literacy",
        maintenanceMode: false,
        emailNotifications: true,
        pushNotifications: true,
        adminAlerts: true,
        twoFactorAuth: false,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        smtpHost: "",
        smtpPort: "587",
        smtpUser: "",
        smtpFrom: "noreply@udyami.com",
        enableChatbot: true,
        enableFraudDetection: true,
        enableGames: true,
        maxConversationsPerDay: 100,
        supportEmail: "support@udyami.com",
        supportPhone: "+91-1800-XXX-XXXX"
      });
      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Settings</h2>
          <p className="text-slate-400">Configure system settings and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 hover:bg-red-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Name</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                rows={3}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-slate-400">Disable the site for maintenance</p>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-slate-400">Send email notifications to users</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Push Notifications</Label>
                <p className="text-sm text-slate-400">Enable browser push notifications</p>
              </div>
              <Switch
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => setSettings({...settings, pushNotifications: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Admin Alerts</Label>
                <p className="text-sm text-slate-400">Receive alerts for suspicious activity</p>
              </div>
              <Switch
                checked={settings.adminAlerts}
                onCheckedChange={(checked) => setSettings({...settings, adminAlerts: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-slate-400">Require 2FA for admin accounts</p>
              </div>
              <Switch
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) => setSettings({...settings, twoFactorAuth: checked})}
              />
            </div>
            <div>
              <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
              <Input
                id="maxLoginAttempts"
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({...settings, maxLoginAttempts: parseInt(e.target.value)})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                  placeholder="smtp.example.com"
                  className="bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                  className="bg-slate-800 border-slate-700"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="smtpUser">SMTP User</Label>
              <Input
                id="smtpUser"
                value={settings.smtpUser}
                onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="smtpFrom">From Email</Label>
              <Input
                id="smtpFrom"
                type="email"
                value={settings.smtpFrom}
                onChange={(e) => setSettings({...settings, smtpFrom: e.target.value})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Feature Settings */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="w-5 h-5" />
              Feature Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Chatbot</Label>
                <p className="text-sm text-slate-400">Enable AI chatbot feature</p>
              </div>
              <Switch
                checked={settings.enableChatbot}
                onCheckedChange={(checked) => setSettings({...settings, enableChatbot: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Fraud Detection</Label>
                <p className="text-sm text-slate-400">Enable fraud message detection</p>
              </div>
              <Switch
                checked={settings.enableFraudDetection}
                onCheckedChange={(checked) => setSettings({...settings, enableFraudDetection: checked})}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Games</Label>
                <p className="text-sm text-slate-400">Enable educational games</p>
              </div>
              <Switch
                checked={settings.enableGames}
                onCheckedChange={(checked) => setSettings({...settings, enableGames: checked})}
              />
            </div>
            <div>
              <Label htmlFor="maxConversations">Max Conversations Per Day</Label>
              <Input
                id="maxConversations"
                type="number"
                value={settings.maxConversationsPerDay}
                onChange={(e) => setSettings({...settings, maxConversationsPerDay: parseInt(e.target.value)})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div>
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input
                id="supportPhone"
                value={settings.supportPhone}
                onChange={(e) => setSettings({...settings, supportPhone: e.target.value})}
                className="bg-slate-800 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default AdminSettings;
