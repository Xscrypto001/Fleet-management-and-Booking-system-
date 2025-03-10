import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  HStack,
  VStack,
  Box,
  Heading,
  Button,
  Card,
  Icon,
  Divider,
  Badge,
  Spinner,
  Empty,
  useToast,
} from '@haystack/react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import PDFLib from 'react-native-pdf-lib';
import Share from 'react-native-share';
import * as FileSystem from 'expo-file-system';

const BookingHistoryScreen = ({ navigation }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', 'completed'
  const toast = useToast();

  // Mock data for bookings history
  const mockBookings = [
    {
      id: 'book-1',
      car: {
        id: '1',
        name: 'Express Deluxe',
        type: 'Bus',
        image: 'https://via.placeholder.com/300x200',
        departureTime: '08:30 AM',
        arrivalTime: '12:45 PM',
        duration: '4h 15m',
        from: 'New York',
        to: 'Boston',
      },
      bookingDate: '02 Mar 2025',
      travelDate: '10 Mar 2025',
      seats: [12, 13],
      totalAmount: 91.98,
      status: 'upcoming',
    },
    {
      id: 'book-2',
      car: {
        id: '3',
        name: 'City Hopper',
        type: 'Minibus',
        image: 'https://via.placeholder.com/300x200',
        departureTime: '10:15 AM',
        arrivalTime: '01:30 PM',
        duration: '3h 15m',
        from: 'Chicago',
        to: 'Detroit',
      },
      bookingDate: '25 Feb 2025',
      travelDate: '05 Mar 2025',
      seats: [5],
      totalAmount: 38.50,
      status: 'completed',
    },
    {
      id: 'book-3',
      car: {
        id: '2',
        name: 'Night Owl Express',
        type: 'Sleeper Bus',
        image: 'https://via.placeholder.com/300x200',
        departureTime: '10:00 PM',
        arrivalTime: '06:30 AM',
        duration: '8h 30m',
        from: 'Los Angeles',
        to: 'San Francisco',
      },
      bookingDate: '15 Feb 2025',
      travelDate: '28 Feb 2025',
      seats: [8, 9, 10],
      totalAmount: 165.75,
      status: 'completed',
    },
    {
      id: 'book-4',
      car: {
        id: '4',
        name: 'Mountain Explorer',
        type: 'Premium Bus',
        image: 'https://via.placeholder.com/300x200',
        departureTime: '07:45 AM',
        arrivalTime: '02:15 PM',
        duration: '6h 30m',
        from: 'Denver',
        to: 'Salt Lake City',
      },
      bookingDate: '05 Mar 2025',
      travelDate: '15 Mar 2025',
      seats: [22, 23],
      totalAmount: 112.00,
      status: 'upcoming',
    },
    {
      id: 'book-5',
      car: {
        id: '5',
        name: 'Coastal Route',
        type: 'Executive Bus',
        image: 'https://via.placeholder.com/300x200',
        departureTime: '09:00 AM',
        arrivalTime: '01:45 PM',
        duration: '4h 45m',
        from: 'Seattle',
        to: 'Portland',
      },
      bookingDate: '01 Feb 2025',
      travelDate: '15 Feb 2025',
      seats: [14],
      totalAmount: 54.99,
      status: 'canceled',
    },
  ];

  useEffect(() => {
    // Simulate API call to fetch bookings
    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 1500);
  }, []);

  const filteredBookings = () => {
    if (filter === 'all') return bookings;
    return bookings.filter(booking => booking.status === filter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'blue';
      case 'completed':
        return 'green';
      case 'canceled':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'completed':
        return 'Completed';
      case 'canceled':
        return 'Canceled';
      default:
        return status;
    }
  };

  const handleViewTicket = async (booking) => {
    if (booking.status === 'canceled') {
      toast.show({
        title: "Cannot view ticket",
        description: "This booking was canceled",
        status: "warning"
      });
      return;
    }

    toast.show({
      title: "Generating Ticket",
      description: "Please wait while we prepare your ticket",
      status: "info"
    });

    try {
      // Generate PDF ticket
      const pdfPath = `${FileSystem.cacheDirectory}ticket_${booking.id}_${Date.now()}.pdf`;
      
      // Create a PDF document (mock implementation)
      const pdfDoc = await PDFLib.PDFDocument.create();
      
      // Add a page
      const page = PDFLib.PDFPage
        .create()
        .setMediaBox(400, 600)
        .drawText(`TICKET: ${booking.car.name}`, {
          x: 30,
          y: 550,
          color: '#000000',
          fontSize: 24,
        })
        .drawText(`Route: ${booking.car.from} → ${booking.car.to}`, {
          x: 30,
          y: 520,
          color: '#000000',
          fontSize: 16,
        })
        .drawText(`Date: ${booking.travelDate}`, {
          x: 30,
          y: 490,
          color: '#000000',
          fontSize: 16,
        })
        .drawText(`Departure: ${booking.car.departureTime}`, {
          x: 30,
          y: 460,
          color: '#000000',
          fontSize: 16,
        })
        .drawText(`Arrival: ${booking.car.arrivalTime}`, {
          x: 30,
          y: 430,
          color: '#000000',
          fontSize: 16,
        })
        .drawText(`Seat(s): ${booking.seats.join(', ')}`, {
          x: 30,
          y: 400,
          color: '#000000',
          fontSize: 16,
        })
        .drawText(`Amount Paid: $${booking.totalAmount.toFixed(2)}`, {
          x: 30,
          y: 370,
          color: '#000000',
          fontSize: 16,
        })
        .drawRectangle({
          x: 30,
          y: 340,
          width: 340,
          height: 2,
          color: '#000000',
        })
        .drawText('Thank you for your booking!', {
          x: 30,
          y: 310,
          color: '#000000',
          fontSize: 14,
        });
      
      // Add the page to the document
      pdfDoc.addPages(page);
      
      // Write the PDF to file
      const pdf = await pdfDoc.write();
      await FileSystem.writeAsStringAsync(pdfPath, pdf, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Share the PDF
      await Share.open({
        url: `file://${pdfPath}`,
        type: 'application/pdf',
        title: 'Your Ticket',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.show({
        title: "Error",
        description: "Failed to generate ticket. Please try again.",
        status: "error"
      });
    }
  };

  const renderBookingItem = ({ item }) => (
    <Card style={styles.bookingCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('BookingDetails', { booking: item })}
        activeOpacity={0.7}
      >
        <VStack space={3}>
          {/* Header with image and status */}
          <Box style={styles.cardHeader}>
            <Image 
              source={{ uri: item.car.image }} 
              style={styles.cardImage}
              resizeMode="cover"
            />
            <Badge
              colorScheme={getStatusColor(item.status)}
              style={styles.statusBadge}
            >
              {getStatusText(item.status)}
            </Badge>
          </Box>
          
          {/* Booking details */}
          <VStack space={2} style={styles.cardContent}>
            <HStack justifyContent="space-between" alignItems="center">
              <Heading size="md">{item.car.name}</Heading>
              <Badge colorScheme="gray">
                {item.car.type}
              </Badge>
            </HStack>
            
            {/* Route info */}
            <HStack space={2} style={styles.routeContainer}>
              <VStack alignItems="flex-start">
                <HStack space={1} alignItems="center">
                  <Icon 
                    as={<MaterialCommunityIcons name="clock-outline" />}
                    size={4}
                    color="gray.500"
                  />
                  <Text style={styles.timeText}>{item.car.departureTime}</Text>
                </HStack>
                <Text style={styles.locationText}>{item.car.from}</Text>
              </VStack>
              
              <VStack alignItems="center" flex={1}>
                <Text style={styles.durationText}>{item.car.duration}</Text>
                <Divider style={styles.routeLine} />
              </VStack>
              
              <VStack alignItems="flex-end">
                <HStack space={1} alignItems="center">
                  <Text style={styles.timeText}>{item.car.arrivalTime}</Text>
                  <Icon 
                    as={<MaterialCommunityIcons name="clock-outline" />}
                    size={4}
                    color="gray.500"
                  />
                </HStack>
                <Text style={styles.locationText}>{item.car.to}</Text>
              </VStack>
            </HStack>
            
            {/* Date and seat info */}
            <HStack justifyContent="space-between" style={styles.infoRow}>
              <HStack space={1} alignItems="center">
                <Icon 
                  as={<FontAwesome5 name="calendar-alt" />}
                  size={4}
                  color="gray.500"
                />
                <Text>{item.travelDate}</Text>
              </HStack>
              
              <HStack space={1} alignItems="center">
                <Icon 
                  as={<MaterialCommunityIcons name="seat" />}
                  size={4}
                  color="gray.500"
                />
                <Text>Seat{item.seats.length > 1 ? 's' : ''}: {item.seats.join(', ')}</Text>
              </HStack>
            </HStack>
            
            {/* Price and view ticket */}
            <HStack justifyContent="space-between" alignItems="center" style={styles.actionRow}>
              <Text style={styles.priceText}>${item.totalAmount.toFixed(2)}</Text>
              
              <Button
                size="sm"
                colorScheme={item.status === 'canceled' ? 'gray' : 'blue'}
                leftIcon={<Icon as={<FontAwesome5 name="ticket-alt" />} size={4} />}
                onPress={() => handleViewTicket(item)}
              >
                View Ticket
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </TouchableOpacity>
    </Card>
  );

  const renderEmptyList = () => (
    <Empty
      icon={<Icon as={<FontAwesome5 name="ticket-alt" />} size={12} color="gray.400" />}
      title="No bookings found"
      description={`You don't have any ${filter !== 'all' ? filter + ' ' : ''}bookings yet`}
    />
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Spinner size="lg" color="blue.500" />
        <Text style={styles.loaderText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter tabs */}
      <HStack style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterTab, filter === 'all' && styles.activeFilterTab]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'upcoming' && styles.activeFilterTab]}
          onPress={() => setFilter('upcoming')}
        >
          <Text style={[styles.filterText, filter === 'upcoming' && styles.activeFilterText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'completed' && styles.activeFilterTab]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterText, filter === 'completed' && styles.activeFilterText]}>
            Completed
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.filterTab, filter === 'canceled' && styles.activeFilterTab]}
          onPress={() => setFilter('canceled')}
        >
          <Text style={[styles.filterText, filter === 'canceled' && styles.activeFilterText]}>
            Canceled
          </Text>
        </TouchableOpacity>
      </HStack>
      
      {/* Booking list */}
      <FlatList
        data={filteredBookings()}
        renderItem={renderBookingItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeFilterTab: {
    borderBottomColor: '#3182CE',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    fontWeight: 'bold',
    color: '#3182CE',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  bookingCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cardHeader: {
    position: 'relative',
    height: 120,
  },
  cardImage: {
    height: '100%',
    width: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  cardContent: {
    padding: 16,
  },
  routeContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 14,
    color: '#555',
  },
  durationText: {
    fontSize: 12,
    color: '#777',
    textAlign: 'center',
  },
  routeLine: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  infoRow: {
    marginTop: 8,
  },
  actionRow: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3182CE',
  },
});

export default BookingHistoryScreen;
