import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowRight, CheckCircle, Plus, X } from "lucide-react"
import { StoryEditor, StoryEditorRef } from "@/components/StoryEditor"
import { submitExperience, type ExperienceSubmission } from "@/api/experiences"
import { getPeptides, type Peptide } from "@/api/peptides"
import { getEffects, type Effect } from "@/api/effects"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/contexts/AuthContext"

const STEPS = [
  { id: 1, title: "Peptide Details", description: "Basic information about your peptide usage" },
  { id: 2, title: "Context & Goals", description: "Your objectives and additional context" },
  { id: 3, title: "Outcomes & Effects", description: "Rate your experience and effects" },
  { id: 4, title: "Personal Story", description: "Share your detailed experience narrative" }
]

const EFFECTS_CATEGORIES = [
  { category: "Physical", effects: ["Increased muscle mass", "Reduced body fat", "Improved strength", "Better endurance", "Enhanced recovery"] },
  { category: "Cognitive", effects: ["Better focus", "Improved memory", "Mental clarity", "Reduced brain fog", "Enhanced creativity"] },
  { category: "Sleep", effects: ["Deeper sleep", "Faster sleep onset", "More vivid dreams", "Better sleep quality", "Reduced insomnia"] },
  { category: "Mood", effects: ["Improved mood", "Reduced anxiety", "Better stress tolerance", "Increased motivation", "Enhanced well-being"] }
]

interface FormData {
  peptideId: string
  dosage: string
  frequency: string
  duration: number
  routeOfAdministration: string
  primaryPurpose: string[]
  demographics: {
    ageRange: string
    biologicalSex: string
    activityLevel: string
  }
  outcomes: {
    [key: string]: number  // Changed to dynamic key-value pairs for effects
  }
  effects: string[]
  timeline: string
  story: string
  stack: string[]
  sourcing: {
    vendorUrl: string
    batchId: string
    purityPercentage: number
    volumeMl: number
  }
  vendor: {
    name: string
    quantity: string
    batchId: string
  }
}

const initialFormData: FormData = {
  peptideId: "",
  dosage: "",
  frequency: "",
  duration: 0,
  routeOfAdministration: "",
  primaryPurpose: [],
  demographics: {
    ageRange: "",
    biologicalSex: "",
    activityLevel: ""
  },
  outcomes: {},  // Will be populated dynamically based on peptide's commonEffects
  effects: [],
  timeline: "",
  story: "",
  stack: [],
  sourcing: {
    vendorUrl: "",
    batchId: "",
    purityPercentage: 0,
    volumeMl: 0
  },
  vendor: {
    name: '',
    quantity: '',
    batchId: ''
  }
}

export function Submit() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [effects, setEffects] = useState<Effect[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [trackingId, setTrackingId] = useState("")
  const [newStackItem, setNewStackItem] = useState("")
  const [newEffect, setNewEffect] = useState("")
  const storyEditorRef = useRef<StoryEditorRef>(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAuth()
  const [honeypotField, setHoneypotField] = useState("")

  console.log("Submit: Rendering with currentStep:", currentStep)
  console.log("Submit: FormData state:", formData)

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Submit: Loading peptides and effects data")
        const [peptidesResponse, effectsResponse] = await Promise.all([
          getPeptides(),
          getEffects()
        ])

        console.log("Submit: Peptides response:", peptidesResponse)
        console.log("Submit: Effects response:", effectsResponse)
        console.log("Submit: Peptides loaded:", peptidesResponse.data?.peptides?.length || 0)
        console.log("Submit: Effects loaded:", effectsResponse.data?.effects?.length || 0)

        setPeptides(peptidesResponse.data?.peptides || [])
        setEffects(effectsResponse.data?.effects || [])
      } catch (error) {
        console.error("Submit: Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load form data. Please refresh the page.",
          variant: "destructive"
        })
      }
    }

    loadData()
  }, [toast])

  const initializeOutcomes = (peptideId: string) => {
    const peptide = peptides.find(p => p._id === peptideId)
    if (peptide) {
      const newOutcomes: { [key: string]: number } = {}
      peptide.commonEffects.forEach(effect => {
        newOutcomes[effect] = 5 // Default to middle rating
      })
      setFormData(prev => ({
        ...prev,
        outcomes: newOutcomes
      }))
    }
  }

  useEffect(() => {
    if (formData.peptideId) {
      initializeOutcomes(formData.peptideId)
    }
  }, [formData.peptideId])

  const nextStep = () => {
    console.log("Submit: Moving to next step from:", currentStep)
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    console.log("Submit: Moving to previous step from:", currentStep)
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (field: string, value: any) => {
    console.log("Submit: Updating form data:", field, value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedFormData = (section: string, field: string, value: any) => {
    console.log("Submit: Updating nested form data:", section, field, value)
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof FormData],
        [field]: value
      }
    }))
  }

  const toggleArrayItem = (field: string, item: string) => {
    console.log("Submit: Toggling array item:", field, item)
    setFormData(prev => {
      const currentArray = prev[field as keyof FormData] as string[]
      const newArray = currentArray.includes(item)
        ? currentArray.filter(i => i !== item)
        : [...currentArray, item]

      return {
        ...prev,
        [field]: newArray
      }
    })
  }

  const addStackItem = () => {
    if (newStackItem.trim()) {
      console.log("Submit: Adding stack item:", newStackItem)
      setFormData(prev => ({
        ...prev,
        stack: [...prev.stack, newStackItem.trim()]
      }))
      setNewStackItem("")
    }
  }

  const removeStackItem = (index: number) => {
    console.log("Submit: Removing stack item at index:", index)
    setFormData(prev => ({
      ...prev,
      stack: prev.stack.filter((_, i) => i !== index)
    }))
  }

  const addCustomEffect = () => {
    if (newEffect.trim()) {
      console.log("Submit: Adding custom effect:", newEffect)
      setFormData(prev => ({
        ...prev,
        effects: [...prev.effects, newEffect.trim()]
      }))
      setNewEffect("")
    }
  }

  const handleSubmit = async () => {
    console.log("Submit: Attempting to submit experience")
    setIsLoading(true)

    try {
      // Check honeypot field - if it's filled, reject the submission
      if (honeypotField) {
        console.log("Submit: Honeypot field was filled, likely a bot")
        throw new Error("Invalid submission detected")
      }

      const submissionData: ExperienceSubmission = {
        peptideId: formData.peptideId,
        dosage: formData.dosage,
        frequency: formData.frequency,
        duration: formData.duration,
        routeOfAdministration: formData.routeOfAdministration,
        primaryPurpose: formData.primaryPurpose,
        demographics: formData.demographics,
        outcomes: formData.outcomes,
        effects: formData.effects,
        timeline: formData.timeline,
        story: formData.story || undefined,
        stack: formData.stack.length > 0 ? formData.stack : undefined,
        sourcing: Object.values(formData.sourcing).some(v => v) ? formData.sourcing : undefined,
      }

      console.log("Submit: Submitting data:", submissionData)
      const result = await submitExperience(submissionData)

      console.log("Submit: Experience submitted successfully:", result)
      setTrackingId(result.trackingId)
      setIsSubmitted(true)

      toast({
        title: "Experience Submitted!",
        description: `Thank you for sharing your experience with the community. Your tracking ID is: ${result.trackingId}`,
      })
    } catch (error: any) {
      console.error("Submit: Error submitting experience:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit your experience. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedFromStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.peptideId && formData.dosage && formData.frequency && formData.duration > 0 && formData.routeOfAdministration
      case 2:
        return formData.primaryPurpose.length > 0 && formData.demographics.ageRange && formData.demographics.biologicalSex && formData.demographics.activityLevel
      case 3:
        return formData.timeline
      case 4:
        return formData.story.length >= 100
      default:
        return true
    }
  }

  const progress = (currentStep / STEPS.length) * 100

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Experience Submitted Successfully!</h1>
            <p className="text-muted-foreground mb-4">
              Thank you for sharing your experience with the community. Your contribution helps others make informed decisions.
            </p>
            {trackingId && (
              <div className="bg-muted p-4 rounded-lg mb-6">
                <p className="text-sm font-medium mb-2">Your Tracking ID:</p>
                <p className="font-mono text-lg">{trackingId}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Save this ID to track or update your submission in the future
                </p>
              </div>
            )}
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/community")}>
                View Community Experiences
              </Button>
              <Button variant="outline" onClick={() => {
                setIsSubmitted(false)
                setCurrentStep(1)
                setFormData(initialFormData)
              }}>
                Submit Another Experience
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Share Your Experience</h1>
            <Badge variant="outline">{currentStep} of {STEPS.length}</Badge>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex items-center gap-4">
            <div className="text-lg font-medium">{STEPS[currentStep - 1].title}</div>
            <div className="text-muted-foreground">{STEPS[currentStep - 1].description}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Step {currentStep}: {STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Step 1: Peptide Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="peptide">Peptide *</Label>
                  <Select value={formData.peptideId} onValueChange={(value) => updateFormData('peptideId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a peptide" />
                    </SelectTrigger>
                    <SelectContent>
                      {peptides.map((peptide) => (
                        <SelectItem key={peptide._id} value={peptide._id}>
                          {peptide.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage *</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 250 mcg"
                    value={formData.dosage}
                    onChange={(e) => updateFormData('dosage', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Frequency *</Label>
                  <Select value={formData.frequency} onValueChange={(value) => updateFormData('frequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="every-other-day">Every Other Day</SelectItem>
                      <SelectItem value="twice-weekly">Twice Weekly</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as-needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (days) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.duration || ''}
                    onChange={(e) => updateFormData('duration', parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="route">Route of Administration *</Label>
                  <Select value={formData.routeOfAdministration} onValueChange={(value) => updateFormData('routeOfAdministration', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="subcutaneous">Subcutaneous</SelectItem>
                      <SelectItem value="intramuscular">Intramuscular</SelectItem>
                      <SelectItem value="oral">Oral</SelectItem>
                      <SelectItem value="nasal">Nasal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="space-y-4 mt-6">
                <h3 className="text-lg font-semibold">Vendor Information (Optional)</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="vendorName">Vendor Name</Label>
                    <Input
                      type="text"
                      id="vendorName"
                      value={formData.vendor.name}
                      onChange={(e) => updateNestedFormData('vendor', 'name', e.target.value)}
                      placeholder="Enter vendor name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="vendorQuantity">Quantity Purchased</Label>
                    <Input
                      type="text"
                      id="vendorQuantity"
                      value={formData.vendor.quantity}
                      onChange={(e) => updateNestedFormData('vendor', 'quantity', e.target.value)}
                      placeholder="e.g., 10mg or 100mcg"
                    />
                    <p className="mt-1 text-sm text-muted-foreground">Enter quantity with units (mg or mcg)</p>
                  </div>
                  <div>
                    <Label htmlFor="vendorBatchId">Batch ID</Label>
                    <Input
                      type="text"
                      id="vendorBatchId"
                      value={formData.vendor.batchId}
                      onChange={(e) => updateNestedFormData('vendor', 'batchId', e.target.value)}
                      placeholder="Enter batch ID"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Context & Goals */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label>Primary Purpose *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {peptides.find(p => p._id === formData.peptideId)?.commonEffects?.map((effect) => (
                    <div key={effect} className="flex items-center space-x-2">
                      <Checkbox
                        id={effect}
                        checked={formData.primaryPurpose.includes(effect)}
                        onCheckedChange={() => toggleArrayItem('primaryPurpose', effect)}
                      />
                      <Label htmlFor={effect} className="text-sm">{effect}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <Label>Stack/Combinations</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add other compounds used"
                      value={newStackItem}
                      onChange={(e) => setNewStackItem(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addStackItem())}
                    />
                    <Button type="button" size="sm" onClick={addStackItem}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {formData.stack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.stack.map((item, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {item}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeStackItem(index)} />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Age Range *</Label>
                  <Select value={formData.demographics.ageRange} onValueChange={(value) => updateNestedFormData('demographics', 'ageRange', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="18-25">18-25</SelectItem>
                      <SelectItem value="25-30">25-30</SelectItem>
                      <SelectItem value="30-35">30-35</SelectItem>
                      <SelectItem value="35-40">35-40</SelectItem>
                      <SelectItem value="40-45">40-45</SelectItem>
                      <SelectItem value="45-50">45-50</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Biological Sex *</Label>
                  <Select value={formData.demographics.biologicalSex} onValueChange={(value) => updateNestedFormData('demographics', 'biologicalSex', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sex" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Activity Level *</Label>
                  <Select value={formData.demographics.activityLevel} onValueChange={(value) => updateNestedFormData('demographics', 'activityLevel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="athletic">Athletic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Outcomes & Effects */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-6">
                <Label className="text-base font-medium">Rate Effectiveness of Effects (1-10)</Label>
                
                {Object.entries(formData.outcomes).map(([effect, value]) => (
                  <div key={effect} className="space-y-2">
                    <div className="flex justify-between">
                      <Label>{effect}</Label>
                      <span className="text-sm font-medium">{value}/10</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => {
                        setFormData(prev => ({
                          ...prev,
                          outcomes: {
                            ...prev.outcomes,
                            [effect]: newValue
                          }
                        }))
                      }}
                      max={10}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label>Additional Effects (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    value={newEffect}
                    onChange={(e) => setNewEffect(e.target.value)}
                    placeholder="Enter additional effect"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newEffect.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          effects: [...prev.effects, newEffect.trim()]
                        }))
                        setNewEffect("")
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.effects.map((effect, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {effect}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            effects: prev.effects.filter((_, i) => i !== index)
                          }))
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>When did you notice effects? *</Label>
                <Select value={formData.timeline} onValueChange={(value) => updateFormData('timeline', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediately">Immediately</SelectItem>
                    <SelectItem value="1-3-days">1-3 days</SelectItem>
                    <SelectItem value="1-week">1 week</SelectItem>
                    <SelectItem value="2-weeks">2 weeks</SelectItem>
                    <SelectItem value="3-4-weeks">3-4 weeks</SelectItem>
                    <SelectItem value="1-2-months">1-2 months</SelectItem>
                    <SelectItem value="no-effects">No effects noticed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 4: Personal Story */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-base font-medium">Share Your Story</Label>
                <p className="text-sm text-muted-foreground">
                  Tell the community about your experience in detail. Your story helps others make informed decisions.
                  Minimum 100 characters recommended.
                </p>
              </div>

              <StoryEditor
                ref={storyEditorRef}
                value={formData.story}
                onChange={(value) => updateFormData('story', value)}
                placeholder="Share your detailed experience with this peptide..."
                maxLength={1000}
                minLength={100}
              />

              <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Story Guidelines</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Share your honest experience, both positive and negative</li>
                  <li>• Include timeline details and specific changes you noticed</li>
                  <li>• Mention any side effects or unexpected results</li>
                  <li>• Be respectful and avoid medical advice</li>
                  <li>• Your story will be anonymous but publicly visible</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            {currentStep < STEPS.length ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceedFromStep(currentStep)}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceedFromStep(currentStep) || isLoading}
              >
                {isLoading ? "Submitting..." : "Submit Experience"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add honeypot field - hidden from real users but visible to bots */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <input
          type="text"
          name="website"
          value={honeypotField}
          onChange={(e) => setHoneypotField(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>
    </div>
  )
}