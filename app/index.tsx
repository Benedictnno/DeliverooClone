import { View, Text ,StyleSheet} from 'react-native'
import React from 'react'
import Categories from '@/components/Categories'
import Colors from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import Resturants from '@/components/Resturants'

const Page = () => {
  return (
    <SafeAreaView style={styles.container} >
      <ScrollView contentContainerStyle={{paddingBottom:100}} >
        <Categories />
        <Text style={styles.header} >Top Picks from your neighborhood</Text>
        <Resturants/>
        <Text style={styles.header} >Offers Near You</Text>
        <Resturants/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    top: 90,
    backgroundColor: Colors.lightGrey,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});

export default Page