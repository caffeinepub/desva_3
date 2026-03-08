import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CartItem, Order } from "../backend.d.ts";
import { useActor } from "./useActor";

export function useAccessoryPrices() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["accessoryPrices"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAccessoryPrices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useContactInfo() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["contactInfo"],
    queryFn: async () => {
      if (!actor)
        return {
          instagramHandle: "@desva.gifts",
          emailAddress: "desva.gifts@gmail.com",
        };
      return actor.getContactInfo();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCart(sessionId: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["cart", sessionId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCart(sessionId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart(sessionId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: CartItem) => {
      if (!actor) throw new Error("No actor");
      await actor.addToCart(sessionId, item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
    },
  });
}

export function useRemoveFromCart(sessionId: string) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (productId: string) => {
      if (!actor) throw new Error("No actor");
      await actor.removeItemFromCart(sessionId, productId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart", sessionId] });
    },
  });
}

export function useSubmitOrder() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (order: Order) => {
      if (!actor) throw new Error("No actor");
      await actor.submitOrder(order);
    },
  });
}

export function useUpdateAccessoryPrices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (prices: {
      earrings: bigint;
      pipeCleanerFramework: bigint;
      keychain: bigint;
      scrunchies: bigint;
      pipeCleanerBag: bigint;
    }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateAccessoryPrices(
        prices.earrings,
        prices.pipeCleanerFramework,
        prices.keychain,
        prices.scrunchies,
        prices.pipeCleanerBag,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accessoryPrices"] });
    },
  });
}

export function useUpdateContactInfo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      instagramHandle,
      emailAddress,
    }: { instagramHandle: string; emailAddress: string }) => {
      if (!actor) throw new Error("No actor");
      await actor.updateContactInfo(instagramHandle, emailAddress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactInfo"] });
    },
  });
}
