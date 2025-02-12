import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { signIn, signUp, signOut } from "@/services/authService";

export const useSignin = () => {
  return useMutation({
    mutationFn: signIn,
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signUp,
  });
};

export const useSignout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      queryClient.clear();
    },
  });
};
