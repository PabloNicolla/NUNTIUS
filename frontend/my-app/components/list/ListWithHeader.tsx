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
  renderItem: ({ item, index }: { item: T; index: number }) => JSX.Element;
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
        contentContainerStyle={{ paddingTop: headerHeight }}
        ListFooterComponent={ListFooterComponent}
      />
    </View>
  );
};

export default ListWithDynamicHeader;
