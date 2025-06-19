import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCurrentUser, updateUserProfile, type UserDemographics, type UserPreferences } from "@/api/users"
import { getExperienceByTrackingId, type Experience } from "@/api/experiences"
import { useToast } from "@/hooks/useToast"

export function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Tracking ID lookup state
  const [trackingId, setTrackingId] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupExperience, setLookupExperience] = useState<Experience | null>(null)
  const [lookupError, setLookupError] = useState('')

  const { toast } = useToast()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser()
        const userData = response.user
        setUser(userData)

        // Set form values
        if (userData.demographics) {
          setValue('age', userData.demographics.age)
          setValue('gender', userData.demographics.gender)
          setValue('weight', userData.demographics.weight)
          setValue('height', userData.demographics.height)
          setValue('activityLevel', userData.demographics.activityLevel)
        }

        if (userData.preferences) {
          setValue('weightUnit', userData.preferences.units?.weight || 'kg')
          setValue('heightUnit', userData.preferences.units?.height || 'cm')
          setValue('shareAge', userData.preferences.privacy?.shareAge !== false)
          setValue('shareGender', userData.preferences.privacy?.shareGender !== false)
          setValue('emailNotifications', userData.preferences.notifications?.email !== false)
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load profile",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [setValue, toast])

  const onSubmit = async (data: any) => {
    setSaving(true)
    try {
      const demographics: UserDemographics = {
        age: data.age ? parseInt(data.age) : undefined,
        gender: data.gender,
        weight: data.weight ? parseFloat(data.weight) : undefined,
        height: data.height ? parseFloat(data.height) : undefined,
        activityLevel: data.activityLevel,
        fitnessGoals: user?.demographics?.fitnessGoals || [],
        medicalConditions: user?.demographics?.medicalConditions || [],
        allergies: user?.demographics?.allergies || []
      }

      const preferences: UserPreferences = {
        units: {
          weight: data.weightUnit,
          height: data.heightUnit
        },
        privacy: {
          shareAge: data.shareAge,
          shareGender: data.shareGender,
          shareWeight: user?.preferences?.privacy?.shareWeight || false,
          shareHeight: user?.preferences?.privacy?.shareHeight || false
        },
        notifications: {
          email: data.emailNotifications,
          newExperiences: user?.preferences?.notifications?.newExperiences || false,
          weeklyDigest: user?.preferences?.notifications?.weeklyDigest || true
        }
      }

      await updateUserProfile({ demographics, preferences })
      toast({
        title: "Success",
        description: "Profile updated successfully!"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const handleLookupExperience = async () => {
    if (!trackingId.trim()) {
      setLookupError('Please enter a tracking ID')
      return
    }

    setLookupLoading(true)
    setLookupError('')
    setLookupExperience(null)

    try {
      const response = await getExperienceByTrackingId(trackingId.trim())
      console.log('Profile: Lookup response:', response)
      
      if (response.success && response.data?.experience) {
        setLookupExperience(response.data.experience)
        toast({
          title: "Experience Found",
          description: "Experience found successfully"
        })
      } else {
        setLookupError('Experience not found')
        toast({
          title: "Error",
          description: "Experience not found",
          variant: "destructive"
        })
      }
    } catch (error: any) {
      console.error('Profile: Lookup error:', error)
      setLookupError(error.message || 'Failed to lookup experience')
      toast({
        title: "Error",
        description: error.message || "Failed to lookup experience",
        variant: "destructive"
      })
    } finally {
      setLookupLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your demographics, preferences, and privacy settings</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="demographics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="tracking">Lookup</TabsTrigger>
          </TabsList>

          <TabsContent value="demographics">
            <Card>
              <CardHeader>
                <CardTitle>Demographics Information</CardTitle>
                <CardDescription>Basic demographic information for research purposes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="Enter your age"
                      {...register('age')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setValue('gender', value)} value={watch('gender')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="Enter your weight"
                      {...register('weight')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="Enter your height"
                      {...register('height')}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="activityLevel">Activity Level</Label>
                    <Select onValueChange={(value) => setValue('activityLevel', value)} value={watch('activityLevel')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">Sedentary</SelectItem>
                        <SelectItem value="lightly-active">Lightly Active</SelectItem>
                        <SelectItem value="moderately-active">Moderately Active</SelectItem>
                        <SelectItem value="very-active">Very Active</SelectItem>
                        <SelectItem value="extremely-active">Extremely Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Unit Preferences</CardTitle>
                <CardDescription>Choose your preferred units for measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weightUnit">Weight Unit</Label>
                    <Select onValueChange={(value) => setValue('weightUnit', value)} value={watch('weightUnit')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select weight unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heightUnit">Height Unit</Label>
                    <Select onValueChange={(value) => setValue('heightUnit', value)} value={watch('heightUnit')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select height unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="ft">Feet (ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control what information you share</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="shareAge"
                      {...register('shareAge')}
                      className="rounded"
                    />
                    <Label htmlFor="shareAge">Share age in research data</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="shareGender"
                      {...register('shareGender')}
                      className="rounded"
                    />
                    <Label htmlFor="shareGender">Share gender in research data</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="emailNotifications"
                      {...register('emailNotifications')}
                      className="rounded"
                    />
                    <Label htmlFor="emailNotifications">Receive email notifications</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tracking">
            <Card>
              <CardHeader>
                <CardTitle>Experience Lookup</CardTitle>
                <CardDescription>Look up your submitted experiences using your tracking ID</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter tracking ID (e.g., TRK-123456789)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleLookupExperience}
                    disabled={lookupLoading || !trackingId.trim()}
                  >
                    {lookupLoading ? "Looking up..." : "Lookup"}
                  </Button>
                </div>

                {lookupError && (
                  <Alert variant="destructive">
                    <AlertDescription>{lookupError}</AlertDescription>
                  </Alert>
                )}

                {lookupExperience && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Experience Found</CardTitle>
                      <CardDescription>Tracking ID: {lookupExperience.trackingId}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p><strong>Peptide:</strong> {lookupExperience.peptideName}</p>
                      <p><strong>Dosage:</strong> {lookupExperience.dosage}</p>
                      <p><strong>Frequency:</strong> {lookupExperience.frequency}</p>
                      <p><strong>Duration:</strong> {lookupExperience.duration} days</p>
                      <p><strong>Route:</strong> {lookupExperience.route}</p>
                      <p><strong>Submitted:</strong> {new Date(lookupExperience.createdAt).toLocaleDateString()}</p>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-6">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </div>
  )
}