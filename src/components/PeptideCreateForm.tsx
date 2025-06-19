import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus } from "lucide-react"
import { createPeptide, type CreatePeptideData } from "@/api/peptides"
import { useToast } from "@/hooks/useToast"

const CATEGORIES = [
  "Healing & Recovery",
  "Growth Hormone",
  "Performance & Enhancement",
  "Anti-Aging",
  "Cognitive Enhancement",
  "Metabolic Health"
]

interface PeptideCreateFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PeptideCreateForm({ onSuccess, onCancel }: PeptideCreateFormProps) {
  console.log("PeptideCreateForm: Component rendered")

  const [formData, setFormData] = useState<CreatePeptideData>({
    name: "",
    peptide_sequence: "",
    category: "",
    description: "",
    detailedDescription: "",
    mechanism: "",
    commonDosage: "",
    commonFrequency: "",
    commonEffects: [],
    sideEffects: [],
    commonStacks: [],
    dosageRanges: {
      low: "",
      medium: "",
      high: ""
    },
    timeline: {
      onset: "",
      peak: "",
      duration: ""
    }
  })

  const [newEffect, setNewEffect] = useState("")
  const [newSideEffect, setNewSideEffect] = useState("")
  const [newStack, setNewStack] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  console.log("PeptideCreateForm: State initialized", {
    hasFormData: !!formData,
    loading,
    formDataName: formData.name
  })

  const handleInputChange = (field: string, value: string) => {
    console.log("PeptideCreateForm: Input changed", { field, value })
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDosageRangeChange = (range: 'low' | 'medium' | 'high', value: string) => {
    console.log("PeptideCreateForm: Dosage range changed", { range, value })
    setFormData(prev => ({
      ...prev,
      dosageRanges: {
        ...prev.dosageRanges!,
        [range]: value
      }
    }))
  }

  const handleTimelineChange = (field: 'onset' | 'peak' | 'duration', value: string) => {
    console.log("PeptideCreateForm: Timeline changed", { field, value })
    setFormData(prev => ({
      ...prev,
      timeline: {
        ...prev.timeline!,
        [field]: value
      }
    }))
  }

  const addEffect = () => {
    if (newEffect.trim()) {
      console.log("PeptideCreateForm: Adding effect", newEffect.trim())
      setFormData(prev => ({
        ...prev,
        commonEffects: [...(prev.commonEffects || []), newEffect.trim()]
      }))
      setNewEffect("")
    }
  }

  const removeEffect = (index: number) => {
    console.log("PeptideCreateForm: Removing effect at index", index)
    setFormData(prev => ({
      ...prev,
      commonEffects: prev.commonEffects?.filter((_, i) => i !== index) || []
    }))
  }

  const addSideEffect = () => {
    if (newSideEffect.trim()) {
      console.log("PeptideCreateForm: Adding side effect", newSideEffect.trim())
      setFormData(prev => ({
        ...prev,
        sideEffects: [...(prev.sideEffects || []), newSideEffect.trim()]
      }))
      setNewSideEffect("")
    }
  }

  const removeSideEffect = (index: number) => {
    console.log("PeptideCreateForm: Removing side effect at index", index)
    setFormData(prev => ({
      ...prev,
      sideEffects: prev.sideEffects?.filter((_, i) => i !== index) || []
    }))
  }

  const addStack = () => {
    if (newStack.trim()) {
      console.log("PeptideCreateForm: Adding stack", newStack.trim())
      setFormData(prev => ({
        ...prev,
        commonStacks: [...(prev.commonStacks || []), newStack.trim()]
      }))
      setNewStack("")
    }
  }

  const removeStack = (index: number) => {
    console.log("PeptideCreateForm: Removing stack at index", index)
    setFormData(prev => ({
      ...prev,
      commonStacks: prev.commonStacks?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("PeptideCreateForm: Form submitted", formData)

    // Validate peptide sequence format
    const peptideSequenceRegex = /^[A-Za-z-]+(?:-[A-Za-z-]+)*$/;
    if (!peptideSequenceRegex.test(formData.peptide_sequence)) {
      console.log("PeptideCreateForm: Validation failed - invalid peptide sequence format")
      toast({
        title: "Error",
        description: "Please enter a valid peptide sequence using standard amino acid codes",
        variant: "destructive"
      })
      return
    }

    if (!formData.name || !formData.peptide_sequence || !formData.category || !formData.description ||
        !formData.detailedDescription || !formData.mechanism ||
        !formData.commonDosage || !formData.commonFrequency) {
      console.log("PeptideCreateForm: Validation failed - missing required fields")
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    console.log("PeptideCreateForm: Starting peptide creation API call")
    setLoading(true)
    try {
      const result = await createPeptide(formData)
      console.log("PeptideCreateForm: Peptide created successfully", result)
      toast({
        title: "Success",
        description: "Peptide created successfully"
      })
      console.log("PeptideCreateForm: Calling onSuccess callback")
      onSuccess()
    } catch (error: any) {
      console.error("PeptideCreateForm: Error creating peptide:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create peptide",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      console.log("PeptideCreateForm: Form submission completed")
    }
  }

  const handleCancel = () => {
    console.log("PeptideCreateForm: Cancel button clicked")
    onCancel()
  }

  console.log("PeptideCreateForm: About to render form")

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Peptide</CardTitle>
        <CardDescription>
          Add a new peptide to the database with detailed information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., BPC-157"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="peptide_sequence">Peptide Sequence *</Label>
              <Input
                id="peptide_sequence"
                value={formData.peptide_sequence}
                onChange={(e) => handleInputChange('peptide_sequence', e.target.value)}
                placeholder="e.g., H-Gly-Pro-Glu-Pro-Lys-Pro-Glu-Asp-Lys-Asp-Ala-Gly-Leu-Val-OH"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of the peptide"
              rows={2}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="detailedDescription">Detailed Description *</Label>
            <Textarea
              id="detailedDescription"
              value={formData.detailedDescription}
              onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
              placeholder="Comprehensive description including background, research, etc."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mechanism">Mechanism of Action *</Label>
            <Textarea
              id="mechanism"
              value={formData.mechanism}
              onChange={(e) => handleInputChange('mechanism', e.target.value)}
              placeholder="How the peptide works in the body"
              rows={3}
              required
            />
          </div>

          {/* Dosage Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commonDosage">Common Dosage *</Label>
              <Input
                id="commonDosage"
                value={formData.commonDosage}
                onChange={(e) => handleInputChange('commonDosage', e.target.value)}
                placeholder="e.g., 250-500 mcg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commonFrequency">Common Frequency *</Label>
              <Input
                id="commonFrequency"
                value={formData.commonFrequency}
                onChange={(e) => handleInputChange('commonFrequency', e.target.value)}
                placeholder="e.g., Daily, Twice weekly"
                required
              />
            </div>
          </div>

          {/* Dosage Ranges */}
          <div className="space-y-4">
            <Label>Dosage Ranges</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosageLow">Low Dose</Label>
                <Input
                  id="dosageLow"
                  value={formData.dosageRanges?.low || ""}
                  onChange={(e) => handleDosageRangeChange('low', e.target.value)}
                  placeholder="e.g., 200-300 mcg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosageMedium">Medium Dose</Label>
                <Input
                  id="dosageMedium"
                  value={formData.dosageRanges?.medium || ""}
                  onChange={(e) => handleDosageRangeChange('medium', e.target.value)}
                  placeholder="e.g., 300-500 mcg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosageHigh">High Dose</Label>
                <Input
                  id="dosageHigh"
                  value={formData.dosageRanges?.high || ""}
                  onChange={(e) => handleDosageRangeChange('high', e.target.value)}
                  placeholder="e.g., 500-750 mcg"
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <Label>Timeline</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="timelineOnset">Onset</Label>
                <Input
                  id="timelineOnset"
                  value={formData.timeline?.onset || ""}
                  onChange={(e) => handleTimelineChange('onset', e.target.value)}
                  placeholder="e.g., 1-3 days"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timelinePeak">Peak</Label>
                <Input
                  id="timelinePeak"
                  value={formData.timeline?.peak || ""}
                  onChange={(e) => handleTimelineChange('peak', e.target.value)}
                  placeholder="e.g., 1-2 weeks"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timelineDuration">Duration</Label>
                <Input
                  id="timelineDuration"
                  value={formData.timeline?.duration || ""}
                  onChange={(e) => handleTimelineChange('duration', e.target.value)}
                  placeholder="e.g., 2-4 weeks post-cycle"
                />
              </div>
            </div>
          </div>

          {/* Common Effects */}
          <div className="space-y-4">
            <Label>Common Effects</Label>
            <div className="flex gap-2">
              <Input
                value={newEffect}
                onChange={(e) => setNewEffect(e.target.value)}
                placeholder="Add a common effect"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addEffect())}
              />
              <Button type="button" onClick={addEffect} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.commonEffects?.map((effect, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {effect}
                  <button
                    type="button"
                    onClick={() => removeEffect(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Side Effects */}
          <div className="space-y-4">
            <Label>Side Effects</Label>
            <div className="flex gap-2">
              <Input
                value={newSideEffect}
                onChange={(e) => setNewSideEffect(e.target.value)}
                placeholder="Add a side effect"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSideEffect())}
              />
              <Button type="button" onClick={addSideEffect} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sideEffects?.map((effect, index) => (
                <Badge key={index} variant="destructive" className="flex items-center gap-1">
                  {effect}
                  <button
                    type="button"
                    onClick={() => removeSideEffect(index)}
                    className="ml-1 hover:text-red-300"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Common Stacks */}
          <div className="space-y-4">
            <Label>Common Stacks</Label>
            <div className="flex gap-2">
              <Input
                value={newStack}
                onChange={(e) => setNewStack(e.target.value)}
                placeholder="Add a peptide this is commonly stacked with"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStack())}
              />
              <Button type="button" onClick={addStack} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.commonStacks?.map((stack, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {stack}
                  <button
                    type="button"
                    onClick={() => removeStack(index)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-6">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Peptide"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}