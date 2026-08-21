import React, { createContext, useState, useCallback, type ReactNode, useContext } from 'react';

// Using the same Product type as in home-mod.tsx
export type Product = {
    id: number | string;
    name: string;
    price: number;
    originalPrice?: number | null;
    tag?: string;
    tagColor?: string;
    category?: string;
    image?: string;
    description?: string;
    // Add any other properties your backend returns
    currency?: string;
};

export interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number | string) => void;
    updateQuantity: (id: number | string, delta: number) => void;
    cartCount: number;
    cartTotal: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const addToCart = useCallback((product: Product) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.id === product.id);
            if (existingItem) {
                return prevItems.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevItems, { ...product, quantity: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id: number | string) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }, []);

    const updateQuantity = useCallback((id: number | string, delta: number) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === id) {
                    const newQty = item.quantity + delta;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            })
        );
    }, []);

    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                cartCount,
                cartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
