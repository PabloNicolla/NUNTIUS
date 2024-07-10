import React, { useRef } from "react";
import {
  View,
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import DynamicHeader from "@/components/list/DynamicHeader";

const headerHeight = 50 * 2;

type ListWithDynamicHeaderProps = {
  data: any[];
  renderItem: ({ item }: { item: any }) => JSX.Element;
  keyExtractor?: (item: any) => string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
};

const ListWithDynamicHeader = ({
  data,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
}: ListWithDynamicHeaderProps) => {
  const theme = useColorScheme();
  const ref = useRef<FlatList>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const translateYNumber = useRef(0);

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: {
          contentOffset: { y: scrollY },
        },
      },
    ],
    {
      useNativeDriver: true,
    },
  );

  const handleSnap = (nativeEvent: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = nativeEvent.nativeEvent.contentOffset.y;
    if (
      !(
        translateYNumber.current === 0 ||
        translateYNumber.current === -headerHeight / 2
      )
    ) {
      if (ref.current) {
        ref.current.scrollToOffset({
          offset:
            getCloser(translateYNumber.current, -headerHeight / 2, 0) ===
            -headerHeight / 2
              ? offsetY + headerHeight / 2
              : offsetY - headerHeight / 2,
        });
      }
    }
  };

  return (
    <View style={{ overflow: "hidden" }}>
      <DynamicHeader scrollY={scrollY} />
      <Animated.FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        scrollEventThrottle={16}
        indicatorStyle={theme === "dark" ? "black" : "white"}
        showsHorizontalScrollIndicator={true}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={handleScroll}
        ref={ref}
        onMomentumScrollEnd={handleSnap}
        contentContainerStyle={{ paddingTop: headerHeight }}
      />
    </View>
  );
};

const getCloser = (value: number, checkOne: number, checkTwo: number) =>
  Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

export default ListWithDynamicHeader;
