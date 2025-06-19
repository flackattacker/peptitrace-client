import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, TrendingUp, Users, Activity, ArrowRight, Star } from "lucide-react"
import { getPublicAnalytics } from "@/api/analytics"
import { getPublicPeptides } from "@/api/peptides"
import { getPublicExperiences } from "@/api/experiences"
import { useToast } from "@/hooks/useToast"
import { AxiosResponse } from "axios"

interface Experience {
  _id: string;
  peptideName: string;
  createdAt: string;
  story: string;
  dosage: string;
  outcomes: {
    energy: number;
    sleep: number;
    mood: number;
    performance: number;
    recovery: number;
  };
}

interface Peptide {
  _id: string;
  name: string;
  category: string;
  totalExperiences: number;
  averageRating: number;
}

interface AnalyticsData {
  totalExperiences: number;
  totalPeptides: number;
  averageRating: number;
  experienceGrowth?: number;
  categories?: number;
  activeUsers?: number;
  trendingCategories?: Array<{
    name: string;
    growth: number;
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export function Home() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [topPeptides, setTopPeptides] = useState<Peptide[]>([])
  const [recentExperiences, setRecentExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)
        console.log('Home: Starting to fetch data...')

        // Fetch analytics
        console.log('Home: Fetching analytics...')
        const analyticsResult = await getPublicAnalytics()
        console.log('Home: Analytics result:', analyticsResult)
        
        if (!analyticsResult?.success || !analyticsResult?.data) {
          throw new Error('Invalid analytics response')
        }
        
        setAnalytics(analyticsResult.data)

        // Fetch peptides
        console.log('Home: Fetching peptides...')
        const peptidesResult = await getPublicPeptides()
        console.log('Home: Peptides result:', peptidesResult)

        // Handle different response structures
        let peptides: Peptide[] = []
        if (peptidesResult?.data?.peptides) {
          peptides = peptidesResult.data.peptides
        } else if (Array.isArray(peptidesResult)) {
          peptides = peptidesResult
        } else if (peptidesResult?.peptides) {
          peptides = peptidesResult.peptides
        }

        // Sort peptides by totalExperiences and take top 6
        const sortedPeptides = [...peptides].sort((a, b) => 
          (b.totalExperiences || 0) - (a.totalExperiences || 0)
        ).slice(0, 6)

        console.log('Home: Setting top peptides:', sortedPeptides)
        setTopPeptides(sortedPeptides)

        // Fetch recent experiences
        console.log('Home: Fetching recent experiences...')
        const experiencesResult = await getPublicExperiences()
        console.log('Home: Experiences result:', experiencesResult)

        // Handle different response structures
        let experiences: Experience[] = []
        if (experiencesResult?.data?.experiences) {
          experiences = experiencesResult.data.experiences
        } else if (Array.isArray(experiencesResult)) {
          experiences = experiencesResult
        }

        // Sort experiences by date and take most recent 3
        const sortedExperiences = [...experiences]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)

        console.log('Home: Setting recent experiences:', sortedExperiences)
        setRecentExperiences(sortedExperiences)

        console.log('Home: Data fetching completed successfully')
      } catch (error: any) {
        console.error('Home: Error fetching data:', error)
        setError(error.message)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">PeptiTrace</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Anonymous peptide experience platform. Share your journey, explore community insights,
          and contribute to peptide research.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => navigate('/submit')}
          >
            Share Experience
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/explore')}
          >
            Explore Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experiences</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalExperiences || 0}</div>
            <p className="text-xs text-muted-foreground">
              +{analytics?.experienceGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peptides Tracked</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalPeptides || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across {analytics?.categories || 0} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageRating?.toFixed(1) || 0}/10</div>
            <p className="text-xs text-muted-foreground">
              Community satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics?.activeUsers || analytics?.totalExperiences || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="popular" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="popular">Popular Peptides</TabsTrigger>
          <TabsTrigger value="recent">Recent Experiences</TabsTrigger>
          <TabsTrigger value="insights">Community Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topPeptides.map((peptide) => (
              <Card key={peptide._id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/peptides/${peptide._id}`)}>
                <CardHeader>
                  <CardTitle>{peptide.name}</CardTitle>
                  <CardDescription>{peptide.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        {peptide.totalExperiences || 0} experiences
                      </p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {peptide.averageRating?.toFixed(1) || 0}/10
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{peptide.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentExperiences.map((experience) => (
              <Card key={experience._id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/experiences/${experience._id}`)}>
                <CardHeader>
                  <CardTitle>{experience.peptideName}</CardTitle>
                  <CardDescription>
                    {new Date(experience.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm line-clamp-2">{experience.story}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">
                          {((experience.outcomes.energy + 
                            experience.outcomes.sleep + 
                            experience.outcomes.mood + 
                            experience.outcomes.performance + 
                            experience.outcomes.recovery) / 5).toFixed(1)}/5
                        </span>
                      </div>
                      <Badge variant="secondary">{experience.dosage}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Insights</CardTitle>
              <CardDescription>Key trends and patterns from the community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Most Popular Categories</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on experience submissions
                    </p>
                  </div>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  {analytics?.trendingCategories?.map((category) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <span className="text-sm">{category.name}</span>
                      <span className="text-sm font-medium">+{category.growth}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}