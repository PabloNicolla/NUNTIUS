import React, { useRef } from "react";
import {
  View,
  Animated,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  useColorScheme,
} from "react-native";
import DynamicHeader from "@/components/list/DynamicHeader";

type ListWithDynamicHeaderProps<T> = {
  data: T[];
  renderItem: ({ item }: { item: T }) => JSX.Element;
  keyExtractor?: (item: T) => string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  DynamicHeaderComponent: React.ComponentType<any>;
  headerHeight: number;
};

const ListWithDynamicHeader = ({
  data,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
  DynamicHeaderComponent,
  headerHeight,
}: ListWithDynamicHeaderProps<any>) => {
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
      <DynamicHeader headerHeight={headerHeight} scrollY={scrollY}>
        <DynamicHeaderComponent />
      </DynamicHeader>
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
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

const getCloser = (value: number, checkOne: number, checkTwo: number) =>
  Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;

export default ListWithDynamicHeader;
