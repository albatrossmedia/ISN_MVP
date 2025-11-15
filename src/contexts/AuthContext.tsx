import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type {
  AuthContextType,
  AuthUser,
  UserRole,
  UserRoleData,
  FeatureAccess
} from '../types/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserRole(session.user.id, session.user.email || '');
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserRole(session.user.id, session.user.email || '');
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserRole = async (userId: string, email: string) => {
    try {
      const { data: roleData, error } = await supabase
        .from('user_roles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error loading user role:', error);
        setUser({
          id: userId,
          email,
          permissions: [],
        });
        return;
      }

      const { data: permissions } = await supabase
        .from('user_permissions')
        .select('resource, actions')
        .eq('user_role_id', roleData.id);

      const permissionsList = permissions?.flatMap(p =>
        p.actions.map((action: string) => `${p.resource}:${action}`)
      ) || [];

      setUser({
        id: userId,
        email,
        role: roleData as UserRoleData,
        permissions: permissionsList,
      });
    } catch (error) {
      console.error('Error loading user role:', error);
      setUser({
        id: userId,
        email,
        permissions: [],
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserRole(data.user.id, email);
        toast.success('Signed in successfully');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error.message || 'Failed to sign in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, organizationName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        let orgId = null;

        if (organizationName) {
          const slug = organizationName.toLowerCase().replace(/\s+/g, '-');
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .insert({
              name: organizationName,
              slug,
              plan: 'trial',
              quota_minutes: 100,
              status: 'trial',
            })
            .select()
            .single();

          if (orgError) {
            console.error('Error creating organization:', orgError);
          } else {
            orgId = orgData.id;
          }
        }

        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            organization_id: orgId,
            role: organizationName ? 'admin' : 'client_user',
            is_active: true,
          });

        if (roleError) {
          console.error('Error creating user role:', roleError);
        }

        toast.success('Account created successfully');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error.message || 'Failed to sign up');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error.message || 'Failed to sign out');
      throw error;
    }
  };

  const hasPermission = (resource: string, action: string = 'read'): boolean => {
    if (!user) return false;
    if (user.role?.role === 'super_admin') return true;

    return user.permissions.includes(`${resource}:${action}`);
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role?.role === role;
  };

  const isSuperAdmin = user?.role?.role === 'super_admin';
  const isAdmin = user?.role?.role === 'admin' || isSuperAdmin;
  const isClientUser = user?.role?.role === 'client_user';

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hasPermission,
    isRole,
    isSuperAdmin,
    isAdmin,
    isClientUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const getFeatureAccess = (user: AuthUser | null): FeatureAccess => {
  const isSuperAdmin = user?.role?.role === 'super_admin';
  const isAdmin = user?.role?.role === 'admin' || isSuperAdmin;
  const isClientUser = user?.role?.role === 'client_user';

  return {
    canViewDashboard: true,
    canManageModels: isAdmin,
    canManageDatasets: isAdmin,
    canRunWorkflows: true,
    canViewWorkflowHistory: true,
    canManageUsers: isAdmin,
    canManageOrganization: isAdmin,
    canViewBilling: true,
    canManageApiKeys: true,
    canViewSystemHealth: isAdmin,
    canViewAuditLogs: isAdmin,
    canAccessTraining: isAdmin,
    canAccessCompliance: isAdmin,
    canManageProviders: isSuperAdmin,
    canConfigureRouting: isSuperAdmin,
  };
};
