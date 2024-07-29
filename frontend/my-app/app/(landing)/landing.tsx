import {
  ImageBackground,
  View,
  Dimensions,
  Pressable,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";
import PagerView from "react-native-pager-view";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import secure from "@/assets/images/landing/secure.svg";
import send_messages from "@/assets/images/landing/send_messages.svg";
import stay_connected from "@/assets/images/landing/stay_connected.svg";

import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/themed-text";
import PrimaryButton from "@/components/buttons/primary-button";
import GetStartedModal from "@/components/modals/get-started-modal";
import { ThemedView } from "@/components/themed-view";
import BottomNavbar from "@/components/custom-nav-bar/bottom-nav-bar";

const { width, height } = Dimensions.get("window");

export default function LandingScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showKeyboardBackground, setShowKeyboardBackground] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (!isModalVisible) {
      setShowKeyboardBackground(false);
    } else {
      setTimeout(() => {
        setShowKeyboardBackground(true);
      }, 200);
    }
  }, [isModalVisible]);

  return (
    <View className="flex-1">
      <BottomNavbar bgColor={Colors.light.primary} styleColor="light" />

      <PagerView className="flex-1" initialPage={0}>
        <PrimaryPage key={1} currentPage={1} onClick={handleOpenModal} />
        <SecondaryPageTemplate
          key={2}
          currentPage={2}
          Svg={send_messages}
          onClick={handleOpenModal}
          title="Speak!"
          subtitle="Messaging made magical"
        />
        <SecondaryPageTemplate
          key={3}
          currentPage={3}
          Svg={stay_connected}
          onClick={handleOpenModal}
          title="Connect!"
          subtitle="Easily connect with anyone"
        />
        <SecondaryPageTemplate
          key={4}
          currentPage={4}
          Svg={secure}
          onClick={handleOpenModal}
          title="Privacy!"
          subtitle="Messages are stored on your device"
        />
      </PagerView>
      <ThemedView
        className={`${showKeyboardBackground ? "" : "hidden"} absolute bottom-0 h-[50%] w-full`}
      />

      <GetStartedModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </View>
  );
}

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
      <LinearGradient
        colors={["rgba(255,255,255,0.1)", "rgba(0,0,0,0.7)"]}
        locations={[0, 1]}
        start={[1, 0]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <TopBar />
          <View className="flex-1 items-center justify-end">
            <View className="mb-[10%] w-[85%] items-center justify-end">
              <ThemedText className="mb-5 text-6xl font-bold text-white">
                Hello!
              </ThemedText>
              <ThemedText className="mb-20 text-center text-xl text-white">
                Let's connect with your friends
              </ThemedText>
              <View className="mb-4">
                <CircleIndicator currentPage={currentPage} />
              </View>
              <PrimaryButton
                handlePress={() => onClick()}
                title="GET STARTED"
                removeShadow={true}
              />
            </View>
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
  title,
  subtitle,
}: {
  currentPage: number;
  Svg: React.FC<SvgProps>;
  onClick: () => void;
  title: string;
  subtitle: string;
}) => {
  return (
    <View className="flex-1">
      <LinearGradient
        colors={["rgba(128,215,255,1)", "rgba(76,153,217,1)"]}
        locations={[0, 1]}
        start={[0, 0.5]}
        className="flex-1"
      >
        <SafeAreaView className="flex-1">
          <View className="flex-1 items-center">
            <TopBar />

            <View className="mb-[10%] w-[85%] flex-1 items-center justify-end">
              <Svg
                width={width * 0.8}
                height={height * 0.4}
                className="mb-10"
              />

              <View className="flex-1 items-center justify-center">
                <ThemedText className="mb-5 text-5xl font-bold text-white">
                  {title}
                </ThemedText>
                <ThemedText className="mb-10 text-center text-xl text-white">
                  {subtitle}
                </ThemedText>
              </View>

              <View className="mb-4">
                <CircleIndicator currentPage={currentPage} />
              </View>
              <PrimaryButton
                handlePress={() => onClick()}
                title="GET STARTED"
              />
            </View>
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

const TopBar = () => (
  <View className="w-full flex-row items-center justify-between px-2">
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
        <ThemedText className="text-lg font-bold text-white">Log in</ThemedText>
      </Pressable>
    </View>
  </View>
);
