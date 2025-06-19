import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Search, Filter, Plus, Loader2, Trash2 } from "lucide-react"
import { getPeptides, deletePeptide, type Peptide } from "@/api/peptides"
import { useToast } from "@/hooks/useToast"
import { PeptideCreateForm } from "@/components/PeptideCreateForm"
import { useAuth } from "@/contexts/AuthContext"

const CATEGORIES = [
  "All Categories",
  "Healing & Recovery",
  "Growth Hormone",
  "Performance & Enhancement",
  "Anti-Aging",
  "Cognitive Enhancement"
]

const SORT_OPTIONS = [
  { value: "popularity", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "experiences", label: "Most Experiences" },
  { value: "name", label: "Alphabetical" }
]

export function Peptides() {
  const { isAuthenticated } = useAuth()
  const [peptides, setPeptides] = useState<Peptide[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingPeptideId, setDeletingPeptideId] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchPeptides()
  }, [])

  const fetchPeptides = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('Peptides component: fetchPeptides called')
      const response = await getPeptides()
      console.log('Peptides component: Response received:', response)
      
      if (response.success && response.data?.peptides) {
        console.log('Peptides component: Setting peptides, count:', response.data.peptides.length)
        console.log('Peptides component: First peptide:', response.data.peptides[0])
        
        // Check for any objects that might cause rendering issues
        response.data.peptides.forEach((peptide: any, index: number) => {
          Object.entries(peptide).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              console.log(`Peptides component: Found object in peptide ${index} (${peptide.name}) at key "${key}":`, value)
            }
          })
        })
        
        setPeptides(response.data.peptides)
      } else {
        console.error('Peptides component: Invalid response:', response)
        setError("Invalid response from server")
      }
    } catch (err: any) {
      console.error("Error fetching peptides:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load peptides",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateSuccess = () => {
    setShowCreateForm(false)
    fetchPeptides() // Refresh the list
    toast({
      title: "Success",
      description: "Peptide created successfully"
    })
  }

  const handleCreateCancel = () => {
    setShowCreateForm(false)
  }

  const handleDeletePeptide = async (peptideId: string, peptideName: string) => {
    setDeletingPeptideId(peptideId)
    await deletePeptide(peptideId)
    
    // Remove the peptide from the local state
    setPeptides(prevPeptides => prevPeptides.filter(p => p._id !== peptideId))
    
    toast({
      title: "Success",
      description: `${peptideName} has been deleted successfully`
    })
    
    console.log("Peptides component: Peptide deleted successfully:", peptideId)
  }

  // Filter and sort peptides
  const filteredPeptides = peptides
    .filter(peptide => {
      const matchesSearch = peptide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           peptide.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || peptide.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "rating":
          return (b.averageRating ?? 0) - (a.averageRating ?? 0)
        case "experiences":
          return (b.totalExperiences ?? 0) - (a.totalExperiences ?? 0)
        case "popularity":
          return ((b as any).popularity ?? 0) - ((a as any).popularity ?? 0)
        default:
          return 0
      }
    })

  console.log('Peptides component: Render - peptides count:', peptides.length)
  console.log('Peptides component: Render - filtered peptides count:', filteredPeptides.length)
  console.log('Peptides component: Render - loading:', loading)
  console.log('Peptides component: Render - error:', error)

  if (showCreateForm) {
    return (
      <PeptideCreateForm
        onSuccess={handleCreateSuccess}
        onCancel={handleCreateCancel}
      />
    )
  }

  // Show loading state while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading peptides...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Peptides</h1>
          <p className="text-muted-foreground mt-2">
            Explore our comprehensive database of peptides
          </p>
        </div>
        {isAuthenticated && (
          <Button onClick={() => {
            setShowCreateForm(true)
          }}>
            <Plus className="h-4 w-4 mr-2" />
            Create Peptide
          </Button>
        )}
      </div>

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

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <Tabs defaultValue="grid" className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList>
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-4 flex-1 sm:max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search peptides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Healing & Recovery">Healing & Recovery</SelectItem>
                <SelectItem value="Growth Hormone">Growth Hormone</SelectItem>
                <SelectItem value="Performance & Enhancement">Performance & Enhancement</SelectItem>
                <SelectItem value="Anti-Aging">Anti-Aging</SelectItem>
                <SelectItem value="Cognitive Enhancement">Cognitive Enhancement</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="experiences">Experiences</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="grid" className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading peptides...</span>
            </div>
          ) : filteredPeptides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No peptides found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPeptides.map((peptide) => {
                // Safety check to ensure all values are renderable
                const safePeptide = {
                  ...peptide,
                  name: String(peptide.name || ''),
                  category: String(peptide.category || ''),
                  description: String(peptide.description || ''),
                  commonDosage: String(peptide.commonDosage || ''),
                  averageRating: Number(peptide.averageRating || 0),
                  totalExperiences: Number(peptide.totalExperiences || 0),
                  commonFrequency: String((peptide as any).commonFrequency || ''),
                  commonEffects: Array.isArray(peptide.commonEffects) ? peptide.commonEffects : []
                }
                
                return (
                  <Card key={String(peptide._id)} className="hover:shadow-lg transition-shadow h-full">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Link to={`/peptides/${String(peptide._id)}`} className="flex-1">
                          <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                            {safePeptide.name}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-2">
                            {safePeptide.category}
                          </Badge>
                        </Link>
                        {isAuthenticated && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deletingPeptideId === String(peptide._id)}
                              >
                                {deletingPeptideId === String(peptide._id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Peptide</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{safePeptide.name}"? This action cannot be undone and will remove all associated data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeletePeptide(String(peptide._id), safePeptide.name)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                      <Link to={`/peptides/${String(peptide._id)}`}>
                        <CardDescription className="line-clamp-2">
                          {safePeptide.description}
                        </CardDescription>
                      </Link>
                    </CardHeader>
                    <Link to={`/peptides/${String(peptide._id)}`}>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rating:</span>
                            <span className="font-medium">{safePeptide.averageRating}/10</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Experiences:</span>
                            <span className="font-medium">{safePeptide.totalExperiences}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Dosage:</span>
                            <span className="font-medium">{safePeptide.commonDosage}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Frequency:</span>
                            <span className="font-medium">{safePeptide.commonFrequency}</span>
                          </div>
                        </div>

                        {safePeptide.commonEffects && safePeptide.commonEffects.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-2">Common Effects:</p>
                            <div className="flex flex-wrap gap-1">
                              {safePeptide.commonEffects.slice(0, 3).map((effect, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {String(effect)}
                                </Badge>
                              ))}
                              {safePeptide.commonEffects.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{safePeptide.commonEffects.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Link>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading peptides...</span>
            </div>
          ) : filteredPeptides.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No peptides found matching your criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPeptides.map((peptide) => {
                // Safety check to ensure all values are renderable
                const safePeptide = {
                  ...peptide,
                  name: String(peptide.name || ''),
                  category: String(peptide.category || ''),
                  description: String(peptide.description || ''),
                  commonDosage: String(peptide.commonDosage || ''),
                  averageRating: Number(peptide.averageRating || 0),
                  totalExperiences: Number(peptide.totalExperiences || 0),
                  commonFrequency: String((peptide as any).commonFrequency || ''),
                  commonEffects: Array.isArray(peptide.commonEffects) ? peptide.commonEffects : []
                }
                
                return (
                  <Card key={String(peptide._id)} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <Link to={`/peptides/${String(peptide._id)}`} className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold hover:text-blue-600 transition-colors">
                              {safePeptide.name}
                            </h3>
                            <Badge variant="secondary">{safePeptide.category}</Badge>
                          </div>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {safePeptide.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Rating: </span>
                              <span className="font-medium">{safePeptide.averageRating}/10</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Experiences: </span>
                              <span className="font-medium">{safePeptide.totalExperiences}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Dosage: </span>
                              <span className="font-medium">{safePeptide.commonDosage}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Frequency: </span>
                              <span className="font-medium">{safePeptide.commonFrequency}</span>
                            </div>
                          </div>

                          {safePeptide.commonEffects && safePeptide.commonEffects.length > 0 && (
                            <div className="mt-4">
                              <p className="text-sm text-muted-foreground mb-2">Common Effects:</p>
                              <div className="flex flex-wrap gap-1">
                                {safePeptide.commonEffects.slice(0, 5).map((effect, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {String(effect)}
                                  </Badge>
                                ))}
                                {safePeptide.commonEffects.length > 5 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{safePeptide.commonEffects.length - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}
                        </Link>
                        
                        {isAuthenticated && (
                          <div className="ml-4">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  disabled={deletingPeptideId === String(peptide._id)}
                                >
                                  {deletingPeptideId === String(peptide._id) ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Trash2 className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Peptide</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{safePeptide.name}"? This action cannot be undone and will remove all associated data.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePeptide(String(peptide._id), safePeptide.name)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}