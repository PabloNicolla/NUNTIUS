import {
  ImageBackground,
  View,
  ColorValue,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
import PagerView from "react-native-pager-view";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import SomethingSVG from "@/assets/images/landing/exploring.svg";
import LoveItSVG from "@/assets/images/landing/love_it.svg";
import UnlockSVG from "@/assets/images/landing/unlock.svg";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import PrimaryButton from "@/components/buttons/PrimaryButton";
import GetStartedModal from "@/components/modals/GetStartedModal";

const { width, height } = Dimensions.get("window");

const PrimaryPage = ({
  currentPage,
  onClick,
}: {
  currentPage: number;
  onClick: () => void;
}) => {
  return (
    <ImageBackground
      source={require("@/assets/images/landing/background.jpeg")}
      className="flex-1"
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(0,0,0,0.9)"]}
        locations={[0, 1]}
        start={[1, 0]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 items-center justify-end">
          <View className="mb-[10%] w-[80%] items-center justify-end">
            <ThemedText className="mb-5 text-6xl font-bold text-white">
              Hello!
            </ThemedText>
            <ThemedText className="mb-20 text-xl text-white">
              Let's improve your life style
            </ThemedText>
            <View className="mb-4">
              <CircleIndicator currentPage={currentPage} />
            </View>
            <PrimaryButton handlePress={() => onClick()} title="GET STARTED" />
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );
};

const SecondaryPageTemplate = ({
  currentPage,
  Svg,
  onClick,
  isModalVisible,
}: {
  currentPage: number;
  Svg: React.FC<SvgProps>;
  onClick: () => void;
  isModalVisible: boolean;
}) => {
  const [isSvgVisible, setIsSvgVisible] = useState(true);

  useEffect(() => {
    if (isModalVisible) {
      setTimeout(() => {
        setIsSvgVisible(false);
      }, 120);
    } else {
      setIsSvgVisible(true);
    }
  }, [isModalVisible]);

  return (
    <View className="flex-1">
      <LinearGradient
        colors={["rgba(128,215,255,1)", "rgba(76,153,217,0.9)"]}
        locations={[0, 1]}
        start={[0, 1]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1 items-center justify-end">
          <View className="mb-[10%] w-[80%] items-center justify-end">
            {isSvgVisible && (
              <View className="bg-transparent">
                {/* <Image
              source={require("@/assets/images/landing/background.jpg")}
              className="mb-10 h-[300] w-[300]"
              resizeMode="cover"
            /> */}

                <Svg
                  width={width * 0.8}
                  height={height * 0.4}
                  className="mb-10"
                />
              </View>
            )}

            <ThemedText className="mb-5 text-6xl font-bold text-white">
              Hello!
            </ThemedText>
            <ThemedText className="mb-20 text-xl text-white">
              Let's improve your life style
            </ThemedText>
            <View className="mb-4">
              <CircleIndicator currentPage={currentPage} />
            </View>
            <PrimaryButton handlePress={() => onClick()} title="GET STARTED" />
          </View>
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

export default function LandingScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
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

      <View className="absolute z-10 mt-[7%] w-full flex-row items-center justify-between px-2">
        <View className="flex-row items-center">
          <Image
            source={require("@/assets/images/brand/Logo.png")}
            className="h-[60] w-[60]"
          />
        </View>
        <View className="items-center">
          <Pressable
            onPress={() => {
              router.push("/sign-in");
            }}
          >
            <ThemedText className="text-lg font-bold text-white">
              Log in
            </ThemedText>
          </Pressable>
        </View>
      </View>

      <PagerView
        className="flex-1"
        initialPage={0}
        // onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        <PrimaryPage key={1} currentPage={1} onClick={handleOpenModal} />
        <SecondaryPageTemplate
          key={2}
          currentPage={2}
          Svg={SomethingSVG}
          onClick={handleOpenModal}
          isModalVisible={isModalVisible}
        />
        <SecondaryPageTemplate
          key={3}
          currentPage={3}
          Svg={LoveItSVG}
          onClick={handleOpenModal}
          isModalVisible={isModalVisible}
        />
        <SecondaryPageTemplate
          key={4}
          currentPage={4}
          Svg={UnlockSVG}
          onClick={handleOpenModal}
          isModalVisible={isModalVisible}
        />
      </PagerView>

      <GetStartedModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </View>
  );
}
