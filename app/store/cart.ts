import { create } from "zustand";
import { Product } from "../types/product";
import { createJSONStorage, persist } from "zustand/middleware";

export interface CartItem {
  cart: Product;
  quantity: number;
}

type CartState = {
  cart: CartItem[];
  cartHydrated: boolean;
  addCart: (product: CartItem) => void;
  removeProduct: (productId: number) => void;
  updateQuantity: (product: number, quantity: number) => void;
  clearCart: () => void;
  setCartHydrated: (state: boolean) => void;

};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      cartHydrated: false,
      setCartHydrated: (state) => set({ cartHydrated: state }),
      addCart: (product: CartItem) =>
        set((state) => {
          const existing = state.cart.find(
            (item) => item.cart.id === product.cart.id
          );
          let newCart;
          if (existing) {
            newCart = state.cart.map((item) =>
              item.cart.id === product.cart.id
                ? { ...item, quantity: item.quantity + product.quantity }
                : item
            );
          } else {
            newCart = [...state.cart, product];
          }

          return { cart: newCart };
        }),
      updateQuantity: (productId: number, quantity: number) =>
        set((state) => {
          const newCart = state.cart.map((item) => {
            return item.cart.id === productId
              ? { ...item, quantity: quantity }
              : item;
          });

          return { cart: newCart };
        }),
      removeProduct: (productId: number) =>
        set((state) => {
          const newCartList = state.cart.filter(
            (item) => item.cart.id !== productId
          );
          return { cart: newCartList };
        }),
      clearCart: () => {
        set({ cart: [] });
      },
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setCartHydrated(true); 
      },
    }
  )
);
