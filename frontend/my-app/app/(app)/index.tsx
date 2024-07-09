// import { SafeAreaView, Pressable, TouchableHighlight } from "react-native";
// import { router } from "expo-router";

// import { ThemedText } from "@/components/ThemedText";
// import { StatusBar } from "expo-status-bar";
// import { TouchableRipple } from "react-native-paper";

// export default function HomeScreen() {
//   return (
//     <SafeAreaView className="flex-1 items-center justify-center">
//       <StatusBar style="auto" />

//       <Pressable
//         onPress={() => {
//           router.replace("/");
//         }}
//       >
//         <TouchableRipple
//           className="h-40 w-40 bg-white"
//           onPress={() => console.log("Pressed")}
//           rippleColor="rgba(0, 0, 0, .32)"
//         >
//           <ThemedText>Click me</ThemedText>
//         </TouchableRipple>
//         <ThemedText>Click me</ThemedText>
//       </Pressable>
//     </SafeAreaView>
//   );
// }

import FormTextField from "@/components/form/FormTextField";
import { ThemedText } from "@/components/ThemedText";
import React, { createContext, useState, useContext, useEffect } from "react";
import { View, Text, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ChatType = {
  id: number;
  name: string;
  lastMessageTime: number;
};

type ChatContextType = {
  chats: ChatType[];
  addOrUpdateChat: (chat: ChatType) => void;
};

const ChatContext = createContext<ChatContextType>({
  chats: [],
  addOrUpdateChat: () => {},
});

export const useChat = () => useContext(ChatContext);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [chats, setChats] = useState<ChatType[]>([
    { id: 1, name: "user1", lastMessageTime: new Date().getTime() },
    { id: 2, name: "user2", lastMessageTime: new Date().getTime() - 1000 },
    { id: 3, name: "user3", lastMessageTime: new Date().getTime() - 2000 },
    { id: 4, name: "user4", lastMessageTime: new Date().getTime() - 3000 },
  ]);

  const addOrUpdateChat = (chat: ChatType) => {
    setChats((prevChats: ChatType[]) => {
      const existingChatIndex = prevChats.findIndex((c) => c.id === chat.id);
      if (existingChatIndex !== -1) {
        // Update existing chat
        const updatedChats = [...prevChats];
        updatedChats[existingChatIndex] = chat;
        return updatedChats.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime,
        );
      } else {
        // Add new chat
        const updatedChats = [...prevChats, chat];
        return updatedChats.sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime,
        );
      }
    });
  };

  return (
    <ChatContext.Provider value={{ chats, addOrUpdateChat }}>
      {children}
    </ChatContext.Provider>
  );
};

const ChatItem = React.memo(({ item }: { item: ChatType }) => (
  <View>
    <Text>{item.name}</Text>
    <Text>{new Date(item.lastMessageTime).toLocaleTimeString()}</Text>
  </View>
));

const ChatList = ({ chats }: { chats: ChatType[] }) => {
  const renderItem = ({ item }: { item: ChatType }) => <ChatItem item={item} />;

  return (
    <FlatList
      data={chats}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const App = () => {
  const { chats, addOrUpdateChat } = useChat();

  const [value1, setValue1] = useState("");
  const [value2, setValue2] = useState("");

  // useWebSocket();
  return (
    <View className="">
      <SafeAreaView className="">
        <ChatList chats={chats} />

        <View className="mt-10">
          <Pressable
            onPress={() => {
              addOrUpdateChat({
                id: 10,
                lastMessageTime: new Date().getTime(),
                name: "user5",
              });
            }}
          >
            <ThemedText>add id 5</ThemedText>
          </Pressable>
        </View>
        <View className="mt-10">
          <Pressable
            onPress={() => {
              addOrUpdateChat({
                id: 1,
                lastMessageTime: new Date().getTime(),
                name: "user1",
              });
            }}
          >
            <ThemedText>update id 1</ThemedText>
          </Pressable>
        </View>
        <View className="mt-10">
          <Pressable
            onPress={() => {
              addOrUpdateChat({
                id: 2,
                lastMessageTime: new Date().getTime(),
                name: "user2",
              });
            }}
          >
            <ThemedText>update id 2</ThemedText>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default () => (
  <ChatProvider>
    <App />
  </ChatProvider>
);

// const socket = io('https://yourserver.com');

// const useWebSocket = () => {
//   const { addOrUpdateChat } = useChat();

//   useEffect(() => {
//     socket.on('new_or_updated_chat', (chat) => {
//       addOrUpdateChat(chat);
//     });

//     return () => {
//       socket.off('new_or_updated_chat');
//     };
//   }, []);
// };
