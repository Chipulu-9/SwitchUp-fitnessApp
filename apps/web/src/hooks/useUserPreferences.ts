import { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './useAuth';

interface UserPreferences {
  weeklyGoal: number;
  calorieGoal: number;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  weeklyGoal: 3,
  calorieGoal: 0,
};

export function useUserPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
      return;
    }

    const fetchPreferences = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          const prefs = data.preferences || {};
          setPreferences({
            weeklyGoal: prefs.weeklyGoal ?? DEFAULT_PREFERENCES.weeklyGoal,
            calorieGoal: prefs.calorieGoal ?? DEFAULT_PREFERENCES.calorieGoal,
          });
        }
      } catch (error) {
        console.error('Failed to fetch user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  const updatePreferences = useCallback(
    async (newPrefs: Partial<UserPreferences>) => {
      if (!user) return;

      const updated = { ...preferences, ...newPrefs };
      setPreferences(updated);

      try {
        await updateDoc(doc(db, 'users', user.uid), {
          'preferences.weeklyGoal': updated.weeklyGoal,
          'preferences.calorieGoal': updated.calorieGoal,
          updatedAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error('Failed to update preferences:', error);
        // Revert on error
        setPreferences(preferences);
        throw error;
      }
    },
    [user, preferences]
  );

  return { preferences, loading: loading, updatePreferences };
}
