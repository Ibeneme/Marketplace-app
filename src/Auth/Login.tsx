import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomHeader from "../Helpers/ProductHeaders";
import CustomTextInput from "../Components/TextInput";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { signInUser } from "../../Redux/Auth/Auth";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/store";
import Icon from "react-native-remix-icon";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login: React.FC = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
      )
      .required("Password is required"),
  });
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  // Define an async function to fetch the access token
  const fetchAccessToken = async () => {
    try {
      const accessToken = await AsyncStorage.getItem(
        "marketplace_access_token"
      );
      console.log("Access Token:", accessToken);
      return accessToken; // Return the access token if needed
    } catch (error) {
      console.error("Error fetching access token:", error);
      return null; // Return null or handle the error accordingly
    }
  };

  // Call the async function to fetch the access token
  fetchAccessToken();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      dispatch(signInUser(values))
        .then((response) => {
          setLoading(false);
          console.log(
            "User registered successfully:",
            response?.payload?.data?.errors
          );
          if (response?.payload?.message === "success") {
            fetchAccessToken();
            navigation.navigate("Profile" as never);
          } else if (
            Array.isArray(response?.payload?.data?.errors) &&
            response?.payload?.data?.errors.some(
              (error: Error) => error.message === "Unique constraint"
            )
          ) {
            setErr("Pls confirm details submitted are correct");
          } else if (response?.payload?.status === 500) {
            setErr("Server Downtime");
          } else if (
            Array.isArray(response?.payload?.data?.errors) &&
            response?.payload?.data?.errors.some(
              (error: Error) => error.message === "Please provide a valid email"
            )
          ) {
            setErr("Please provide a valid email");
          } else {
            setErr("Pls confirm details submitted are correct");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error registering user:", error);
        });
    },
  });

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
          <Text style={styles.headerText}>Login to Continue</Text>
          <Text style={styles.subHeaderText}>Welcome Back</Text>
          {err ? (
            <View
              style={{
                backgroundColor: "#ff000015",
                padding: 16,
                borderRadius: 8,
                marginTop: 32,
                marginBottom: -12,
              }}
            >
              <Text
                style={{
                  color: "#ff0000",
                  fontFamily: "Regular",
                }}
              >
                {err}
              </Text>
            </View>
          ) : null}
          <View style={styles.inputSection}>
            <CustomTextInput
              label="Email Address"
              placeholder="Enter your email address"
              value={formik.values.email}
              onChangeText={(value) => {
                formik.handleChange("email")(value);
                setErr("");
                // setErr(""); // Reset error message
              }}
              error={formik.errors.email}
            />

            <View style={styles.passwordSection}>
              <View style={[styles.passwordSection, { marginTop: 4 }]}>
                <CustomTextInput
                  label="Password"
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChangeText={(value) => {
                    formik.handleChange("password")(value);
                    setErr("");
                    // setErr(""); // Reset error message
                  }}
                  secureTextEntry={!showPassword}
                  // error={formik.errors.password}
                />
                {/* Toggle button to show/hide password */}
                <TouchableOpacity
                  style={styles.togglePasswordButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Icon name="eye-close-line" size={24} color="#333" />
                  ) : (
                    <Icon name="ri-eye-fill" size={24} color="#333" />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={styles.errorText}>{formik.errors.password}</Text>

              <TouchableOpacity
                style={styles.showPasswordButton}
                onPress={navigateToForgotPassword}
              >
                <Text style={styles.showPasswordButtonText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              formik.handleSubmit(); // Handle form submission directly
            }}
            style={[
              styles.signupButton,
              { backgroundColor: "#dc4d04" },
              !formik.isValid && { opacity: 0.5 },
            ]}
            disabled={!formik.isValid}
          >
            <Text style={styles.signupButtonText}>
              {" "}
              {loading ? <ActivityIndicator size={16} color="#fff" /> : "Login"}
            </Text>
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
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -36,
    marginBottom: 8,
    fontFamily: "Regular",
  },
  togglePasswordButton: {
    position: "absolute", // Position the button absolutely within the password input
    right: 16, // Adjust the position to the right side
    top: "43%", // Position in the middle vertically
    transform: [{ translateY: -12 }], // Adjust vertically to center the icon
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

export default Login;
