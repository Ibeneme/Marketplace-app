import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../../Routing/Buyers/BuyersStack";
import CustomHeader from "../../Helpers/ProductHeaders";
import Icon from "react-native-remix-icon";
// import CountryFlag from "react-native-country-flag";
import { Product, ProductCard } from "../Products/AllProducts";
import { StackNavigationProp } from "@react-navigation/stack";
import { signOut } from "../../../Redux/Auth/Auth";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../../Redux/store";
import LoadingComponent from "../../Components/ShimmerLoader";
const logoImage = require("../../../assets/fonts/Shop.png");
const loadingImage = require("../../../assets/Tofa.png");

export type ProfileDetailsProps = {
  route: RouteProp<StackParamList, "ProfileDetails">;
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({ route }) => {
  const { profile } = route.params;

  console.log(profile, "proifle");

  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const daySuffix = getDaySuffix(day);

    return `${day}${daySuffix} ${monthNames[monthIndex]} ${year}`;
  };

  const getDaySuffix = (day: number) => {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  //   const handleCopyReferralCode = () => {
  //     const referralCode = profile?.referralCode;
  //     const textField = document.createElement("textarea");
  //     textField.innerText = referralCode;
  //     document.body.appendChild(textField);
  //     textField.select();
  //     document.execCommand("copy");
  //     textField.remove();
  //     console.log("Referral code copied");
  //   };

  const handlePhoneNumberPress = () => {
    Linking.openURL(`tel:${profile?.phoneNumber}`);
  };

  const scrollRef = useRef<ScrollView | null>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
    }
  };
  const navigation = useNavigation<StackNavigationProp<StackParamList>>();
  const handleProductPress = (product: Product) => () => {
    navigation.navigate("ProductDetails", { productData: product });
  };
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [message, setMessage] = useState("");

  const handleSignOut = () => {
    setLoading(true);
    dispatch(signOut())
      .then((response) => {
        setLoading(false);
        console.log("Sign out successful:", response);
        setMessage("Sign out successful");
        navigation.navigate("Dashboard");
      })
      .catch((error) => {
        setLoading(false);
        //console.error("Sign out failed:", error);
        setMessage("Sign out failed");
      });
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessage("");
    });

    return unsubscribe;
  }, [navigation]);

  
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      {loading ? (
        <LoadingComponent logo={loadingImage} />
      ) : (
        <ScrollView style={styles.contentContainer}>
          <View>
            {message ? (
              <View
                style={{
                  backgroundColor: "#dc4d0417",
                  padding: 12,
                  marginVertical: 36,
                  borderLeftWidth: 6,
                  borderLeftColor: "#dc4d04",
                }}
              >
                <Text
                  style={{
                    color: "#dc4d04",
                    fontFamily: "Regular",
                  }}
                >
                  {message}
                </Text>
              </View>
            ) : null}

            <View
              style={{ justifyContent: "flex-end", alignItems: "flex-end" }}
            >
              <View
                style={{
                  backgroundColor: "#dc4d0415",
                  borderRadius: 120,
                  padding: 12,
                  width: 100,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontFamily: "SemiBold", color: "#dc4d04" }}>
                  Points: {profile?.point}
                </Text>
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginVertical: 24,
                }}
              >
                <View style={styles.circleContainer}>
                  <Text style={styles.circleText}>
                    {profile?.LastName.charAt(0).toUpperCase()}
                    {profile?.firstName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Bold",
                  fontSize: 16,
                  textAlign: "center",
                }}
              >
                {`${profile?.LastName} ${profile?.firstName}`}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  marginVertical: 8,
                }}
              >
                <Icon name="mail-line" size={14} color="#808080" />
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 14,
                    textAlign: "center",
                    color: "#808080",
                  }}
                >
                  {profile?.email}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  marginBottom: 8,
                }}
              >
                <Icon name="phone-line" size={14} color="#808080" />
                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 14,
                    textAlign: "center",
                    color: "#808080",
                  }}
                  onPress={handlePhoneNumberPress}
                >
                  {profile?.phoneNumber}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  marginBottom: 8,
                 // backgroundColor: "#0F9E4020",
                  padding: 8,
                  borderRadius: 244,
                  paddingHorizontal: 28,
                  marginTop: 4,
                }}
              >
                {/* <CountryFlag isoCode="ng" size={14} /> */}

                <Text
                  style={{
                    fontFamily: "Regular",
                    fontSize: 14,
                    textAlign: "center",
                    color: "#808080",
                  }}
                >
                  {profile?.country}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => navigation.navigate("Settings")}
              // onPress={handleSaveChanges}
            >
              <Text style={styles.saveButtonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#dc4d04",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: 32,
              }}
              onPress={handleSignOut}
            >
              <Text style={{ fontFamily: "SemiBold", color: "#dc4d04" }}>
                Log out
              </Text>
            </TouchableOpacity>

            <View
              style={{
                backgroundColor: "#dc4d0420",
                padding: 16,
                borderRadius: 8,
                alignItems: "center",
                marginVertical: -12,
                height: 300,
                marginBottom: 230,
              }}
            >
              <View>
                <Image
                  source={logoImage}
                  style={{ width: 150, height: 150, marginTop: 24 }}
                />
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: "#031849",
                  padding: 20,
                  borderRadius: 8,
                  alignItems: "center",
                  marginVertical: 32,
                  width: "100%",
                }}
              >
                <Text style={{ fontFamily: "SemiBold", color: "#fff" }}>
                  Become a Seller
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const renderDetailRow = (label: string, value: string) => (
  <View style={styles.detailRow}>
    <Text style={styles.labelText}>{label}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const renderAddressRow = (label: string, value: string) => (
  <View style={{ gap: 12, marginVertical: 16 }}>
    <Text style={styles.labelText}>{label}</Text>
    <Text style={styles.valueText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "Bold",
    marginBottom: 16,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  labelText: {
    fontSize: 14,
    fontFamily: "Bold",
  },
  valueText: {
    fontSize: 14,
    fontFamily: "Regular",
  },
  circleContainer: {
    backgroundColor: "#dc4d04",
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  circleText: {
    color: "#fff",
    fontFamily: "Bold",
    fontSize: 24,
  },
  sellerName: {
    fontSize: 16,
    fontFamily: "Bold",
  },
  saveButton: {
    backgroundColor: "#dc4d04",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    height: 50,
    justifyContent: "center",
    marginTop: 48,
    marginBottom: -20,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "SemiBold",
  },
});

export default ProfileDetails;
