import React from "react";
import {
    Image,
    Text,
    View,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { background, splash } from "../../inventory/images";

interface Props {
    navigation : NavigationProp<any, any>;
}


const index: React.FC<Props> = ({navigation}) => {
    return (
        <View style={{ flex: 1, backgroundColor: "#c77a32" }}>
            <ImageBackground style={styles.bgSplash} source={background}>
                <View>
                    <Image source={splash} />
                </View>
                <View style={{ width: "55%", marginHorizontal: "auto" }}>
                    <Text style={styles.txtCoffe}>
                        Coffe so good, your taste buds will love it
                    </Text>
                </View>

                <View style={{ width: "60%", marginHorizontal: "auto" }}>
                    <Text style={styles.txtHighlight}>
                        The best grain, the finest roas, the most powerful
                        flavor.
                    </Text>
                </View>

                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Home')} style={styles.button}>
                    <Text style={{ fontSize: 20, color : "#fff", fontWeight : "bold" }}>Get started</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

export default index;

const styles = StyleSheet.create({
    bgSplash: {
        flex: 1,
        justifyContent: "center",
        marginTop: -30,
        gap : 20
    },
    txtCoffe: {
        color: "#fff",
        fontSize: 24,
        textAlign: "center",
    },
    txtHighlight: {
        color: "#fff",
        fontSize: 15,
        textAlign : 'center',
    },
    button: {
        backgroundColor: "#944d0c",
        width: "50%",
        padding: 15,
        alignItems: "center",
        borderRadius: 30,
        marginHorizontal : "auto"
    },
});
