import React, { useEffect, useState, useMemo } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Button,
    TextInput,
    StatusBar,
    Platform,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GopayLogo } from "@/app/inventory/icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { DrawerContent } from "@/app/components";
import MenuDrawer from "react-native-side-drawer";
import { NavigationProp } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

const Cart: React.FC<props> = ({ navigation }) => {
    const [image, setImage] = useState<string>();
    const [imgSend, setImgSend] = useState<string>();
    const [id, setId] = useState<number>();
    const [idLogin, setIdLogin] = useState<number>();
    const [user, setUser] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState(true);
    const [dataTransaksi, setDataTransaksi] = useState<
        {
            id: number;
            namaPelanggan: string;
            status: boolean;
            buktiBayar: string;
            cash: number;
            keranjangs: [
                {
                    id: string;
                    qty: number;
                    productId: number;
                    transaksiId: number;
                },
            ];
        }[]
    >([]);
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

    const [dataShow, setDataShow] = useState<
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
    const [loading, setLoading] = useState(true); // opsional
    const [idTransaksi, setIdTransaksi] = useState<number>();

    const [catatan, setCatatan] = useState<string>();
    const [cash, setCash] = useState<number>(0);

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    // get product -----------------------
    const getProducts = async () => {
        const response = await fetch("http://192.168.27.12:5000/product");
        const data = await response.json();
        setProducts(data);
    };

    useEffect(() => {
        getProducts();
    }, []);

    // end get product --------------------

    // Get Data Login --------------------------
    const getUserId = async () => {
        const response = await fetch("http://192.168.27.12:5000/login");
        const data = await response.json();
        setIdLogin(Object.values(data)[0]?.id);
        setId(Object.values(data)[0]?.userId);
    };

    useEffect(() => {
        getUserId();
    }, []);

    const getAkunLoggin = async () => {
        const response = await fetch(`http://192.168.27.12:5000/user/${id}`);
        const user = await response.json();
        // console.log("login",user);
        if (user != null) {
            setUser(user.role);
            setUsername(user.username);
        } else {
            setUser("");
            setUsername("");
        }
    };

    const logOut = async () => {
        await fetch(`http://192.168.27.12:5000/login/${idLogin}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        navigation.navigate("LoginPage" as never);
    };
    getAkunLoggin();
    // end data login ---------------------

    // data transaksi ----------------------

    useEffect(() => {
        const getTransaksi = async () => {
            const response = await fetch("http://192.168.27.12:5000/transaksi");
            const transaksiS = await response.json();
            setDataTransaksi(transaksiS.response);
            setLoading(false);
        };
        getTransaksi();
    }, []); // hanya sekali saat mount

    useEffect(() => {
        if (dataTransaksi.length === 0) return;

        const transaksiNamaPelangganUser = dataTransaksi.filter(
            (item) => item.namaPelanggan === username,
        );
        const transaksiStatusUser = transaksiNamaPelangganUser.filter(
            (item) => item.buktiBayar === null && item.cash === null,
        );

        if (transaksiStatusUser.length === 0) return;

        setIdTransaksi(transaksiStatusUser[0].id);

        const productMap = Object.fromEntries(products.map((p) => [p.id, p]));

        const hasilKeranjang = transaksiStatusUser[0]?.keranjangs.map(
            (item) => {
                const product = productMap[item.productId];
                return {
                    id: item.id,
                    nama_product: product?.nama_product,
                    img_product: product?.img_product,
                    kategori: product?.kategori_product,
                    harga: product?.harga_product,
                    qty: item.qty,
                };
            },
        );

        setDataShow(hasilKeranjang || []);
    }, [dataTransaksi, products, username]);

    // end data transaksi ---------------------

    // hitung total harga
    // Hitung total harga: harga * qty lalu jumlahkan
    const ubahQty = (id, increment) => {
        const update = dataShow.map((item) => {
            if (item.id === id) {
                const newQty = item.qty + increment;
                return { ...item, qty: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        setDataShow(update);
    };

    console.log(dataShow);

    const totalHarga = useMemo(() => {
        return dataShow.reduce(
            (total, item) => total + item.harga * item.qty,
            0,
        );
    }, [dataShow]);

    // end hitung total -----------------------

    // Handle delete cart ---------------------
    const handleDeleteCart = async (cartId: number) => {
        await fetch(`http://192.168.27.12:5000/cart/${cartId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });
        navigation.navigate("Home");
    };
    // end handle delete cart -------------------

    // handle uplod image --------------------
    useEffect(() => {
        (async () => {
            if (Platform.OS !== "web") {
                const { status } =
                    await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== "granted") {
                    alert("Permission to access gallery is required!");
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            uploadToCloudinary(result.assets[0].uri);
        }
    };

    const uploadToCloudinary = async (imageUri) => {
        const data2 = new FormData();

        // Ekstrak file name dan type dari URI
        const fileName = imageUri.split("/").pop();
        const fileType = fileName.split(".").pop();

        data2.append("file", {
            uri: imageUri,
            name: fileName,
            type: `image/${fileType}`,
        });

        data2.append("upload_preset", "Cloudinary_my_first_time"); // dari cloudinary
        data2.append("cloud_name", "dqcnnluof");

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dqcnnluof/image/upload",
                {
                    method: "POST",
                    body: data2,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            const json = await res.json();
            setImgSend(json.secure_url);
            console.log("Uploaded URL:", json.secure_url);
        } catch (error) {
            console.error("Upload failed:", error);
        }
    };

    // end handle uplod image --------------

    // handle buy button -----------------------
    const buyHandle = async () => {
        if ((dataShow.length > 0 && imgSend?.length > 0) || cash > 0) {
            try {
                dataShow.forEach(async (item: any) => {
                    await fetch(`http://192.168.27.12:5000/cart/${item.id}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            qty: item.qty,
                        }),
                    });
                });

                await fetch(
                    `http://192.168.27.12:5000/transaksi/${idTransaksi}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            totalHarga: totalHarga,
                            buktiBayar: imgSend,
                            catatanTambahan: catatan,
                            cash: cash,
                        }),
                    },
                );
                alert("Pesanan Sedang Diproses :)");
                navigation.navigate("Home");
            } catch (error) {
                console.log(error);
            }
        } else {
            alert("Anda belum menyelesaikan pemesanan!");
        }
    };
    // end handle buy button --------------------

    const sideBarContent = () => {
        return (
            <DrawerContent
                toggleOpen={toggleOpen}
                onPress1={() => navigation.navigate("Cart")}
                onPress2={() => navigation.navigate("Home")}
                onPress3={() => navigation.navigate("HistoryPesanan")}
                status={user === "kasir" ? false : true}
                onPress4={() => logOut()}
                onPress5={() => navigation.navigate("KelolaProduct")}
                onPress6={() => navigation.navigate("Laporan")}
                onPress7={() => navigation.navigate("KelolaUser")}
            />
        );
    };
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                style={{
                    flex: 1,
                    backgroundColor: "#FBFBFB",
                    paddingBottom: 20,
                }}
            >
                <StatusBar barStyle={"default"} />
                <View
                    style={{
                        flexDirection: "row",
                        marginBottom: 20,
                        gap: 10,
                        alignItems: "center",
                        paddingTop: 10,
                        justifyContent: "space-between",
                    }}
                >
                    <Text style={{ fontWeight: "500", fontSize: 20 }}>
                        Cart User Page
                    </Text>

                    <Ionicons
                        name="menu"
                        size={30}
                        color="black"
                        onPress={() => toggleOpen()}
                    />
                </View>

                {dataShow.map((item, index) => (
                    <View style={styles.card} key={index}>
                        <Image src={item.img_product} style={styles.image} />
                        <View style={styles.cardContent}>
                            <View style={styles.rowBetween}>
                                <View>
                                    <Text style={styles.productTitle}>
                                        {item.nama_product}
                                    </Text>
                                    <Text style={styles.productSubtitle}>
                                        {item.kategori}
                                    </Text>
                                </View>
                                <Text style={styles.price}>
                                    Rp {item.harga.toLocaleString()}
                                </Text>
                            </View>

                            <View style={styles.quantityRow}>
                                <Text style={styles.quantity}>{item.qty}</Text>

                                <TouchableOpacity
                                    style={styles.plusButton}
                                    onPress={() => ubahQty(item.id, -1)}
                                >
                                    <AntDesign
                                        name="minus"
                                        size={18}
                                        color="#fff"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.plusButton}
                                    onPress={() => ubahQty(item.id, 1)}
                                >
                                    <AntDesign
                                        name="plus"
                                        size={18}
                                        color="#fff"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleDeleteCart(item.id)}
                                >
                                    <FontAwesome
                                        name="trash"
                                        size={24}
                                        color="black"
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))}

                {/* Summary */}
                <View style={styles.summary}>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Note Plus"
                        onChangeText={(text) => setCatatan(text)}
                        multiline={true}
                        numberOfLines={4}
                    />

                    {/* <TextInput
                        style={{
                            borderWidth: 1,
                            borderColor: "gray",
                            borderRadius: 8,
                            marginTop: 10,
                        }}
                        keyboardType="number-pad"
                        placeholder="Cash"
                        onChangeText={(text) => setCash(Number(text))}
                    /> */}

                    <View style={styles.summaryRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalLabel}>
                            Rp {totalHarga?.toLocaleString()}
                        </Text>
                    </View>
                </View>

                {/* Payment */}
                <Text style={styles.paymentLabel}>Payment</Text>
                <View style={styles.paymentMethods}>
                    <Text style={{ alignSelf: "center" }}>Gopay</Text>
                    <Text style={{ alignSelf: "center" }}>
                        : +62 877-3818-2043
                    </Text>
                </View>
                <View style={styles.paymentMethods}>
                    <Text style={{ alignSelf: "center" }}>Dana</Text>
                    <Text style={{ alignSelf: "center" }}>
                        : +62 877-3818-2043
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => pickImage()}
                >
                    <Ionicons name="camera-outline" size={24} color="white" />
                    <Text style={{ color: "#fff" }}>Proof Of Payment</Text>
                </TouchableOpacity>

                {image?.length > 0 ? (
                    <Image
                        resizeMode="cover"
                        style={styles.img}
                        src={image}
                    />
                ) : (
                    ""
                )}

                {/* Buy Button */}
                <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => buyHandle()}
                >
                    <Text style={styles.buyText}>PROCESS</Text>
                </TouchableOpacity>
                <MenuDrawer
                    open={open}
                    position={"left"}
                    drawerContent={sideBarContent()}
                    drawerPercentage={70}
                    animationTime={250}
                    overlay={true}
                    opacity={0.4}
                ></MenuDrawer>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    img: {
        width: 300,
        height: 600,
        marginHorizontal: "auto",
        borderRadius: 8,
        elevation: 5,
    },
    textArea: {
        width: "100%",
        height: 100,
        borderColor: "gray",
        borderWidth: 1,
        padding: 10,
        fontSize: 16,
        borderRadius: 10,
    },
    button: {
        backgroundColor: "#50C2C9",
        width: "100%",
        padding: 8,
        alignItems: "center",
        borderRadius: 9,
        color: "#fff",
        marginTop: 20,
    },
    container: {
        paddingHorizontal: 20,
        backgroundColor: "#fff",
        paddingBottom: 20,
    },
    cartTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
    card: {
        flexDirection: "row",
        backgroundColor: "#fdfdfd",
        borderRadius: 16,
        marginBottom: 16,
        padding: 10,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    cardContent: {
        flex: 1,
        marginLeft: 10,
        justifyContent: "space-between",
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    productTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    productSubtitle: {
        fontSize: 12,
        color: "#666",
    },
    price: {
        fontWeight: "bold",
        color: "#000",
    },
    detailText: {
        fontSize: 12,
        marginTop: 4,
    },
    boldText: {
        fontWeight: "bold",
    },
    quantityRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 12,
    },
    quantity: {
        fontSize: 16,
        fontWeight: "bold",
    },
    plusButton: {
        backgroundColor: "#1E5128",
        padding: 6,
        borderRadius: 20,
    },
    likeButton: {
        position: "absolute",
        top: 8,
        right: 8,
    },
    summary: {
        marginTop: 16,
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4,
    },
    totalLabel: {
        fontWeight: "bold",
        fontSize: 16,
    },
    paymentLabel: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: "bold",
    },
    paymentMethods: {
        flexDirection: "row",
        marginTop: 10,
        gap: 16,
    },
    paymentIcon: {
        width: 70,
        height: 50,
    },
    buyButton: {
        backgroundColor: "#50C2C9",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    buyText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

export default Cart;
