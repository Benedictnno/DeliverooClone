import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SectionList,
  ListRenderItem,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import Colors from "@/constants/Colors";
import ParallexScrollview from "@/components/ParallexScrollview";
import { restaurant } from "@/assets/data/restaurant";
import { Link, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScrollView } from "react-native-gesture-handler";
import { useBasketStore } from "@/store/basketStore";

export default function Details() {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState<Number>(0);
  const opacity = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<TouchableOpacity[]>([]);
  const Data = restaurant.food.map((item, index) => ({
    title: item.category,
    data: item.meals,
    index,
  }));

  const { items, total } = useBasketStore();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: " ",
      headerLeft: () => {
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.roundButton}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>;
      },
      headerRight: () => {
        <View style={styles.bar}>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="share-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.roundButton}>
            <Ionicons name="search-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>;
      },
      headerTintColor: Colors.primary,
    });
  }, []);

  const renderItem: ListRenderItem<any> = ({ item, index }) => (
    <Link href={{ pathname: "/(model)/Dish", params: { id: item.id } }} asChild>
      <TouchableOpacity style={styles.item}>
        <View style={{ flex: 1 }}>
          <Text style={styles.dish}> {item?.name} </Text>
          <Text style={styles.dishText}> {item?.info} </Text>
          <Text style={styles.dishText}> {item?.price} </Text>
        </View>
        <Image source={item?.img} style={styles.dishImage} />
      </TouchableOpacity>
    </Link>
  );

  function selectCategory(index: number) {
    const selected = itemRef.current[index];
    setActiveIndex(index);

    selected.measure((x) => {
      scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true });
    });
  }

  function onScroll(event: any) {
    const y = event.nativeEvent.contentOffset.y;
    if (y > 350) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  }
  return (
    <>
      <ParallexScrollview
        scrollEvent={onScroll}
        style={{ flex: 1 }}
        parallaxHeaderHeight={300}
        stickyHeaderHeight={130}
        backgroundColor="#fff"
        renderStickyHeader={() => (
          <View key={"sticky-header"} style={styles.stickySection}>
            <Text style={styles.stickySectionText}>{restaurant.name}</Text>
          </View>
        )}
        renderBackground={() => (
          <Image
            source={restaurant.img}
            style={{ width: "100%", height: 300 }}
          />
        )}
      >
        <View style={styles.detailsContainer}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.restaurantDescription}>
            {restaurant.delivery} *{" "}
            {restaurant.tags.map(
              (tag, index) =>
                `${tag}${index < restaurant.tags.length - 1 ? "," : " "}`
            )}
          </Text>
          <Text style={styles.restaurantDescription}>{restaurant.about}</Text>
          <SectionList
            contentContainerStyle={{ paddingBottom: 50 }}
            keyExtractor={(Item, index) => `${Item.name + index}`}
            sections={Data}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  marginHorizontal: 20,
                  height: 1,
                  backgroundColor: Colors.grey,
                }}
              />
            )}
            SectionSeparatorComponent={() => (
              <View style={{ height: 1, backgroundColor: Colors.grey }} />
            )}
            renderItem={renderItem}
            renderSectionHeader={({ section: { title, index } }) => (
              <Text style={styles.sectionHeader}>{title}</Text>
            )}
          />
        </View>
      </ParallexScrollview>

      {/* Sticky segment */}
      <Animated.View style={[styles.stickySegments, animatedStyles]}>
        <View style={styles.segmentsShadow}>
          <ScrollView
            ref={scrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          >
            {restaurant.food.map((item, index) => (
              <TouchableOpacity
                ref={(ref) => (itemRef.current[index] = ref!)}
                key={index}
                style={
                  activeIndex === index
                    ? styles.segmentButtonActive
                    : styles.segmentButton
                }
                onPress={() => selectCategory(index)}
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.segmentTextActive
                      : styles.segmentText
                  }
                >
                  {item.category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* Footer Basket */}
      {items > 0 && (
        <View style={styles.footer}>
          <Link href={"/Basket"} asChild>
            <TouchableOpacity style={styles.fullButton}>
              <Text style={styles.basket}>{items}</Text>
              <Text style={styles.footerText}>View Basket</Text>
              <Text style={styles.basketTotal}>Total : ${total}</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: Colors.lightGrey,
  },
  stickySection: {
    backgroundColor: "#fff",
    marginLeft: 70,
    height: 100,
    justifyContent: "flex-end",
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  stickySectionText: {
    fontSize: 20,
    margin: 10,
  },
  restaurantName: {
    fontSize: 30,
    margin: 16,
  },
  restaurantDescription: {
    fontSize: 16,
    margin: 16,
    lineHeight: 22,
    color: Colors.medium,
  },
  sectionHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 40,
    margin: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
  },
  dishImage: {
    height: 80,
    width: 80,
    borderRadius: 4,
  },
  dish: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dishText: {
    fontSize: 14,
    color: Colors.mediumDark,
    paddingVertical: 4,
  },
  stickySegments: {
    position: "absolute",
    height: 50,
    left: 0,
    right: 0,
    top: 100,
    backgroundColor: "#fff",
    overflow: "hidden",
    paddingBottom: 4,
  },
  segmentsShadow: {
    backgroundColor: "#fff",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: "100%",
    height: "100%",
  },
  segmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
  },
  segmentText: {
    color: Colors.primary,
    fontSize: 16,
  },
  segmentButtonActive: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  segmentTextActive: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  segmentScrollview: {
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 20,
    paddingBottom: 4,
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
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    height: 50,
  },
  footerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  basket: {
    color: "#fff",
    backgroundColor: "#19AA86",
    fontWeight: "bold",
    padding: 8,
    borderRadius: 2,
  },
  basketTotal: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
