import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContent } from "@/app/components";
import MenuDrawer from "react-native-side-drawer";
import { NavigationProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

const HistoryPesanan: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(true);
    const [idLogin, setIdLogin] = useState<number>();
    const [historyTransaksi, setHistoryTransaksi] = useState<
        {
            keranjangs: [
                {
                    id: number;
                    qty: number;
                    createdAt: number;
                    productId: number;
                    userId: number;
                    transaksiId: number;
                },
            ];
            id: number;
            uuid: string;
            totalHarga: number;
            createdAt: string;
            namaPelanggan: string;
            status: boolean;
            buktiBayar: string;
            catatanTambahan: string;
        }[]
    >([]);

    const [barang, setBarang] = useState<
        {
            id: number;
            nama_product: string;
            harga_product: number;
            stok: number;
        }[]
    >([]);

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const sideBarContent = () => {
        return (
            <DrawerContent
                toggleOpen={toggleOpen}
                onPress1={() => navigation.navigate("Cart")}
                onPress2={() => navigation.navigate("Home")}
                onPress3={() => navigation.navigate("HistoryPesanan")}
                onPress4={() => logOut()}
                onPress5={() => navigation.navigate("KelolaProduct")}
                onPress6={() => navigation.navigate("Laporan")}
                onPress7={() => navigation.navigate("KelolaUser")}
            />
        );
    };

    // Get Data Login --------------------------
    const getUserId = async () => {
        const response = await fetch("http://192.168.27.12:5000/login");
        const data = await response.json();
        setIdLogin(Object.values(data)[0]?.id);
    };

    useEffect(() => {
        getUserId();
    }, []);

    const logOut = async () => {
        await fetch(`http://192.168.27.12:5000/login/${idLogin}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        navigation.navigate("LoginPage" as never);
    };

    const getHistorys = async () => {
        try {
            const response = await fetch("http://192.168.27.12:5000/transaksi");
            const history = (await response.json()) as {
                response: {
                    keranjangs: [
                        {
                            id: number;
                            qty: number;
                            createdAt: number;
                            productId: number;
                            userId: number;
                            transaksiId: number;
                        },
                    ];
                    id: number;
                    uuid: string;
                    totalHarga: number;
                    createdAt: string;
                    namaPelanggan: string;
                    status: boolean;
                    buktiBayar: string;
                    catatanTambahan: string;
                }[];
            };
            const dataArray = history.response;
            // console.log(dataArray[0].keranjangs);

            setHistoryTransaksi(dataArray);
        } catch (error) {
            console.log(error);
        }
    };

    const getDataBarang = async () => {
        try {
            const response = await fetch("http://192.168.27.12:5000/product");
            const barang = await response.json();
            console.log(barang);
            setBarang(barang);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDataBarang();
    }, []);

    useEffect(() => {
        getHistorys();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={"default"} />

            <View
                style={{
                    flexDirection: "row",
                    marginBottom: 20,
                    gap: 10,
                    alignItems: "center",
                    paddingTop: 10,
                    justifyContent: "space-between",
                    paddingHorizontal: 20
                }}
            >
                <Text style={{ fontWeight: "500", fontSize: 20 }}>
                    Order History Page
                </Text>

                <Ionicons
                    name="menu"
                    size={30}
                    color="black"
                    onPress={() => toggleOpen()}
                />
            </View>

            <ScrollView>
                {[...historyTransaksi]
                    .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    )
                    .map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.card}
                            onPress={() =>
                                navigation.navigate("DetailTransaksi", {
                                    uuid: item.uuid,
                                })
                            }
                        >
                            <View style={styles.rowBetween}>
                                <Text style={styles.date}>
                                    {item.createdAt.split("T")[0]}
                                </Text>
                                <Text style={styles.type}>
                                    Status{" "}
                                    {item.status === null ? (
                                        <Text>✘</Text>
                                    ) : (
                                        <Text>✔</Text>
                                    )}
                                </Text>
                            </View>
                            <View style={styles.titleRow}>
                                <View style={styles.verticalLine} />
                                <View style={styles.content}>
                                    <Text style={styles.title}>
                                        Username : {item.namaPelanggan}
                                    </Text>
                                    <Text style={styles.location}>
                                        Id Pesanan : {item.uuid.slice(0, 8)}
                                    </Text>
                                    {item.keranjangs.map((name, idx) => (
                                        <Text key={idx} style={styles.name}>
                                            {
                                                barang.find(
                                                    (a) =>
                                                        a.id === name.productId,
                                                )?.nama_product
                                            }{" "}
                                            x {name.qty}
                                        </Text>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.rowBetween}>
                                <TouchableOpacity>
                                    <Text style={styles.showLess}>
                                        Total Nominal :
                                    </Text>
                                </TouchableOpacity>
                                <Text style={styles.price}>
                                    {item.totalHarga}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
            </ScrollView>

            <MenuDrawer
                open={open}
                position={"left"}
                drawerContent={sideBarContent()}
                drawerPercentage={70}
                animationTime={250}
                overlay={true}
                opacity={0.4}
            ></MenuDrawer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingBottom: 20,
        paddingTop: 10,
    },
    card: {
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        padding: 16,
        elevation: 2,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    date: {
        fontSize: 13,
        color: "#333",
    },
    type: {
        fontSize: 13,
        color: "#fff",
        backgroundColor: "#50C2C9",
        padding: 5,
        borderRadius: 5
    },
    titleRow: {
        flexDirection: "row",
        marginTop: 8,
    },
    verticalLine: {
        width: 5,
        borderRadius: 3,
        backgroundColor: "red",
        marginRight: 10,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    location: {
        fontSize: 14,
        color: "#555",
        marginTop: 2,
    },
    name: {
        fontSize: 13,
        color: "#333",
        marginTop: 2,
    },
    showLess: {
        fontSize: 13,
        color: "#888",
        marginTop: 8,
    },
    price: {
        fontWeight: "bold",
        fontSize: 16,
        marginTop: 8,
    },
    fab: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#FDCB00",
        padding: 18,
        borderRadius: 50,
        elevation: 5,
    },
});

export default HistoryPesanan;
