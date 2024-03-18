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
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/store";
import { useDispatch } from "react-redux";
import { forgotPassword } from "../../Redux/Auth/Auth";

const ForgotPassword: React.FC = () => {
  const [err, setErr] = useState("");
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      setErr("");
      setLoading(true);
      console.log(values, "values");
      dispatch(forgotPassword(values))
        .then((response) => {
          setLoading(false);
          console.log(
            "User registered successfully:",
            response?.payload?.data?.errors
          );
          if (response?.payload?.message === "success") {
            navigation.navigate("ForgotAuth" as never);
          } else if (
            Array.isArray(response?.payload?.data?.errors) &&
            response?.payload?.data?.errors.some(
              (error: Error) => error.message === "Unique constraint"
            )
          ) {
            setErr("An account with these details already exists");
          } else if (response?.payload?.status === 400) {
            setErr("Email is Invalid and could not be sent");
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
            setErr("An err occurred");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log("Error registering user:", error);
        });
    },
  });

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
          <Text style={styles.headerText}>Forgot Password</Text>
          <Text style={styles.subHeaderText}>
            Enter registered email address to reset your password
          </Text>

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
              error={formik.errors.email}
              onChangeText={(value) => {
                formik.handleChange("email")(value);
                setErr(""); // Reset error message
              }}
            />
          </View>

          <TouchableOpacity
            onPress={(e) => {
              e.preventDefault();
              formik.handleSubmit(
                e as unknown as React.FormEvent<HTMLFormElement>
              );
            }}
            style={[
              styles.signupButton,
              { backgroundColor: "#dc4d04" },
              !formik.isValid && { opacity: 0.5 },
            ]}
            disabled={!formik.isValid}
          >
            <Text style={styles.signupButtonText}>
              {loading ? (
                <ActivityIndicator size={16} color="#fff" />
              ) : (
                "Submit"
              )}
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

export default ForgotPassword;
