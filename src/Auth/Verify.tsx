import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import CustomHeader from "../Helpers/ProductHeaders";
import CustomTextInput from "../Components/TextInput";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

const VerifyOTP: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = () => {
    // Implement signup logic for buyer
  };

  const navigation = useNavigation();
  const navigateToBuyerLogin = () => {
    navigation.navigate("ChooseSignupOption" as never);
  };
  const navigateToForgotPassword = () => {
    navigation.navigate("ForgotPassword" as never);
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <TouchableOpacity onPress={navigateToBuyerLogin}>
          <Text style={styles.loginLinkText}>
            Don't have an account?{" "}
            <Text style={styles.loginLink}>Register</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.headerText}>
            A Link was sent to your mail, pls verify
          </Text>
          <Text style={styles.subHeaderText}>
            Enter the digits sent to your mail
          </Text>

          <View style={styles.inputSection}>
            <CustomTextInput
              label="OTP"
              placeholder="Enter your OTP"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <TouchableOpacity
            onPress={handleSignup}
            style={[styles.signupButton, { backgroundColor: "#dc4d04" }]}
          >
            <Text style={styles.signupButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loginLinkText: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#666",
    paddingTop: 36,
    marginBottom: -40,
    padding: 16,
    width: "100%",
    textAlign: "right",
  },
  loginLink: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#dc4d04",
    paddingTop: 24,
    marginBottom: -48,
    padding: 16,
    width: "100%",
    textAlign: "right",
  },
  formContainer: {
    marginVertical: 48,
    padding: 16,
  },
  headerText: {
    fontFamily: "Bold",
    fontSize: 18,
    paddingVertical: 2,
  },
  subHeaderText: {
    fontFamily: "Regular",
    fontSize: 14,
    color: "#666666",
  },
  inputSection: {
    paddingVertical: 48,
  },
  passwordSection: {
    marginTop: 0,
  },
  showPasswordButton: {
    marginTop: -12,
  },
  showPasswordButtonText: {
    fontFamily: "Regular",
    textAlign: "right",
    fontSize: 14,
  },
  termsContainer: {
    backgroundColor: "#dc4d0425",
    padding: 16,
    borderRadius: 4,
    borderColor: "#dc4d04",
    borderWidth: 1,
  },
  termsText: {
    color: "#dc4d04",
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "Regular",
  },
  signupButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  signupButtonText: {
    color: "white",
    fontFamily: "Regular",
    fontSize: 16,
  },
});

export default VerifyOTP;
