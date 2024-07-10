// groups.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutAnimation,
  useColorScheme,
  ScrollView,
  Animated,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatListItem, {
  ChatListItemProps,
} from "@/components/chat/ChatListItem";
import { SelectionProvider, useSelection } from "@/providers/chat-provider";
import { ThemedText } from "@/components/ThemedText";
import Header from "@/components/list/TempHeader";
import { StatusBar } from "expo-status-bar";
import { chats_data } from "@/test-data/chat-data";
import ListWithDynamicHeader from "@/components/list/ListWithHeader";

const { diffClamp } = Animated;
const headerHeight = 50 * 2;

const App = () => {
  const theme = useColorScheme();
  const [chats, setChats] = useState<ChatListItemProps[]>(chats_data);

  const addOrUpdateChat = (chat: ChatListItemProps) => {
    setChats((prevChats: ChatListItemProps[]) => {
      const existingChatIndex = prevChats.findIndex((c) => c.id === chat.id);
      if (existingChatIndex !== -1) {
        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = chat;
        return updatedChats.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime,
        );
      } else {
        const updatedChats = [...prevChats, chat];
        return updatedChats.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime,
        );
      }
    });
  };

  const renderItem = ({ item }: { item: ChatListItemProps }) => (
    <ChatListItem key={item.id} {...item} />
  );

  // // header
  // const ref = useRef<FlatList>(null);

  // const scrollY = useRef(new Animated.Value(0));
  // const scrollYClamped = diffClamp(scrollY.current, 0, headerHeight);

  // const translateY = scrollYClamped.interpolate({
  //   inputRange: [0, headerHeight],
  //   outputRange: [0, -headerHeight],
  // });

  // const translateYNumber = useRef();

  // translateY.addListener(({ value }) => {
  //   translateYNumber.current = value;
  // });

  // const handleScroll = Animated.event(
  //   [
  //     {
  //       nativeEvent: {
  //         contentOffset: { y: scrollY.current },
  //       },
  //     },
  //   ],
  //   {
  //     useNativeDriver: true,
  //   },
  // );

  // const handleSnap = (nativeEvent: NativeSyntheticEvent<NativeScrollEvent>) => {
  //   const offsetY = nativeEvent.nativeEvent.contentOffset.y;
  //   if (
  //     !(
  //       translateYNumber.current === 0 ||
  //       translateYNumber.current === -headerHeight / 2
  //     )
  //   ) {
  //     if (ref.current) {
  //       ref.current.scrollToOffset({
  //         offset:
  //           getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
  //           -headerHeight / 2
  //             ? offsetY + headerHeight / 2
  //             : offsetY - headerHeight / 2,
  //       });
  //     }
  //   }
  // };

  return (
    <View className="flex-1">
      <StatusBar style="auto" />

      <SafeAreaView className="flex-1">
        <ListWithDynamicHeader
          data={chats}
          renderItem={renderItem}
          ListHeaderComponent={HeaderComponent}
        />

        {/* <Animated.View
            style={[styles.header, { transform: [{ translateY }] }]}
          >
            <Header {...{ headerHeight }} />
          </Animated.View>
          <Animated.FlatList
            data={chats}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEventThrottle={16}
            indicatorStyle={theme === "dark" ? "black" : "white"}
            showsHorizontalScrollIndicator={true}
            ListHeaderComponent={HeaderComponent}
            onScroll={handleScroll}
            ref={ref}
            onMomentumScrollEnd={handleSnap}
            contentContainerStyle={{ paddingTop: headerHeight }}
          /> */}
      </SafeAreaView>
    </View>
  );
};

const HeaderComponent = () => {
  const { selectedChatItems } = useSelection();

  return (
    <View className="h-20 w-20">
      <Pressable
        onPress={() => {
          console.log(selectedChatItems);
        }}
      >
        <ThemedText className="h-20">ASDSADASDSADASDASDASDSA</ThemedText>
      </Pressable>
    </View>
  );
};

export default () => (
  <SelectionProvider>
    <App />
  </SelectionProvider>
);
