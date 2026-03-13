import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
    Cart,
    DetailProduct,
    KelolaProduct,
    Home,
    Profile,
    SplashScreen,
    TambahProduct,
    UbahProduct,
    HistoryPesanan,
    LoginPage,
    DetailTransaksi,
    Laporan,
    CekEmail,
    ChangePass,
    SetAkun,
    TambahUser,
} from "../pages";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ButtonTabs  from "../components/buttonTabs/index";
import UbahUser from "../pages/ubahUser";

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

// const MainApp = () => {
//     return (
//         <Tab.Navigator
//             screenOptions={{ headerShown: false }}
//             tabBar={(props) => <ButtonTabs {...props} />}
//         >
//             <Tab.Screen name="Home" component={Home} />
//             <Tab.Screen name="Cart" component={Cart} />
//             <Tab.Screen name="HistoryPesanan" component={HistoryPesanan} />
//             <Tab.Screen name="Staff" component={Home} />
//         </Tab.Navigator>
//     );
// };

const Router = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
            <Stack.Screen name="LoginPage" component={LoginPage} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="KelolaProduct" component={KelolaProduct} />
            <Stack.Screen name="Cart" component={Cart} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="DetailProduct" component={DetailProduct} />
            <Stack.Screen name="Laporan" component={Laporan} />
            <Stack.Screen name="CekEmail" component={CekEmail} />
            <Stack.Screen name="ChangePass" component={ChangePass} />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Detail Transaksi",
                }}
                name="DetailTransaksi"
                component={DetailTransaksi}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Tambah Product",
                }}
                name="TambahProduct"
                component={TambahProduct}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Ubah Product",
                }}
                name="UbahProduct"
                component={UbahProduct}
            />
            <Stack.Screen name="HistoryPesanan" component={HistoryPesanan} />
            <Stack.Screen name="KelolaUser" component={SetAkun} />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Tambah User",
                }}
                name="TambahUser"
                component={TambahUser}
            />
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Ubah User",
                }}
                name="UbahUser"
                component={UbahUser}
            />
        </Stack.Navigator>
    );
};

export default Router;
