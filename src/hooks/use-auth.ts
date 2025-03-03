import { useMutation, useQueryClient } from "@tanstack/react-query";

import { signIn, signUp, signOut } from "@/services/authService";

import { toast } from "./use-toast";

export const useSignin = () => {
  return useMutation({
    mutationFn: signIn,
    onSuccess: () =>
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      }),
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: () =>
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      }),
    onError: (error) =>
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      }),
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
