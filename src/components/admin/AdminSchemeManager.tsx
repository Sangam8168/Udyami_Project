import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Shield,
  Calendar,
  DollarSign
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Scheme {
  id: string;
  name: string;
  name_hi: string;
  description: string;
  description_hi: string;
  category: string;
  eligibility_criteria: string;
  benefits: string;
  official_link: string;
  application_deadline: string;
  benefit_amount: string;
  application_process: string;
  ministry_department: string;
  documents_required: string[];
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

const AdminSchemeManager = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState<Scheme | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    name_hi: "",
    description: "",
    description_hi: "",
    category: "",
    eligibility_criteria: "",
    benefits: "",
    official_link: "",
    application_deadline: "",
    benefit_amount: "",
    application_process: "",
    ministry_department: "",
    documents_required: [] as string[],
    status: "active" as 'active' | 'inactive' | 'archived'
  });

  useEffect(() => {
    fetchSchemes();
  }, []);

  const fetchSchemes = async () => {
    try {
      const { data, error } = await supabase
        .from('schemes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSchemes((data || []).map((scheme: any) => ({
        ...scheme,
        status: scheme.status || 'active',
        name_hi: scheme.name_hi || '',
        description_hi: scheme.description_hi || ''
  })));
    } catch (error) {
      console.error('Error fetching schemes:', error);
      toast({
        title: "Error",
        description: "Failed to fetch schemes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('schemes')
        .insert(formData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scheme added successfully",
      });
      setShowAddForm(false);
      setFormData({
        name: "",
        name_hi: "",
        description: "",
        description_hi: "",
        category: "",
        eligibility_criteria: "",
        benefits: "",
        official_link: "",
        application_deadline: "",
        benefit_amount: "",
        application_process: "",
        ministry_department: "",
        documents_required: [],
        status: "active"
      });
      fetchSchemes();
    } catch (error) {
      console.error('Error adding scheme:', error);
      toast({
        title: "Error",
        description: "Failed to add scheme",
        variant: "destructive",
      });
    }
  };

  const handleUpdateScheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingScheme) return;

    try {
      const { error } = await supabase
        .from('schemes')
        .update(formData)
        .eq('id', editingScheme.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scheme updated successfully",
      });
      setEditingScheme(null);
      setFormData({
        name: "",
        name_hi: "",
        description: "",
        description_hi: "",
        category: "",
        eligibility_criteria: "",
        benefits: "",
        official_link: "",
        application_deadline: "",
        benefit_amount: "",
        application_process: "",
        ministry_department: "",
        documents_required: [],
        status: "active"
      });
      fetchSchemes();
    } catch (error) {
      console.error('Error updating scheme:', error);
      toast({
        title: "Error",
        description: "Failed to update scheme",
        variant: "destructive",
      });
    }
  };

  const handleDeleteScheme = async (id: string) => {
    if (!confirm("Are you sure you want to delete this scheme?")) return;

    try {
      const { error } = await supabase
        .from('schemes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Scheme deleted successfully",
      });
      fetchSchemes();
    } catch (error) {
      console.error('Error deleting scheme:', error);
      toast({
        title: "Error",
        description: "Failed to delete scheme",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (scheme: Scheme) => {
    setEditingScheme(scheme);
    setFormData({
      name: scheme.name,
      name_hi: scheme.name_hi || '',
      description: scheme.description,
      description_hi: scheme.description_hi || '',
      category: scheme.category,
      eligibility_criteria: scheme.eligibility_criteria || '',
      benefits: scheme.benefits,
      official_link: scheme.official_link || '',
      application_deadline: scheme.application_deadline || '',
      benefit_amount: scheme.benefit_amount || '',
      application_process: scheme.application_process || '',
      ministry_department: scheme.ministry_department || '',
      documents_required: scheme.documents_required || [],
      status: scheme.status || 'active'
    });
  };

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = 
      scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || scheme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(schemes.map(s => s.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-slate-400">Loading schemes...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Scheme Manager</h2>
          <p className="text-slate-400">Manage government schemes and benefits</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Scheme
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingScheme) && (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">
              {editingScheme ? "Edit Scheme" : "Add New Scheme"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingScheme ? handleUpdateScheme : handleAddScheme} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Scheme Name (English)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="name_hi">Scheme Name (Hindi)</Label>
                  <Input
                    id="name_hi"
                    value={formData.name_hi}
                    onChange={(e) => setFormData({...formData, name_hi: e.target.value})}
                    required
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="health">Health</SelectItem>
                    <SelectItem value="housing">Housing</SelectItem>
                    <SelectItem value="women">Women Empowerment</SelectItem>
                    <SelectItem value="business">Business/Startup</SelectItem>
                    <SelectItem value="employment">Employment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="benefit_amount">Benefit Amount</Label>
                  <Input
                    id="benefit_amount"
                    value={formData.benefit_amount}
                    onChange={(e) => setFormData({...formData, benefit_amount: e.target.value})}
                    placeholder="e.g., ₹6,000 per year"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="application_deadline">Application Deadline</Label>
                  <Input
                    id="application_deadline"
                    type="date"
                    value={formData.application_deadline}
                    onChange={(e) => setFormData({...formData, application_deadline: e.target.value})}
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description (English)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  required
                  rows={3}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="description_hi">Description (Hindi)</Label>
                <Textarea
                  id="description_hi"
                  value={formData.description_hi}
                  onChange={(e) => setFormData({...formData, description_hi: e.target.value})}
                  required
                  rows={3}
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="eligibility_criteria">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility_criteria"
                  value={formData.eligibility_criteria}
                  onChange={(e) => setFormData({...formData, eligibility_criteria: e.target.value})}
                  required
                  rows={2}
                  placeholder="Who can apply..."
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits</Label>
                <Textarea
                  id="benefits"
                  value={formData.benefits}
                  onChange={(e) => setFormData({...formData, benefits: e.target.value})}
                  required
                  rows={2}
                  placeholder="What beneficiaries receive..."
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="official_link">Official Link</Label>
                <Input
                  id="official_link"
                  type="url"
                  value={formData.official_link}
                  onChange={(e) => setFormData({...formData, official_link: e.target.value})}
                  placeholder="https://..."
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: 'active' | 'inactive' | 'archived') => setFormData({...formData, status: value})}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-red-600 hover:bg-red-700">
                  {editingScheme ? "Update Scheme" : "Add Scheme"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingScheme(null);
                    setFormData({
                      name: "",
                      name_hi: "",
                      description: "",
                      description_hi: "",
                      category: "",
                      eligibility_criteria: "",
                      benefits: "",
                      official_link: "",
                      application_deadline: "",
                      benefit_amount: "",
                      application_process: "",
                      ministry_department: "",
                      documents_required: [],
                      status: "active"
                    });
                  }}
                  className="border-slate-700 text-slate-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-800 border-slate-700 pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schemes List */}
      <div className="grid gap-4">
        {filteredSchemes.length === 0 ? (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="py-12 text-center">
              <Shield className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No schemes found</p>
            </CardContent>
          </Card>
        ) : (
          filteredSchemes.map((scheme) => (
            <Card key={scheme.id} className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{scheme.name}</h3>
                      <Badge 
                        variant={scheme.status === 'active' ? 'default' : 'secondary'}
                        className={scheme.status === 'active' ? 'bg-green-600' : ''}
                      >
                        {scheme.status}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {scheme.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{scheme.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>{scheme.benefit_amount || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{scheme.application_deadline || "No deadline"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditClick(scheme)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(scheme.official_link, '_blank')}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteScheme(scheme.id)}
                      className="border-red-900 text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSchemeManager;
