import { hotel } from "@/app/inventory/images";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
    navigation: NavigationProp<any, any>;
}

const LoginPage: React.FC<props> = ({ navigation }) => {
    const [room, setRoom] = useState("");
    const [code, setCode] = useState("");

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();

    const [data, setData] = useState([]);

    const getUserId = async () => {
        try {
            const response = await fetch("http://192.168.27.12:5000/login");
            const datas = await response.json();
            setData(datas); // update state
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    // 1. Ambil data saat komponen pertama kali muncul
    useEffect(() => {
        getUserId();
    }, []);

    // 2. Pantau perubahan pada `data`
    useEffect(() => {
        if (data.length > 0) {
            navigation.navigate("Home"); // Arahkan ke MainApp jika sudah login
        }
    }, [data]);

    const handleLogin = async () => {
        if (room && code) {
            const response = await fetch("http://192.168.27.12:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: room,
                    password: code,
                }),
            });
            const json = await response.json();

            if (JSON.stringify(response.status) === "401") {
                setError("Email atau password salah!");
            } else {
                navigation.navigate("Home", { data: json.response });
            }
        } else {
            setError("Isi email dan password!");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={"default"} />
            <ScrollView style={styles.box}>
                <Image
                    style={{
                        height: 190,
                        width: 190,
                        marginHorizontal: "auto",
                    }}
                    source={hotel}
                />

                <Text style={styles.title}>Hotel Service</Text>
                <Text style={styles.subtitle}>Masuk untuk memesan</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nomor Kamar"
                    // keyboardType="numeric"
                    // value={room}
                    onChangeText={setRoom}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Kode Booking"
                    // value={code}
                    onChangeText={setCode}
                />

                <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={handleLogin}
                    // onPress={() => navigation.navigate("Home")}
                >
                    <Text style={styles.btnText}>Login Tamu</Text>
                </TouchableOpacity>

                
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    containerForm: {
        paddingHorizontal: 15,
        paddingTop: 150,
    },
    headLogin: {
        alignItems: "center",
        marginBottom: 40,
    },
    headLoginText1: {
        fontSize: 30,
        fontWeight: "900",
        marginBottom: 10,
        color: "#1E5128",
    },
    headLoginText2: {
        fontSize: 20,
        fontWeight: "light",
    },
    garisHead: {
        borderBottomWidth: 3,
        width: "70%",
        marginTop: -10,
    },
    button: {
        backgroundColor: "#1E5128",
        width: "80%",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 9,
        marginTop: 20,
        marginHorizontal: "auto",
    },
    buatAkun: {
        width: "80%",
        paddingVertical: 15,
        alignItems: "center",
        borderRadius: 9,
        marginHorizontal: "auto",
    },
    topBar: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 30,
    },
    textLabel: {
        fontWeight: "bold",
        fontSize: 18,
        paddingHorizontal: 3,
    },
    errorMsg: {
        fontSize: 18,
        color: "red",
        textAlign: "center",
    },
    hidden: {
        display: "none",
    },

    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    box: { width: "85%", padding: 20 },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        marginBottom: 30,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
    },
    btnPrimary: {
        backgroundColor: "#3498db",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    btnSecondary: {
        marginTop: 10,
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#3498db",
    },
    btnText: { color: "#fff", fontWeight: "bold" },
    btnTextSecondary: { color: "#3498db", fontWeight: "bold" },
});

export default LoginPage;
