import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';

const Header: React.FC = () => {
    const [count, setCount] = useState(0);
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribeFocus = navigation.addListener('state', (e) => {
            const isBack = e.data.state.index < e.data.state.routes.length - 1;
            if (isBack) {
                setCount((prevCount) => Math.max(prevCount - 1, 0));
            } else {
                setCount((prevCount) => prevCount + 1);
            }
        });

        // Listen for the back button press explicitly
        const unsubscribeBack = navigation.addListener('beforeRemove', (e) => {
            setCount((prevCount) => Math.max(prevCount - 1, 0));
        });

        return () => {
            unsubscribeFocus();
            unsubscribeBack();
        };
    }, [navigation]);

    // Dynamic height based on count
    const headerHeight = count === 0 ? 0 : 50;

    return (
        <View style={[styles.header, { height: headerHeight }]}>
            {/* Back Button */}
            {navigation.canGoBack() && (
                <TouchableOpacity onPress={() => {
                    navigation.goBack();
                    setCount((prevCount) => Math.max(prevCount - 1, 0)); // Ensure count decrements
                }} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="white" />
                </TouchableOpacity>
            )}

            {/* Title (Optional, Adjust as Needed) */}
            <Text style={styles.title}></Text>

            {/* Weather Icon & User Menu */}
            <View style={styles.rightContainer}>
                {/* Weather Icon (Visible after 2nd page) */}
                {count > 2 && (
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="cloud-outline" size={25} color="white" />
                    </TouchableOpacity>
                )}
                {/* User Account Dropdown */}
                {count > 2 && (
                    <Menu>
                        <MenuTrigger>
                            <Icon name="person-circle-outline" size={30} color="white" />
                        </MenuTrigger>
                        <MenuOptions customStyles={{ optionsContainer: styles.menu }}>
                            <MenuOption onSelect={() => alert('Profile')} text="Profile" />
                            <MenuOption onSelect={() => alert('Settings')} text="Settings" />
                            <MenuOption onSelect={() => alert('Logout')} text="Logout" />
                        </MenuOptions>
                    </Menu>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        width: '100%',
        paddingVertical: 5,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        flexDirection: 'row',
        paddingHorizontal: 15,
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: '50%',
        transform: [{ translateY: -15 }],
        zIndex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 15,
    },
    menu: {
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
    },
});

export default Header;
