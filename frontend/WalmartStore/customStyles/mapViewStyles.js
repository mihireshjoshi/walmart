// MapViewStyles.js

import { StyleSheet, Dimensions } from 'react-native';

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: "auto",
    zIndex: -1,
  },

  topPop: {
    width: windowWidth,
    zIndex: 1,
    elevation: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optPop: {
    flexDirection: "row",
    paddingTop: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickTxt: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002E4F",
  },
  select: {
    width: 160,
    margin: 4,
    padding: 6,
    marginHorizontal: "auto",
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    padding: 0,
    backgroundColor: "#E6EDF2",
    borderRadius: 4,
  },
  qrButton: {
    marginHorizontal: 20,
    backgroundColor: "#002E4F",
    paddingHorizontal: "auto",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTxt: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  closeButton: {
    backgroundColor: "#266BBC",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  productListContainer: {
    margin: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  productListTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  productListItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#E6EDF2",
    borderRadius: 8,
  },
  productListText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#002E4F",
  },
});

export default styles;
