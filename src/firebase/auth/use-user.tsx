'use client';

import { useFirebase, type UserHookResult } from '@/firebase/provider';

/**
 * Hook specifically for accessing the authenticated user's state.
 * This provides the User object, loading status, and any auth errors.
 * @returns {UserHookResult} Object with user, isUserLoading, userError.
 */
export const useUser = (): UserHookResult => {
  const context = useFirebase();
  return { 
    user: context.user, 
    isUserLoading: context.isUserLoading, 
    userError: context.userError 
  };
};