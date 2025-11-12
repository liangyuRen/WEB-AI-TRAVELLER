import React, { useState } from 'react';
import { travelService } from '../services/api';

export default function TravelPlanner() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(10000);
  const [people, setPeople] = useState(2);
  const [preferences, setPreferences] = useState('');
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await travelService.generatePlan(
        destination,
        days,
        budget,
        people,
        preferences
      );
      setPlan(result.data.data);
    } catch (error) {
      console.error('Error generating plan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Travel Planner</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <form onSubmit={handleGeneratePlan} className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Destination *
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Japan, Paris, Tokyo"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Number of Days: {days}
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Budget: ¥{budget}
                </label>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Number of Travelers: {people}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={people}
                onChange={(e) => setPeople(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Preferences (e.g., food, culture, adventure)
              </label>
              <textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="What are your interests?"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
                rows={3}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Generating Plan...' : 'Generate Travel Plan'}
            </button>
          </form>
        </div>

        {plan && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{destination} - {days} Days</h2>

            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Budget:</strong> ¥{plan.total_estimated_cost}
              </p>
              <p className="text-gray-700">
                <strong>Per Person:</strong> ¥{Math.round(plan.total_estimated_cost / people)}
              </p>
            </div>

            <div className="space-y-4">
              {plan.itinerary && plan.itinerary.map((day: any, index: number) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">Day {day.day}</h3>
                  <p className="text-gray-600"><strong>Accommodation:</strong> {day.accommodation}</p>
                  <p className="text-gray-600"><strong>Meals:</strong> {day.meals}</p>
                  <p className="text-gray-600"><strong>Estimated Cost:</strong> ¥{day.estimated_cost}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
