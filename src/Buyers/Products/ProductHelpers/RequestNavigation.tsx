// RequestSuccessNavigation.tsx

import { StackNavigationProp } from "@react-navigation/stack";

import { useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../../../Routing/Buyers/BuyersStack";

type RequestSuccessNavigationProp = StackNavigationProp<
  StackParamList,
  "RequestSuccess"
>;

export const useRequestSuccessNavigation = () =>
  useNavigation<RequestSuccessNavigationProp>();
