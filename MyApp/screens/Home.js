import React, { useState } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, SafeAreaView, StatusBar } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableBuses, setAvailableBuses] = useState([]);
  const [loading, setLoading] = useState(true);
/*
  const [availableBuses, setAvailableBuses] = useState([
    { id: '1', route: 'Downtown - Suburbs', time: '10:30 AM', driver: 'John Smith', seats: 14, price: '$5.50' },
    { id: '2', route: 'Airport Express', time: '11:45 AM', driver: 'Sarah Johnson', seats: 8, price: '$12.00' },
    { id: '3', route: 'Central Station - Mall', time: '12:15 PM', driver: 'Mike Chen', seats: 22, price: '$4.25' },
    { id: '4', route: 'University - Downtown', time: '1:30 PM', driver: 'Emma Davis', seats: 5, price: '$3.75' },
    { id: '5', route: 'Beach Route', time: '2:45 PM', driver: 'Robert Wilson', seats: 17, price: '$6.00' },
  ]); */
  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/routes/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAvailableBuses(data);
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="blue" />;
  }
  const filteredBuses = availableBuses.filter(
    bus => bus.route.toLowerCase().includes(searchQuery.toLowerCase()) || 
           bus.driver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderBusItem = ({ item }) => (
    <TouchableOpacity style={styles.busItem}>
      <View style={styles.busDetails}>
        <View style={styles.routeRow}>
          <Ionicons name="bus" size={24} color="#3366CC" />
          <Text style={styles.routeText}>{item.route}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.timeText}>{item.time}</Text>
          <View style={styles.driverContainer}>
            <Ionicons name="person" size={16} color="#555" />
            <Text style={styles.driverText}>{item.driver}</Text>
          </View>
        </View>
        <View style={styles.bottomRow}>
          <View style={styles.seatsContainer}>
            <MaterialIcons name="event-seat" size={16} color={item.seats < 10 ? "#FF6B6B" : "#4CAF50"} />
            <Text style={[styles.seatsText, {color: item.seats < 10 ? "#FF6B6B" : "#4CAF50"}]}>
              {item.seats} seats available
            </Text>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.appTitle}>TravelGo</Text>
        <TouchableOpacity>
          <Ionicons name="notifications" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            title="Your Location"
            description="Current Location"
          />
          <Marker
            coordinate={{ latitude: 37.79825, longitude: -122.4224 }}
            title="Bus Station"
            description="Central Bus Station"
            pinColor="#3366CC"
          />
        </MapView>
      </View>

      {/* Service Selection Tabs */}
      <View style={styles.serviceContainer}>
        <TouchableOpacity 
          style={[
            styles.serviceTab, 
            activeTab === 'ticket' ? styles.activeServiceTab : null
          ]}
          onPress={() => setActiveTab('ticket')}
        >
          <FontAwesome5 name="ticket-alt" size={24} color={activeTab === 'ticket' ? "#fff" : "#3366CC"} />
          <Text style={[styles.serviceText, activeTab === 'ticket' ? styles.activeServiceText : null]}>Book Ticket</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.serviceTab, 
            activeTab === 'parcel' ? styles.activeServiceTab : null
          ]}
          onPress={() => setActiveTab('parcel')}
        >
          <FontAwesome5 name="box" size={24} color={activeTab === 'parcel' ? "#fff" : "#3366CC"} />
          <Text style={[styles.serviceText, activeTab === 'parcel' ? styles.activeServiceText : null]}>Send Parcel</Text>
        </TouchableOpacity>
      </View>

      {/* Ticket Booking Section */}
      {activeTab === 'ticket' && (
        <View style={styles.contentContainer}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search routes or drivers..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <Text style={styles.sectionTitle}>Available Buses</Text>
          
          <FlatList
            data={filteredBuses}
            renderItem={renderBusItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.busList}
          />
        </View>
      )}

      {/* Parcel Delivery Section */}
      {activeTab === 'parcel' && (
        <View style={styles.contentContainer}>
          <View style={styles.parcelContainer}>
            <Image 
              source={{ uri: 'https://via.placeholder.com/80' }} 
              style={styles.parcelImage} 
            />
            <Text style={styles.parcelTitle}>Request Parcel Delivery</Text>
            <Text style={styles.parcelDescription}>
              Send packages to any destination with our reliable delivery service
            </Text>
            
            <TouchableOpacity style={styles.parcelButton}>
              <Text style={styles.parcelButtonText}>Set Pickup Location</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#3366CC" />
          <Text style={[styles.navText, { color: "#3366CC" }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="time" size={24} color="#888" />
          <Text style={styles.navText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <FontAwesome5 name="ticket-alt" size={22} color="#888" />
          <Text style={styles.navText}>Tickets</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f9fc',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3366CC',
  },
  mapContainer: {
    height: 200,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    height: '100%',
    width: '100%',
  },
  serviceContainer: {
    flexDirection: 'row',
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    gap: 8,
  },
  activeServiceTab: {
    backgroundColor: '#3366CC',
  },
  serviceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3366CC',
  },
  activeServiceText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  busList: {
    paddingBottom: 16,
  },
  busItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  busDetails: {
    padding: 16,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeText: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  seatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seatsText: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3366CC',
  },
  parcelContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  parcelImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  parcelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  parcelDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  parcelButton: {
    backgroundColor: '#3366CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  parcelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#888',
  },
});

export default HomeScreen;
