import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load initial data from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem('aakrithi_cart');
        const storedWishlist = localStorage.getItem('aakrithi_wishlist');
        const storedUser = localStorage.getItem('aakrithi_user');

        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
        if (storedUser) setUser(JSON.parse(storedUser));
        
        setLoading(false);
    }, []);

    // Sync cart to localStorage
    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('aakrithi_cart', JSON.stringify(newCart));
    };

    // Sync wishlist to localStorage
    const updateWishlist = (newWishlist) => {
        setWishlist(newWishlist);
        localStorage.setItem('aakrithi_wishlist', JSON.stringify(newWishlist));
    };

    const addToCart = (product, size = 'Free Size', redirect = null) => {
        const cartKey = `${product.id}_${size}`;
        const newCart = [...cart];
        const existingIndex = newCart.findIndex(item => item.cartKey === cartKey);

        if (existingIndex > -1) {
            newCart[existingIndex].quantity += 1;
        } else {
            newCart.push({
                cartKey,
                product_id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
                size: size,
                quantity: 1
            });
        }
        updateCart(newCart);
        
        if (redirect) {
            window.location.href = redirect;
        }
    };

    const removeFromCart = (cartKey) => {
        const newCart = cart.filter(item => item.cartKey !== cartKey);
        updateCart(newCart);
    };

    const updateCartQuantity = (cartKey, quantity) => {
        const newCart = cart.map(item => {
            if (item.cartKey === cartKey) {
                return { ...item, quantity: Math.max(1, quantity) };
            }
            return item;
        });
        updateCart(newCart);
    };

    const toggleWishlist = (product) => {
        const exists = wishlist.some(item => item.id === product.id);
        let newWishlist;
        if (exists) {
            newWishlist = wishlist.filter(item => item.id !== product.id);
        } else {
            newWishlist = [...wishlist, product];
        }
        updateWishlist(newWishlist);
    };

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('aakrithi_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('aakrithi_user');
        window.location.href = '/';
    };

    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const wishlistCount = wishlist.length;

    return (
        <AppContext.Provider value={{
            cart,
            wishlist,
            user,
            cartCount,
            wishlistCount,
            loading,
            addToCart,
            removeFromCart,
            updateCartQuantity,
            toggleWishlist,
            login,
            logout,
            updateCart
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
