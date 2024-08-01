// // import { Redirect } from "expo-router/build/exports";

// // export default () => <Redirect href={"/groups"} />;

// // SignUpScreen.tsx
// import React from "react";
// import { View } from "react-native";

// import * as WebBrowser from "expo-web-browser";

// import LogoutButton from "@/components/buttons/logout-button";
// import PrimaryButton from "@/components/buttons/primary-button";
// import { useSession } from "@/providers/session-provider";

// WebBrowser.maybeCompleteAuthSession();

// const SignUpScreen = ({}) => {
//   const { getAccessToken } = useSession();

//   return (
//     <View className="mt-20">
//       <LogoutButton />
//       <PrimaryButton
//         title="getAccess"
//         handlePress={() => {
//           const myFunction = async () => {
//             const test = await getAccessToken();
//             console.log(test);
//           };
//           myFunction();
//         }}
//       />
//     </View>
//   );
// };

// export default SignUpScreen;
