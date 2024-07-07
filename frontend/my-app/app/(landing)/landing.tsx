import {
  Image,
  ImageBackground,
  Pressable,
  View,
  StyleSheet,
  ColorValue,
  Text,
} from "react-native";

import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { SvgProps } from "react-native-svg";
import PagerView from "react-native-pager-view";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

import { ThemedText } from "@/components/ThemedText";

import SomethingSVG from "@/assets/images/landing/exploring.svg";
import LoveItSVG from "@/assets/images/landing/love_it.svg";
import UnlockSVG from "@/assets/images/landing/unlock.svg";

import { Colors } from "@/constants/Colors";
import { useEffect, useState } from "react";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GetStartedModal from "@/components/modals/GetStartedModal";

// const GetStartedButton = () => {
//   return (
//     <Pressable
//       className="h-[68] w-[250] items-center justify-center rounded-xl bg-primary-light shadow-2xl shadow-white"
//       onPress={() => {
//         router.replace("/sign-up");
//       }}
//     >
//       <ThemedText className="text-xl font-bold text-white">
//         GET STARTED
//       </ThemedText>
//     </Pressable>
//   );
// };

const PrimaryPage = ({
  currentPage,
  onClick,
}: {
  currentPage: number;
  onClick: () => void;
}) => {
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
          <PrimaryButton onPress={() => onClick()} title="GET STARTED" />
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const SecondaryPageTemplate = ({
  currentPage,
  Svg,
  onClick,
}: {
  currentPage: number;
  Svg: React.FC<SvgProps>;
  onClick: () => void;
}) => {
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
            {/* <Image
              source={require("@/assets/images/landing/background.jpg")}
              className="mb-10 h-[300] w-[300]"
              resizeMode="cover"
            /> */}
            <Svg width={300} height={300} className="mb-10" />
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
          <PrimaryButton onPress={() => onClick()} title="GET STARTED" />
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
  const [isVisible, setVisible] = useState(false);

  const onClick = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    let defaultNavBarColor: ColorValue, defaultStyle: "light" | "dark";

    (async () => {
      // Fetch the default values
      defaultNavBarColor = await NavigationBar.getBackgroundColorAsync();
      defaultStyle = await NavigationBar.getButtonStyleAsync();

      // Set the new values
      await NavigationBar.setBackgroundColorAsync(Colors.light.primary);
      await NavigationBar.setButtonStyleAsync("light");
    })();

    // Cleanup function to restore the default values
    return () => {
      (async () => {
        await NavigationBar.setBackgroundColorAsync(defaultNavBarColor);
        await NavigationBar.setButtonStyleAsync(defaultStyle);
      })();
    };
  }, []);

  return (
    <View className="flex-1">
      <StatusBar style="light" />

      <PagerView
        className="flex-1"
        initialPage={0}
        // onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <PrimaryPage key={1} currentPage={1} onClick={onClick} />
        <SecondaryPageTemplate
          key={2}
          currentPage={2}
          Svg={SomethingSVG}
          onClick={onClick}
        />
        <SecondaryPageTemplate
          key={3}
          currentPage={3}
          Svg={LoveItSVG}
          onClick={onClick}
        />
        <SecondaryPageTemplate
          key={4}
          currentPage={4}
          Svg={UnlockSVG}
          onClick={onClick}
        />
      </PagerView>

      <GetStartedModal isVisible={isVisible} onClose={onClose} />
    </View>
  );
}
