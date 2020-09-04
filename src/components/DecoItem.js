import React, { Component } from "react";
import { StyleSheet, View, Image, PanResponder, Animated, } from "react-native";


export default class DecoItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { img, size, selectItem, _setSelectItem } = this.props;

        return (
            <View onStartShouldSetResponder={(event) => {
                if (selectItem === null) {
                    _setSelectItem(img,size)
                }
            }}>
                <Image
                    source={img}
                    style={{ height: size, width: size, resizeMode: "cover" }}
                />
            </View>

        )
    }
}
