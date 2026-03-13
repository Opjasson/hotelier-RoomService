import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from "react-native";
import { AntDesign, Entypo, FontAwesome } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";

interface props {
    navigation: NavigationProp<any, any>;
    route: RouteProp<any, any>;
}

const DetailProduct: React.FC<props> = ({ navigation, route }) => {
    const sendData = route.params?.data;
    const sendTransId = route.params?.idTrans;
    const sendIdUser = route.params?.idUser;
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
            productId: number;
        }[]
    >([]);
    const [loading, setLoading] = useState(true); // opsional
    const [idTransaksi, setIdTransaksi] = useState<number>();

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
                    productId: item.productId,
                };
            },
        );

        setDataShow(hasilKeranjang || []);
    }, [dataTransaksi, products, username]);

    const findData = dataShow.find((item) => item.productId === sendData.id);
    // console.log("test", dataShow);
    console.log("dataShow", findData);

    // end data transaksi ---------------------

    // handle add to cart button --------------
    const addCart = async () => {
        if (findData) {
            navigation.navigate("Cart");
        } else {
            try {
                await fetch(`http://192.168.27.12:5000/cart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        qty: 1,
                        productId: sendData.id,
                        userId: sendIdUser,
                        transaksiId: sendTransId,
                    }),
                });
                navigation.navigate("Cart");
            } catch (error) {
                alert("ada error nih");
            }
        }
    };
    // end handle add to cart button -----------

    return (
        <ScrollView style={styles.container}>
            {/* Header Image */}
            <View style={styles.imageContainer}>
                <Image src={sendData.img_product} style={styles.image} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.navigate("Home")}
                >
                    <Text style={{color: "white", fontSize: 30}}>◀</Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <View>
                        <Text style={styles.title}>
                            {sendData.nama_product}
                        </Text>
                        <Text style={styles.subtitle}>
                            {sendData.kategori_product}
                        </Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>About</Text>
                <Text style={styles.aboutText}>{sendData.deskripsi}</Text>

                <View style={styles.cartRow}>
                    <TouchableOpacity
                        style={styles.cartButton}
                        onPress={addCart}
                    >
                        <Text style={styles.cartText}>Add to cart</Text>
                    </TouchableOpacity>
                    <Text style={styles.price}>
                        Rp. {sendData.harga_product.toLocaleString()}
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { backgroundColor: "#fff", flex: 1 },
    imageContainer: { position: "relative" },
    image: {
        width: "100%",
        height: 250,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#00000070",
        padding: 8,
        borderRadius: 20,
    },
    heartButton: {
        position: "absolute",
        top: 40,
        right: 20,
        backgroundColor: "#00000070",
        padding: 8,
        borderRadius: 20,
    },
    content: { padding: 20 },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: { fontSize: 22, fontWeight: "bold", color: "#222" },
    subtitle: { fontSize: 14, color: "#777" },
    rating: {
        flexDirection: "row",
        backgroundColor: "#C4963A",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        alignItems: "center",
    },
    ratingText: {
        color: "#fff",
        marginLeft: 4,
        fontWeight: "600",
    },
    sectionTitle: {
        marginTop: 20,
        fontWeight: "bold",
        fontSize: 16,
        color: "#222",
        borderBottomWidth: 2,
        borderColor: "#C4963A",
    },
    optionRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: "#aaa",
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    optionText: {
        color: "#444",
        fontSize: 14,
    },
    selectedOption: {
        backgroundColor: "#1E5128",
        borderColor: "#1E5128",
    },
    selectedSugar: {
        backgroundColor: "#1E5128",
        borderColor: "#1E5128",
    },
    selectedText: {
        color: "#fff",
    },
    aboutText: {
        marginTop: 10,
        color: "#555",
        fontSize: 14,
        lineHeight: 20,
    },
    cartRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
        alignItems: "center",
    },
    cartButton: {
        backgroundColor: "#50C2C9",
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        flex: 1,
        marginRight: 10,
        alignItems: "center",
    },
    cartText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    price: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#222",
    },
});

export default DetailProduct;
