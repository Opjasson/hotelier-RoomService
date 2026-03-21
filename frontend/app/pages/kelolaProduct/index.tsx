import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { DrawerContent } from "@/app/components";
import MenuDrawer from "react-native-side-drawer";
import { NavigationProp } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

const KelolaProduct: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(true);
    const [products, setProducts] = useState<
        {
            id: number;
            nama_product: string;
            deskripsi: string;
            harga_product: number;
            img_product: string;
            kategori_product: string;
            promo: string;
        }[]
    >([]);
    const [idLogin, setIdLogin] = useState<number>();

    // Get Data Login --------------------------
    const getUserId = async () => {
        const response = await fetch("http://192.168.6.12:5000/login");
        const data = await response.json();
        setIdLogin(Object.values(data)[0]?.id);
    };

    useEffect(() => {
        getUserId();
    }, []);

    const logOut = async () => {
        await fetch(`http://192.168.6.12:5000/login/${idLogin}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        navigation.navigate("LoginPage" as never);
    };

    const getProducts = async () => {
        const response = await fetch("http://192.168.6.12:5000/product");
        const data = await response.json();
        setProducts(data);
        // console.log(data);
    };

    useEffect(() => {
        getProducts();
    }, []);

    const handleDeleteProduct = async (productId: number) => {
        await fetch(`http://192.168.6.12:5000/product/${productId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        alert("Product berhasil dihapus!");
        navigation.navigate("Home");
    };

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
    return (
        <SafeAreaView style={{ paddingBottom: 130, paddingTop: 10 }}>
            {/* Product */}
            <View
                style={{
                    flexDirection: "row",
                    marginBottom: 20,
                    gap: 10,
                    alignItems: "center",
                    paddingTop: 10,
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                }}
            >
                <Text style={{ fontWeight: "500", fontSize: 20 }}>
                    Manage Item Page
                </Text>

                <Ionicons
                    name="menu"
                    size={30}
                    color="black"
                    onPress={() => toggleOpen()}
                />
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                style={{
                    justifyContent: "center",
                    flexDirection: "row",
                    backgroundColor: "#50C2C9",
                    alignItems: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    borderRadius: 30,
                    gap: 5,
                    marginHorizontal: 10,
                }}
                onPress={() => navigation.navigate("TambahProduct")}
                // onPress={() => handleNotif()}
            >
                <Feather name="plus-circle" size={24} color="white" />
                <Text style={{ color: "white" }}>Add Item</Text>
            </TouchableOpacity>

            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={{
                        marginTop: 20,
                    }}
                >
                    {/* Show Products */}

                    {products.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.7}
                            style={styles.card}
                        >
                            <View style={styles.imageContainer}>
                                <Image
                                    src={item?.img_product}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </View>

                            <View style={styles.content}>
                                <Text style={styles.title} numberOfLines={1}>
                                    {item.nama_product}
                                </Text>
                                <Text
                                    style={styles.description}
                                    numberOfLines={2}
                                >
                                    {item.deskripsi.substring(0, 30)}
                                </Text>
                                <View style={styles.footer}>
                                    <Text style={styles.price}>
                                        Rp.
                                        {item.harga_product.toLocaleString()}
                                    </Text>

                                    <TouchableOpacity
                                        // onPress={() => tambahKeKeranjang(item)}
                                        style={styles.addButton}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.addButtonText}>
                                            ✂
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableOpacity>
                        // <TouchableOpacity
                        //     key={index}
                        //     onPress={() =>
                        //         navigation.navigate("UbahProduct", {
                        //             data: item,
                        //         })
                        //     }
                        //     activeOpacity={0.7}
                        //     style={{
                        //         backgroundColor: "white",
                        //         borderRadius: 20,
                        //         paddingHorizontal: 5,
                        //         paddingVertical: 5,
                        //         elevation: 5,
                        //         shadowColor: "black",
                        //         marginRight: 8,
                        //         margin: 8,
                        //     }}
                        // >
                        //     <Image
                        //         src={item.img_product}
                        //         style={{
                        //             width: 144,
                        //             height: 144,
                        //             borderRadius: 20,
                        //         }}
                        //     />
                        //     <View
                        //         style={{
                        //             flexDirection: "row",
                        //             justifyContent: "space-between",
                        //             marginTop: 10,
                        //         }}
                        //     >
                        //         <View>
                        //             <Text
                        //                 style={{
                        //                     fontWeight: "500",
                        //                     fontSize: 14,
                        //                 }}
                        //             >
                        //                 {item.nama_product}
                        //             </Text>
                        //             <Text
                        //                 style={{ marginTop: 5, fontSize: 10 }}
                        //             >
                        //                 {item.kategori_product}
                        //             </Text>
                        //         </View>
                        //     </View>

                        //     <View
                        //         style={{
                        //             flexDirection: "row",
                        //             alignItems: "center",
                        //             justifyContent: "space-between",
                        //         }}
                        //     >
                        //         <Text>
                        //             Rp. {item.harga_product.toLocaleString()}
                        //         </Text>

                        //         <TouchableOpacity
                        //             onPress={() => handleDeleteProduct(item.id)}
                        //         >
                        //             <MaterialIcons
                        //                 name="delete"
                        //                 size={24}
                        //                 color="black"
                        //             />
                        //         </TouchableOpacity>
                        //     </View>
                        // </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            {/* End Product */}
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
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    card: {
        padding: 24,
        flexDirection: "row",
        gap: 16,
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginBottom: 20,
        borderRadius: 10,
        borderWidth: 1,
        elevation: 10,
    },
    imageContainer: {
        width: 96,
        height: 96,
        borderRadius: 8,
        overflow: "hidden",
        backgroundColor: "#f3f4f6",
    },
    image: {
        width: "100%",
        height: "100%",
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: "#111827",
        marginBottom: 4,
        fontWeight: "400",
    },
    description: {
        fontSize: 14,
        color: "#6b7280",
        marginBottom: 12,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    price: {
        fontSize: 18,
        color: "#111827",
    },
    addButton: {
        backgroundColor: "#dc1515",
        paddingHorizontal: 16,
        // paddingVertical: 6,
        borderRadius: 9999,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 20,
        // fontWeight: "500",
    },
    quantityContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: "#f3f4f6",
        borderRadius: 9999,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    quantityButton: {
        width: 28,
        height: 28,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
    },
    quantityText: {
        width: 24,
        textAlign: "center",
        fontWeight: "500",
    },
});

export default KelolaProduct;
