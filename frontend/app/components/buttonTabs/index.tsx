import { Ionicons } from "@expo/vector-icons";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { PlatformPressable } from "@react-navigation/elements";
import { useLinkBuilder, useTheme } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const Icon = ({ label, focus }) => {
    switch (label) {
        case "Home":
            return focus ? (
                <Entypo name="home" size={28} color={"#2f823a"} />
            ) : (
                <Entypo name="home" size={28} color="#fff" />
            );
        case "Cart":
            return focus ? (
                <FontAwesome5 name="cart-arrow-down" size={24} color="#2f823a" />
            ) : (
                <FontAwesome5 name="cart-arrow-down" size={24} color="#fff" />
            );
        case "HistoryPesanan":
            return focus ? (
                <FontAwesome name="history" size={24} color="#2f823a" />
            ) : (
                <FontAwesome name="history" size={24} color="#fff" />
            );
        case "Staff":
            return focus ? (
                <MaterialCommunityIcons name="human-male-board-poll" size={24} color="#2f823a" />
            ) : (
                <MaterialCommunityIcons name="human-male-board-poll" size={24} color="#fff" />
            );
    }
};

const ButtonTabs = ({ state, descriptors, navigation }) => {
    const { colors } = useTheme();
    const { buildHref } = useLinkBuilder();

    const insets = useSafeAreaInsets();
    return (
        <SafeAreaView
            edges={["bottom"]} // Hanya aktifkan padding di bawah
            style={{
                backgroundColor: "#50C2C9",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                // Jangan kasih height/padding di sini, biarkan mengikuti View di dalam
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: "#50C2C9",
                    paddingHorizontal: 50,
                    paddingTop: 20,
                    paddingBottom: 15,

                    // 3. ALIGNMENT: Pastikan Icon sejajar vertikal di tengah
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                }}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                              ? options.title
                              : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key,
                        });
                    };

                    return (
                        <PlatformPressable
                            key={index}
                            href={buildHref(route.name, route.params)}
                            accessibilityState={
                                isFocused ? { selected: true } : {}
                            }
                            accessibilityLabel={
                                options.tabBarAccessibilityLabel
                            }
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                        >
                            <Icon label={label} focus={isFocused} />
                        </PlatformPressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
};

export default ButtonTabs;

