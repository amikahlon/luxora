import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCartItem, getCart, removeCartItem, updateCartItem } from "./api";

export const cartQueryKey = ["cart"];

export const useCartQuery = (enabled = true) =>
  useQuery({
    queryKey: cartQueryKey,
    queryFn: getCart,
    enabled,
  });

export const useAddCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
  });
};

export const useUpdateCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
  });
};

export const useRemoveCartItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: (cart) => {
      queryClient.setQueryData(cartQueryKey, cart);
    },
  });
};
