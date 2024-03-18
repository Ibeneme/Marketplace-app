import React, { useEffect, useState } from "react";
import { View, Image, Text, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-remix-icon";
import { getAllReviews } from "../../../../Redux/Reviews/Reviews";
import { useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../../../Redux/store";

interface Props {
  productId: string; // Define productId as a prop
}

interface Review {
  id: number;
  userName: string;
  userImage: string;
  date: string;
  rating: number;
  text: string;
}

interface ReviewData {
  reviews: Review[];
  averageStarRating: string;
}

const ReviewsProfileComponent: React.FC<Props> = ({ productId }) => {
  const maxRating = 5;
  const dispatch = useDispatch<ThunkDispatch<RootState, undefined, any>>();
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);

  useEffect(() => {
    dispatch(getAllReviews(productId))
      .then((response) => {
        setReviewData(response?.payload?.data);
        //console.log("Reviews fetched successfully!", response?.payload?.data);
      })
      .catch((error) => {
       // console.error("Error fetching reviews:", error);
      });
  }, [dispatch, productId]);

  if (!reviewData) {
    return <Text>Loading...</Text>;
  }

  const { reviews, averageStarRating } = reviewData;

  // Count the number of each rating
  const ratingCounts = Array.from(
    { length: maxRating },
    (_, index) =>
      reviews.filter((review) => review.rating === maxRating - index).length
  );

  // Find the maximum count for scaling
  const maxCount = Math.max(...ratingCounts);

  return (
    <ScrollView
      style={{
        borderWidth: 1,
        borderColor: "#66666636",
        borderRadius: 12,
        padding: 16,
      }}
      contentContainerStyle={styles.container}
    >
      <View>
        <View style={styles.container}>
          <Text style={styles.reviewsText}>Reviews</Text>
          <View style={styles.flexStars}>
            <Icon name="star-line" size={24} color="#000" />
            <Icon name="star-line" size={24} color="#000" />
            <Icon name="star-line" size={24} color="#000" />
            <Icon name="star-line" size={24} color="#000" />
            <Icon name="star-line" size={24} color="#000" />
            <Text>{averageStarRating}</Text>
          </View>

          <View>
            <Text style={styles.flexStarsGray}>Based on {reviews.length} reviews</Text>
          </View>
        </View>
      </View>
      {ratingCounts.map((count, index) => (
        <View key={index} style={styles.reviewContainer}>
          <Text style={styles.ratingText}>{maxRating - index} Stars</Text>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.ratingBar,
                { width: `${(count / maxCount) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.ratingCount}>{count}</Text>
        </View>
      ))}

      {reviews.map((review) => (
        <View key={review.id} style={styles.reviewContainers}>
          <View style={styles.reviewDetails}>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginVertical: 16,
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Image
                    source={{ uri: review.userImage }}
                    style={styles.userImage}
                  />
                  <Text style={styles.reviewUserName}>@{review.userName}</Text>
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
            </View>
            <View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    marginTop: 16,
    alignItems: "center",
    gap: 12,
  },
  reviewText: {
    fontSize: 12,
    fontFamily: "Regular",
    color: "#333",
  },
  flexStars: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginTop: 8,
  },
  flexStarsGray: {
    fontSize: 14,
    fontFamily: "Regular",
    color: "#666",
  },
  reviewsText: {
    fontSize: 16,
    fontFamily: "Bold",
  },
  reviewContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  reviewContainers: {
    flexDirection: "column",
    marginBottom: 12,
  },
  ratingText: {
    marginRight: 8,
    fontSize: 14,
    fontFamily: "Regular",
  },
  barContainer: {
    flex: 1,
    height: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
  ratingBar: {
    height: "100%",
    backgroundColor: "#121212",
    borderRadius: 8,
  },
  ratingCount: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "Regular",
    color: "#666",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewDetails: {
    flex: 1,
  },
  reviewUserName: {
    fontSize: 14,
    fontFamily: "Medium",
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "Regular",
    color: "#666",
    marginBottom: 4,
  },
});

export default ReviewsProfileComponent;
