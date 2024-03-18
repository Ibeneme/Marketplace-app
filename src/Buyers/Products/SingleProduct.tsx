// import React from 'react';
// import { useCartContext } from '../../Context/CartContext';
// import { Button, View, Text, FlatList } from 'react-native'

// const SampleComponent = () => {
//   const { addToCart, cart } = useCartContext(); // Destructure addToCart and cart from the context

//   const handleAddToCart = () => {
//     // Example item to add to cart
//     const itemToAdd = {
//       id: '1',
//       quantity: 1,
//       images: 'image-url',
//       price: 10,
//       description: 'Sample Item',
//       currency: 'USD',
//       sellerId: 'seller-1',
//       text: 'Sample Item',
//       groupedItems: [],
//       itemsToCheckout: [],
//       newItem: [],
//     };

//     // Call addToCart function with the itemToAdd
//     addToCart(itemToAdd);
//   };

//   return (
//     <View>
//       <Button title="Add to Cart" onPress={handleAddToCart} />
//       <View>
//         <Text>Cart Items</Text>
//         <FlatList
//           data={Array.from(cart.values()).flatMap((sellerItems) => sellerItems)}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View>
//               <Text>{item.text}</Text>
//               <Text>Price: {item.price}</Text>
//               <Text>Quantity: {item.quantity}</Text>
//             </View>
//           )}
//         />
//       </View>
//     </View>
//   );
// };

// export default SampleComponent;