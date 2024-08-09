import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";

const ListFooterComponent = () => {
  return (
    <ThemedView className="h-[80] w-max items-center justify-center border-t-[1px] border-primary-light/50">
      <ThemedText>NUNTIUS</ThemedText>
    </ThemedView>
  );
};

export default ListFooterComponent;
