import { useState } from 'react';
import { DogData, HealthPlan, AppScreen } from './types';
import { generateHealthEvents, getDogImageUrl } from './services/healthPlan';
import { generateDiagnosis } from './services/openai';
import LandingPage from './components/LandingPage';
import DogForm from './components/DogForm';
import LoadingScreen from './components/LoadingScreen';
import ResultsPage from './components/ResultsPage';
import SuccessPage from './components/SuccessPage';
import PrivacyPolicy from './components/PrivacyPolicy';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('landing');
  const [dogData, setDogData] = useState<DogData | null>(null);
  const [healthPlan, setHealthPlan] = useState<HealthPlan | null>(null);
  const [eventsAddedCount, setEventsAddedCount] = useState(0);

  async function handleFormSubmit(data: DogData) {
    setDogData(data);
    setScreen('loading');

    try {
      // Generate events (local, no API)
      const events = generateHealthEvents(data);

      // Fetch dog image and AI diagnosis in parallel
      const [imageUrl, diagnosis] = await Promise.all([
        getDogImageUrl(data.breed, data.size),
        generateDiagnosis(data),
      ]);

      setHealthPlan({ events, imageUrl, diagnosis });
    } catch (err) {
      console.error('Error building health plan:', err);

      // Fallback: still show results even if API calls fail
      const { generateFallbackDiagnosis } = await import('./services/openai');
      const events = generateHealthEvents(data);
      setHealthPlan({
        events,
        imageUrl: '',
        diagnosis: generateFallbackDiagnosis(data),
      });
    }

    setScreen('results');
  }

  function handleCalendarSuccess(count: number) {
    setEventsAddedCount(count);
    setScreen('success');
  }

  function handleRestart() {
    setDogData(null);
    setHealthPlan(null);
    setEventsAddedCount(0);
    setScreen('landing');
  }

  return (
    <div className="font-sans">
      {screen === 'landing' && (
        <LandingPage onStart={() => setScreen('form')} onPrivacy={() => setScreen('privacy')} />
      )}

      {screen === 'form' && (
        <DogForm initialData={dogData} onSubmit={handleFormSubmit} />
      )}

      {screen === 'loading' && (
        <LoadingScreen dogName={dogData?.name ?? ''} />
      )}

      {screen === 'results' && healthPlan && dogData && (
        <ResultsPage
          dog={dogData}
          plan={healthPlan}
          onCalendarSuccess={handleCalendarSuccess}
          onEditDog={() => setScreen('form')}
        />
      )}

      {screen === 'success' && dogData && (
        <SuccessPage
          dogName={dogData.name}
          eventsCount={eventsAddedCount}
          onRestart={handleRestart}
        />
      )}

      {screen === 'privacy' && (
        <PrivacyPolicy onBack={() => setScreen('landing')} />
      )}
    </div>
  );
}
