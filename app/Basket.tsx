import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import Colors from "@/constants/Colors";
import { useBasketStore } from "@/store/basketStore";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfettiCannon from "react-native-confetti-cannon";
import { Link } from "expo-router";
import GmailStyleSwipeableRow from "@/components/Swipable";

export default function Basket() {
  const { products, total, clearCart, reduceProduct } = useBasketStore();
  const [order, setOrder] = useState(false);
  const FEES = {
    service: 2.99,
    delivery: 5.99,
  };

  function checkOut() {
    setOrder(true);
    clearCart();
  }

  return (
    <>
      {order && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 10 }}
          fallSpeed={250}
          fadeOut={true}
          autoStart
        />
      )}
      {order && (
        <View style={{ marginTop: "50%", padding: 20, alignItems: "center" }}>
          <Text
            style={{ fontSize: 24, fontWeight: "bold", textAlign: "center" }}
          >
            Your Order has Been place successfully
          </Text>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.orderBtn}>
              <Text style={styles.footerText}>Place a New Order</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
      {!order && (
        <>
          <FlatList
            data={products}
            ListHeaderComponent={<Text style={styles.section}> Items</Text>}
            ItemSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
            )}
            renderItem={({ item }) => (
              <GmailStyleSwipeableRow onDelete={() => reduceProduct(item)}>
                <View style={styles.row}>
                  <Text style={{ fontSize: 18, color: Colors.primary }}>
                    {item.quantity}x
                  </Text>
                  <Text style={{ flex: 1, fontSize: 18 }}>{item.name}</Text>
                  <Text style={{ fontSize: 18 }}>${item.price}</Text>
                </View>
              </GmailStyleSwipeableRow>
            )}
            ListFooterComponent={
              <View>
                <View style={styles.totalRow}>
                  <Text style={styles.total}>Subtotal</Text>
                  <Text style={{ fontSize: 18 }}>${total}</Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.total}>Service Fee</Text>
                  <Text style={{ fontSize: 18 }}>${FEES.service}</Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.total}>Delivery Fee</Text>
                  <Text style={{ fontSize: 18 }}>${FEES.delivery}</Text>
                </View>

                <View style={styles.totalRow}>
                  <Text style={styles.total}>Order Total</Text>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    ${(FEES.delivery + total + FEES.service).toFixed(2)}
                  </Text>
                </View>
              </View>
            }
          />
          <View style={styles.footer}>
            <SafeAreaView
              edges={["bottom"]}
              style={{ backgroundColor: "#fff" }}
            >
              <TouchableOpacity style={styles.fullButton} onPress={checkOut}>
                <Text style={styles.footerText}>Place Order</Text>
              </TouchableOpacity>
            </SafeAreaView>
          </View>
        </>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    gap: 20,
    alignItems: "center",
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
  },
  total: {
    fontSize: 18,
    color: Colors.medium,
  },
  footer: {
    position: "absolute",
    backgroundColor: "#fff",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    paddingTop: 20,
  },
  fullButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 50,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  orderBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    width: 250,
    height: 50,
    justifyContent: "center",
    marginTop: 20,
  },
});
