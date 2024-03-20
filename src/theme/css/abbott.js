import React, {StyleSheet, Dimensions, PixelRatio} from "react-native";
const {width, height, scale} = Dimensions.get("window"),
    vw = width / 100,
    vh = height / 100,
    vmin = Math.min(vw, vh),
    vmax = Math.max(vw, vh);

export default StyleSheet.create({
    "firstcolor": {
        "color": "black"
    },
    "titulo_tabla": {
        "backgroundColor": "#b6cff9",
        "borderRadius": "0px 25px 0px 0px !important"
    },
    "item-input input": {},
    "item-input textarea": {},
    "bar-energized": {
        "color": "#f4a435 !important",
        "borderColor": "#2E9AFE !important",
        "backgroundColor": "#2E9AFE !important"
    },
    "bar-abbott": {
        "backgroundColor": "#387ef5 !important"
    },
    "background": {
        "backgroundColor": "#387ef5 !important",
        "color": "#ffffff !important"
    },
    "background pane": {
        "backgroundColor": "#387ef5 !important",
        "color": "#ffffff !important"
    },
    "background item": {
        "backgroundColor": "#387ef5 !important",
        "color": "#ffffff !important"
    },
    "background item-complex item-content": {
        "backgroundColor": "#387ef5 !important",
        "color": "#ffffff !important"
    },
    "item-select": {
        "border": 0
    },
    "spinner svg": {
        "width": "100px !important",
        "height": "100px !important",
        "fill": "#0c60ee !important",
        "backgroundColor": "inherit",
        "stroke": "white !important",
        "border": "0px !important",
        "marginTop": "auto",
        "marginRight": "!important",
        "marginBottom": "auto",
        "marginLeft": "!important"
    },
    "loading-container loading": {
        "paddingTop": 20,
        "paddingRight": 20,
        "paddingBottom": 20,
        "paddingLeft": 20,
        "borderRadius": 5,
        "backgroundColor": "rgba(0, 0, 0, 0)",
        "color": "#fff",
        "textAlign": "center",
        "textOverflow": "ellipsis",
        "fontSize": 15
    },
    "item-select2": {
        "borderColor": "#ddd",
        "backgroundColor": "#fff",
        "color": "#444",
        "position": "relative",
        "zIndex": 2,
        "display": "block",
        "marginTop": -1,
        "marginRight": -1,
        "marginBottom": -1,
        "marginLeft": -1,
        "paddingTop": 8,
        "paddingRight": 8,
        "paddingBottom": 8,
        "paddingLeft": 8,
        "borderWidth": 1,
        "borderStyle": "solid",
        "fontSize": 16
    },
    "lista": {
        "paddingTop": 8,
        "paddingRight": "!important",
        "paddingBottom": 8,
        "paddingLeft": "!important"
    },
    "lista_row": {
        "paddingTop": 0,
        "paddingRight": "!important",
        "paddingBottom": 0,
        "paddingLeft": "!important"
    },
    "col-pedidos-2": {
        "textAlign": "right !important"
    },
    "modal": {
        "top": 0,
        "bottom": 0,
        "left": 0,
        "right": 0,
        "width": "100%"
    },
    "item-select select": {
        "left": "0 !important",
        "width": "100%"
    },
    "ion-nav-view": {
        "position": "absolute",
        "top": 0,
        "left": 0,
        "width": "100%",
        "height": "100%",
        "backgroundColor": "#ffffff !important"
    },
    "platform-ios scroll-content": {
        "marginTop": "16px !important"
    },
    "barbar-stable": {
        "borderColor": "#387ef5",
        "backgroundColor": "#387ef5",
        "backgroundImage": "linear-gradient(0deg, #387ef5, #387ef5 50%, transparent 50%)",
        "color": "white"
    },
    "barbar-stable title": {
        "color": "#ffffff"
    },
    "button-cancel": {
        "backgroundColor": "red"
    },
    "bar-stable buttonbutton-clear": {
        "borderColor": "transparent",
        "background": "none",
        "boxShadow": "none",
        "color": "#ffffff",
        "fontSize": 17
    }
});