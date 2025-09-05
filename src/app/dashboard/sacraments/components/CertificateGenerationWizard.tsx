import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  User,
  Award,
  Eye,
  AlertCircle,
  Star,
  Church,
  Zap,
  Shield,
  Crown,
  Heart,
  Sparkles,
} from "lucide-react";

interface CertificateGenerationWizardProps {
  onComplete?: (certificateData: any) => void;
  onCancel?: () => void;
  templates?: any[];
  sacramentalRecords?: any[];
  loading?: boolean;
}

const CertificateGenerationWizard: React.FC<
  CertificateGenerationWizardProps
> = ({
  onComplete,
  onCancel,
  templates = [],
  sacramentalRecords = [],
  loading = false,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    sacramentalRecordId: "",
    templateId: "",
    memberName: "",
    sacramentType: "",
    denomination: "",
    dateOfSacrament: "",
    location: "",
    officiant: "",
    specialNotes: "",
  });

  const steps = [
    {
      id: "record",
      title: "Select Record",
      icon: <User className="h-5 w-5" />,
    },
    {
      id: "template",
      title: "Choose Template",
      icon: <Award className="h-5 w-5" />,
    },
    {
      id: "customize",
      title: "Customize",
      icon: <FileText className="h-5 w-5" />,
    },
    { id: "preview", title: "Preview", icon: <Eye className="h-5 w-5" /> },
  ];

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const getDenominationDisplayName = (denomination: string) => {
    const names: Record<string, string> = {
      CATHOLIC: "Catholic",
      BAPTIST: "Baptist",
      LUTHERAN: "Lutheran",
      METHODIST: "Methodist",
      PRESBYTERIAN: "Presbyterian",
      ANGLICAN: "Anglican",
      PENTECOSTAL: "Pentecostal",
      ORTHODOX: "Orthodox",
    };
    return names[denomination] || denomination;
  };

  const getSacramentTypeDisplayName = (type: string) => {
    const names: Record<string, string> = {
      BAPTISM: "Baptism",
      CONFIRMATION: "Confirmation",
      EUCHARIST_FIRST_COMMUNION: "First Communion",
      MATRIMONY: "Marriage",
      HOLY_ORDERS: "Holy Orders",
      ANOINTING_OF_THE_SICK: "Anointing",
      RECONCILIATION: "Reconciliation",
    };
    return names[type] || type;
  };

  const getDenominationIcon = (denomination: string) => {
    const icons: Record<string, React.ReactNode> = {
      CATHOLIC: <Church className="h-4 w-4" />,
      BAPTIST: <Zap className="h-4 w-4" />,
      LUTHERAN: <Shield className="h-4 w-4" />,
      ORTHODOX: <Crown className="h-4 w-4" />,
      METHODIST: <Heart className="h-4 w-4" />,
      PENTECOSTAL: <Sparkles className="h-4 w-4" />,
    };
    return icons[denomination] || <Church className="h-4 w-4" />;
  };

  const getDenominationColor = (denomination: string) => {
    const colors: Record<string, string> = {
      CATHOLIC: "from-red-500 to-red-600",
      BAPTIST: "from-blue-500 to-blue-600",
      LUTHERAN: "from-purple-500 to-purple-600",
      ORTHODOX: "from-amber-500 to-amber-600",
      METHODIST: "from-pink-500 to-pink-600",
      PENTECOSTAL: "from-orange-500 to-orange-600",
    };
    return colors[denomination] || "from-gray-500 to-gray-600";
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRecordSelection = (recordId: string) => {
    const record = sacramentalRecords.find((r) => r.id === recordId);
    if (record) {
      updateFormData("sacramentalRecordId", recordId);
      updateFormData("memberName", record.memberName || "");
      updateFormData("sacramentType", record.sacramentType || "");
      updateFormData("dateOfSacrament", record.dateOfSacrament || "");
      updateFormData("location", record.location || "");
      updateFormData("officiant", record.officiant || "");
    }
  };

  const handleTemplateSelection = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      updateFormData("templateId", templateId);
      updateFormData("denomination", template.denomination || "");
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return !!formData.sacramentalRecordId;
      case 1:
        return !!formData.templateId;
      case 2:
        return !!formData.memberName && !!formData.sacramentType;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleGenerate = () => {
    if (onComplete) onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Select Sacramental Record
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Choose the record for certificate generation
              </p>
            </div>

            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {sacramentalRecords.length === 0 ? (
                <Card className="border-dashed border-2">
                  <CardContent className="text-center py-8">
                    <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      No sacramental records available
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sacramentalRecords.map((record: any) => (
                  <Card
                    key={record.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      formData.sacramentalRecordId === record.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : ""
                    }`}
                    onClick={() => handleRecordSelection(record.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 bg-gradient-to-br ${getDenominationColor(record.denomination || "CATHOLIC")} rounded-lg text-white`}
                          >
                            {getDenominationIcon(
                              record.denomination || "CATHOLIC",
                            )}
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              {record.memberName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {getSacramentTypeDisplayName(
                                record.sacramentType,
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(
                                record.dateOfSacrament,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">
                            {getDenominationDisplayName(
                              record.denomination || "CATHOLIC",
                            )}
                          </Badge>
                          {formData.sacramentalRecordId === record.id && (
                            <div className="p-1 bg-primary rounded-full">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        );

      case 1:
        const filteredTemplates = templates.filter(
          (t) =>
            !formData.sacramentType ||
            t.sacramentType === formData.sacramentType,
        );
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Choose Template</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Select a professional certificate template
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 max-h-96 overflow-y-auto">
              {filteredTemplates.map((template: any) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    formData.templateId === template.id
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  }`}
                  onClick={() => handleTemplateSelection(template.id)}
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getDenominationColor(template.denomination)} opacity-10`}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div
                          className={`p-3 bg-gradient-to-br ${getDenominationColor(template.denomination)} rounded-full mb-2 shadow-lg text-white`}
                        >
                          {getDenominationIcon(template.denomination)}
                        </div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Certificate Preview
                        </div>
                      </div>
                    </div>

                    {template.isDefault && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-amber-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      </div>
                    )}

                    {formData.templateId === template.id && (
                      <div className="absolute top-2 right-2">
                        <div className="p-1 bg-primary rounded-full">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {getDenominationDisplayName(template.denomination)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {getSacramentTypeDisplayName(template.sacramentType)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Customize Details</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review and customize certificate information
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="memberName">Member Name *</Label>
                  <Input
                    id="memberName"
                    value={formData.memberName}
                    onChange={(e) =>
                      updateFormData("memberName", e.target.value)
                    }
                    placeholder="Enter member name"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfSacrament">Date of Sacrament *</Label>
                  <Input
                    id="dateOfSacrament"
                    type="date"
                    value={formData.dateOfSacrament}
                    onChange={(e) =>
                      updateFormData("dateOfSacrament", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => updateFormData("location", e.target.value)}
                    placeholder="Church or ceremony location"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="officiant">Officiant</Label>
                  <Input
                    id="officiant"
                    value={formData.officiant}
                    onChange={(e) =>
                      updateFormData("officiant", e.target.value)
                    }
                    placeholder="Pastor, Priest, or Officiant name"
                  />
                </div>
                <div>
                  <Label htmlFor="specialNotes">Special Notes</Label>
                  <Input
                    id="specialNotes"
                    value={formData.specialNotes}
                    onChange={(e) =>
                      updateFormData("specialNotes", e.target.value)
                    }
                    placeholder="Any special notes"
                  />
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 className="font-medium mb-2">Certificate Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sacrament:</span>
                      <span className="font-medium">
                        {getSacramentTypeDisplayName(formData.sacramentType)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Denomination:</span>
                      <span className="font-medium">
                        {getDenominationDisplayName(formData.denomination)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Preview & Generate</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Review final certificate details
              </p>
            </div>

            <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div
                    className={`p-6 bg-gradient-to-br ${getDenominationColor(formData.denomination)} rounded-2xl shadow-2xl mx-auto max-w-md text-white`}
                  >
                    <div className="space-y-4">
                      <div className="p-3 bg-white/20 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                        {getDenominationIcon(formData.denomination)}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold">
                          Certificate of{" "}
                          {getSacramentTypeDisplayName(formData.sacramentType)}
                        </h4>
                        <p className="text-lg opacity-90">
                          {formData.memberName}
                        </p>
                        <p className="text-sm opacity-75">
                          {new Date(
                            formData.dateOfSacrament,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-xs opacity-75">
                        <p>{formData.location}</p>
                        <p>Officiant: {formData.officiant}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header with Progress */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 border shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">
              Certificate Generation Wizard
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Step {currentStep + 1} of {steps.length}:{" "}
              {steps[currentStep].title}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-sm text-gray-500">Complete</div>
          </div>
        </div>

        <div className="space-y-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col items-center space-y-2"
              >
                <div
                  className={`p-3 rounded-full transition-all ${
                    index <= currentStep
                      ? "bg-primary text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <div className="text-center">
                  <div
                    className={`text-sm font-medium ${index <= currentStep ? "text-primary" : "text-gray-500"}`}
                  >
                    {step.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="border-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm shadow-2xl">
        <CardContent className="p-8">{renderStepContent()}</CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={currentStep === 0 ? onCancel : prevStep}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 0 ? "Cancel" : "Previous"}
        </Button>

        <div className="flex items-center space-x-3">
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep} disabled={!canProceed()}>
              Next Step <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={!canProceed() || loading}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {loading ? "Generating..." : "Generate Certificate"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CertificateGenerationWizard;
