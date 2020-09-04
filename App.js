/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { SafeAreaView, StyleSheet, Dimensions, View, Animated } from 'react-native';
import DragItem from './src/components/DragItem';
import DecoItem from './src/components/DecoItem';

export default class App extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      canvasSize: Dimensions.get('window').width - 40,
      canvasMarginTop: 20,
      canvasMarginLeft: 20,
      arrDragItem: [],
      centerX: 0,
      centerY: 0,
      touchRTx: 0,
      touchRTy: 0,
      selectItem: null,
      pan: new Animated.ValueXY()
    }
  }


  _viewInitEvent = ({ nativeEvent }) => {
    const { canvasMarginLeft, canvasMarginTop } = this.state;
    console.log("**************** 부모뷰 좌표 ***************")
    for (var key in nativeEvent) {
      console.log("key: " + key + " / " + JSON.stringify(nativeEvent[key]))
    }

    const numX = Number(nativeEvent.layout.x);
    const numY = Number(nativeEvent.layout.y);
    const numW = Number(nativeEvent.layout.width);
    const numH = Number(nativeEvent.layout.height);

    const centerX = (numW / 2) - (numX / 2) - canvasMarginLeft;
    const centerY = (numW / 2) - (numY / 2) - canvasMarginTop;

    console.log("좌상 - X:" + numX + ", Y:" + numY)
    console.log("좌하 - X:" + numX + ", Y:" + (numY + numH))
    console.log("우상 - X:" + (numX + numW) + ", Y:" + numY)
    console.log("우하 - X:" + (numX + numW) + ", Y:" + (numY + numH))
    console.log("중앙좌표 - X:" + centerX + ", Y:" + centerY)

    this.setState({ centerX, centerY })
  }


  // ** 전역 터치 이벤트
  onGlobalTouchEvent = ({ nativeEvent }) => {
    this.setState({ touchRTx: nativeEvent.pageX, touchRTy: nativeEvent.pageY })
  }


  // ** 전역 터치 종료 이벤트
  onGlobalTouchRelease = (evt) => {
    let { arrDragItem, touchRTx, touchRTy, selectItem, canvasMarginLeft, canvasMarginTop } = this.state;

    if (selectItem !== null) {
      console.log("*************** 터치 종료 (복사 아이템제거, 캔버스에 아이템 추가)****************")

      // x,y 좌표가 좌측상단이기 때문에 아이템 사이즈 만큼 보정해줘야됨.
      // 터치로 끌고갈때 touchRTx,touchRTy 값이 중앙처리 되도록 보정된 상태이기 때문
      const itemCenterX = touchRTx - (selectItem.size / 2) - canvasMarginLeft;
      const itemCenterY = touchRTy - (selectItem.size / 2) - canvasMarginTop;

      // 캔버스안에 있을때만 아이템 생성
      if (this._isInnerPalette(itemCenterX, itemCenterY, selectItem.size)) {
        arrDragItem.push({
          selectItem: selectItem,
          initX: itemCenterX,
          initY: itemCenterY
        })
      }

      let newData = [...arrDragItem]
      this.setState({ arrDragItem: newData, selectItem: null })
    }
  }


  // ** 아이템이 캔버스 위에 있는지 여부 반환
  _isInnerPalette = (itemX, itemY, itemWidth) => {
    const { centerX, centerY, canvasSize } = this.state;

    // 캔버스와 아이템 두 중심사이의 거리
    const disCenterToItem = Math.sqrt(Math.pow((centerX - itemX), 2) + Math.pow((centerY - itemY), 2));

    // 캔버스와 아이템 반지름의 차
    const minRadius = ((canvasSize / 2) - (itemWidth / 2))

    console.log("_isInnerPalette - 캔버스 centerX : " + centerX)
    console.log("_isInnerPalette - 캔버스 centerY : " + centerY)
    console.log("_isInnerPalette - 캔버스 canvasSize : " + canvasSize)
    console.log("_isInnerPalette - 캔버스 반지름 : " + canvasSize / 2)

    console.log("_isInnerPalette - 아이템 itemX : " + itemX)
    console.log("_isInnerPalette - 아이템 itemY : " + itemY)
    console.log("_isInnerPalette - 아이템 반지름 : " + itemWidth / 2)

    console.log("_isInnerPalette - 캔버스와 아이템 두 중심사이의 거리 : " + disCenterToItem)
    console.log("_isInnerPalette - 캔버스와 아이템 반지름차 : " + minRadius)

    if (disCenterToItem > minRadius) {
      return false
    } else {
      return true
    }
  }

  _setSelectItem = (img, size) => {
    this.setState({ selectItem: { img, size } })
  }


  render() {
    let { canvasSize, arrDragItem, touchRTx, touchRTy, selectItem, canvasMarginLeft, canvasMarginTop } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: '#550055' }}
        onStartShouldSetResponder={(ev) => true}
        onResponderGrant={this.onGlobalTouchEvent}
        onResponderMove={this.onGlobalTouchEvent}
        onResponderRelease={this.onGlobalTouchRelease}
      >
        <SafeAreaView style={{ width: Dimensions.get('window').width }}>


          {/* ******************************* 캔버스 ******************************* */}
          <View style={{ width: canvasSize, height: canvasSize, borderRadius: (canvasSize) / 2, backgroundColor: '#ff00ff', marginTop: canvasMarginTop, marginLeft: canvasMarginLeft }}
            onLayout={this._viewInitEvent}>

            {
              arrDragItem.length > 0 && (
                arrDragItem.map((item, idx) => (
                  <DragItem key={idx} pX={item.initX} pY={item.initY} img={item.selectItem.img} itemSize={item.selectItem.size} isRollback={false} />
                ))
              )
            }
          </View>



          {/* ******************************* 아이템 리스트 ******************************* */}
          <View style={{ width: '100%', height: 80, marginTop: 50, backgroundColor: '#0000ff', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row' }}>

            <DecoItem img={require("./src/img/ic_heart_solid.png")} size={30} selectItem={selectItem} _setSelectItem={this._setSelectItem} />
            <DecoItem img={require("./src/img/ic_star_bk.png")} size={50} selectItem={selectItem} _setSelectItem={this._setSelectItem} />
            <DecoItem img={require("./src/img/ic_heart_solid.png")} size={60} selectItem={selectItem} _setSelectItem={this._setSelectItem} />
            <DecoItem img={require("./src/img/ic_star_bk.png")} size={80} selectItem={selectItem} _setSelectItem={this._setSelectItem} />
          </View>



          {/* ******************************* 복사된 아이템 ******************************* */}
          {
            selectItem !== null && (
              <DragItem pX={(touchRTx - (selectItem.size / 2))} pY={touchRTy - (selectItem.size / 2)} img={selectItem.img} itemSize={selectItem.size} isRollback={selectItem === null ? true : false} />
            )
          }

        </SafeAreaView>
      </View>
    );
  };
}

const styles = StyleSheet.create({
});
