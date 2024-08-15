import React, { useRef } from "react";
import { View, Animated, FlatList, useColorScheme } from "react-native";
import DynamicHeader from "@/components/list/dynamic-header";

type ListWithDynamicHeaderProps<T> = {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => JSX.Element;
  keyExtractor?: (item: T) => string;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  DynamicHeaderComponent: React.ComponentType<any>;
  headerHeight: number;

  initialNumToRender?: number;
  maxToRenderPerBatch?: number;
  windowSize?: number;
};

const ListWithDynamicHeader = ({
  data,
  renderItem,
  keyExtractor,
  ListHeaderComponent,
  ListFooterComponent,
  DynamicHeaderComponent,
  headerHeight,

  initialNumToRender,
  maxToRenderPerBatch,
  windowSize,
}: ListWithDynamicHeaderProps<any>) => {
  const theme = useColorScheme() ?? "dark";
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
        indicatorStyle={theme === "dark" ? "white" : "black"}
        showsHorizontalScrollIndicator={true}
        ListHeaderComponent={ListHeaderComponent}
        onScroll={handleScroll}
        ref={ref}
        contentContainerStyle={{ paddingTop: headerHeight }}
        ListFooterComponent={ListFooterComponent}
        initialNumToRender={initialNumToRender}
        maxToRenderPerBatch={maxToRenderPerBatch}
        windowSize={windowSize}
      />
    </View>
  );
};

export default ListWithDynamicHeader;
