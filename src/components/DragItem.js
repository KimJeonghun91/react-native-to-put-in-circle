import React, { Component } from "react";
import { StyleSheet, View, Image, PanResponder, Animated, } from "react-native";


export default class DragItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDraggable: true,
            dropAreaValues: null,
            pan: new Animated.ValueXY(),
            opacity: new Animated.Value(1),
            isRollback: false
        };
    }

    render() {
        const { pX, pY, itemSize, img } = this.props;
        const { showDraggable } = this.state;

        // * 부모에게 받은 좌표로 뷰 이동
        this.state.pan.setOffset({ x: pX, y: pY })

        return (
                <View style={{ position: "absolute" }}>
                    <Animated.View
                        style={[{ transform: this.state.pan.getTranslateTransform() }, { width: itemSize, height: itemSize, borderRadius: itemSize / 2, opacity: this.state.opacity, overflow: 'hidden' }]}  >

                        <Image
                            source={img}
                            style={{ height: itemSize, width: itemSize, resizeMode: "cover" }}
                        />
                    </Animated.View>
                </View>
        );
    }


}
