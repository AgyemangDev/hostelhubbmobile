import React from "react";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { TransactionProvider } from "../../../context/TransactionContext";
import { CustomHeader } from "../(bookings)/_layout";

const ProfileLayout = () => {
  const router = useRouter();

  return (
    <TransactionProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="howHostelHubbWorks"
         options={{
            headerShown: true,
            header: () => <CustomHeader title="How Hostelhubb Works" showBack />,
          }} />

        <Stack.Screen
          name="personalInfo"
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Personal Info" showBack />,
          }}
        />
        <Stack.Screen
          name="reportAConcern"
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Report Concern" showBack />,
          }}
        />
        <Stack.Screen
          name="reviews"
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Reviews" showBack />,
          }}
        />
        <Stack.Screen
          name="transactions"
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Transactions" showBack />,
          }}
        />
        <Stack.Screen
          name="referralInfo"
          options={{
            headerShown: true,
            header: () => <CustomHeader title="Referral Program" showBack />,
          }}
        />
        <Stack.Screen
          name="contactHostel"
          options={{
            headerShown: true,
            header: () => <CustomHeader title="About Us" showBack />,
          }}
        />
      </Stack>
    </TransactionProvider>
  );
};

export default ProfileLayout;