import { useState, useRef, forwardRef, useImperativeHandle } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Edit, BookOpen, Plus } from "lucide-react"

const STORY_PROMPTS = [
  "What motivated you to try this peptide?",
  "Describe your experience during the first week",
  "What changes did you notice over time?",
  "What would you tell someone considering this peptide?",
  "Any unexpected effects or surprises?"
]

interface StoryEditorProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  maxLength?: number
  minLength?: number
}

export interface StoryEditorRef {
  focus: () => void
  getCharacterCount: () => number
  getWordCount: () => number
}

export const StoryEditor = forwardRef<StoryEditorRef, StoryEditorProps>(({
  value = "",
  onChange,
  className = "",
  placeholder = "Share your detailed experience with this peptide...",
  maxLength = 5000,
  minLength = 100
}, ref) => {
  const [showPreview, setShowPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  console.log("StoryEditor: Rendering with value length:", value.length)

  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus()
    },
    getCharacterCount: () => value.length,
    getWordCount: () => value.trim() ? value.trim().split(/\s+/).length : 0
  }))

  const getCharacterCount = () => value.length
  const getWordCount = () => value.trim() ? value.trim().split(/\s+/).length : 0

  const insertPromptText = (prompt: string) => {
    console.log("StoryEditor: Inserting prompt:", prompt)
    const textarea = textareaRef.current
    if (!textarea) return

    const currentText = value
    const cursorPosition = textarea.selectionStart
    const textBefore = currentText.substring(0, cursorPosition)
    const textAfter = currentText.substring(cursorPosition)

    const promptText = `\n\n**${prompt}**\n\n`
    const newText = textBefore + promptText + textAfter

    onChange(newText)

    // Set cursor position after the inserted prompt
    setTimeout(() => {
      const newPosition = cursorPosition + promptText.length
      textarea.setSelectionRange(newPosition, newPosition)
      textarea.focus()
    }, 0)
  }

  const formatPreviewText = (text: string) => {
    // Simple markdown-like formatting for preview
    return text
      .split('\n')
      .map((line, index) => {
        // Bold text formatting
        const boldFormatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return `<p key="${index}">${boldFormatted}</p>`
      })
      .join('')
  }

  const getCharacterCountColor = () => {
    const count = getCharacterCount()
    if (count < minLength) return "text-orange-600"
    if (count > maxLength * 0.9) return "text-red-600"
    return "text-green-600"
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <Tabs value={showPreview ? "preview" : "write"} onValueChange={(value) => setShowPreview(value === "preview")}>
        <div className="flex items-center justify-between">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Write
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
          </TabsList>

          <div className={`text-sm font-medium ${getCharacterCountColor()}`}>
            {getCharacterCount()}/{maxLength} characters • {getWordCount()} words
          </div>
        </div>

        <TabsContent value="write" className="space-y-4">
          <div className="space-y-3">
            <Label className="text-sm font-medium text-muted-foreground">
              Writing Prompts - Click to insert into your story:
            </Label>
            <div className="flex flex-wrap gap-2">
              {STORY_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertPromptText(prompt)}
                  className="text-xs h-8 flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[300px] resize-y"
              maxLength={maxLength}
            />
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div>
                {getCharacterCount() < minLength && (
                  <span className="text-orange-600">
                    Recommended minimum: {minLength} characters ({minLength - getCharacterCount()} more needed)
                  </span>
                )}
                {getCharacterCount() >= minLength && getCharacterCount() <= maxLength && (
                  <span className="text-green-600">
                    Great length! Your story will be very helpful to the community.
                  </span>
                )}
                {getCharacterCount() > maxLength * 0.9 && (
                  <span className="text-red-600">
                    Approaching character limit
                  </span>
                )}
              </div>
              <div>
                Use **text** for bold formatting
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card className="border-dashed">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <Label className="text-base font-medium">Story Preview</Label>
              </div>
              
              {value.trim() ? (
                <div 
                  className="prose prose-sm max-w-none text-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatPreviewText(value) }}
                />
              ) : (
                <div className="text-muted-foreground italic text-center py-8">
                  Your story preview will appear here as you write...
                </div>
              )}
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Continue Writing
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {getCharacterCount() > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <Badge variant="outline" className="text-xs">
            {getWordCount()} words
          </Badge>
          <Badge variant="outline" className="text-xs">
            {Math.ceil(getWordCount() / 200)} min read
          </Badge>
          <span>
            {getCharacterCount() >= minLength ? "✓" : "○"} Recommended length
          </span>
        </div>
      )}
    </div>
  )
})

StoryEditor.displayName = "StoryEditor"