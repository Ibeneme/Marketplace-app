import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: any;
  quantity: number;
  images: string;
  price: number;
  description: string;
  currency: string;
  seller: string;
  text: string;
  countryOfOrigin: string;
  logisticsStatus: string;
  // groupedItems: CartItem[];
  // itemsToCheckout: CartItem[];
  // newItem: [];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  decreaseQuantity: (itemId: string) => void;
  clearCart: () => void;
  totalUniqueItems: number;
  increaseQuantity: (itemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const addToCart = (item: CartItem) => {
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    const updatedCart =
      existingItemIndex !== -1
        ? [...cart]
        : [...cart, { ...item, quantity: 1 }];
    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += 1;
    }

    setCart(updatedCart);
  };

  const removeFromCart = (itemId: string) =>
    setCart((prevCart) =>
      prevCart.filter((cartItem) => cartItem.id !== itemId)
    );
  const updateQuantity = (itemId: string, operation: (q: number) => number) =>
    setCart((prevCart) =>
      prevCart.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: operation(cartItem.quantity) }
          : cartItem
      )
    );

  const increaseQuantity = (itemId: string) =>
    updateQuantity(itemId, (q) => q + 1);
  const decreaseQuantity = (itemId: string) =>
    updateQuantity(itemId, (q) => Math.max(0, q - 1));
  const clearCart = () => {
    setCart([]);
    setShowModal(false);
  };
  const totalUniqueItems: number = Array.from(
    new Set(cart.map((item) => item.id))
  ).length;

  const contextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,
    totalUniqueItems,
    increaseQuantity,
  };

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);

  if (!context)
    throw new Error("useCartContext must be used within a CartContextProvider");
  return context;
};

// import React, { createContext, useContext, useState } from "react";

// export interface CartItem {
//   id: string;
//   quantity: number;
//   images: string;
//   price: number;
//   currency: string;
//   sellerId: string;
//   sellerFirstName: string;
//   sellerLastName: string;
//   text: string;
//   groupedItems: CartItem[];
//   itemsToCheckout: CartItem[];
// }

// interface CartContextType {
//   cart: Map<string, CartItem[]>; // Use a Map to store items grouped by seller's ID
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (itemId: string, sellerId: string) => void;
//   decreaseQuantity: (itemId: string, sellerId: string) => void;
//   increaseQuantity: (itemId: string, sellerId: string) => void;
//   clearCart: () => void;
//   getCartItemsForSeller: (sellerId: string) => CartItem[] | undefined;
//   totalUniqueItems: number;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [cart, setCart] = useState<Map<string, CartItem[]>>(new Map());

//   const addToCart = (item: CartItem) => {
//     setCart((prevCart) => {
//       const updatedCart = new Map(prevCart);

//       if (!updatedCart.has(item.sellerId)) {
//         updatedCart.set(item.sellerId, []);
//       }

//       const sellerCart = updatedCart.get(item.sellerId)!;
//       const existingItemIndex = sellerCart.findIndex(
//         (cartItem) => cartItem.id === item.id
//       );

//       if (existingItemIndex !== -1) {
//         sellerCart[existingItemIndex].quantity += 1;
//       } else {
//         sellerCart.push({ ...item, quantity: 1 });
//       }

//       const updatedCartMap = new Map<string, CartItem[]>(updatedCart);

//       return updatedCartMap;
//     });
//   };

//   const removeFromCart = (itemId: string, sellerId: string) => {
//     setCart((prevCart) => {
//       const updatedCart = new Map(prevCart);
//       const sellerCart = updatedCart.get(sellerId);

//       if (sellerCart) {
//         const filteredCart = sellerCart.filter((item) => item.id !== itemId);
//         updatedCart.set(sellerId, filteredCart);
//       }

//       return updatedCart;
//     });
//   };

//   const updateQuantity = (
//     itemId: string,
//     sellerId: string,
//     operation: (q: number) => number
//   ) => {
//     setCart((prevCart) => {
//       const updatedCart = new Map(prevCart);
//       const sellerCart = updatedCart.get(sellerId);

//       if (sellerCart) {
//         const updatedItems = sellerCart.map((item) =>
//           item.id === itemId
//             ? { ...item, quantity: operation(item.quantity) }
//             : item
//         );
//         const filteredItems = updatedItems.filter((item) => item.quantity > 0);
//         updatedCart.set(sellerId, filteredItems);
//       }

//       return updatedCart;
//     });
//   };

//   const decreaseQuantity = (itemId: string, sellerId: string) =>
//     updateQuantity(itemId, sellerId, (q) => Math.max(0, q - 1));

//   const increaseQuantity = (itemId: string, sellerId: string) =>
//     updateQuantity(itemId, sellerId, (q) => q + 1);

//   const clearCart = () => {
//     setCart(new Map());
//   };

//   const getCartItemsForSeller = (sellerId: string) => {
//     return cart.get(sellerId);
//   };

//   const totalUniqueItems = Array.from(cart.values()).reduce(
//     (count, items) => count + items.length,
//     0
//   );

//   const contextValue: CartContextType = {
//     cart,
//     addToCart,
//     removeFromCart,
//     decreaseQuantity,
//     increaseQuantity,
//     clearCart,
//     getCartItemsForSeller,
//     totalUniqueItems,
//   };

//   return (
//     <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
//   );
// };

// export const useCartContext = () => {
//   const context = useContext(CartContext);

//   if (!context)
//     throw new Error("useCartContext must be used within a CartContextProvider");
//   return context;
// };
