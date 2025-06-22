// app/setup/page.tsx
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  User, 
  Check, 
  X, 
  Loader2, 
  ArrowRight, 
  Globe,
  Star,
  Zap
} from 'lucide-react'

interface UsernameValidation {
  isValid: boolean
  isAvailable: boolean | null
  isChecking: boolean
  errors: string[]
}

interface QueryParams {
  isNewProfile: boolean
}

const RESERVED_USERNAMES = [
  'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'root', 'support',
  'help', 'info', 'blog', 'news', 'shop', 'store', 'app', 'mobile',
  'dashboard', 'profile', 'settings', 'login', 'register', 'signup',
  'signin', 'auth', 'oauth', 'callback', 'webhook', 'analytics',
  'about', 'contact', 'privacy', 'terms', 'legal', 'dmca'
]

export default function UsernameSetup() {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [validation, setValidation] = useState<UsernameValidation>({
    isValid: false,
    isAvailable: null,
    isChecking: false,
    errors: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const isNewProfile = searchParams.get('isNewProfile')
  const supabase = createClientComponentClient()

  useEffect(() => {
    if(!isNewProfile)
      checkIfUserNeedsSetup()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        validateUsername(username)
      } else {
        setValidation({
          isValid: false,
          isAvailable: null,
          isChecking: false,
          errors: []
        })
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [username])

  const checkIfUserNeedsSetup = async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('checkIfUserNeedsSetup: No user found, redirecting to login.');
        if (authError) {
          console.error('checkIfUserNeedsSetup: Auth error:', authError);
        }
        router.push('/login');
        return;
      }

      console.log(`checkIfUserNeedsSetup: Checking profile for user ID: ${user.id}`);

      // First, let's see what a direct query without .single() returns
      const { data: profilesData, error: profilesQueryError } = await supabase
        .from('profiles')
        .select('username, id') // select id as well for clarity
        .eq('id', user.id);

      console.log('checkIfUserNeedsSetup: Raw profiles query result (without .single()):', { profilesData, profilesQueryError });

      if (profilesQueryError) {
        console.error('Error fetching profiles (without .single()):', profilesQueryError);
        toast.error('Failed to check profile status. Please try again.');
        return;
      }

      if (profilesData && profilesData.length > 1) {
        console.warn(`WARNING: Multiple profiles found for user ID ${user.id} when querying without .single(). Data:`, profilesData);
        // This is the condition that would cause .single() to throw a 406.
        // The user needs to clean this up in their database.
        toast.error('Multiple profile entries found for your user ID. This is a data issue.');
        // At this point, the .single() call below will likely fail with 406.
      }

      // Now, attempt the .single() call as originally intended
      const { data: profile, error: singleError } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      console.log('checkIfUserNeedsSetup: Profile data (with .single()):', { profile, singleError });

      if (singleError && singleError.code !== 'PGRST116') { // PGRST116: "Query returned no rows" - this is acceptable for .single()
        console.error('Error fetching profile with .single():', singleError);
        // If profilesData.length > 1 from above, this singleError is expected to be the 406.
        toast.error(`Error verifying profile setup: ${singleError.message}`);
        return;
      }

      if (profile?.username) {
        console.log(`checkIfUserNeedsSetup: User ${user.id} has username "${profile.username}", redirecting to dashboard.`);
        router.push('/dashboard');
      } else {
        console.log(`checkIfUserNeedsSetup: User ${user.id} needs setup (no username or no profile found with .single()).`);
        // Stays on setup page, which is correct if no profile or no username in profile
      }
    } catch (error) {
      console.error('Critical error in checkIfUserNeedsSetup function:', error);
      toast.error('An unexpected error occurred while checking your setup status.');
    }
  };

  const validateUsername = async (usernameToCheck: string) => {
    setValidation(prev => ({ ...prev, isChecking: true }))
    const errors: string[] = []
    let isValid = true
    let isAvailable = null

    // Basic validations
    if (usernameToCheck.length < 3) {
      errors.push('Username must be at least 3 characters long')
      isValid = false
    } else if (usernameToCheck.length > 30) {
      errors.push('Username must be less than 30 characters long')
      isValid = false
    }

    // Character validation
    const validPattern = /^[a-zA-Z0-9_-]+$/
    if (!validPattern.test(usernameToCheck)) {
      errors.push('Username can only contain letters, numbers, hyphens, and underscores')
      isValid = false
    }

    // Start/end validation and reserved username check
    if (usernameToCheck.startsWith('-') || usernameToCheck.endsWith('-') ||
        usernameToCheck.startsWith('_') || usernameToCheck.endsWith('_')) {
      errors.push('Username cannot start or end with hyphens or underscores')
      isValid = false
    }

    if (RESERVED_USERNAMES.includes(usernameToCheck.toLowerCase())) {
      errors.push('This username is reserved and cannot be used')
      isValid = false
    }

    // Check availability if format is valid
    if (isValid) {
      try {
        // Get all usernames that match (case insensitive)
        const { data: existingUsers, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', usernameToCheck.toLowerCase());

        if (error) {
          console.error('Error checking username:', error);
          throw error;
        }

        // Check if any usernames match (case insensitive)
        if (existingUsers && existingUsers.length > 0) {
          console.log('Found existing usernames:', existingUsers);
          isAvailable = false;
          errors.push('This username is already taken');
          isValid = false;
        } else {
          // Double check with direct comparison
          const { data: exactMatch } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', usernameToCheck);

          if (exactMatch && exactMatch.length > 0) {
            isAvailable = false;
            errors.push('This username is already taken');
            isValid = false;
          } else {
            isAvailable = true;
          }
        }

        console.log('Username availability check:', {
          username: usernameToCheck,
          exists: !isAvailable,
          matchedUsers: existingUsers
        });
      } catch (error) {
        console.error('Error checking username:', error);
        errors.push('Unable to verify username availability')
        isValid = false
        isAvailable = null
      }
    }

    setValidation({
      isValid,
      isAvailable,
      isChecking: false,
      errors
    })
  }

  const handleSubmit = async () => {
    if (!validation.isValid || !username) return

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Use upsert to either insert a new profile or update an existing one.
      // The 'id' field in the payload will be used as the conflict target by default if it's the primary key.
      
      if(!isNewProfile){
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id, // Ensure user.id is part of the object for insert/conflict resolution
            username: username.toLowerCase(),
            display_name: displayName || null,
            created_at: new Date().toISOString(), // Use ISO string for consistency
            // created_at should ideally be handled by a database default value (e.g., DEFAULT now())
          })
          .select() // Optionally, select the data to confirm and potentially use it


        if (error) throw error

        toast.success('Profile setup complete!')
        router.push('/dashboard') // Redirect immediately after successful setup
      }
      else{
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: user.id, // Ensure user.id is part of the object for insert/conflict resolution
            username: username.toLowerCase(),
            display_name: displayName || null,
            created_at: new Date().toISOString(), // Use ISO string for consistency
            // created_at should ideally be handled by a database default value (e.g., DEFAULT now())
          })
          .select() // Optionally, select the data to confirm and potentially use it

        if (error) throw error

        toast.success('Profile setup complete!')
        router.push('/dashboard') // Redirect immediately after successful setup
      }
    } catch (error) {
      console.error('Error setting up profile:', error)
      toast.error('Failed to setup profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUsernameChange = (value: string) => {
    const sanitized = value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '')
    setUsername(sanitized)
  }

  const generateSuggestions = () => {
    const base = displayName ? displayName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '') : 'user'
    const suggestions = [
      `${base}${Math.floor(Math.random() * 100)}`,
      `${base}_official`,
      `${base}${new Date().getFullYear()}`,
      `the_${base}`,
      `${base}_dev`
    ]
    return suggestions.slice(0, 3)
  }

  const getValidationIcon = () => {
    if (validation.isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    } else if (validation.isValid) {
      return <Check className="h-4 w-4 text-green-500" />
    } else if (username && validation.errors.length > 0) {
      return <X className="h-4 w-4 text-red-500" />
    }
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 flex items-center">
          <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="h-8 w-8 text-gray-600" />
          </div>
          <div className="px-5">
            <h1 className="text-3xl font-bold mb-1 text-start">{isNewProfile ? 'Profile Setup' : 'Complete Your Profile'}</h1>
            <p className="text-secondary-600">Choose your unique username to get started</p>
          </div>
        </div>

        <Progress value={step === 1 ? 50 : 100} className="mb-6" />

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2">
              {step === 1 ? (
                <>
                  <Globe className="h-5 w-5" />
                  Choose Your Username
                </>
              ) : (
                <>
                  <Star className="h-5 w-5" />
                  Almost Done!
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {step === 1 ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Username
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                      {process.env.NEXT_PUBLIC_BASE_URL}/
                    </div>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      placeholder="yourusername"
                      className="pl-28 pr-10"
                      maxLength={30}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {getValidationIcon()}
                    </div>
                  </div>
                  
                  {validation.errors.length > 0 && (
                    <Alert variant="destructive" className="mt-2">
                      <X className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc list-inside space-y-1">
                          {validation.errors.map((error, index) => (
                            <li key={index} className="text-sm">{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {validation.isValid && (
                    <Alert className="mt-2 border-green-200 bg-green-50">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-700">
                        Great! This username is available.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {username && !validation.isValid && !validation.isChecking && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">Try these suggestions:</p>
                    <div className="flex flex-wrap gap-2">
                      {generateSuggestions().map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setUsername(suggestion)}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-4">
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!validation.isValid}
                    className="w-full"
                    size="lg"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Your URL will be:</span>
                      <Badge variant="secondary" className="font-mono">
                        {process.env.NEXT_PUBLIC_BASE_URL}/{username}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName" className="text-sm font-medium">
                      Display Name (Optional)
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      maxLength={50}
                    />
                    <p className="text-xs text-gray-500">
                      This is how your name will appear on your profile
                    </p>
                  </div>

                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-indigo-900 mb-1">
                          You're all set!
                        </h4>
                        <p className="text-sm text-indigo-700">
                          Once you complete setup, you can start adding links and customizing your profile.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Setting up...
                      </>
                    ) : (
                      <>
                        Complete Setup
                        <Check className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Need help? <a href="#" className="text-indigo-600 hover:underline">Contact support</a>
          </p>
        </div>
      </div>
    </div>
  )
}