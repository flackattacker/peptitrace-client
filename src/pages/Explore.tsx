import React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, LineChart, PieChart, TrendingUp, Users, Filter, Download, Calendar } from "lucide-react"
import { getPublicAnalytics, comparePeptides, getPeptideTrends, type AnalyticsData, type PeptideTrends } from "@/api/analytics"
import { getPublicPeptides, type Peptide } from "@/api/peptides"
import { useToast } from "@/hooks/useToast"

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Explore ErrorBoundary caught error:', error);
    console.error('Explore ErrorBoundary error info:', errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return <div>Something went wrong: {this.state.error?.message}</div>;
    }
    return this.props.children;
  }
}

export function Explore() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [trends, setTrends] = useState<PeptideTrends | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeptides, setSelectedPeptides] = useState<string[]>([])
  const [comparisonData, setComparisonData] = useState<any>(null)
  const [trendsPeriod, setTrendsPeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly')
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Explore: useEffect fetchData started');
        console.log('Explore: About to make API calls');

        // Only fetch public data - trends require authentication
        const [analyticsResult, peptidesResult] = await Promise.all([
          getPublicAnalytics(),
          getPublicPeptides()
        ]);

        console.log('Explore: Public API calls completed');
        console.log('Explore: analyticsResult:', analyticsResult);
        console.log('Explore: peptidesResult:', peptidesResult);

        // Handle analytics data
        if (analyticsResult?.data) {
          console.log('Explore: Setting analytics data:', analyticsResult.data);
          setAnalytics(analyticsResult.data);
        }

        // Handle peptides data
        let finalPeptides: Peptide[] = [];
        if (peptidesResult?.data?.peptides) {
          finalPeptides = peptidesResult.data.peptides;
        } else if (peptidesResult?.peptides) {
          finalPeptides = peptidesResult.peptides;
        } else if (Array.isArray(peptidesResult)) {
          finalPeptides = peptidesResult;
        }
        console.log('Explore: Setting peptides data:', finalPeptides);
        setPeptides(finalPeptides);

        // Note: Trends data requires authentication, so we skip it for public pages
        console.log('Explore: Skipping trends data (requires authentication)');

        console.log('Explore: All state updates completed');

      } catch (error: any) {
        console.error('Explore: Error in fetchData:', error);
        console.error('Explore: Error stack:', error.stack);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        console.log('Explore: Setting loading to false');
        setLoading(false);
      }
    };

    fetchData();
  }, [toast])

  const handleCompare = async () => {
    if (selectedPeptides.length < 2) {
      toast({
        title: "Select Peptides",
        description: "Please select at least 2 peptides to compare",
        variant: "destructive"
      })
      return
    }

    // Note: Comparison requires authentication
    toast({
      title: "Authentication Required",
      description: "Peptide comparison requires authentication. Please log in to compare peptides.",
      variant: "default"
    })
  }

  const handleTrendsPeriodChange = async (newPeriod: 'daily' | 'weekly' | 'monthly') => {
    try {
      setTrendsPeriod(newPeriod)
      // Note: Trends data requires authentication, so we show a message instead
      toast({
        title: "Authentication Required",
        description: "Trends data requires authentication. Please log in to view detailed trends.",
        variant: "default"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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

  return (
    <ErrorBoundary>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Data Explorer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore aggregated peptide experiences and discover insights from the community
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {analytics?.totalExperiences?.toLocaleString() || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Experiences</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
            <CardContent className="p-6 text-center">
              <BarChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {analytics?.totalPeptides || 0}
              </div>
              <div className="text-sm text-muted-foreground">Peptides Tracked</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {analytics?.averageRating?.toFixed(1) || 0}/10
              </div>
              <div className="text-sm text-muted-foreground">Avg Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
            <CardContent className="p-6 text-center">
              <LineChart className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                {analytics?.activeUsers || analytics?.totalExperiences || 0}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="peptides">Top Peptides</TabsTrigger>
            <TabsTrigger value="trends">Usage Trends</TabsTrigger>
            <TabsTrigger value="growth">Growth Trends</TabsTrigger>
            <TabsTrigger value="compare">Compare</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Peptides Chart */}
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
                <CardHeader>
                  <CardTitle>Most Popular Peptides</CardTitle>
                  <CardDescription>Based on number of experiences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.topPeptides && Array.isArray(analytics.topPeptides) ? (
                      analytics.topPeptides.map((peptide, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{peptide.name}</div>
                              <div className="text-sm text-muted-foreground">
                                ★ {peptide.rating ? peptide.rating.toFixed(1) : 'N/A'}/10
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{peptide.experiences}</div>
                            <div className="text-sm text-muted-foreground">experiences</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No top peptides data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Effectiveness Distribution */}
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
                <CardHeader>
                  <CardTitle>Effectiveness Ratings</CardTitle>
                  <CardDescription>Average effectiveness by peptide</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics?.effectivenessData && Array.isArray(analytics.effectivenessData) ? (
                      analytics.effectivenessData.map((item) => {
                        const effectivenessValues = Object.values(item.effectiveness);
                        const averageEffectiveness = effectivenessValues.reduce((a, b) => a + b, 0) / effectivenessValues.length;
                        return (
                          <div key={item.peptide} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{item.peptide}</span>
                              <span>{averageEffectiveness.toFixed(1)}/10 ({item.experiences} experiences)</span>
                            </div>
                            <Progress value={(averageEffectiveness / 10) * 100} className="h-2" />
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center text-muted-foreground">
                        No effectiveness data available
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Top Peptides Tab */}
          <TabsContent value="peptides" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle>Top Performing Peptides</CardTitle>
                <CardDescription>Peptides with the highest ratings and most experiences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.topPeptides && Array.isArray(analytics.topPeptides) && analytics.topPeptides.length > 0 ? (
                    analytics.topPeptides.map((peptide, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold text-lg">{peptide.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {peptide.experiences} experiences
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">
                            ★ {peptide.rating ? peptide.rating.toFixed(1) : 'N/A'}
                          </div>
                          <div className="text-sm text-muted-foreground">Average Rating</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No top peptides data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Usage Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Peptide usage patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Detailed usage trends require authentication. Please log in to view comprehensive trend analysis.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/login'}>
                    Sign In to View Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Trends Tab */}
          <TabsContent value="growth" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle>Growth Trends</CardTitle>
                <CardDescription>Community growth and engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Growth trend analysis requires authentication. Please log in to view detailed growth metrics.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/login'}>
                    Sign In to View Growth Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compare Tab */}
          <TabsContent value="compare" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-slate-900/70">
              <CardHeader>
                <CardTitle>Peptide Comparison Tool</CardTitle>
                <CardDescription>Compare up to 3 peptides side by side</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center py-8">
                  <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
                  <p className="text-muted-foreground mb-4">
                    Peptide comparison requires authentication. Please log in to access the comparison tool.
                  </p>
                  <Button variant="outline" onClick={() => window.location.href = '/login'}>
                    Sign In to Compare Peptides
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ErrorBoundary>
  )
}