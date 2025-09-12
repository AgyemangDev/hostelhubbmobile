import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Cads from './Cads';


const MainSectionHeader = () => {
  const data = [{
    id: 1,
    hostelName: "'St Theresa's  Hostel",
    location: "No. 1 T. Nagar, Chennai"
  },
  {
    id: 2,
    hostelName: "'St Theresa's  Hostel",
    location: "No. 1 T. Nagar, Chennai"
  },
  {
    id: 3,
    hostelName: "'St Theresa's  Hostel",
    location: "No. 1 T. Nagar, Chennai"
  }
,{
  id: 4,
  hostelName: "'St Theresa's  Hostel",
  location: "No. 1 T. Nagar, Chennai"
},
{
id: 5,
hostelName: "'St Theresa's  Hostel",
location: "No. 1 T. Nagar, Chennai"
},
{
id: 6,
hostelName: "'St Theresa's  Hostel",
location: "No. 1 T. Nagar, Chennai"
},
{
id: 7,
hostelName: "'St Theresa's  Hostel",
location: "No. 1 T. Nagar, Chennai"
}
,{
id: 8,
hostelName: "'St Theresa's  Hostel",
location: "No. 1 T. Nagar, Chennai"
}]
  return (
    <View>
        <FlatList data={data}
    renderItem={({item})=>  <Cads hostelName={item.hostelName} location={item.location}/>}
    keyExtractor={item=> item.id}
    scrollEnabled={false}
    />
    </View>

  );
};

export default MainSectionHeader;


