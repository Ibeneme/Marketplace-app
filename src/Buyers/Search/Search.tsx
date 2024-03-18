import React, { useState } from "react";
import { View, TextInput, StyleSheet, SafeAreaView } from "react-native";
import CustomHeader from "../../Helpers/ProductHeaders";
import Icon from "react-native-remix-icon";

type SearchProps = {};

const Search: React.FC<SearchProps> = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Search" />
      <View style={{ padding: 16 }}>
        <View style={styles.searchContainer}>
          <Icon
            name="search-line"
            size={20}
            color="#555"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search for Products"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    borderRadius: 4,
    justifyContent:'center'
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
});

export default Search;
