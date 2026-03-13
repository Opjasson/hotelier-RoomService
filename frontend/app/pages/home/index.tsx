import { coffe, photo } from "../../inventory/images";
import {
    Location,
    Notification,
    Search,
    Filter,
    Cup,
    Cup2,
    Heart,
    Add,
    HeartOff,
} from "../../inventory/icons";

import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Feather from "@expo/vector-icons/Feather";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { DrawerContent } from "@/app/components";
import MenuDrawer from "react-native-side-drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface props {
    navigation: NavigationProp<any, any>;
}

const Home: React.FC<props> = ({ navigation }) => {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState<string>("makanan");
    const [search, setSearch] = useState<string>();
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
    const [id, setId] = useState<number>();
    const [idLogin, setIdLogin] = useState<number>();
    const [user, setUser] = useState<string>();
    const [username, setUsername] = useState<string>();
    const [room, setRoom] = useState<string>();
    const [transaksiId, setTransaksiId] = useState<number>();
    const [dataTransaksi, setDataTransaksi] = useState<
        {
            id: number;
            namaPelanggan: string;
            status: boolean;
            buktiBayar: string;
            cash: number;
        }[]
    >([]);

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
            setRoom(user.email);
        } else {
            setUser("");
            setUsername("");
            setRoom("");
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
    // ------------------------

    const getProducts = async () => {
        const response = await fetch("http://192.168.27.12:5000/product");
        const data = await response.json();
        setProducts(data);
        // console.log(data);
    };

    useEffect(() => {
        getProducts();
    }, []);

    // menfilter data berdasarkan yang diketian di search
    const searchProduct = products.filter((item) => {
        const words = search?.split(" ");
        return words?.some((word) => item.nama_product.includes(word));
    });

    const toggleOpen = () => {
        if (open === false) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    const createTransaksi = async () => {
        const response = await fetch("http://192.168.27.12:5000/transaksi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                namaPelanggan: username,
            }),
        });
        setTransaksiId(2);
        alert("Silahkan Lanjutkan Pesanan");
    };

    const getTransaksi = async () => {
        const response = await fetch("http://192.168.27.12:5000/transaksi");
        const transaksiS = await response.json();
        // console.log(transaksiS.response);
        setDataTransaksi(transaksiS.response);
    };

    useEffect(() => {
        getTransaksi();
    }, []);

    const transaksiNamaPelangganUser = dataTransaksi.filter(
        (item) => item.namaPelanggan === username,
    );
    const transaksiStatusUser = transaksiNamaPelangganUser.filter(
        (item) => item.buktiBayar === null && item.cash === null,
    );

    const handleDeleteStorage = async () => {
        await AsyncStorage.removeItem("infoPesanan");
        navigation.navigate("HistoryPesanan");
    };

    // cek infoPesanan storage
    useEffect(() => {
        const cekToken = async () => {
            const token = await AsyncStorage.getItem("infoPesanan");
            if (username === "Zaki_Waiter" && token !== null) {
                Alert.alert(
                    "Pesanan Telah Selesai",
                    `Atas Nama Pelanggan : ${token}`,
                    [
                        {
                            text: "Okey",
                            onPress: handleDeleteStorage,
                            style: "default",
                        },
                    ],
                );
                console.log(token);
            }
        };
        cekToken();
    });
    // End Cek infoPesanan storage ------

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
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: "#FBFBFB",
            }}
        >
            <StatusBar barStyle={"dark-content"} />
            <ScrollView>
                {/* Top menu */}
                <View
                    style={{
                        backgroundColor: "#f5f7f7",
                        paddingBottom: 10,
                        elevation: 10,
                        borderBottomLeftRadius: 15,
                        borderBottomRightRadius: 15,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 30,
                            marginHorizontal: 30,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "500",
                                    fontSize: 12,
                                }}
                            >
                                Hotel Petra Tegal
                            </Text>
                        </View>
                        <Ionicons
                            name="menu"
                            size={30}
                            color="black"
                            onPress={() => toggleOpen()}
                        />
                    </View>

                    <Text
                        style={{
                            fontWeight: "500",
                            fontSize: 12,
                            marginHorizontal: 30,
                            alignItems: "center",
                        }}
                    >
                        Room : {room}
                    </Text>
                </View>
                {/* Top menu */}
                {/* <View
                    style={{
                        flexDirection: "row",
                        // marginTop: 30,
                        marginHorizontal: 30,
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Ionicons
                        name="menu"
                        size={30}
                        color="black"
                        onPress={() => toggleOpen()}
                    />

                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Image source={Location} />
                        <Text
                            style={{
                                fontWeight: "500",
                                fontSize: 12,
                                marginLeft: 5,
                            }}
                        >
                            Tegal, Indonesia
                        </Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                        <FontAwesome name="user" size={24} color="black" />
                    </TouchableOpacity>
                </View> */}
                {/* End top menu */}
                <View style={{ marginHorizontal: 30, marginTop: 15 }}>
                    <Text style={{ fontWeight: "500", fontSize: 14 }}>
                        Selamat Datang, {username}
                    </Text>
                </View>
                {/* Search tab */}
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "75%",
                        backgroundColor: "#1111",
                        marginHorizontal: "auto",
                        borderRadius: 30,
                        paddingHorizontal: 20,
                        marginTop: 20,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 2,
                            width: "100%",
                        }}
                    >
                        <Image source={Search} />
                        <TextInput
                            placeholder="Cari..."
                            style={{ width: "100%" }}
                            onChangeText={(text) => setSearch(text)}
                        />
                    </View>
                </View>
                {/* End Search */}

                {/* Categories */}
                <View style={{ marginLeft: 25, marginTop: 15 }}>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ fontWeight: "500", marginLeft: 5 }}>
                            Layanan
                        </Text>
                    </View>
                    <ScrollView horizontal>
                        {/* Menu Makanan */}
                        <TouchableOpacity
                            onPress={() => setFilter("makanan")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "makanan" ? "#2f823a" : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                                marginVertical: 5,
                                elevation: 1.5,
                                shadowColor: "black",
                            }}
                        >
                            <Ionicons
                                name="pizza-outline"
                                size={24}
                                color={filter === "makanan" ? "white" : "black"}
                            />
                            <Text
                                style={{
                                    color:
                                        filter === "makanan"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Makanan
                            </Text>
                        </TouchableOpacity>

                        {/* End Menu */}

                        {/* Menu Minuman*/}
                        <TouchableOpacity
                            onPress={() => setFilter("minuman")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "minuman" ? "#2f823a" : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                                marginVertical: 5,
                                elevation: 1.5,
                                shadowColor: "black",
                            }}
                        >
                            <SimpleLineIcons
                                name="cup"
                                size={23}
                                color={filter === "minuman" ? "white" : "black"}
                            />
                            <Text
                                style={{
                                    color:
                                        filter === "minuman"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Minuman
                            </Text>
                        </TouchableOpacity>
                        {/* End menu */}

                        {/* Menu extra bed*/}
                        <TouchableOpacity
                            onPress={() => setFilter("bed")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "bed" ? "#2f823a" : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                                marginVertical: 5,
                                elevation: 1.5,
                                shadowColor: "black",
                            }}
                        >
                            <Fontisto
                                name="bed-patient"
                                size={23}
                                color={filter === "bed" ? "white" : "black"}
                            />

                            <Text
                                style={{
                                    color: filter === "bed" ? "white" : "black",
                                }}
                            >
                                Extra Bed
                            </Text>
                        </TouchableOpacity>
                        {/* End menu */}

                        {/* Menu Cleaning */}
                        <TouchableOpacity
                            onPress={() => setFilter("cleaning")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "cleaning" ? "#2f823a" : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                                marginVertical: 5,
                                elevation: 1.5,
                                shadowColor: "black",
                            }}
                        >
                            <MaterialIcons
                                name="cleaning-services"
                                size={23}
                                color={
                                    filter === "cleaning" ? "white" : "black"
                                }
                            />

                            <Text
                                style={{
                                    color:
                                        filter === "cleaning"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Cleaning
                            </Text>
                        </TouchableOpacity>
                        {/* End menu */}

                        {/* Menu Toileters*/}
                        <TouchableOpacity
                            onPress={() => setFilter("toiletries")}
                            activeOpacity={0.8}
                            style={{
                                justifyContent: "center",
                                flexDirection: "row",
                                backgroundColor:
                                    filter === "toiletries"
                                        ? "#2f823a"
                                        : "white",
                                alignItems: "center",
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                                borderRadius: 30,
                                gap: 5,
                                marginRight: 10,
                                marginVertical: 5,
                                elevation: 1.5,
                                shadowColor: "black",
                            }}
                        >
                            <FontAwesome
                                name="bathtub"
                                size={23}
                                color={
                                    filter === "toiletries" ? "white" : "black"
                                }
                            />

                            <Text
                                style={{
                                    color:
                                        filter === "toiletries"
                                            ? "white"
                                            : "black",
                                }}
                            >
                                Toiletries
                            </Text>
                        </TouchableOpacity>
                        {/* End menu */}
                    </ScrollView>
                </View>
                {/* End Categories */}

                {/* Product */}
                <View style={{ marginTop: 20 }}>
                    {/* button create transaksi */}
                    <TouchableOpacity
                        disabled={
                            transaksiId === 2 || transaksiStatusUser?.length > 0
                                ? true
                                : false
                        }
                        onPress={createTransaksi}
                        activeOpacity={0.8}
                        style={{
                            justifyContent: "center",
                            flexDirection: "row",
                            backgroundColor: "blue",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            paddingVertical: 10,
                            borderRadius: 30,
                            gap: 5,
                            marginRight: 10,
                            marginLeft: 20,
                            marginBottom: 10,
                            width: "20%",
                        }}
                    >
                        <FontAwesome6
                            name="notes-medical"
                            size={24}
                            color="white"
                        />
                    </TouchableOpacity>
                    {/* end button transaksi */}

                    <ScrollView>
                        {/* Product */}
                        {search?.length > 0 && searchProduct.length > 0
                            ? searchProduct.map((a, index) => (
                                  <TouchableOpacity
                                      key={index}
                                      onPress={
                                          transaksiId === 2 ||
                                          transaksiStatusUser?.length > 0
                                              ? () =>
                                                    navigation.navigate(
                                                        "DetailProduct",
                                                        {
                                                            data: a,
                                                            idTrans:
                                                                transaksiStatusUser[0]
                                                                    ?.id,
                                                            idUser: id,
                                                        },
                                                    )
                                              : () =>
                                                    alert(
                                                        "Buat Transaksi Dulu!",
                                                    )
                                      }
                                      activeOpacity={0.7}
                                      style={{
                                          backgroundColor: "white",
                                          borderRadius: 20,
                                          paddingHorizontal: 5,
                                          paddingVertical: 5,
                                          elevation: 5,
                                          shadowColor: "black",
                                          marginRight: 8,
                                          margin: 8,
                                          width: 155,
                                      }}
                                  >
                                      <Image
                                          src={a?.img_product}
                                          style={{
                                              width: 144,
                                              height: 130,
                                              borderRadius: 20,
                                          }}
                                      />
                                      <View
                                          style={{
                                              flexDirection: "row",
                                              justifyContent: "space-between",
                                              marginTop: 10,
                                          }}
                                      >
                                          <View>
                                              <Text
                                                  style={{
                                                      fontWeight: "500",
                                                      fontSize: 14,
                                                  }}
                                              >
                                                  {a.nama_product}
                                              </Text>
                                              <Text
                                                  style={{
                                                      marginTop: 5,
                                                      fontSize: 10,
                                                  }}
                                              >
                                                  {a.deskripsi.substring(0, 30)}
                                                  ...
                                              </Text>
                                          </View>
                                      </View>

                                      <View
                                          style={{
                                              flexDirection: "row",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                          }}
                                      >
                                          <Text>
                                              Rp.
                                              {a.harga_product.toLocaleString()}
                                          </Text>
                                          <Image source={Add} />
                                      </View>
                                  </TouchableOpacity>
                              ))
                            : products
                                  .filter((a) => a.kategori_product === filter)
                                  .map((item, index) => (
                                      <TouchableOpacity
                                          key={index}
                                          onPress={
                                              transaksiId === 2 ||
                                              transaksiStatusUser?.length > 0
                                                  ? () =>
                                                        navigation.navigate(
                                                            "DetailProduct",
                                                            {
                                                                data: item,
                                                                idTrans:
                                                                    transaksiStatusUser[0]
                                                                        ?.id,
                                                                idUser: id,
                                                            },
                                                        )
                                                  : () =>
                                                        alert(
                                                            "Buat Transaksi Dulu!",
                                                        )
                                          }
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
                                              <Text
                                                  style={styles.title}
                                                  numberOfLines={1}
                                              >
                                                  {item.nama_product}
                                              </Text>
                                              <Text
                                                  style={styles.description}
                                                  numberOfLines={2}
                                              >
                                                  {item.deskripsi.substring(
                                                      0,
                                                      30,
                                                  )}
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
                                                      <Text
                                                          style={
                                                              styles.addButtonText
                                                          }
                                                      >
                                                          Add
                                                      </Text>
                                                  </TouchableOpacity>
                                              </View>
                                          </View>
                                      </TouchableOpacity>
                                  ))}

                        {/* End Product */}
                    </ScrollView>
                </View>
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
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 9999,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
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

export default Home;
