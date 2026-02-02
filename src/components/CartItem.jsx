import React, { useState } from 'react';
import { cartApi } from '../services/api';
import { useCart } from '../hooks/useCart';
import QuantitySpinner from './QuantitySpinner';
import { HiOutlineTrash } from 'react-icons/hi';

const formatCurrency = (number) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(number);

const CartItem = ({ item }) => {
  const { fetchCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [description, setDescription] = useState(item.description || ''); 
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateCart = async (newQuantity) => {
    setIsLoading(true);
    
    const descriptionToSend = description.trim() === '' ? ' ' : description;
    const payload = {
      quantity: newQuantity,
      description: descriptionToSend,
    };
    console.log("MENGIRIM UPDATE KE API:", payload); 

    try {
      await cartApi.put(`/${item.product_id}`, payload);
      console.log("UPDATE BERHASIL. Memuat ulang keranjang...");
      fetchCart({ showLoading: false }); 
    } catch (error) {
      console.error("GAGAL UPDATE ITEM:", error.response?.data || error.message);
      setQuantity(item.quantity); 
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveItem = async () => {
    setIsLoading(true);
    try {
      await cartApi.delete(`/${item.id}`);
      fetchCart({ showLoading: false }); 
    } catch (error) {
      console.error("Gagal hapus item:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (valueOrFn) => {
    
    setQuantity(prevQuantity => {
      
      const newValue = typeof valueOrFn === 'function' 
        ? valueOrFn(prevQuantity) 
        : valueOrFn;
      
      if (newValue !== prevQuantity) {
        
        if (newValue > 0) {
          handleUpdateCart(newValue); 
        } else {
          handleRemoveItem(); 
        }
      }
      
      return newValue;
    });
  };
  
  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };
  
  const handleDescriptionBlur = () => {
    if (description !== item.description) {
      handleUpdateCart(quantity); 
    }
  };

  return (
    <div className={`relative flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
      <img
        src={item.product_image || `https://placehold.co/100x100/E0F2E9/333333?text=${item.product_name.split(' ')[0]}`}
        alt={item.product_name}
        className="w-full md:w-24 h-32 md:h-24 object-cover rounded-md"
      />
      
      <div className="flex-1">
        <p className="text-xs text-gray-500">Penjual: {item.seller_name}</p>
        <h3 className="text-base font-semibold text-gray-900">{item.product_name}</h3>
        <p className="text-lg font-bold text-cyan-600 mt-1">{formatCurrency(item.price)}</p>
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          onBlur={handleDescriptionBlur} 
          placeholder="Catatan..."
          className="text-xs text-gray-600 mt-1 italic p-1 border rounded w-full md:w-3/4"
        />
      </div>

      <div className="flex justify-between md:justify-end items-center gap-4">
        <QuantitySpinner 
          quantity={quantity} 
          setQuantity={handleQuantityChange} 
          maxStock={99}
          minStock={0}
        />
        <button
          onClick={handleRemoveItem}
          className="text-gray-400 hover:text-red-500 transition-colors p-2"
          aria-label="Hapus item"
        >
          <HiOutlineTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;