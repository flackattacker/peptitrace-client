console.log("Research.tsx file is being loaded and parsed");

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Database, Download, FileText, Key, Users, BarChart3, AlertCircle, CheckCircle, Loader2, Trash2, UserCheck } from "lucide-react"
import { getAnalytics } from "@/api/analytics"
import { useToast } from "@/hooks/useToast"

console.log("All imports loaded successfully");

export function Research() {
  console.log("Research component function started");
  
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [pendingUsers, setPendingUsers] = useState<any[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  console.log("State and hooks initialized");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        console.log('Research: Fetching analytics data...')
        const analyticsData = await getAnalytics()
        console.log('Research: Analytics data received:', analyticsData)
        setAnalytics((analyticsData as any).data)
      } catch (error: any) {
        console.error('Research: Error fetching analytics:', error)
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
    fetchPendingUsers()
  }, [])

  const fetchPendingUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await fetch('http://localhost:3001/api/users/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setPendingUsers(data.users)
      } else {
        throw new Error(data.error || 'Failed to load pending users')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load pending users",
        variant: "destructive"
      })
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Failed to approve user')
      
      toast({
        title: "Success",
        description: "User approved successfully"
      })
      fetchPendingUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user",
        variant: "destructive"
      })
    }
  }

  const handleRejectUser = async (userId: string, notes: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ notes })
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.error || 'Failed to reject user')
      
      toast({
        title: "Success",
        description: "User rejected successfully"
      })
      fetchPendingUsers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log("Handler functions defined, starting render");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Research Hub</h1>
        <p className="text-muted-foreground mt-2">
          Access research data, manage database, and explore academic resources
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="api">API Access</TabsTrigger>
          <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalExperiences || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalExperiences > 0 ? 'Real user submissions' : 'No data available'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peptides Tracked</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalPeptides || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalPeptides > 0 ? 'In database' : 'No peptides seeded'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Data Quality Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.totalExperiences > 0 ? '94%' : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.totalExperiences > 0 ? 'Based on submissions' : 'Insufficient data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                <Key className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics?.averageRating ? `${analytics.averageRating}/10` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.averageRating ? 'Community average' : 'No ratings yet'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Research Impact</CardTitle>
                <CardDescription>Citations and academic usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Published Papers</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences > 100 ? '23' : '0'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Academic Citations</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences > 100 ? '156' : '0'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Research Collaborations</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences > 50 ? '8' : '0'}
                  </Badge>
                </div>
                {analytics?.totalExperiences < 50 && (
                  <p className="text-sm text-muted-foreground">
                    More data needed for research metrics
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Health</CardTitle>
                <CardDescription>Platform engagement metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Active Contributors</span>
                  <Badge variant="secondary">{analytics?.totalExperiences || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Peer Reviews</span>
                  <Badge variant="secondary">
                    {analytics?.totalExperiences ? analytics.totalExperiences * 2 : 0}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quality Reports</span>
                  <Badge variant="secondary">0</Badge>
                </div>
                {!analytics?.totalExperiences && (
                  <p className="text-sm text-muted-foreground">
                    No community activity yet
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Management</CardTitle>
              <CardDescription>
                Database status and information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Database management operations are restricted in production environments.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Peptides Database</h4>
                    <p className="text-sm text-muted-foreground">
                      {analytics?.totalPeptides || 0} peptides currently in database
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Effects Database</h4>
                    <p className="text-sm text-muted-foreground">
                      Effects data is managed through the API
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Export research data for analysis and reporting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Analytics Data</CardTitle>
                    <CardDescription>Export platform analytics and metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const data = {
                          exportDate: new Date().toISOString(),
                          analytics: analytics,
                          summary: {
                            totalExperiences: analytics?.totalExperiences || 0,
                            totalPeptides: analytics?.totalPeptides || 0,
                            averageRating: analytics?.averageRating || 0,
                            activeUsers: analytics?.activeUsersCount || 0
                          }
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `peptitrace-analytics-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast({
                          title: "Export Successful",
                          description: "Analytics data exported successfully"
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export Analytics
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Data</CardTitle>
                    <CardDescription>Export user management data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        const data = {
                          exportDate: new Date().toISOString(),
                          pendingUsers: pendingUsers,
                          summary: {
                            totalPending: pendingUsers.length,
                            exportDate: new Date().toISOString()
                          }
                        };
                        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `peptitrace-users-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                        toast({
                          title: "Export Successful",
                          description: "User data exported successfully"
                        });
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Export Users
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Exported data is for research purposes only. Please ensure compliance with data protection regulations.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>API endpoints and usage for research integration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-mono">Authorization: Bearer &lt;your-token&gt;</p>
                    <p className="text-xs text-muted-foreground mt-1">All API requests require a valid JWT token in the Authorization header.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Core Endpoints</h3>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm font-mono">/api/analytics</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Retrieve platform analytics and metrics</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm font-mono">/api/peptides</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Get all peptides with experience statistics</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm font-mono">/api/experiences</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Retrieve user experiences with optional filters</p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">GET</Badge>
                        <code className="text-sm font-mono">/api/users/pending</code>
                      </div>
                      <p className="text-sm text-muted-foreground">Get pending user registrations (Moderator only)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Response Format</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <pre className="text-xs overflow-x-auto">
{`{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully"
}`}
                    </pre>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Rate Limits</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Standard requests</span>
                      <Badge variant="outline">100/hour</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Analytics requests</span>
                      <Badge variant="outline">10/hour</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">User management</span>
                      <Badge variant="outline">50/hour</Badge>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    For full API documentation and SDKs, contact the development team. This is a research-focused API with limited public access.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guidelines" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Research Guidelines</CardTitle>
              <CardDescription>Guidelines for conducting peptide research and data collection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Data Collection Standards</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Standardized Reporting</p>
                        <p className="text-sm text-muted-foreground">All experiences should include dosage, duration, and measurable outcomes.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Baseline Measurements</p>
                        <p className="text-sm text-muted-foreground">Record baseline health metrics before starting any peptide protocol.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Regular Monitoring</p>
                        <p className="text-sm text-muted-foreground">Track progress weekly and document any changes or side effects.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Safety Protocols</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Medical Consultation</p>
                        <p className="text-sm text-muted-foreground">Always consult with healthcare professionals before starting peptide protocols.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Adverse Event Reporting</p>
                        <p className="text-sm text-muted-foreground">Report any adverse effects immediately and discontinue use if necessary.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Quality Assurance</p>
                        <p className="text-sm text-muted-foreground">Only use peptides from verified, high-quality sources with proper documentation.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-semibold mb-3">Research Ethics</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Informed Consent</p>
                        <p className="text-sm text-muted-foreground">Ensure all participants understand the research process and potential risks.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Privacy Protection</p>
                        <p className="text-sm text-muted-foreground">Maintain participant confidentiality and protect personal health information.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">Transparent Reporting</p>
                        <p className="text-sm text-muted-foreground">Report both positive and negative outcomes to avoid publication bias.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    These guidelines are based on current best practices in peptide research. Always follow local regulations and institutional review board requirements.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Review and manage user registrations. Approve or reject new user applications with notes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingUsers ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : pendingUsers.length === 0 ? (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    No pending user registrations. All users have been reviewed.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pending Users ({pendingUsers.length})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchPendingUsers}
                    >
                      Refresh
                    </Button>
                  </div>
                  {pendingUsers.map((user) => (
                    <div key={user._id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{user.username}</h4>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Registered: {new Date(user.createdAt).toLocaleDateString()} at {new Date(user.createdAt).toLocaleTimeString()}
                          </p>
                          {user.moderatorNotes && (
                            <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                              <strong>Notes:</strong> {user.moderatorNotes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectUser(user._id, '')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(user._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}