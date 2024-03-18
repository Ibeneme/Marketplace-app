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
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../../Redux/Auth/Auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../Redux/store";
import Icon from "react-native-remix-icon";
import { Dropdown } from "react-native-element-dropdown";
import { AxiosError } from "axios";

interface UserData {
  firstName: string;
  LastName: string;
  email: string;
  phoneNumberWithCountryCode: string;
  country?: string;
  password: string;
  hearAboutUs?: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required").trim(),
  LastName: Yup.string().required("Last name is required").trim(),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phoneNumberWithCountryCode: Yup.string()
    .matches(/^\d{9,}$/, "Phone number must be at least 9 digits long")
    .required("Phone number is required"),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),
  country: Yup.string().required("Please select your country"),
  hearAboutUs: Yup.string()
    .required("Please select where you heard about us")
    .test("is-selected", "Please select where you heard about us", (value) => {
      return value !== ""; // Ensure a value is selected
    }),
});

const SellerSignup: React.FC = () => {
  const [err, setErr] = useState("");
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      LastName: "",
      email: "",
      phoneNumberWithCountryCode: "",
      password: "",
      role: "SELLER",
      hearAboutUs: "",
      country: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const { country, phoneNumberWithCountryCode, ...rest } = values;
      const phoneNumber = country + phoneNumberWithCountryCode; // Concatenate country code with phone number

      setErr("");
      const body = { ...rest, phoneNumber: phoneNumber };
      console.log(body, "body");

      dispatch(
        registerUser({ ...rest, phoneNumber: phoneNumber })
      )
        .then((response) => {
          console.log(
            "User registered successfully:",
            response?.payload,
            response?.payload?.data?.errors
          );
          if (response?.payload?.message === "success") {
            navigation.navigate("SuccessAuth" as never);
          } else if (
            Array.isArray(response?.payload?.data?.errors) &&
            response?.payload?.data?.errors.some(
              (error: Error) => error.message === "Unique constraint"
            )
          ) {
            setErr("An account with these details already exists");
          } else if (
            Array.isArray(response?.payload?.data?.errors) &&
            response?.payload?.data?.errors.some(
              (error: Error) => error.message === "Please provide a valid email"
            )
          ) {
            setErr("Please provide a valid email");
          } else if (
            Array.isArray(response?.payload?.data?.errors) &&
            response?.payload?.data?.errors.some(
              (error: Error) =>
                error.message === "Request failed with status code 400"
            )
          ) {
            setErr("Please Check your phone Number and other details filled");
          } else if (response?.payload?.status === 500) {
            setErr("Server Downtime");
          } else {
            setErr("An err occurred");
          }
        })
        .catch((error) => {
          console.log("Error registering user:", error);
        });
    },
  });

  const navigation = useNavigation();

  const navigateToBuyerLogin = () => {
    navigation.navigate("Login" as never);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <TouchableOpacity onPress={navigateToBuyerLogin}>
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLink}>Login</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <Text style={styles.headerText}>Register as a Seller</Text>
          <Text style={styles.subHeaderText}>
            You are a few steps away from creating your account
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
              label="First Name"
              placeholder="Enter your first name"
              value={formik.values.firstName}
              onChangeText={(value) => {
                formik.handleChange("firstName")(value);
                setErr(""); // Reset error message
              }}
              error={formik.errors.firstName}
            />

            <CustomTextInput
              label="Last Name"
              placeholder="Enter your last name"
              value={formik.values.LastName}
              onChangeText={(value) => {
                formik.handleChange("LastName")(value);
                setErr(""); // Reset error message
              }}
              error={formik.errors.LastName}
            />

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
            <View>
              <Text style={[styles.label, { marginBottom: -21 }]}>
                Enter Phone Number
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  width: "94%",
                  gap: 4,
                  alignItems: "center",
                }}
              >
                <Dropdown
                  style={[styles.input, { width: "48%" }]}
                  placeholder="Select option"
                  data={[
                    { label: "Nigeria +234", value: "+234" },
                    { label: "US +1", value: "+1" },
                    { label: "UK +44", value: "+44" },
                  ]}
                  labelField="label"
                  valueField="value"
                  value={formik.values.country}
                  maxHeight={800}
                  onChange={(value) =>
                    formik.setFieldValue("country", value?.value)
                  }
                />

                <View style={{ width: "57%" }}>
                  <CustomTextInput
                    //style={{ width: "48%" }}
                    //label="Phone Number"
                    placeholder="Enter your phone number"
                    value={formik.values.phoneNumberWithCountryCode}
                    error={formik.errors.phoneNumberWithCountryCode}
                    onChangeText={(value) => {
                      formik.handleChange("phoneNumberWithCountryCode")(value);
                      setErr(""); // Reset error message
                    }}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text style={styles.label}>Where did you hear about us?</Text>
              <Dropdown
                style={styles.input}
                placeholder="Select option"
                data={[
                  { label: "AFCTCA", value: "AFCTCA" },
                  { label: "Old Mutuals", value: "OldMutuals" },
                  { label: "Others", value: "Others" },
                ]}
                labelField="label"
                valueField="value"
                value={formik.values.hearAboutUs}
                maxHeight={800}
                onChange={(value) =>
                  formik.setFieldValue("hearAboutUs", value?.value)
                }
              />
              <Text style={styles.errorTexts}>{formik.errors.hearAboutUs}</Text>
            </View>

            <View style={[styles.passwordSection, { marginTop: 4 }]}>
              <CustomTextInput
                label="Password"
                placeholder="Enter your password"
                value={formik.values.password}
                onChangeText={(value) => {
                  formik.handleChange("password")(value);
                  setErr(""); // Reset error message
                }}
                secureTextEntry={!showPassword}
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
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By Registering you Agree to our Terms & Conditions and Privacy
              Policy
            </Text>
          </View>
          {err ? (
            <View
              style={{
                backgroundColor: "#ff000015",
                padding: 16,
                borderRadius: 8,
                marginTop: 32,
                marginBottom: 12,
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
            <Text style={styles.signupButtonText}>Signup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: -36,
    marginBottom: 8,
    fontFamily: "Regular",
  },
  errorTexts: {
    color: "red",
    fontSize: 14,
    marginTop: -16,
    marginBottom: 32,
    fontFamily: "Regular",
  },
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
    fontSize: 16,
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
    marginTop: -12,
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
    marginBottom: 300,
  },
  signupButtonText: {
    color: "white",
    fontFamily: "Regular",
    fontSize: 16,
  },
  togglePasswordButton: {
    position: "absolute", // Position the button absolutely within the password input
    right: 16, // Adjust the position to the right side
    top: "43%", // Position in the middle vertically
    transform: [{ translateY: -12 }], // Adjust vertically to center the icon
  },
  label: {
    fontSize: 14,
    fontFamily: "Medium",
    paddingVertical: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#666",
    borderRadius: 4,
    padding: 8,
    marginBottom: 24,
    height: 48,
    fontFamily: "Regular",
  },
});

export default SellerSignup;
