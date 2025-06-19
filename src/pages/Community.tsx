import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ThumbsUp, ThumbsDown, MessageSquare, Filter, Search, Trash2, Flag, FileText, AlertTriangle, Star } from "lucide-react"
import { getPublicExperiences, voteOnExperience, getUserVoteForExperience, deleteExperience, type Experience } from "@/api/experiences"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/contexts/AuthContext"

export function Community() {
  console.log('Community: Component starting to load')

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [filteredExperiences, setFilteredExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [userVotes, setUserVotes] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const { user } = useAuth()

  console.log('Community: Component state initialized')

  useEffect(() => {
    console.log('Community: useEffect triggered to fetch experiences')
    const fetchExperiences = async () => {
      try {
        console.log('Community: About to call getPublicExperiences()')
        const response = await getPublicExperiences() as any
        console.log('Community: getPublicExperiences response:', response)

        // Fix: The actual response structure is response.data.experiences
        if (response && response.data && response.data.experiences) {
          console.log('Community: Setting experiences from response.data.experiences:', response.data.experiences)
          setExperiences(response.data.experiences)
          setFilteredExperiences(response.data.experiences)
        } else if (response && response.experiences) {
          console.log('Community: Setting experiences from response.experiences:', response.experiences)
          setExperiences(response.experiences)
          setFilteredExperiences(response.experiences)
        } else if (Array.isArray(response)) {
          console.log('Community: Setting experiences from direct array:', response)
          setExperiences(response)
          setFilteredExperiences(response)
        } else {
          console.log('Community: No valid experiences data found in response')
          setExperiences([])
          setFilteredExperiences([])
        }
      } catch (error: any) {
        console.error('Community: Error fetching experiences:', error)
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        })
      } finally {
        console.log('Community: Setting loading to false')
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [toast])

  // Add filtering logic
  useEffect(() => {
    console.log('Community: Filter useEffect triggered with searchTerm:', searchTerm, 'selectedCategory:', selectedCategory, 'sortBy:', sortBy)
    
    let filtered = [...experiences]
    console.log('Community: Starting with', filtered.length, 'experiences')

    // Apply search filter
    if (searchTerm.trim()) {
      console.log('Community: Applying search filter for term:', searchTerm)
      filtered = filtered.filter(experience => 
        experience.peptideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experience.story?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        experience.effects?.some(effect => effect.toLowerCase().includes(searchTerm.toLowerCase())) ||
        experience.primaryPurpose?.some(purpose => purpose.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      console.log('Community: After search filter, experiences count:', filtered.length)
    }

    // Apply category filter (map UI categories to actual data)
    if (selectedCategory !== 'all') {
      console.log('Community: Applying category filter for:', selectedCategory)
      const categoryMappings: Record<string, string[]> = {
        'healing': ['recovery', 'injury healing', 'healing & recovery'],
        'performance': ['muscle gain', 'strength', 'performance', 'endurance'],
        'anti-aging': ['anti-aging', 'longevity'],
        'cognitive': ['cognitive enhancement', 'focus', 'memory']
      }
      
      const searchTerms = categoryMappings[selectedCategory] || [selectedCategory]
      filtered = filtered.filter(experience =>
        experience.primaryPurpose?.some(purpose => 
          searchTerms.some(term => purpose.toLowerCase().includes(term.toLowerCase()))
        )
      )
      console.log('Community: After category filter, experiences count:', filtered.length)
    }

    // Apply sorting
    console.log('Community: Applying sort by:', sortBy)
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case 'helpful':
        filtered.sort((a, b) => (b.votes?.helpful || 0) - (a.votes?.helpful || 0))
        break
      case 'rating':
        filtered.sort((a, b) => {
          const avgA = (a.outcomes.energy + a.outcomes.sleep + a.outcomes.mood + a.outcomes.performance + a.outcomes.recovery) / 5
          const avgB = (b.outcomes.energy + b.outcomes.sleep + b.outcomes.mood + b.outcomes.performance + b.outcomes.recovery) / 5
          return avgB - avgA
        })
        break
      default:
        break
    }

    console.log('Community: Final filtered experiences count:', filtered.length)
    setFilteredExperiences(filtered)
  }, [experiences, searchTerm, selectedCategory, sortBy])

  const handleSearchChange = (value: string) => {
    console.log('Community: Search term changed to:', value)
    setSearchTerm(value)
  }

  const handleCategoryChange = (value: string) => {
    console.log('Community: Category changed to:', value)
    setSelectedCategory(value)
  }

  const handleSortChange = (value: string) => {
    console.log('Community: Sort changed to:', value)
    setSortBy(value)
  }

  const handleClearFilters = () => {
    console.log('Community: Clearing all filters')
    setSearchTerm('')
    setSelectedCategory('all')
    setSortBy('newest')
  }

  const handleVote = async (experienceId: string, voteType: 'helpful' | 'not-helpful' | 'detailed' | 'concerning') => {
    try {
      console.log('Community: Attempting to vote', voteType, 'on experience:', experienceId)
      await voteOnExperience(experienceId, voteType)
      
      // Update local state to reflect the vote
      setUserVotes(prev => ({
        ...prev,
        [experienceId]: voteType
      }))

      // Refresh experiences to get updated vote counts
      const response = await getPublicExperiences() as any
      if (response && response.data && response.data.experiences) {
        setExperiences(response.data.experiences)
      }

      toast({
        title: "Vote Recorded",
        description: `Your ${voteType} vote has been recorded.`
      })
    } catch (error: any) {
      console.error('Community: Error voting on experience:', error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  console.log('Community: About to render, loading:', loading, 'experiences count:', experiences.length, 'filtered count:', filteredExperiences.length)

  if (loading) {
    console.log('Community: Rendering loading state')
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  console.log('Community: Rendering main community view')

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Community Experiences
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore real user experiences, share insights, and learn from the community
        </p>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search experiences</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by peptide, effect..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="healing">Healing & Recovery</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="anti-aging">Anti-Aging</SelectItem>
                  <SelectItem value="cognitive">Cognitive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="helpful">Most Helpful</SelectItem>
                  <SelectItem value="rating">Highest Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experiences List */}
      <div className="space-y-4">
        {filteredExperiences.map((experience) => (
          <Card key={experience._id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{experience.peptideName}</CardTitle>
                  <CardDescription className="mt-1">
                    {experience.dosage} • {experience.frequency} • {experience.duration} days
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{experience.route}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Outcomes Grid */}
              <div>
                <h4 className="font-medium mb-3">Outcomes (1-10 scale)</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {Object.entries(experience.outcomes).map(([effect, rating], index) => (
                    <div key={effect} className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{rating}</div>
                      <div className="text-sm text-muted-foreground">{effect}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Story */}
              {experience.story && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Experience Story</h4>
                    <p className="text-muted-foreground leading-relaxed">{experience.story}</p>
                  </div>
                </>
              )}

              {/* Vendor Information */}
              {experience.vendor && (experience.vendor.name || experience.vendor.quantity || experience.vendor.batchId) && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-medium mb-2">Vendor Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {experience.vendor.name && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Vendor:</span> {experience.vendor.name}
                        </div>
                      )}
                      {experience.vendor.quantity && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Quantity:</span> {experience.vendor.quantity}
                        </div>
                      )}
                      {experience.vendor.batchId && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Batch ID:</span> {experience.vendor.batchId}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              {/* Actions and Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(experience._id, 'helpful')}
                    className={`${userVotes[experience._id] === 'helpful' ? 'bg-green-100 text-green-700' : ''}`}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Helpful
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleVote(experience._id, 'not-helpful')}
                    className={`${userVotes[experience._id] === 'not-helpful' ? 'bg-red-100 text-red-700' : ''}`}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    Not Helpful
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{new Date(experience.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}