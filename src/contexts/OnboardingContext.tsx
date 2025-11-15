import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type {
  OnboardingContextType,
  UserOnboarding,
  UserPreferences,
  UserNotification,
  FeatureAnnouncement,
  OnboardingStep,
  ActivityType,
} from '../types/onboarding';
import toast from 'react-hot-toast';

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [onboarding, setOnboarding] = useState<UserOnboarding | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [announcements, setAnnouncements] = useState<FeatureAnnouncement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadOnboardingData();
      setupRealtimeSubscriptions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const setupRealtimeSubscriptions = () => {
    if (!user) return;

    const notificationsSub = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadNotifications();
        }
      )
      .subscribe();

    return () => {
      notificationsSub.unsubscribe();
    };
  };

  const loadOnboardingData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadOnboarding(),
        loadPreferences(),
        loadNotifications(),
        loadAnnouncements(),
      ]);
    } catch (error) {
      console.error('Error loading onboarding data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOnboarding = async () => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .select('*')
        .eq('user_id', user?.id || '')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setOnboarding(data);
    } catch (error) {
      console.error('Error loading onboarding:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id || '')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setPreferences(data);
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notifications')
        .select('*')
        .eq('user_id', user?.id || '')
        .eq('is_dismissed', false)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('feature_announcements')
        .select('*')
        .eq('is_active', true)
        .order('priority', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error loading announcements:', error);
    }
  };

  const startOnboarding = async () => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .upsert({
          user_id: user?.id,
          step: 'welcome',
          completed_steps: [],
          is_completed: false,
          skipped: false,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      setOnboarding(data);
      await logActivity('feature_used', { feature: 'onboarding_started' });
    } catch (error: any) {
      console.error('Error starting onboarding:', error);
      toast.error('Failed to start onboarding');
    }
  };

  const completeStep = async (step: OnboardingStep) => {
    if (!onboarding) return;

    try {
      const completedSteps = [...onboarding.completed_steps, step];
      const allSteps: OnboardingStep[] = [
        'welcome',
        'profile_setup',
        'demo_workflow',
        'api_key_setup',
        'first_workflow',
      ];
      const isCompleted = allSteps.every(s => completedSteps.includes(s));

      const { data, error } = await supabase
        .from('user_onboarding')
        .update({
          completed_steps: completedSteps,
          step: isCompleted ? 'complete' : step,
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq('user_id', user?.id || '')
        .select()
        .single();

      if (error) throw error;
      setOnboarding(data);

      if (isCompleted) {
        toast.success('Onboarding completed! 🎉');
        await logActivity('feature_used', { feature: 'onboarding_completed' });
      }
    } catch (error: any) {
      console.error('Error completing step:', error);
      toast.error('Failed to update progress');
    }
  };

  const skipOnboarding = async () => {
    try {
      const { data, error } = await supabase
        .from('user_onboarding')
        .update({
          skipped: true,
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('user_id', user?.id || '')
        .select()
        .single();

      if (error) throw error;
      setOnboarding(data);
      await logActivity('feature_used', { feature: 'onboarding_skipped' });
      toast.success('Onboarding skipped');
    } catch (error: any) {
      console.error('Error skipping onboarding:', error);
      toast.error('Failed to skip onboarding');
    }
  };

  const updatePreferences = async (prefs: Partial<UserPreferences>) => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .update(prefs)
        .eq('user_id', user?.id || '')
        .select()
        .single();

      if (error) throw error;
      setPreferences(data);
      toast.success('Preferences updated');
    } catch (error: any) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification read:', error);
    }
  };

  const dismissNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_notifications')
        .update({ is_dismissed: true })
        .eq('id', id);

      if (error) throw error;
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const logActivity = async (type: ActivityType, data: Record<string, any> = {}) => {
    try {
      await supabase.from('user_activity_log').insert({
        user_id: user?.id,
        activity_type: type,
        activity_data: data,
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const value: OnboardingContextType = {
    onboarding,
    preferences,
    notifications,
    announcements,
    loading,
    startOnboarding,
    completeStep,
    skipOnboarding,
    updatePreferences,
    markNotificationRead,
    dismissNotification,
    logActivity,
  };

  return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
};
