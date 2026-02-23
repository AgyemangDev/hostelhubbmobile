import { AntDesign, Entypo, Feather, Octicons } from "@expo/vector-icons";

export const icons = {
    index: (props)=> <Octicons name="home" size={26} {...props} />,
    explore: (props)=> <Entypo name="heart-outlined" size={29} {...props} />,
    create: (props)=> <AntDesign name="pluscircleo" size={26} {...props} />,
    profile: (props)=> <AntDesign name="user" size={26} {...props} />,
}