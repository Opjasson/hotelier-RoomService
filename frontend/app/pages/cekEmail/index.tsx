import { NavigationProp } from "@react-navigation/native";
import React, { useState } from "react";
import {
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface props {
    navigation: NavigationProp<any, any>;
}

const CekEmail: React.FC<props> = ({ navigation }) => {
    const [email, setEmail] = useState<string>();
    const [error, setError] = useState<string>();

    const handleCek = async () => {
        if (email) {
            const response = await fetch(
                "http://192.168.6.12:5000/forgotPass",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                    }),
                },
            );
            const json = await response.json();
            // console.log(json);
            if (json.message) {
                setError(json.message);
            } else {
                alert("Email terdaftar!");
                navigation.navigate("ChangePass", {
                    user: json,
                });
            }

            // if (JSON.stringify(response.status) === "401") {
            //     setError("Email atau password salah!");
            // } else {
            //     navigation.navigate("kasir", { data: json.response });
            // }
        } else {
            setError("Isi email dan password!");
        }
    };

    return (
        <ScrollView>
            <StatusBar barStyle={"light-content"} backgroundColor={"#1F1F1F"} />
            <View style={styles.containerForm}>
                <View style={styles.headLogin}>
                    <Text style={styles.headLoginText1}>
                        Cek Email Anda Dahulu
                    </Text>
                    <Text style={styles.headLoginText2}>
                        Grandian Hotel Brebes Restaurant
                    </Text>
                    <Text style={styles.garisHead}></Text>
                </View>
                <Text style={styles.textLabel}>Email</Text>
                <TextInput
                    style={{
                        borderWidth: 1,
                        marginBottom: 5,
                        borderRadius: 5,
                    }}
                    keyboardType="email-address"
                    placeholder="Masukan email anda"
                    onChangeText={(text) => setEmail(text)}
                />

                <Text style={error ? styles.errorMsg : styles.hidden}>
                    {error}
                </Text>
            </View>
            {/* End Form */}

            <TouchableOpacity style={styles.button} onPress={handleCek}>
                <Text style={{ color: "white" }}>Cek Email</Text>
            </TouchableOpacity>
        </ScrollView>
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
});

export default CekEmail;
