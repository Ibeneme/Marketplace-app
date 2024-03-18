import React, { useState, useEffect, useContext } from "react";
import "./Checkout.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { ProtectedRoutes } from "../../components/utils/ProtectedRoutes";
import { axiosInstance } from "../../components/baseUrl";

import { useNavigate, useSearchParams } from "react-router-dom";
import { useFlutterwave } from "flutterwave-react-v3";

import EditShipping from "../../components/modal/EditShipping";
import SelectPaymentModal from "../../components/modal/SelectPaymentModal";
import CartItems from "./CartItems";
import UserDetails from "./UserDetails";
import ShippingDetails from "./ShippingDetails";
import PaymentMethod from "./PaymentMethod";
import CartPaymentSummary from "./CartPaymentSummary";
import { useEditUserProfile } from "../../components/hooks/useEditUserProfile";
import { convertPrice } from "../../components/helpers/convertPrice";
import { useUpdateProductQuantityInCart } from "../../components/hooks/useUpdateProductQuantityInCart";
import toast, { Toaster } from "react-hot-toast";
import { useRemoveProductFromCart } from "../../components/hooks/useRemoveProductFromCart";
import { GlobalContext } from "../../components/utils/GlobalState";
import { useEventTag } from "../../components/hooks/useEventTag";
import { useUpdateOrderStatus } from "../../components/hooks/useUpdateOrderStatus";
import { useDeleteBulkProductCart } from "../../components/hooks/useDeleteBulkProductCart";
import cookies from "js-cookie";
import { convertPriceForFlutterwaveConfig } from "../../components/helpers/convertPriceForFlutterwaveConfig";
import { useJsApiLoader } from "@react-google-maps/api";

const Checkout = () => {
  const { cartItems } = useContext(GlobalContext);

  const [searchParams] = useSearchParams();
  const logisticsStatus = searchParams.get("status") || "";

  const { qtyLoader } = useUpdateProductQuantityInCart();
  const { handleEventTag } = useEventTag();
  const { deleteLoader } = useRemoveProductFromCart();
  const { updateOrderStatus } = useUpdateOrderStatus();
  const { handleDelete } = useDeleteBulkProductCart();
  const {
    user,
    handleEditProfile,
    updateLoader,
    handleAddressChange,
    handleCountryChange,
    address,
    country,
    setAddress,
    userLoading,
    isChange,
    setIsChange,
  } = useEditUserProfile();

  const [selectedCurrenci, setSelectedCurrenci] = useState("");

  const selectedCurrency = cookies.get("currency") || "USD";

  const currentSelectedCurrency = selectedCurrenci || selectedCurrency;

  const navigate = useNavigate();

  const [paymentTerm, setPaymentTerm] = useState("");
  const [loader, setLoader] = useState(false);

  const [userDetails, setUserDetails] = useState({
    port: "",
    incoterm: "",
    shippingType: "",
  });

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const handlePlacesChanged = () => {
    // Access the Autocomplete instance using refs
    const autocomplete = autocompleteRef.current;

    if (autocomplete) {
      const places = autocomplete.getPlaces();
      if (places && places.length > 0) {
        const selectedPlace = places[0];
        setAddress(selectedPlace.formatted_address || "");
      }
    }
  };

  // Ref to hold the Autocomplete instance
  const autocompleteRef = React.useRef(null);

  const sellersDetails = cartItems?.cart?.map((obj) => {
    const { product } = obj;
    return {
      pickupName: `${product?.createdBy?.firstName} ${product?.createdBy?.LastName}`,
      pickupPhoneNumber:
        product?.createdBy?.phoneNumber && product?.createdBy?.phoneNumber,
      pickupAddress: product?.createdBy?.address && product?.createdBy?.address,
    };
  });

  const options = {
    label: "Click here",
    redirectBackLink: "http://localhost:3003/checkout",
    apiKey: "d146cce23e67f0df9b7156bd25bd0d9c94fec209033e36ea36c563af56da6192",
    receiverName: `${user.firstName} ${user.LastName}`,
    deliveryAddress: user?.address && user?.address, // Optional: Include other query parameters if needed
    receiverPhone: user?.phoneNumber && user?.phoneNumber, // Optional: Include other query parameters if needed
    receiverEmail: user?.email && user?.email,
    pickupDetails: sellersDetails,
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [navigate]);

  const modifiedCartItems = cartItems?.cart?.map((obj) => {
    const { productId, quantity, product } = obj;
    return {
      productID: productId,
      sellerId: product?.userId,
      cost: cartItems?.cartPrice,
      quantityOrdered: quantity?.toString(),
      productName: product?.productName,
      productDescription: product?.productDescription,
      countryOfOrigin: product?.countryOfOrigin || "Nigeria",
      logisticsStatus: logisticsStatus === "successful" ? "PAID" : "UNPAID",
    };
  });

  const handlePaymentTermChange = (e) => {
    setPaymentTerm(e.target.value);
  };

  const handleCurrencyChange = (e) => {
    setSelectedCurrenci(e.target.value);
    cookies.set("currency", e.target.value);
  };

  const config = {
    public_key: "FLWPUBK-2ee5d0dabe02aabd10b0b905e71d1237-X",
    tx_ref: Date.now(),
    amount: convertPriceForFlutterwaveConfig(
      cartItems?.cartPrice,
      currentSelectedCurrency
    ),
    currency: currentSelectedCurrency,
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: user.email,
      phone_number: user.phoneNumber,
      name: user.firstName + " " + user.LastName,
    },
    customizations: {
      title: "Traders Of Africa",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!address) {
      toast.error("Please enter delivery address.", {
        duration: 4000,
      });
    } else if (
      !userDetails.shippingType ||
      userDetails.shippingType === "Select"
    ) {
      toast.error("Please select mode of delivery.", {
        duration: 4000,
        style: {
          background: "#353434",
          color: "#fff",
        },
      });
    } else if (!userDetails.incoterm || userDetails.incoterm === "Select") {
      toast.error("Please select incoterm.", {
        duration: 4000,
        style: {
          background: "#353434",
          color: "#fff",
        },
      });
    } else if (userDetails.incoterm !== "LOCAL_DELIVERY" && !userDetails.port) {
      toast.error("Please enter port", {
        duration: 4000,
        style: {
          background: "#353434",
          color: "#fff",
        },
      });
    } else if (!paymentTerm || paymentTerm === "Select payment method") {
      toast.error("Please select payment method", {
        duration: 4000,
        style: {
          background: "#353434",
          color: "#fff",
        },
      });
    } else
      try {
        setLoader(true);
        const createOrder = {
          bulkOrder: modifiedCartItems,
          destination: address,
          port:
            userDetails.incoterm === "LOCAL_DELIVERY"
              ? "None"
              : userDetails.port,
          note: "None",
          incoterm: userDetails.incoterm,
          shippingType: userDetails.shippingType,
          paymentTerm: paymentTerm,
        };

        const data = await axiosInstance.post("/order/bulk-order", createOrder);
        setLoader(false);
        handleEventTag("user clicked on pay now", user.id);
        localStorage.setItem(
          "orderIds",
          JSON.stringify(data.data.data.orderIDs)
        );
        toast.success(
          "Your order has been recorded. Kindly make payment to complete order.",
          {
            duration: 3000,
            style: {
              background: "#353434",
              color: "#fff",
            },
          }
        );

        if (data && paymentTerm === "PAYNOW") {
          handleFlutterPayment({
            callback: (response) => {
              // Payment successful
              const transactionId = response.tx_ref.toString();
              const totalAmountUSD = Number(cartItems?.cartPrice);
              const userId = user.id; // Replace with the actual user ID

              // update order status to processing when payment is made using flutterwave
              const savedOrderIds = localStorage.getItem("orderIds");
              const OrderIds = JSON.parse(savedOrderIds);

              if (OrderIds) {
                updateOrderStatus(OrderIds);
              }

              // delete the cart
              handleDelete(cartItems.cart);
              // Send payment information to your backend
              axiosInstance
                .post("/payment", {
                  transactionId,
                  userId,
                  totalAmountUSD,
                })
                .then((response) => {
                  navigate("/order/success-message");
                })
                .catch((error) => {
                  console.error(error);
                  navigate("/order/success-message");
                  toast.error(`${error.response.data.errors[0].message}`, {
                    duration: 4000,
                    style: {
                      background: "#353434",
                      color: "#fff",
                    },
                  });
                });
            },
            onClose: () => {
              // Payment canceled or closed
              console.log("Payment canceled or closed.");
            },
          });
        } else {
          setTimeout(() => {
            handleDelete(cartItems.cart);
            navigate(`/order/bank-payment/${cartItems?.cartPrice}`);
          }, 2000);
        }
      } catch (error) {
        console.log(error);
        setLoader(false);
        handleEventTag(
          `user clicked on pay now and got error: ${error.response.data.errors[0].message}`,
          user.id
        );

        if (!error.response.data.errors) {
          return navigate(`/no-connection`);
        }
        toast.error(`${error.response.data.errors[0].message}`, {
          duration: 4000,
          style: {
            background: "#353434",
            color: "#fff",
          },
        });
      }
  };

  return (
    <div className="checkout-ctn">
      <Toaster />
      {userLoading ? (
        <div className={"dim-loader"}></div>
      ) : !isLoaded ? (
        <div className={"dim-loader"}></div>
      ) : qtyLoader ? (
        <div className={"dim-loader"}></div>
      ) : loader ? (
        <div className={"dim-loader"}></div>
      ) : deleteLoader ? (
        <div className={"dim-loader"}></div>
      ) : null}
      <Header />
      <div className="cheeck">
        <div className="checkout-wrap">
          <div className="row mt-5">
            <div className="col-md-8 col-12">
              <div className="row">
                <UserDetails
                  user={user}
                  address={address}
                  handleAddressChange={handleAddressChange}
                  country={country}
                  handleCountryChange={handleCountryChange}
                  handleEditProfile={handleEditProfile}
                  updateLoader={updateLoader}
                  setAddress={setAddress}
                  handlePlacesChanged={handlePlacesChanged}
                  autocompleteRef={autocompleteRef}
                  isChange={isChange}
                  setIsChange={setIsChange}
                />

                <ShippingDetails userDetails={userDetails} />

                <PaymentMethod paymentTerm={paymentTerm} />

                <CartItems
                  cartItems={cartItems}
                  selectedCurrency={currentSelectedCurrency}
                />
              </div>
            </div>

            <CartPaymentSummary
              cartItems={cartItems}
              loader={loader}
              handleSubmit={handleSubmit}
              currentSelectedCurrency={currentSelectedCurrency}
              convertPrice={convertPrice}
              options={options}
            />
          </div>
        </div>
      </div>
      <Footer />

      {/* modal for address */}
      {/* modal for shipping */}
      <EditShipping userDetails={userDetails} setUserDetails={setUserDetails} />
      {/* modal for shipping */}
      {/* modal for payment option */}
      <SelectPaymentModal
        paymentTerm={paymentTerm}
        handlePaymentTermChange={handlePaymentTermChange}
        handleCurrencyChange={handleCurrencyChange}
        selectedCurrenci={selectedCurrenci}
      />
      {/* modal for payment option */}
    </div>
  );
};

export default ProtectedRoutes(Checkout, ["BUYER", "SELLER"]);