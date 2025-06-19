import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { ArrowLeft, Star, Users, TrendingUp, AlertTriangle, Info, ThumbsUp, Trash2, MessageSquare } from "lucide-react"
import { getPeptideDetail, deletePeptide, type PeptideDetail } from "@/api/peptides"
import { getExperiences, voteOnExperience, deleteExperience, getUserVoteForExperience, type Experience, type UserVote } from "@/api/experiences"
import { useToast } from "@/hooks/useToast"
import { useAuth } from "@/contexts/AuthContext"

export function PeptideDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [peptide, setPeptide] = useState<PeptideDetail | null>(null)
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [userVotes, setUserVotes] = useState<Record<string, UserVote>>({})
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deletingExperienceId, setDeletingExperienceId] = useState<string | null>(null)
  const [votingId, setVotingId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  console.log("PeptideDetail component: Starting render, id from params:", id)

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        console.log("PeptideDetail component: No ID provided")
        return
      }

      console.log("PeptideDetail component: Starting to fetch data for peptide ID:", id)

      try {
        console.log("PeptideDetail component: Calling getPeptideDetail with ID:", id)
        const peptideData = await getPeptideDetail(id)
        console.log("PeptideDetail component: getPeptideDetail response:", peptideData)
        console.log("PeptideDetail component: Response structure check:", {
          hasPeptide: !!(peptideData as any).peptide,
          hasData: !!(peptideData as any).data,
          hasDataPeptide: !!(peptideData as any).data?.peptide,
          success: (peptideData as any).success,
          fullResponse: peptideData
        })

        // Extract peptide data with better error handling
        let peptide = null
        if ((peptideData as any).data?.peptide) {
          peptide = (peptideData as any).data.peptide
          console.log("PeptideDetail component: Found peptide in data.peptide:", peptide)
        } else if ((peptideData as any).peptide) {
          peptide = (peptideData as any).peptide
          console.log("PeptideDetail component: Found peptide in peptide:", peptide)
        } else {
          console.error("PeptideDetail component: No peptide found in response structure")
          throw new Error("Invalid response structure - no peptide data found")
        }

        if (!peptide) {
          console.error("PeptideDetail component: Peptide is null after extraction")
          throw new Error("Peptide data is null")
        }

        console.log("PeptideDetail component: Setting peptide data:", peptide)
        setPeptide(peptide)

        console.log("PeptideDetail component: Calling getExperiences with peptideId:", id)
        const experiencesData = await getExperiences({ peptideId: id })
        console.log("PeptideDetail component: getExperiences response:", experiencesData)

        // Extract experiences data with better error handling
        let experiencesArray = []
        if ((experiencesData as any).data?.experiences) {
          experiencesArray = (experiencesData as any).data.experiences
        } else if ((experiencesData as any).experiences) {
          experiencesArray = (experiencesData as any).experiences
        } else {
          console.log("PeptideDetail component: No experiences found, using empty array")
          experiencesArray = []
        }

        console.log("PeptideDetail component: Setting experiences data:", experiencesArray)
        setExperiences(experiencesArray)

        // Fetch user votes for each experience if user is logged in
        if (user) {
          const votePromises = experiencesArray.map(async (exp: Experience) => {
            try {
              const userVote = await getUserVoteForExperience(exp._id)
              return { experienceId: exp._id, vote: userVote.data }
            } catch (error) {
              console.log(`No vote found for experience ${exp._id}`);
              return { experienceId: exp._id, vote: { hasVoted: false, voteType: null, voteId: null } }
            }
          })

          const voteResults = await Promise.all(votePromises)
          const votesMap: Record<string, UserVote> = {}
          voteResults.forEach(result => {
            votesMap[result.experienceId] = result.vote
          })
          setUserVotes(votesMap)
        }
      } catch (error: any) {
        console.error("PeptideDetail component: Error fetching data:", error)
        console.error("PeptideDetail component: Error details:", {
          message: error.message,
          response: error?.response?.data,
          status: error?.response?.status
        })
        toast({
          title: "Error",
          description: error.message || "Failed to load peptide details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
        console.log("PeptideDetail component: Finished fetching data")
      }
    }

    fetchData()
  }, [id, toast, user])

  const handleVote = async (experienceId: string, voteType: 'helpful' | 'not-helpful' | 'detailed' | 'concerning') => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote on experiences.",
        variant: "destructive",
        action: (
          <Button
            variant="outline"
            onClick={() => navigate('/login')}
            className="mt-2"
          >
            Log In
          </Button>
        )
      });
      return;
    }

    try {
      console.log("PeptideDetail: Voting on experience:", experienceId, "with type:", voteType)
      setVotingId(experienceId)

      const existingVote = userVotes[experienceId]

      if (existingVote?.hasVoted && existingVote.voteType === voteType) {
        toast({
          title: "Already Voted",
          description: "You have already marked this experience as " + voteType + ".",
        })
        return
      }

      const result = await voteOnExperience(experienceId, voteType)

      // Update local user votes state
      setUserVotes(prev => ({
        ...prev,
        [experienceId]: {
          hasVoted: true,
          voteType: voteType,
          voteId: result.data.vote._id
        }
      }))

      // Refresh experiences to get updated vote counts
      const experiencesData = await getExperiences({ peptideId: id })
      setExperiences(experiencesData.data.experiences)

      toast({
        title: "Vote Recorded",
        description: `Your ${voteType} vote has been recorded.`
      })
    } catch (error: any) {
      console.error("PeptideDetail: Error voting on experience:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setVotingId(null)
    }
  }

  const handleDeletePeptide = async () => {
    if (!id || !peptide) return

    console.log("PeptideDetail component: Delete initiated for peptide:", id, peptide.name)
    try {
      setDeleting(true)
      await deletePeptide(id)

      toast({
        title: "Success",
        description: peptide.name + " has been deleted successfully"
      })

      navigate('/peptides')

      console.log("PeptideDetail component: Peptide deleted successfully:", id)
    } catch (error: any) {
      console.error("PeptideDetail component: Error deleting peptide:", error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      setDeletingExperienceId(experienceId)
      await deleteExperience(experienceId)

      setExperiences(prev => prev.filter(exp => exp._id !== experienceId))

      toast({
        title: "Success",
        description: "Experience deleted successfully"
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setDeletingExperienceId(null)
    }
  }

  const canDeleteExperience = (experience: Experience) => {
    return user && experience.userId === user._id
  }

  const getVoteButtonStyle = (experienceId: string, voteType: 'helpful' | 'not-helpful' | 'detailed' | 'concerning') => {
    const userVote = userVotes[experienceId]
    const isCurrentVote = userVote?.hasVoted && userVote.voteType === voteType

    if (isCurrentVote) {
      switch (voteType) {
        case 'helpful':
          return "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300"
        case 'detailed':
          return "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
        case 'concerning':
          return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-300"
        default:
          return ""
      }
    }

    switch (voteType) {
      case 'helpful':
        return "text-green-600 hover:text-green-700"
      case 'detailed':
        return "text-blue-600 hover:text-blue-700"
      case 'concerning':
        return "text-red-600 hover:text-red-700"
      default:
        return ""
    }
  }

  console.log("PeptideDetail component: Current state - loading:", loading, "peptide:", peptide ? "exists" : "null")

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!peptide) {
    console.log("PeptideDetail component: Peptide is null, showing not found message")
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Peptide not found</h2>
        <Button asChild>
          <Link to="/peptides">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Peptides
          </Link>
        </Button>
      </div>
    )
  }

  console.log("PeptideDetail component: Rendering peptide details for:", peptide.name)

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{peptide.name}</h1>
          <Button asChild>
            <Link to="/peptides">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Peptides
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Important Safety Information</h2>
              <p className="text-yellow-700 mb-3">
                The information provided on this platform is for educational purposes only and should not be considered medical advice. Peptides are powerful compounds that can have significant effects on the body, and their use should be approached with caution.
              </p>
              <div className="text-yellow-700 space-y-1">
                <p className="font-medium">Before considering any peptide therapy:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Consult with a qualified healthcare professional</li>
                  <li>Discuss your medical history and current medications</li>
                  <li>Understand potential risks and side effects</li>
                  <li>Ensure proper dosing and administration</li>
                  <li>Monitor for adverse reactions</li>
                </ul>
              </div>
              <p className="text-yellow-700 mt-3">
                This platform aggregates user experiences and research data, but individual responses to peptides can vary significantly. Always prioritize your health and safety by seeking professional medical guidance before starting any peptide regimen.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>Key information about {peptide.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {peptide.commonEffects && peptide.commonEffects.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Common Effects</h3>
                      <div className="flex flex-wrap gap-2">
                        {peptide.commonEffects.map(effect => (
                          <Badge key={effect} variant="secondary">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {peptide.sideEffects && peptide.sideEffects.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Side Effects</h3>
                      <div className="flex flex-wrap gap-2">
                        {peptide.sideEffects.map(effect => (
                          <Badge key={effect} variant="secondary" className="bg-red-100 text-red-700">
                            {effect}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Popularity</h3>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Popularity Score</span>
                          <span>{peptide.popularity}%</span>
                        </div>
                        <Progress value={peptide.popularity} className="h-2" />
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      Based on {peptide.totalExperiences} experiences and recent activity
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiences">
            <Card>
              <CardHeader>
                <CardTitle>User Experiences</CardTitle>
                <CardDescription>Real experiences from users who have tried {peptide.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experiences.map(experience => (
                    <div key={experience._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        {experience.demographics && (
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span className="text-sm text-muted-foreground">
                              {experience.demographics.age} years old, {experience.demographics.gender}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span>{experience.rating}/5</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {experience.effects.map(effect => (
                            <Badge key={effect} variant="secondary" className="text-xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>

                        {experience.story && (
                          <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900 p-4 rounded-lg">
                            <p className="text-sm">{experience.story}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center gap-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(experience._id, 'helpful')}
                              className={getVoteButtonStyle(experience._id, 'helpful')}
                              disabled={votingId === experience._id}
                            >
                              {votingId === experience._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                              ) : (
                                <ThumbsUp className="h-4 w-4 mr-1" />
                              )}
                              Helpful ({experience.helpfulVotes})
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(experience._id, 'detailed')}
                              className={getVoteButtonStyle(experience._id, 'detailed')}
                              disabled={votingId === experience._id}
                            >
                              {votingId === experience._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                              ) : (
                                <MessageSquare className="h-4 w-4 mr-1" />
                              )}
                              Detailed
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVote(experience._id, 'concerning')}
                              className={getVoteButtonStyle(experience._id, 'concerning')}
                              disabled={votingId === experience._id}
                            >
                              {votingId === experience._id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-1"></div>
                              ) : (
                                <AlertTriangle className="h-4 w-4 mr-1" />
                              )}
                              Concerning
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {experience.totalVotes} total votes
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}