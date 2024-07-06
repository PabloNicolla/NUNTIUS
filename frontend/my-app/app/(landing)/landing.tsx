import {
  Image,
  ImageBackground,
  Pressable,
  View,
  StyleSheet,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import PagerView from "react-native-pager-view";

const GetStartedButton = () => {
  return (
    <Pressable
      className="h-[68] w-[250] items-center justify-center rounded-xl bg-primary-light shadow-2xl shadow-white"
      onPress={() => {
        router.replace("/sign-up");
      }}
    >
      <ThemedText className="text-xl font-bold text-white">
        GET STARTED
      </ThemedText>
    </Pressable>
  );
};

const PrimaryPage = ({ currentPage }: { currentPage: number }) => {
  return (
    <ImageBackground
      source={require("@/assets/images/landing/background.jpg")}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="flex-1 bg-[#00000050]">
        <SafeAreaView className="mb-10 flex-1 items-center justify-end">
          <ThemedText className="mb-5 text-6xl font-bold text-white">
            Hello!
          </ThemedText>
          <ThemedText className="mb-20 text-xl text-white">
            Let's improve your life style
          </ThemedText>
          <View className="mb-4">
            <CircleIndicator currentPage={currentPage} />
          </View>
          <GetStartedButton />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
const SecondaryPageTemplate = ({ currentPage }: { currentPage: number }) => {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["rgba(128,215,255,1)", "rgba(76,153,217,0.9)"]}
        locations={[0, 1]}
        start={[0, 1]}
        className="flex-1"
      >
        <SafeAreaView className="mb-10 flex-1 items-center justify-end">
          <View className="bg-transparent">
            <Image
              source={require("@/assets/images/landing/background.jpg")}
              className="mb-10 h-[300] w-[300]"
              resizeMode="cover"
            />
          </View>

          <ThemedText className="mb-5 text-6xl font-bold text-white">
            Hello!
          </ThemedText>

          <ThemedText className="mb-20 text-xl text-white">
            Let's improve your life style
          </ThemedText>
          <View className="mb-4">
            <CircleIndicator currentPage={currentPage} />
          </View>
          <GetStartedButton />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const CircleIndicator = ({ currentPage }: { currentPage: number }) => {
  return (
    <View className="flex-row justify-center">
      {[1, 2, 3, 4].map((page) => (
        <View
          key={page}
          className={`mx-1 h-3 w-3 rounded-full ${
            currentPage === page ? "bg-primary-light" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
};

export default function HomeScreen() {
  // const [currentPage, setCurrentPage] = useState(0);

  return (
    <View className="flex-1">
      <PagerView
        className="flex-1"
        initialPage={0}
        // onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <PrimaryPage key={1} currentPage={1} />
        <SecondaryPageTemplate key={2} currentPage={2} />
        <SecondaryPageTemplate key={3} currentPage={3} />
        <SecondaryPageTemplate key={4} currentPage={4} />
      </PagerView>
    </View>
  );
}
