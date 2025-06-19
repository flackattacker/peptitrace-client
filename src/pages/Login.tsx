import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  LogIn
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

type LoginForm = {
  email: string
  password: string
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  console.log("Login component rendering...");
  
  let login;
  try {
    const auth = useAuth();
    login = auth.login;
    console.log("AuthContext loaded successfully");
  } catch (error) {
    console.error("Error loading AuthContext:", error);
    return <div>Error loading authentication</div>;
  }
  
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    console.log("Login form submitted with data:", { email: data.email, password: "***" });
    try {
      setLoading(true)
      console.log("Calling login function...");
      await login(data.email, data.password);
      console.log("Login successful, showing toast and navigating");
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      navigate("/")
    } catch (error: any) {
      console.error("Login form error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("Form submit event triggered");
    e.preventDefault();
    console.log("Default prevented, calling handleSubmit");
    handleSubmit(onSubmit)(e);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", { required: true })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: true })}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
              onClick={(e) => {
                console.log("Button clicked");
                // Don't prevent default here, let the form handle it
              }}
            >
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            className="text-sm text-muted-foreground"
            onClick={() => navigate("/register")}
          >
            Don't have an account? Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}