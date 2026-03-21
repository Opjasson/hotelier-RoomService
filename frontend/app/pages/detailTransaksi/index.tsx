import { NavigationProp, RouteProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import * as FileSystem from "expo-file-system";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    route: RouteProp<any, any>;
    navigation: NavigationProp<any, any>;
}

const DetailTransaksi: React.FC<props> = ({ route, navigation }) => {
    const [id, setId] = useState<number>();
    const [uuid, setUuid] = useState<string>();
    const [date, setDate] = useState(new Date());
    const [cart, setCart] = useState<
        {
            qty: number;
            productId: number;
            transaksiId: number;
        }[]
    >([]);

    const [totalHarga, setTotalHarga] = useState<number>();
    const [createdAt, setCreatedAt] = useState<string>();
    const [pelanggan, setPelanggan] = useState<string>();
    const [room, setRoom] = useState<string>();
    const [buktiBayar, setBuktiBayar] = useState<string>();
    const [cash, setCash] = useState<number>();
    const [catatanTambahan, setCatatanTambahan] = useState<number>();
    const [status, setStatus] = useState<number>();

    const routeUuid = route.params?.uuid;

    const getTransaksiByUUID = async () => {
        const response = await fetch(
            `http://192.168.27.12:5000/transaksi/${routeUuid}`,
        );
        const dataJson = await response.json();
        console.log("Datanyg",dataJson);
        

        if (dataJson != null) {
            setCart(dataJson.keranjangs);
            setUuid(dataJson.uuid);
            setTotalHarga(dataJson.totalHarga);
            setPelanggan(dataJson.namaPelanggan);
            setRoom(dataJson.email);
            setBuktiBayar(dataJson.buktiBayar);
            setCatatanTambahan(dataJson.catatanTambahan);
            setCash(dataJson.cash);
            setStatus(dataJson.status);
            setCreatedAt(dataJson.createdAt);
            setId(dataJson.id);
        } else {
            setCart([]);
            setUuid("");
            setTotalHarga(0);
            setPelanggan("");
            setBuktiBayar("");
            setCatatanTambahan(2);
            setCash(1);
            setStatus(1);
            setCreatedAt("");
            setId(1);
        }
    };

    const [barang, setBarang] = useState<
        {
            id: number;
            nama_product: string;
            harga_product: number;
        }[]
    >([]);
    // console.log(data);

    const getDataBarang = async () => {
        try {
            const response = await fetch("http://192.168.27.12:5000/product");
            const barang = await response.json();
            setBarang(barang);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTransaksiByUUID();
    });

    useEffect(() => {
        getDataBarang();
    }, []);

    const deleteTransaksi = async () => {
        await fetch(`http://192.168.27.12:5000/transaksi/${id}`, {
            method: "DELETE",
        });
        alert("Transaksi Berhasil Dihapus!");
        navigation.navigate("HistoryPesanan");
    };

    const handleUpdateStatus = async () => {
        await fetch(`http://192.168.27.12:5000/transaksi/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                status: true,
            }),
        });
        // handleNotif();

        await AsyncStorage.setItem("infoPesanan", `${pelanggan}`);

        alert("Status Selesai!");
        navigation.navigate("HistoryPesanan");
    };

    // convert tanggal menjadi string
    const dateNow = date.toISOString().split("T")[0];

    // hitungQty nota
    const handleQTyAll = () => {
        const hitungCart = cart.map((a) => a.qty);
        const sum = hitungCart.reduce((acc, curr) => {
            return acc + curr;
        }, 0);

        return sum;
    };

    const handleCetak = () => {
        const rows = cart
            .map(
                (item, index) => `
            <div>Pesanan : ${
                barang.find((e) => e.id === item.productId)?.nama_product
            }<br>${item.qty} x ${
                barang.find((e) => e.id === item.productId)?.harga_product
            }<span class="right">Rp ${
                item.qty *
                barang.find((e) => e.id === item.productId)!.harga_product
            }</span>
            </div>
    `,
            )
            .join("");
        return `
        <html>
        <head>
        <style>
        @page { size: 58mm auto; margin: 0; } body { width: 58mm; font-size: 10px; padding: 5px; font-family: sans-serif; padding: 16px;  }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        .line { border-top: 1px dashed #000; margin: 10px 0; }
        .right { text-align: right; }
        .row { display: flex; justify-content: space-between; }
        </style>
        </head>
        <body>
        <div class="center">
        <h3>Hotel Petra Tegal</h3>
        <p>Jl. KS. Tubun No.65, Slerok, Kec. Tegal Tim., <br> Kota Tegal, Jawa Tengah 52192</p>
        <p>No. Telp: +62 877-3818-2043</p>
        </div>
        <div class="line"></div>
        <div class="row"><span>${dateNow}</span></div>
        <div class="row"><span>Pelanggan: ${pelanggan}</span></div>
        <div>No.xxxx</div>
        <div class="line"></div>
        
        list pesanan
              
            ${rows}
              <div class="line"></div>
              <div class="row"><span>Jumlah barang</span><span>Qty : ${handleQTyAll()}</span></div>
              <div class="row bold"><span>Total</span><span>Rp ${totalHarga?.toLocaleString()}</span></div>
              <div class="row"><span>Bayar (Cash)</span><span>Rp ${totalHarga?.toLocaleString()}</span></div>
              <div class="row"><span>Kembali</span><span>Rp ${
                  totalHarga! - totalHarga!
              }</span></div>
        
              <div class="center"><p>Terima kasih telah berbelanja</p></div>
            </body>
          </html>
        `;
    };

    const handleSavePdf = async () => {
        const htmlContent = handleCetak();

        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
        });

        const customFileName = `Nota Transaksi - Hotel Petra_${dateNow}.pdf`;

        // buat file target
        const targetFile = new FileSystem.File(
            FileSystem.Paths.document,
            customFileName,
        );

        // cek dulu
        if (await targetFile.exists) {
            await targetFile.delete();
        }

        // file sumber
        const sourceFile = new FileSystem.File(uri);

        // move → harus File object
        await sourceFile.move(targetFile);

        // share pakai uri hasil target
        await Sharing.shareAsync(targetFile.uri);
    };

    return (
        <SafeAreaView>
            <ScrollView>
                <View
                    style={{
                        justifyContent: "center",
                        gap: 10,
                        flexDirection: "row",
                        marginBottom: 10,
                        marginHorizontal: 10,
                    }}
                >
                    {/* Button Selesai */}
                    <TouchableOpacity
                        style={[styles.button, styles.finish]}
                        onPress={() => handleUpdateStatus()}
                    >
                        <MaterialIcons
                            name="check-circle"
                            size={20}
                            color="#fff"
                        />
                        <Text style={styles.text}>Selesai</Text>
                    </TouchableOpacity>

                    {/* Button Delete */}
                    <TouchableOpacity
                        style={[styles.button, styles.delete]}
                        onPress={() => deleteTransaksi()}
                    >
                        <MaterialIcons name="delete" size={20} color="#fff" />
                        <Text style={styles.text}>Delete</Text>
                    </TouchableOpacity>

                    {/* Button Cetak */}
                    <TouchableOpacity
                        style={[styles.button, styles.print]}
                        onPress={handleSavePdf}
                    >
                        <MaterialIcons name="print" size={20} color="#fff" />
                        <Text style={styles.text}>Cetak</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.card}>
                    {/* HEADER */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.orderId}>
                                Order Id : {uuid?.slice(0, 8)}
                            </Text>
                            <Text style={styles.date}>
                                {createdAt?.split("T")[0]}
                            </Text>
                        </View>

                        <Text style={styles.type}>
                            Status{" "}
                            {status === null ? <Text>✘</Text> : <Text>✔</Text>}
                        </Text>
                    </View>

                    {/* USER */}
                    <Text style={styles.username}>
                        Username : 👤 {pelanggan}
                    </Text>

                    <Text style={styles.username}>
                        Username : 👤 {room}
                    </Text>

                    {/* ITEMS */}

                    <View style={styles.itemsContainer}>
                        {cart.map((name, idx) => (
                            <View key={idx} style={styles.itemRow}>
                                <Text key={idx} style={styles.name}>
                                    {
                                        barang.find(
                                            (a) => a.id === name.productId,
                                        )?.nama_product
                                    }{" "}
                                    x {name.qty}
                                </Text>

                                <Text style={styles.itemPrice}>
                                    Rp{" "}
                                    {
                                        barang.find(
                                            (a) => a.id === name.productId,
                                        )?.harga_product
                                    }{" "}
                                </Text>
                            </View>
                        ))}

                        <Text style={{ marginTop: 7, borderTopWidth: 2 }}>
                            Catatan Tambahan :
                        </Text>
                        <Text style={styles.location}>{catatanTambahan}</Text>

                        <Text style={{ marginTop: 7, borderTopWidth: 2 }}>
                            Bukti Bayar :
                        </Text>

                        {buktiBayar?.length > 0 ? (
                            <Image
                                resizeMode="cover"
                                style={styles.img}
                                src={buktiBayar}
                            />
                        ) : (
                            ""
                        )}
                    </View>

                    {/* TOTAL */}
                    <View style={styles.footer}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalPrice}>Rp {totalHarga}</Text>
                    </View>

                    {/* end header */}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    button: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
        borderRadius: 10,
        marginHorizontal: 5,
    },

    text: {
        color: "#fff",
        fontWeight: "bold",
        marginLeft: 6,
    },

    finish: {
        backgroundColor: "#27ae60",
    },

    delete: {
        backgroundColor: "#e74c3c",
    },

    print: {
        backgroundColor: "#3498db",
    },
    card: {
        backgroundColor: "#fff",
        marginVertical: 10,
        marginHorizontal: 16,
        borderRadius: 16,
        padding: 16,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    orderId: {
        fontSize: 16,
        fontWeight: "bold",
    },

    date: {
        fontSize: 12,
        color: "#888",
    },

    username: {
        marginTop: 10,
        fontSize: 14,
        fontWeight: "500",
    },

    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },

    statusText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },

    itemsContainer: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 10,
    },

    itemRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 3,
    },

    itemName: {
        fontSize: 14,
        color: "#333",
    },

    itemPrice: {
        fontSize: 14,
        fontWeight: "500",
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#eee",
        paddingTop: 10,
    },

    totalLabel: {
        fontSize: 15,
        fontWeight: "bold",
    },

    totalPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#27ae60",
    },

    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },

    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingBottom: 20,
        paddingTop: 10,
    },
    rowBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    type: {
        fontSize: 13,
        color: "#fff",
        backgroundColor: "#50C2C9",
        padding: 5,
        borderRadius: 5,
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
    img: {
        width: 300,
        height: 600,
        marginHorizontal: "auto",
        borderRadius: 8,
        elevation: 5,
    },
    container: { flex: 1, backgroundColor: "#f4f4f4" },
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
        color: "#666",
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
    buttonDate: {
        borderWidth: 1,
        width: 130,
        flexDirection: "row",
        gap: 5,
        marginTop: 20,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: "#819067",
    },
    containerTransaksi: {
        borderWidth: 2,
        padding: 10,
    },
    dataTransaksi: {
        alignItems: "center",
    },
    containerCart: {
        alignItems: "center",
    },
    buttonDelete: {
        backgroundColor: "red",
        width: "40%",
        alignItems: "center",
        marginTop: 10,
        marginHorizontal: "auto",
        borderRadius: 20,
    },
});

export default DetailTransaksi;
