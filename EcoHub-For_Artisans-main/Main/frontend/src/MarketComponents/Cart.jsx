import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MarketNavBar } from './MarketNavBar';

export function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
    
      try {

        const userEmail = localStorage.getItem("email");
        console.log(userEmail)
        const response = await axios.get(`http://localhost:5001/getCartByEmail/`, { withCredentials: true });
        setCartItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate the total price, discount, etc. based on the cartItems
  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);
  const discount = cartItems.reduce((total, item) => {
    return total + (item.originalPrice - item.price);
  }, 0);

  const handleRemove = async (itemIndex) => {
  
    console.log(itemIndex)// Replace with the logged-in user's email
    try {
      const response = await axios.post(`http://localhost:5001/removeFromCart`, {
        
        itemIndex
      },{ withCredentials: true });
  
      if (response.status === 200) {
        // If the item is successfully removed from the backend, update the state
        setCartItems(prevItems => prevItems.filter((_, index) => index !== itemIndex));
      }
    } catch (error) {
      console.error("Error removing item from cart:", error.response ? error.response.data.msg : error.message);
    }
  };
  const checkoutHandler = async (amount) => {
  


    const { data: { key } } = await axios.get("http://www.localhost:5001/api/getkey")
    console.log("key of api -- ",key);

    const { data: { order } } = await axios.post("http://localhost:5001/api/checkout", {
        amount:totalPrice
    },{ withCredentials: true });
    console.log("order --  ",order);

    const options = {
        key,
        amount: order.amount,
        currency: "INR",
        name: "6 Pack Programmer",
        description: "Tutorial of RazorPay",
        image: "EcoHub\\EcoHub-For_Artisans-main\\Main\\frontend\\src\\assets\\avatar.jpg",
        order_id: order.id,
        callback_url: "http://localhost:5001/api/paymentverification",
        prefill: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "9999999999"
        },
        notes: {
            "address": "Razorpay Corporate Office"
        },
        theme: {
            "color": "#121212"
        }
    };
    const razor = new window.Razorpay(options);
    razor.open();
}


  // const handleCheckout = () => {
  //   navigate('/checkout');
  // };

  return (
    <>
    <MarketNavBar/>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-0"> {/* Added py-20 for vertical padding */}
      <div className="flex flex-col lg:flex-row gap-x-8 items-start lg:items-center"> {/* Added items-center for vertical centering */}
        {/* Cart Items */}
        <div className="flex-1">
          {cartItems.map((item, index) => (
            <div key={item._id} className="flex items-center py-6 border-b border-gray-200">
              <img src={item.image} alt={item.title} className="h-24 w-24 flex-shrink-0 rounded-md object-cover" />
              <div className="ml-6 flex flex-1 flex-col">
                <div className="flex justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item.title}
                  </h3>
                  <button onClick={() => handleRemove(index)} className="text-red-600 hover:text-red-900">
                      <Trash className="w-4 h-4" />
                    </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">Dimensions: {item.dimensions}</p>
                <div className="flex items-end justify-between">
                  <p className="mt-1 text-sm font-medium text-gray-900">₹{item.price}</p>
                  <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* Price Details */}
        <div className="w-full lg:w-1/4 bg-white p-4 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Price Details</h3>
          <div className="mt-4">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Price ({cartItems.length} items)</p>
              <p className="text-sm font-medium text-gray-900">₹{totalPrice}</p>
            </div>
            {/* Add Discount and Delivery charges details here if you have them */}
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <h4 className="text-base font-medium text-gray-900">Total Amount</h4>
                <p className="text-base font-medium text-gray-900">₹{totalPrice}</p>
              </div>
              <button amount={totalPrice} onClick={checkoutHandler} className="mt-6 w-full bg-[#617a4f] border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-[#617a4f]">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}  

