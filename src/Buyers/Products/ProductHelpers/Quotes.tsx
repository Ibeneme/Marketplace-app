import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import CustomHeader from "../../../Helpers/ProductHeaders";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Product } from "../AllProducts";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../../../Redux/store";
import { fetchCurrentUser } from "../../../../Redux/Auth/Auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createRFQ } from "../../../../Redux/RFG/RFG";

// interface RouteParams {
//   productData: Product;
// }

const QuoteForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [userID, setUserID] = useState("");
  const [err, setErr] = useState("");
  const route = useRoute();
  const { productData } = route.params as { productData: Product };
  // console.log(productData, "productData");
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();

  useEffect(() => {
    dispatch(fetchCurrentUser())
      .then((response: any) => {
        console.log(
          "Fetch current user successful:",
          response?.payload?.currentUser?.id
        );
        setUserID(response?.payload?.currentUser?.id);
      })
      .catch((error: any) => {
        console.error("Error fetching current user:", error);
      });
  }, [dispatch]);

  const validationSchema = Yup.object().shape({
    productDescription: Yup.string().required("Product requirements required"),
    quantityRequired: Yup.number().required("quantity is required"),
    unit: Yup.string().required("Selected unit required"),
    termsOfTrade: Yup.string().required("Selected shipping term required"),
    paymentTerms: Yup.string().required("Selected payment term required"),
    destinationPort: Yup.string().required("Destination port required"),
    targetPrice: Yup.number().required("Price in USD required"),
  });

  const formik = useFormik({
    initialValues: {
      productDescription: "",
      quantityRequired: "",
      unit: "",
      termsOfTrade: null,
      paymentTerms: null,
      destinationPort: "",
      targetPrice: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      setLoading(true);
      setTimeout(() => {
        const { ...rest } = values;
        const body = {
          ...rest,
          userId: userID,
          productId: productData?.id,
          productName: productData?.productName,
        };

        dispatch(createRFQ(body))
          .then((response: any) => {
            console.log(
              "RFQ created successfully:",
              response?.meta?.requestStatus
            );
            setLoading(false);
            setSubmitting(false);
            if (response?.meta?.requestStatus === "fulfilled") {
              (navigation.navigate as any)("RequestSuccess", {
                productData: productData,
              });
            } else {
              setErr("An error occured, couldn't Process your request");
            }
          })
          .catch((error: any) => {
            setLoading(false);
            console.error("Failed to create RFQ:", error);
            setSubmitting(false);
          });

        console.log("Form submitted!");
        setSubmitting(false);
      }, 400);
    },
  });

  //   {
  //     "productName": "BEANS",
  //     "productDescription": "Beans  description 2",
  //     "quantityRequired": "23",

  //     "unit": "23",
  //     "targetPrice": "100",
  //     "destinationPort": "PORT NIGERIA AFRICA",

  //     "termsOfTrade": "BUY",
  //     "paymentTerms": "BUY",
  //     "productId": "df2d876e-d05f-49cd-9618-6bf8340af29e",
  //     "userId": "e6b25d56-69a2-4457-b16d-960b97e18fa7"
  // }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader />
      <ScrollView>
        <View
          style={{ paddingBottom: 320, paddingTop: 12, paddingHorizontal: 16 }}
        >
          <Text
            style={{ fontSize: 18, fontFamily: "Bold", paddingVertical: 24 }}
          >
            Request for Quote for{" "}
            <Text style={{ color: "#dc4d04" }}>{productData?.productName}</Text>
          </Text>

          {err ? (
            <View
              style={{
                backgroundColor: "#ff000015",
                padding: 16,
                borderRadius: 8,
                marginTop: 32,
                marginBottom: 24,
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

          <View>
            <Text style={styles.label}>Product Requirement</Text>
            <TextInput
              style={styles.productDescriptionInput}
              multiline
              placeholder="Enter product requirements"
              onChangeText={formik.handleChange("productDescription")}
              onBlur={formik.handleBlur("productDescription")}
              value={formik.values.productDescription}
            />
            {formik.touched.productDescription &&
            formik.errors.productDescription ? (
              <Text style={styles.error}>
                {formik.errors.productDescription}
              </Text>
            ) : null}
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter quantity"
              onChangeText={formik.handleChange("quantityRequired")}
              onBlur={formik.handleBlur("quantityRequired")}
              value={formik.values.quantityRequired}
              keyboardType="numeric"
            />
            {formik.touched.quantityRequired &&
            formik.errors.quantityRequired ? (
              <Text style={styles.error}>{formik.errors.quantityRequired}</Text>
            ) : null}
          </View>

          <View style={styles.quantityContainer}>
            <Text style={styles.label}>Unit</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a Unit"
              onChangeText={formik.handleChange("unit")}
              onBlur={formik.handleBlur("unit")}
              value={formik.values.unit}
              keyboardType="numeric"
            />
            {formik.touched.unit && formik.errors.unit ? (
              <Text style={styles.error}>{formik.errors.unit}</Text>
            ) : null}
          </View>

          <View>
            <Text style={styles.label}>Shipping Method</Text>
            <Dropdown
              style={styles.input}
              placeholder="Select shipping term"
              data={[
                { label: "FOB", value: "FOB" },
                { label: "CIF", value: "CIF" },
                { label: "C&F", value: "C&F" },
                { label: "Local Delivery", value: "Local Delivery" },
              ]}
              labelField="label"
              valueField="value"
              value={formik.values.termsOfTrade}
              maxHeight={800}
              onChange={(value) =>
                formik.setFieldValue("termsOfTrade", value.value)
              }
            />
            {formik.touched.termsOfTrade && formik.errors.termsOfTrade ? (
              <Text style={styles.error}>{formik.errors.termsOfTrade}</Text>
            ) : null}
          </View>

          {/* Payment Method */}
          <View>
            <Text style={styles.label}>Payment Method</Text>
            <Dropdown
              style={styles.input}
              data={[
                { label: "Pay Now", value: "Pay Now" },
                { label: "Transfer", value: "Transfer" },
                { label: "Letter of Credit", value: "Letter of Credit" },
                {
                  label: "Telegraphic Transfer",
                  value: "Telegraphic Transfer",
                },
              ]}
              placeholder="Select Payment Method"
              labelField="label"
              valueField="value"
              value={formik.values.paymentTerms}
              maxHeight={800}
              onChange={(value) =>
                formik.setFieldValue("paymentTerms", value?.value)
              }
            />
            {formik.touched.paymentTerms && formik.errors.paymentTerms ? (
              <Text style={styles.error}>{formik.errors.paymentTerms}</Text>
            ) : null}
          </View>

          {/* Destination */}
          <View>
            <Text style={styles.label}>Destination</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter destination port/location"
              onChangeText={formik.handleChange("destinationPort")}
              onBlur={formik.handleBlur("destinationPort")}
              value={formik.values.destinationPort}
            />
            {formik.touched.destinationPort && formik.errors.destinationPort ? (
              <Text style={styles.error}>{formik.errors.destinationPort}</Text>
            ) : null}
          </View>

          {/* Price in USD */}
          <View>
            <Text style={styles.label}>Price in USD</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price in USD"
              onChangeText={formik.handleChange("targetPrice")}
              onBlur={formik.handleBlur("targetPrice")}
              value={formik.values.targetPrice}
              keyboardType="numeric"
            />
            {formik.touched.targetPrice && formik.errors.targetPrice ? (
              <Text style={styles.error}>{formik.errors.targetPrice}</Text>
            ) : null}
          </View>

          {err ? (
            <View
              style={{
                backgroundColor: "#ff000015",
                padding: 16,
                borderRadius: 8,
                marginTop: 32,
                marginBottom: 24,
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

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              !formik.isValid && styles.disabledButton,
            ]}
            onPress={() => {
              formik.handleSubmit(); // Handle form submission directly
            }}
            disabled={!formik.isValid}
          >
            <Text style={styles.submitButtonText}>
              {" "}
              {loading ? (
                <ActivityIndicator size={16} color="#fff" />
              ) : (
                "Submit Quote"
              )}{" "}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#Ffffff",
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontFamily: "Medium",
    paddingVertical: 6,
  },
  productDescriptionInput: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 16,
    padding: 12,
  },
  quantityContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    color: "#666",
    borderRadius: 4,
    padding: 8,
    marginBottom: 24,
    height: 48,
  },
  error: {
    color: "red",
    fontSize: 12,
    fontFamily: "Medium",
    marginTop: -12,
    marginBottom: 28,
  },
  submitButton: {
    backgroundColor: "#dc4d04",
    padding: 12,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontFamily: "Bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default QuoteForm;
