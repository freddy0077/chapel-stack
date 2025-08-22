import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Star,
  Church,
  Award,
  RefreshCw,
  AlertCircle,
  Grid3X3,
  List,
  Sparkles,
  Heart,
  Bookmark,
  ArrowRight,
  Zap,
  Crown,
  Shield
} from 'lucide-react';

interface StandardTemplateSelectorProps {
  onTemplateSelect?: (templateId: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDenomination: string;
  onDenominationChange: (denomination: string) => void;
  selectedSacramentType: string;
  onSacramentTypeChange: (type: string) => void;
  templates: any[];
  denominations: string[];
  sacramentTypes: string[];
  loading: boolean;
}

const StandardTemplateSelector: React.FC<StandardTemplateSelectorProps> = ({
  onTemplateSelect,
  searchTerm,
  onSearchChange,
  selectedDenomination,
  onDenominationChange,
  selectedSacramentType,
  onSacramentTypeChange,
  templates,
  denominations,
  sacramentTypes,
  loading,
}) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favoriteTemplates, setFavoriteTemplates] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Filter templates based on search and filters
  const filteredTemplates = useMemo(() => {
    let filtered = templates;

    // Apply search filter
    if (searchTerm && searchTerm.length >= 2) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.denomination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply denomination filter
    if (selectedDenomination && selectedDenomination !== 'ALL') {
      filtered = filtered.filter(template => template.denomination === selectedDenomination);
    }

    // Apply sacrament type filter
    if (selectedSacramentType && selectedSacramentType !== 'ALL') {
      filtered = filtered.filter(template => template.sacramentType === selectedSacramentType);
    }

    // Sort by default templates first, then by name
    return filtered.sort((a, b) => {
      if (a.isDefault && !b.isDefault) return -1;
      if (!a.isDefault && b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [templates, searchTerm, selectedDenomination, selectedSacramentType]);

  // Get denomination display name
  const getDenominationDisplayName = (denomination: string) => {
    return denomination.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Get sacrament type display name
  const getSacramentTypeDisplayName = (type: string) => {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Handle template selection
  const handleTemplateSelect = (template: any) => {
    if (onTemplateSelect) {
      onTemplateSelect(template.id);
    }
  };

  // Handle template preview
  const handleTemplatePreview = (template: any) => {
    // Open preview in new window/modal
    if (template.previewUrl) {
      window.open(template.previewUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading templates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Certificate Templates</h3>
          <p className="text-sm text-muted-foreground">
            Choose from {templates.length} professional templates across {denominations.length} denominations
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">
            {filteredTemplates.length} templates
          </Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates by name, description, or denomination..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedDenomination} onValueChange={onDenominationChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Denominations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Denominations</SelectItem>
            {denominations.map((denomination) => (
              <SelectItem key={denomination} value={denomination}>
                {getDenominationDisplayName(denomination)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSacramentType} onValueChange={onSacramentTypeChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Sacraments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Sacraments</SelectItem>
            {sacramentTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {getSacramentTypeDisplayName(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <h4 className="text-lg font-medium mb-2">No templates found</h4>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button 
            variant="outline" 
            onClick={() => {
              onSearchChange('');
              onDenominationChange('');
              onSacramentTypeChange('');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      {template.name}
                      {template.isDefault && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    <Church className="h-3 w-3 mr-1" />
                    {getDenominationDisplayName(template.denomination)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {getSacramentTypeDisplayName(template.sacramentType)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Template Preview */}
                <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  {template.previewUrl ? (
                    <img 
                      src={template.previewUrl} 
                      alt={template.name}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="text-center text-muted-foreground">
                    <Award className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">Template Preview</p>
                  </div>
                </div>

                {/* Template Features */}
                {template.liturgicalElements && template.liturgicalElements.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.liturgicalElements.slice(0, 3).map((element: any, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {element.type?.replace('_', ' ') || 'Feature'}
                        </Badge>
                      ))}
                      {template.liturgicalElements.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.liturgicalElements.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleTemplatePreview(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Statistics */}
      <div className="border-t pt-6">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{templates.length}</div>
            <div className="text-sm text-muted-foreground">Total Templates</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{denominations.length}</div>
            <div className="text-sm text-muted-foreground">Denominations</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{sacramentTypes.length}</div>
            <div className="text-sm text-muted-foreground">Sacrament Types</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {templates.filter(t => t.isDefault).length}
            </div>
            <div className="text-sm text-muted-foreground">Default Templates</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardTemplateSelector;
