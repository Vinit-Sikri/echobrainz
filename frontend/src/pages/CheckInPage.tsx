import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
// VoiceRecorder import hata diya gaya hai
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// Tabs imports ki ab zaroorat nahi hai
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
// Loader2 aur Send icons rakhe hain, Check icon hata diya hai
import { Loader2, Send } from "lucide-react";

// MoodAnalysis interface ki ab zaroorat nahi hai

const CheckInPage = () => {
  // Voice se related saari state hata di gayi hai
  const [moodScore, setMoodScore] = useState(5);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [textInput, setTextInput] = useState("");
  const [isSubmittingText, setIsSubmittingText] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Voice se related functions (handleAnalysisComplete, submitCheckIn) hata diye gaye hain

  // Submit manual text check-in
  const submitTextCheckIn = async () => {
    if (!textInput.trim()) {
      toast({
        title: "Text required",
        description: "Please enter some text about how you're feeling",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingText(true);
    
    try {
      // Is function mein ab AI text analysis aur check-in save, dono kaam hote hain
      await api.post('/mood/check-in', {
        moodScore: moodScore,
        energyLevel: energyLevel,
        method: 'text',
        text: textInput
      });
      
      toast({
        title: "Check-in recorded",
        description: "Your mood has been logged successfully. Check your recommendations!",
      });
      
      // Navigate to dashboard after successful check-in
      navigate('/dashboard'); // Changed from '/' to '/dashboard' for consistency
    } catch (error) {
      console.error('Error with text check-in:', error);
      toast({
        title: "Error",
        description: "Failed to save your mood check-in",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingText(false);
    }
  };

  // Helper functions (getMoodDescription, getEnergyDescription) same rahenge
  const getMoodDescription = (score: number) => {
    if (score <= 2) return "Feeling low";
    if (score <= 4) return "A bit down";
    if (score <= 6) return "Neutral";
    if (score <= 8) return "Pretty good";
    return "Excellent";
  };

  const getEnergyDescription = (level: number) => {
    if (level <= 2) return "Very low energy";
    if (level <= 4) return "Somewhat tired";
    if (level <= 6) return "Moderate energy";
    if (level <= 8) return "Energetic";
    return "Very high energy";
  };

  return (
    <DashboardLayout pageTitle="Daily Check-in">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">How are you feeling today?</CardTitle>
            <CardDescription>
              Share your emotions to track your mental well-being and get personalized recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Tabs system poora hata diya gaya hai. Ab seedhe Text Check-in form hai. */}
            <div className="pt-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Describe how you're feeling today
                </label>
                <Textarea
                  placeholder="Today I feel..."
                  className="h-32 resize-none"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Mood Score: {moodScore}/10
                    </label>
                    <span className="text-sm text-gray-500">
                      {getMoodDescription(moodScore)}
                    </span>
                  </div>
                  <Slider
                    value={[moodScore]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => setMoodScore(value[0])}
                  />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Energy Level: {energyLevel}/10
                    </label>
                    <span className="text-sm text-gray-500">
                      {getEnergyDescription(energyLevel)}
                    </span>
                  </div>
                  <Slider
                    value={[energyLevel]}
                    min={1}
                    max={10}
                    step={1}
                    onValue-change={(value) => setEnergyLevel(value[0])}
                  />
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={submitTextCheckIn}
                  disabled={isSubmittingText || !textInput.trim()}
                  className="bg-wellness-green hover:bg-wellness-green-dark text-white"
                >
                  {isSubmittingText ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Submit Check-in
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <p className="text-sm text-gray-500 text-center max-w-md">
              Your check-ins help us understand your emotional patterns and provide better recommendations for your well-being.
            </p>
          </CardFooter>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CheckInPage;