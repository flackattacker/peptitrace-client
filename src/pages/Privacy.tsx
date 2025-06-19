import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Eye, Database, Trash2, Download, AlertTriangle, CheckCircle, Lock } from "lucide-react"
import { useState } from "react"
import { getExperienceByTrackingId } from "@/api/experiences"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function Privacy() {
  const [trackingId, setTrackingId] = useState('')
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupExperience, setLookupExperience] = useState<any>(null)
  const [lookupError, setLookupError] = useState('')
  const { toast } = useToast()

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
      console.log('Privacy: Lookup response:', response)
      
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
      console.error('Privacy: Lookup error:', error)
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Privacy & Data Control
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Your privacy is our priority. Learn how we protect your data and maintain complete anonymity.
        </p>
      </div>

      {/* Privacy Score */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300">
                  Excellent Privacy Protection
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Zero-knowledge architecture • No tracking • Complete anonymity
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-green-600">A+</div>
              <div className="text-sm text-green-600">Privacy Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data">Your Data</TabsTrigger>
          <TabsTrigger value="rights">Your Rights</TabsTrigger>
          <TabsTrigger value="technical">Technical Details</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  What We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Experience Data</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anonymous Demographics</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Outcome Ratings</span>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <hr className="my-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Personal Identifiers</span>
                    <Badge variant="destructive" className="text-xs">Never</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IP Addresses</span>
                    <Badge variant="destructive" className="text-xs">Never</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Contact Information</span>
                    <Badge variant="destructive" className="text-xs">Never</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-green-600" />
                  How We Protect It
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Anonymous by Design:</strong> No way to link data back to individuals
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Encrypted Storage:</strong> All data encrypted at rest and in transit
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>No Tracking:</strong> No cookies, analytics, or behavioral tracking
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div className="text-sm">
                      <strong>Open Source:</strong> Code is publicly auditable
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle>Privacy Principles</CardTitle>
              <CardDescription>The core values that guide our approach to privacy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                  <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Privacy by Default
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Maximum privacy protection is built into every system by default
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                  <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                    Data Minimization
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We only collect what's absolutely necessary for the service
                  </p>
                </div>

                <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <Eye className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    Full Transparency
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Complete visibility into what data we have and how it's used
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Your Data Tab */}
        <TabsContent value="data" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle>Data Control Center</CardTitle>
              <CardDescription>Manage your submissions and data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="trackingId">Tracking ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="trackingId"
                      placeholder="Enter your tracking ID to manage your submissions"
                      className="flex-1"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                    />
                    <Button 
                      onClick={handleLookupExperience}
                      disabled={lookupLoading || !trackingId.trim()}
                    >
                      {lookupLoading ? "Looking up..." : "Lookup"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the tracking ID you received when submitting an experience
                  </p>
                </div>

                {lookupError && (
                  <Alert variant="destructive">
                    <AlertDescription>{lookupError}</AlertDescription>
                  </Alert>
                )}

                {lookupExperience && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      Experience Found
                    </h4>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      <p>Peptide: {lookupExperience.peptideId?.name}</p>
                      <p>Submitted: {new Date(lookupExperience.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Download className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Export Data</div>
                    <div className="text-xs text-muted-foreground">Download your submissions</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Database className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Update Experience</div>
                    <div className="text-xs text-muted-foreground">Modify your submission</div>
                  </div>
                </Button>

                <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2 text-red-600 hover:text-red-700">
                  <Trash2 className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">Delete Data</div>
                    <div className="text-xs text-muted-foreground">Remove your submissions</div>
                  </div>
                </Button>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  Anonymous Data Notice
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Your tracking ID is the only link to your submissions. If you lose it, we cannot recover
                  your data as there are no other identifiers stored. Keep it safe!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Your Rights Tab */}
        <TabsContent value="rights" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle>Your Privacy Rights</CardTitle>
              <CardDescription>Understanding your rights and how to exercise them</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">GDPR Rights (EU Users)</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Right to Access</div>
                        <div className="text-sm text-muted-foreground">View your submitted data</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Right to Rectification</div>
                        <div className="text-sm text-muted-foreground">Correct inaccurate information</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Right to Erasure</div>
                        <div className="text-sm text-muted-foreground">Delete your data completely</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Right to Portability</div>
                        <div className="text-sm text-muted-foreground">Export your data in standard format</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">How to Exercise Rights</h4>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                      <div className="font-medium text-sm mb-1">1. Use Your Tracking ID</div>
                      <div className="text-xs text-muted-foreground">
                        Most actions can be performed using your tracking ID
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                      <div className="font-medium text-sm mb-1">2. No Verification Needed</div>
                      <div className="text-xs text-muted-foreground">
                        Since data is anonymous, no identity verification required
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                      <div className="font-medium text-sm mb-1">3. Instant Processing</div>
                      <div className="text-xs text-muted-foreground">
                        Most requests are processed immediately
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Important Note</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Due to our zero-knowledge architecture, we cannot identify your data without your tracking ID.
                      If you lose your tracking ID, we cannot recover or delete your specific submissions.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Details Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle>Technical Implementation</CardTitle>
              <CardDescription>How we implement privacy protection at the technical level</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Zero-Knowledge Architecture</h4>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <strong>No User Accounts:</strong> No login system means no stored credentials or profile data
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <strong>Anonymous Tracking IDs:</strong> Random, non-sequential identifiers with no personal connection
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="text-sm">
                        <strong>Data Separation:</strong> No way to correlate submissions from the same user
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Encryption & Security</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                      <h5 className="font-medium text-green-700 dark:text-green-300 mb-2">Data at Rest</h5>
                      <ul className="text-sm space-y-1">
                        <li>• AES-256 encryption</li>
                        <li>• Encrypted database storage</li>
                        <li>• Regular key rotation</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
                      <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Data in Transit</h5>
                      <ul className="text-sm space-y-1">
                        <li>• TLS 1.3 encryption</li>
                        <li>• Certificate pinning</li>
                        <li>• HSTS enforcement</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">No Tracking Policy</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
                      <span className="text-sm">Google Analytics</span>
                      <Badge variant="destructive">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
                      <span className="text-sm">Third-party Cookies</span>
                      <Badge variant="destructive">Blocked</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950">
                      <span className="text-sm">Fingerprinting</span>
                      <Badge variant="destructive">Prevented</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                      <span className="text-sm">Session Storage Only</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Open Source Commitment</h4>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                    <p className="text-sm mb-3">
                      Our entire codebase is open source and available for public audit. This ensures
                      transparency and allows the community to verify our privacy claims.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href="https://github.com/flackattacker/peptitrace" target="_blank" rel="noopener noreferrer">
                        View Source Code on GitHub
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}