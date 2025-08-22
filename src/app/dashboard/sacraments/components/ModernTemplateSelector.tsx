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
  Shield,
  Plus,
  ChevronDown,
  X
} from 'lucide-react';

interface ModernTemplateSelectorProps {
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

const ModernTemplateSelector: React.FC<ModernTemplateSelectorProps> = ({
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

  // Helper functions for display names
  const getDenominationDisplayName = (denomination: string) => {
    const displayNames: Record<string, string> = {
      'CATHOLIC': 'Catholic',
      'BAPTIST': 'Baptist',
      'LUTHERAN': 'Lutheran',
      'METHODIST': 'Methodist',
      'PRESBYTERIAN': 'Presbyterian',
      'ANGLICAN': 'Anglican/Episcopal',
      'PENTECOSTAL': 'Pentecostal',
      'ORTHODOX': 'Orthodox',
      'REFORMED': 'Reformed',
      'EVANGELICAL': 'Evangelical',
      'CONGREGATIONAL': 'Congregational',
      'ADVENTIST': 'Adventist',
      'QUAKER': 'Quaker',
      'UNITARIAN': 'Unitarian',
      'EPISCOPAL': 'Episcopal',
      'MORAVIAN': 'Moravian',
      'MENNONITE': 'Mennonite',
      'BRETHREN': 'Brethren'
    };
    return displayNames[denomination] || denomination;
  };

  const getSacramentTypeDisplayName = (type: string) => {
    const displayNames: Record<string, string> = {
      'BAPTISM': 'Baptism',
      'CONFIRMATION': 'Confirmation',
      'EUCHARIST_FIRST_COMMUNION': 'First Communion',
      'MATRIMONY': 'Marriage',
      'HOLY_ORDERS': 'Holy Orders',
      'ANOINTING_OF_THE_SICK': 'Anointing of the Sick',
      'RECONCILIATION': 'Reconciliation',
      'IMMERSION_BAPTISM': 'Immersion Baptism',
      'INFANT_BAPTISM': 'Infant Baptism',
      'ADULT_BAPTISM': 'Adult Baptism',
      'BELIEVER_BAPTISM': 'Believer Baptism',
      'DEDICATION': 'Child Dedication',
      'MEMBERSHIP': 'Church Membership'
    };
    return displayNames[type] || type;
  };

  // Helper function to toggle favorites
  const toggleFavorite = (templateId: string) => {
    setFavoriteTemplates(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  // Get denomination icon and color
  const getDenominationIcon = (denomination: string) => {
    const icons: Record<string, React.ReactNode> = {
      'CATHOLIC': <Church className="h-4 w-4" />,
      'BAPTIST': <Zap className="h-4 w-4" />,
      'LUTHERAN': <Shield className="h-4 w-4" />,
      'ORTHODOX': <Crown className="h-4 w-4" />,
      'ANGLICAN': <Award className="h-4 w-4" />,
      'METHODIST': <Heart className="h-4 w-4" />,
      'PRESBYTERIAN': <Star className="h-4 w-4" />,
      'PENTECOSTAL': <Sparkles className="h-4 w-4" />,
    };
    return icons[denomination] || <Church className="h-4 w-4" />;
  };

  const getDenominationColor = (denomination: string) => {
    const colors: Record<string, string> = {
      'CATHOLIC': 'from-red-500 to-red-600',
      'BAPTIST': 'from-blue-500 to-blue-600',
      'LUTHERAN': 'from-purple-500 to-purple-600',
      'ORTHODOX': 'from-amber-500 to-amber-600',
      'ANGLICAN': 'from-green-500 to-green-600',
      'METHODIST': 'from-pink-500 to-pink-600',
      'PRESBYTERIAN': 'from-indigo-500 to-indigo-600',
      'PENTECOSTAL': 'from-orange-500 to-orange-600',
    };
    return colors[denomination] || 'from-gray-500 to-gray-600';
  };

  // Loading skeleton component
  const TemplateCardSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700">
        <Skeleton className="w-full h-full" />
      </div>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-8 w-16" />
        </div>
      </CardContent>
    </Card>
  );

  // Modern template card component
  const TemplateCard = ({ template }: { template: any }) => (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white dark:bg-gray-900 relative">
      {/* Template Preview */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <div className={`absolute inset-0 bg-gradient-to-br ${getDenominationColor(template.denomination)} opacity-10`}></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`p-4 bg-gradient-to-br ${getDenominationColor(template.denomination)} rounded-full mb-3 shadow-lg`}>
              {getDenominationIcon(template.denomination)}
              <div className="text-white">
                {getDenominationIcon(template.denomination)}
              </div>
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Certificate Preview
            </div>
          </div>
        </div>
        
        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-3">
          <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-gray-900">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button 
            size="sm" 
            className="bg-primary hover:bg-primary/90"
            onClick={() => onTemplateSelect?.(template.id)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Select
          </Button>
        </div>

        {/* Favorite Button */}
        <Button
          size="sm"
          variant="ghost"
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white text-gray-700 hover:text-red-500 transition-colors"
          onClick={() => toggleFavorite(template.id)}
        >
          <Heart 
            className={`h-4 w-4 ${favoriteTemplates.has(template.id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>

        {/* Default Badge */}
        {template.isDefault && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Default
            </Badge>
          </div>
        )}
      </div>

      {/* Template Info */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
              {template.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {template.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs font-medium">
              {getDenominationDisplayName(template.denomination)}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {getSacramentTypeDisplayName(template.sacramentType)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <Download className="h-3 w-3" />
            <span>Professional Quality</span>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={() => onTemplateSelect?.(template.id)}
          >
            Use Template
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Modern Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Certificate Templates</h2>
              <p className="text-gray-600 dark:text-gray-400">Choose from our professional template library</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardContent className="p-6">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search templates by name, description, or denomination..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-12 pr-4 py-3 text-base border-0 bg-white dark:bg-gray-800 shadow-md focus:shadow-lg transition-shadow rounded-xl"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 h-auto"
                onClick={() => onSearchChange('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="space-y-4">
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Denomination</label>
                  <Select value={selectedDenomination} onValueChange={onDenominationChange}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-0 shadow-md">
                      <SelectValue placeholder="All Denominations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Denominations</SelectItem>
                      {denominations.map((denomination) => (
                        <SelectItem key={denomination} value={denomination}>
                          <div className="flex items-center space-x-2">
                            {getDenominationIcon(denomination)}
                            <span>{getDenominationDisplayName(denomination)}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sacrament Type</label>
                  <Select value={selectedSacramentType} onValueChange={onSacramentTypeChange}>
                    <SelectTrigger className="bg-white dark:bg-gray-800 border-0 shadow-md">
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
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? 'Loading...' : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? 's' : ''} found`}
          </p>
          {(selectedDenomination !== 'ALL' || selectedSacramentType !== 'ALL' || searchTerm) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDenominationChange('ALL');
                onSacramentTypeChange('ALL');
                onSearchChange('');
              }}
              className="text-primary hover:text-primary/80"
            >
              Clear filters
              <X className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <TemplateCardSkeleton key={index} />
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-16">
            <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No templates found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              We couldn't find any templates matching your criteria. Try adjusting your search or filters.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                onDenominationChange('ALL');
                onSacramentTypeChange('ALL');
                onSearchChange('');
              }}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ModernTemplateSelector;
