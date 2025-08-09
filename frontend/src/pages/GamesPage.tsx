import DashboardLayout from "@/components/DashboardLayout";
import { BreathingGame } from "@/components/games/BreathingGame";

const GamesPage = () => {

  return (
    <DashboardLayout pageTitle="Stress Relief Games">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-wellness-green-dark mb-2">
            Mini-Games for Stress Relief
          </h2>
          <p className="text-gray-600">
            Take a break and reduce stress with this simple mindfulness game. 
            Playing this game can help improve your focus and emotional state.
          </p>
        </div>

        {/* Mood recommendation card hata diya gaya hai */}
        
        {/* Tabs system hata diya gaya hai, ab seedhe game component hai */}
        <BreathingGame onComplete={() => {}} />
        
      </div>
    </DashboardLayout>
  );
};

export default GamesPage;