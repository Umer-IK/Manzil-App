import * as React from "react";
import { useState, useEffect } from "react";

import { View, TouchableOpacity, Text } from "react-native";
import { styles } from "../styles/homestyles";
import Icon from "react-native-vector-icons/FontAwesome6";

interface FooterProps {
  currentTab: number;

  email: string;
  cityName: string;

  handleProfile: (email: string, cityName: string) => void;
  handleBack: (cityName: string) => void;
}

const Footer: React.FC<FooterProps> = ({
  handleProfile,
  handleBack,
  email,
  cityName,
  currentTab
}: FooterProps) => {
  const [color1, setColor1] = useState("#0078ff");
  const [color2, setColor2] = useState("gray");

  const colorChange = (tab: number) => {
    if(tab === 1){
      setColor1("#0078ff")
      setColor2("gray")
    }
    else if (tab === 2) {
      setColor1("gray")
      setColor2("#0078ff")
    }
  };

  useEffect(() => {
    colorChange(currentTab);
  }, [currentTab]);
  
  
  return (
    <>
      <View style={styles.footMenu}>
        <View
          style={[
            styles.buttonsContainer2,
            // isSmallScreen && {
            //   flexDirection: "column",
            //   alignItems: "stretch",
            // },
          ]}
        >
          <TouchableOpacity
            onPress={() => handleBack(cityName)}
          >
            <Icon
              name="house"
              size={20}
              color= {color1}
              style={{ margin: 10, opacity: 0.8 }} // Add more styling
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleProfile(email, cityName)}
          >
            <Icon 
              name="user" 
              size={20}
              color= {color2}
              style={{ margin: 10, opacity: 0.8 }} // Add more styling
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Footer;
