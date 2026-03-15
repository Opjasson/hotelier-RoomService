import React, { useEffect, useState } from "react";
import {
    Button,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { NavigationProp } from "@react-navigation/native";
import MenuDrawer from "react-native-side-drawer";
import { DrawerContent } from "@/app/components";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

const Laporan: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);

    const [barang, setBarang] = useState<
        {
            id: number;
            nama_product: string;
            harga_product: number;
            harga_jual: number;
            stok: number;
        }[]
    >([]);

    const [cart, setCart] = useState<
        {
            productId: number;
            createdAt: string;
            qty: number;
            transaksiId: number;
        }[]
    >([]);
    const [date, setDate] = useState(new Date());
    const [date2, setDate2] = useState(new Date());
    const [idLogin, setIdLogin] = useState<number>();

    const [dataLaporan, setDataLaporan] = useState<
        {
            tanggal: string;
            barang: string;
            qty: number;
            harga: number;
            total_Penjualan: number;
        }[]
    >([]);

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
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

    // convert tanggal menjadi string
    const dateNow = date.toISOString().split("T")[0];

    const onChange1 = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setDate(currentDate);
    };

    const onChange2 = (event: any, selectedDate2: any) => {
        const currentDate2 = selectedDate2 || date2;
        setDate2(currentDate2);
    };

    const getCart = async () => {
        try {
            const response = await fetch("http://192.168.27.12:5000/cart");
            const cat = await response.json();
            setCart(cat.response);
        } catch (error) {
            console.log(error);
        }
    };

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
        getCart();
    }, []);

    useEffect(() => {
        getDataBarang();
    }, []);

    // Penting ----------------
    // Buat map untuk mempermudah pencarian nama berdasarkan barangId
    const barangMap = Object.fromEntries(
        barang.map((b) => [b.id, b.nama_product]),
    );

    // Ubah barangId menjadi nama
    const cartDenganNama = cart?.map((item) => ({
        createdAt: item.createdAt.split("T")[0],
        qty: item.qty,
        transaksiId: item.transaksiId,
        nama_barang: barangMap[item.productId],
    }));

    const grouped1 = new Map();

    for (const item of cartDenganNama) {
        const key = `${item.createdAt}_${item.nama_barang}`;

        if (grouped1.has(key)) {
            grouped1.get(key).qty += item.qty;
        } else {
            grouped1.set(key, {
                createdAt: item.createdAt,
                nama_barang: item.nama_barang,
                qty: item.qty,
            });
        }
    }

    const hasilGabungan = Array.from(grouped1.values());

    // Buat map nama_barang => data barang
    const barangMap2 = Object.fromEntries(
        barang.map((b) => [b.nama_product, b]),
    );

    // Tambahkan harga ke setiap item transaksi
    const transaksiDenganHarga = hasilGabungan.map((item) => {
        const barangInfo = barangMap2[item.nama_barang] || {};
        return {
            ...item,
            harga_jual: barangInfo.harga_product || 0,
        };
    });

    // Range tanggal yang dipilih
    const startDate = new Date(date.toISOString().split("T")[0]);
    const endDate = new Date(date2.toISOString().split("T")[0]);

    // // Filter berdasarkan range
    const filteredData = transaksiDenganHarga.filter((item) => {
        const tgl = new Date(item.createdAt);
        return tgl >= startDate && tgl <= endDate;
    });

    const totalPenjualan2 = filteredData.reduce((total, item) => {
        return total + item.harga_jual * item.qty;
    }, 0);

    console.log(filteredData);
    // ************

    const generateHTML = () => {
        const rows = filteredData
            .map(
                (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.createdAt}</td>
            <td>${item.nama_barang}</td>
            <td>${item.qty}</td>
            <td>Rp  ${item.harga_jual.toLocaleString()}</td>
            <td>Rp  ${item.harga_jual * item.qty}</td>
          </tr>
        `,
            )
            .join("");
        return `
<html>
<head>
<meta charset="UTF-8">
<title>Laporan Penjualan</title>

<style>

body{
    font-family: "Segoe UI", Arial, sans-serif;
    margin:40px;
    color:#333;
}

/* HEADER */

.report-header{
    display:flex;
    justify-content:space-between;
    align-items:center;
    border-bottom:2px solid #444;
    padding-bottom:15px;
    margin-bottom:25px;
}

.company{
    display:flex;
    align-items:center;
}

.company img{
    height:60px;
    margin-right:15px;
}

.company-info h2{
    margin:0;
    font-size:22px;
}

.company-info p{
    margin:2px 0;
    font-size:13px;
    color:#555;
}

.report-info{
    text-align:right;
}

.report-info h3{
    margin:0;
}

.report-info p{
    margin:2px;
    font-size:13px;
}

/* SUMMARY */

.summary{
    display:flex;
    justify-content:space-between;
    margin-bottom:20px;
}

.summary-box{
    width:30%;
    border:1px solid #ddd;
    border-radius:6px;
    padding:10px 15px;
    background:#fafafa;
}

.summary-title{
    font-size:12px;
    color:#777;
}

.summary-value{
    font-size:18px;
    font-weight:bold;
    margin-top:5px;
}

/* TABLE */

table{
    width:100%;
    border-collapse:collapse;
    margin-top:10px;
}

thead{
    background:#2c3e50;
    color:white;
}

th{
    padding:10px;
    font-size:13px;
}

td{
    padding:9px;
    border-bottom:1px solid #ddd;
    font-size:13px;
}

td:nth-child(1),
td:nth-child(4){
    text-align:center;
}

td:nth-child(5),
td:nth-child(6){
    text-align:right;
}

tbody tr:nth-child(even){
    background:#f9f9f9;
}

/* TOTAL ROW */

.total-row{
    font-weight:bold;
    background:#f1f3f6;
}

.total-row td{
    padding:12px;
}

/* FOOTER */

.footer{
    margin-top:40px;
    display:flex;
    justify-content:space-between;
}

.signature{
    text-align:center;
    width:200px;
}

.signature-line{
    margin-top:60px;
    border-top:1px solid #333;
    padding-top:5px;
    font-size:13px;
}

.print-info{
    font-size:12px;
    color:#777;
}

</style>
</head>


<body>

<!-- HEADER -->

<div class="report-header">

<div class="company">

<img src="../../inventory/images/hotel.png">

<div class="company-info">
<h2>Hotel Petra Tegal</h2>
<p>Jl. Raya Tegal</p>
<p>Telp : +62 895-1462-6206</p>
</div>

</div>

<div class="report-info">
<h3>LAPORAN PENJUALAN</h3>
<p>Periode</p>
<p>${date.toISOString().split("T")[0]} - ${
            date2.toISOString().split("T")[0]
        }</p>
</div>

</div>


<!-- SUMMARY -->

<div class="summary">

<div class="summary-box">
<div class="summary-title">Total Transaksi</div>
<div class="summary-value">${filteredData.length}</div>
</div>

<div class="summary-box">
<div class="summary-title">Total Penjualan</div>
<div class="summary-value">Rp ${totalPenjualan2.toLocaleString()}</div>
</div>

<div class="summary-box">
<div class="summary-title">Tanggal Cetak</div>
<div class="summary-value">${new Date().toLocaleDateString()}</div>
</div>

</div>


<!-- TABLE -->

<table>

<thead>
<tr>
<th>No</th>
<th>Tanggal</th>
<th>Nama Barang</th>
<th>Qty</th>
<th>Harga</th>
<th>Total</th>
</tr>
</thead>

<tbody>

${rows}

<tr class="total-row">
<td colspan="5" style="text-align:right;">TOTAL PENJUALAN</td>
<td>Rp ${totalPenjualan2.toLocaleString()}</td>
</tr>

</tbody>

</table>


<!-- FOOTER -->

<div class="footer">

<div class="print-info">
Dicetak pada : ${new Date().toLocaleString()}
</div>

<div class="signature">
<div class="signature-line">
Manager
</div>
</div>

</div>

</body>
</html>
`;
    };

    const handleSavePdf = async () => {
        const htmlContent = generateHTML();

        const { uri } = await Print.printToFileAsync({
            html: htmlContent,
        });

        const customFileName = `Laporan Penjualan Aplikasi - Room Service Hotel Petra_${dateNow}.pdf`;

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

    // ------------------------------------------------------------
    const showDatepicker = () => {
        DateTimePickerAndroid.open({
            value: date,
            onChange: onChange1,
            mode: "date",
            is24Hour: true,
        });
    };

    const showDatepicker2 = () => {
        DateTimePickerAndroid.open({
            value: date2,
            onChange: onChange2,
            mode: "date",
            is24Hour: true,
        });
    };

    // console.log("tgl1", date);
    // console.log("tgl2", date2);

    return (
        <SafeAreaView style={styles.container}>
            {/* bagian atas aplikasi kasir */}
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
                    Reports Page
                </Text>

                <Ionicons
                    name="menu"
                    size={30}
                    color="black"
                    onPress={() => toggleOpen()}
                />
            </View>
            {/* ------------ */}

            {/* menampilkan daftar menu */}
            <ScrollView style={{ paddingLeft: 10 }}>
                {/* Title */}
                <Text style={styles.title}>Hotel Petra</Text>

                <Text style={styles.subtitle}>Room Service Print Reports</Text>

                {/* Filter Tanggal */}
                <View style={styles.dateContainer}>
                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={showDatepicker}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="white"
                        />
                        <Text style={styles.dateText}>2026-03-11</Text>
                    </TouchableOpacity>

                    <Text style={styles.separator}>{"----"}</Text>

                    <TouchableOpacity
                        style={styles.dateButton}
                        onPress={showDatepicker2}
                    >
                        <Ionicons
                            name="calendar-outline"
                            size={18}
                            color="white"
                        />
                        <Text style={styles.dateText}>2026-03-11</Text>
                    </TouchableOpacity>
                </View>

                {/* Button Cetak */}
                <TouchableOpacity
                    style={styles.printButton}
                    onPress={handleSavePdf}
                >
                    <Ionicons name="print-outline" size={18} color="white" />
                    <Text style={styles.printText}>Cetak</Text>
                </TouchableOpacity>

                {/* menu bagian */}
                <ScrollView
                    horizontal
                    style={{
                        backgroundColor: "#FFF",
                    }}
                >
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={[styles.row, styles.header]}>
                            <Text style={{ width: 50, paddingLeft: 5 }}>
                                No
                            </Text>
                            <Text
                                style={[
                                    styles.cell,
                                    styles.headerText,
                                    { flex: 2 },
                                ]}
                            >
                                Tanggal
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                barang
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                qty
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                harga
                            </Text>
                            <Text style={[styles.cell, styles.headerText]}>
                                total penjualan
                            </Text>
                        </View>

                        {/* Data Rows */}

                        {filteredData.map((item, index) => {
                            return (
                                <View key={index} style={styles.row}>
                                    <Text style={{ width: 50, paddingLeft: 5 }}>
                                        {index + 1}
                                    </Text>
                                    <Text style={[styles.cell, { flex: 2 }]}>
                                        {item.createdAt}
                                    </Text>
                                    <Text style={[styles.cell, styles.green]}>
                                        {item.nama_barang}
                                    </Text>
                                    <Text style={[styles.cell, styles.red]}>
                                        {item.qty}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {item.harga_jual}
                                    </Text>
                                    <Text style={styles.cell}>
                                        {item.harga_jual * item.qty}
                                    </Text>
                                </View>
                            );
                        })}
                        <Text style={{ fontSize: 15, fontWeight: "700" }}>
                            Total Penjualan keseluruhan : {totalPenjualan2}
                        </Text>
                    </View>
                </ScrollView>
                {/* ------------ */}
            </ScrollView>

            {/* ---------- */}
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
    title: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },

    subtitle: {
        textAlign: "center",
        marginVertical: 10,
        color: "#555",
    },

    dateContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
    },

    dateButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#50C2C9",
        padding: 10,
        borderRadius: 20,
        marginHorizontal: 5,
    },

    dateText: {
        color: "white",
        marginLeft: 5,
    },

    separator: {
        fontSize: 20,
        marginHorizontal: 10,
    },

    printButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#50C2C9",
        padding: 12,
        borderRadius: 10,
        width: "80%",
        justifyContent: "center",
        marginVertical: 15,
        marginHorizontal: "auto"
    },

    printText: {
        color: "white",
        marginLeft: 5,
        fontWeight: "bold",
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
        backgroundColor: "#1E5128",
    },
    container: {
        padding: 10,
        minWidth: 700,
    },
    row: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: "#ccc",
        paddingVertical: 6,
    },
    header: {
        backgroundColor: "#f0f0f0",
        borderBottomWidth: 2,
    },
    headerText: {
        fontWeight: "bold",
    },
    cell: {
        flex: 1,
        // paddingHorizontal: 6,
        // paddingRight : 20,
        width: 110,
        borderRightWidth: 0.5,
        paddingLeft: 10,
    },
    green: {
        color: "green",
    },
    red: {
        color: "red",
    },
    animatedBox: {
        flex: 1,
        backgroundColor: "#38C8EC",
        padding: 10,
    },
    sidebarHead: {
        flexDirection: "row",
        borderWidth: 2,
        justifyContent: "space-between",
    },
    sidebarTitle: {
        fontSize: 17,
        fontWeight: "700",
    },
    sidebarMain: {
        borderWidth: 2,
        flexDirection: "column",
        justifyContent: "space-between",
        height: "50%",
        marginTop: 20,
    },
    sidebarMenu: {
        fontSize: 20,
        fontWeight: "800",
    },
    tutupSidebar: {
        flexDirection: "row",
        alignItems: "center",
    },
    container: {
        flex: 1,
    },
    headContainer: {
        flexDirection: "row",
        position: "relative",
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#27548A",
    },
    headTitle: {
        fontSize: 20,
        marginLeft: 30,
        color: "white",
    },
    containerSearch: {
        flexDirection: "row",
        borderWidth: 3,
        alignItems: "center",
    },
    containerBarang: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        backgroundColor: "#FFF085",
        padding: 5,
        paddingVertical: 15,
    },
    barisInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    barisInfo2: {
        alignItems: "flex-end",
        flexDirection: "column",
        gap: 15,
    },
});

export default Laporan;
