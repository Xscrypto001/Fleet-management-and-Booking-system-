import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,ActivityIndicator,
} from 'react-native';
import {
  HStack,
  VStack,
  Box,
  Heading,
  Button,
  Icon,
  Divider,
  Badge,
  Spinner,
  useToast,
} from 'native-base';
import { ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import Share from 'react-native-share';
import * as FileSystem from 'expo-file-system';
const CarDetailScreen = ({ route, navigation }) => {
 /* const { car } = route.params || {
    car: {
      id: '1',
      name: 'Express Deluxe',
      type: 'Bus',
      image: 'https://via.placeholder.com/300x200',
      rating: 4.7,
      departureTime: '08:30 AM',
      arrivalTime: '12:45 PM',
      duration: '4h 15m',
      from: 'New York',
      to: 'Boston',
      date: '10 Mar 2025',
      price: 45.99,
      amenities: ['WiFi', 'AC', 'USB Charging', 'Reclining Seats'],
      totalSeats: 30,
      availableSeats: 18,
    }
  };*/
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/car/${carId}/`)
      .then(response => response.json())
      .then(data => {
        setCar(data.car);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching car details:", error);
        setLoading(false);
      });
  }, [carId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#1abc9c" style={styles.loader} />;
  }
  const [selectedSeats, setSelectedSeats] = useState([]);
  const toast = useToast();

  // Generate seat layout
  const generateSeats = () => {
    const seats = [];
    const rows = Math.ceil(car.totalSeats / 4); // 4 seats per row
    let seatNumber = 1;

    for (let i = 0; i < rows; i++) {
      const rowSeats = [];
      for (let j = 0; j < 4 && seatNumber <= car.totalSeats; j++) {
        // Skip aisle between seats 2 and 3
        if (j === 2) {
          rowSeats.push(
            <View key={`aisle-${i}`} style={styles.aisle} />
          );
        }
        
        const isAvailable = seatNumber <= car.availableSeats;
        const isSelected = selectedSeats.includes(seatNumber);
        
        rowSeats.push(
          <TouchableOpacity
            key={seatNumber}
            style={[
              styles.seat,
              !isAvailable && styles.bookedSeat,
              isSelected && styles.selectedSeat,
            ]}
            disabled={!isAvailable}
            onPress={() => toggleSeatSelection(seatNumber)}
          >
            <Text style={[
              styles.seatText,
              isSelected && styles.selectedSeatText,
            ]}>
              {seatNumber}
            </Text>
          </TouchableOpacity>
        );
        seatNumber++;
      }
      
      seats.push(
        <HStack key={`row-${i}`} style={styles.seatRow}>
          {rowSeats}
        </HStack>
      );
    }
    return seats;
  };

  const toggleSeatSelection = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const generateTicketPDF = async () => {
    if (selectedSeats.length === 0) {
      toast.show({
        title: "No seats selected",
        description: "Please select at least one seat to continue",
        status: "warning"
      });
      return;
    }

    // Simulate payment process
    Alert.alert(
      "Complete Payment",
      `Total amount: $${(car.price * selectedSeats.length).toFixed(2)}`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Pay Now",
          onPress: async () => {
            toast.show({
              title: "Payment Successful",
              description: "Generating your ticket...",
              status: "success"
            });
            
            // Generate PDF ticket (mock implementation)
            try {
              const pdfPath = `${FileSystem.cacheDirectory}ticket_${car.id}_${Date.now()}.pdf`;
              
              // Create a PDF document
              const pdfDoc = await PDFDocument.create();
              
              // Add a page
              const page = PDFPage
                .create()
                .setMediaBox(400, 600)
                .drawText(`TICKET: ${car.name}`, {
                  x: 30,
                  y: 550,
                  color: '#000000',
                  fontSize: 24,
                })
                .drawText(`Route: ${car.from} → ${car.to}`, {
                  x: 30,
                  y: 520,
                  color: '#000000',
                  fontSize: 16,
                })
                .drawText(`Date: ${car.date}`, {
                  x: 30,
                  y: 490,
                  color: '#000000',
                  fontSize: 16,
                })
                .drawText(`Departure: ${car.departureTime}`, {
                  x: 30,
                  y: 460,
                  color: '#000000',
                  fontSize: 16,
                })
                .drawText(`Arrival: ${car.arrivalTime}`, {
                  x: 30,
                  y: 430,
                  color: '#000000',
                  fontSize: 16,
                })
                .drawText(`Seat(s): ${selectedSeats.join(', ')}`, {
                  x: 30,
                  y: 400,
                  color: '#000000',
                  fontSize: 16,
                })
                .drawText(`Amount Paid: $${(car.price * selectedSeats.length).toFixed(2)}`, {
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
              
              // Navigate to success screen or back to list
              navigation.navigate('BookingSuccess', {
                car,
                selectedSeats,
                totalAmount: (car.price * selectedSeats.length).toFixed(2),
              });
            } catch (error) {
              console.error('Error generating PDF:', error);
              toast.show({
                title: "Error",
                description: "Failed to generate ticket. Please try again.",
                status: "error"
              });
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with image */}
      <Box style={styles.imageContainer}>
        <Image 
          source={{ uri: car.image }} 
          style={styles.image}
          resizeMode="cover"
        />
        <Badge 
          style={styles.typeBadge}
          colorScheme="blue"
        >
          {car.type}
        </Badge>
      </Box>
      
      {/* Basic Info */}
      <Card style={styles.card}>
        <VStack space={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <Heading size="lg">{car.name}</Heading>
            <HStack alignItems="center">
              <Icon 
                as={<MaterialCommunityIcons name="star" />}
                size={5}
                color="amber.500"
              />
              <Text style={styles.ratingText}>{car.rating}</Text>
            </HStack>
          </HStack>
          
          {/* Journey details */}
          <HStack space={2} style={styles.journeyContainer}>
            <VStack alignItems="center">
              <Text style={styles.timeText}>{car.departureTime}</Text>
              <Text style={styles.locationText}>{car.from}</Text>
            </VStack>
            
            <VStack alignItems="center" flex={1}>
              <Text style={styles.durationText}>{car.duration}</Text>
              <Divider style={styles.journeyLine} />
              <Icon 
                as={<MaterialCommunityIcons name="bus" />}
                size={6}
                color="blue.500"
              />
            </VStack>
            
            <VStack alignItems="center">
              <Text style={styles.timeText}>{car.arrivalTime}</Text>
              <Text style={styles.locationText}>{car.to}</Text>
            </VStack>
          </HStack>
          
          <Text style={styles.dateText}>Date: {car.date}</Text>
          
          {/* Amenities */}
          <VStack space={2}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <HStack flexWrap="wrap" space={2}>
              {car.amenities.map((amenity, index) => (
                <Badge key={index} colorScheme="blue" style={styles.amenityBadge}>
                  {amenity}
                </Badge>
              ))}
            </HStack>
          </VStack>
        </VStack>
      </Card>
      
      {/* Seat Selection */}
      <Card style={styles.card}>
        <VStack space={3}>
          <Heading size="md">Select Seats</Heading>
          <Text>Available: {car.availableSeats} / {car.totalSeats} seats</Text>
          
          <HStack space={3} style={styles.seatLegend}>
            <HStack alignItems="center" space={1}>
              <Box style={styles.availableSeatLegend} />
              <Text>Available</Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <Box style={styles.selectedSeatLegend} />
              <Text>Selected</Text>
            </HStack>
            <HStack alignItems="center" space={1}>
              <Box style={styles.bookedSeatLegend} />
              <Text>Booked</Text>
            </HStack>
          </HStack>
          
          {/* Bus front */}
          <Box style={styles.busFront}>
            <Text style={styles.busFrontText}>Driver</Text>
          </Box>
          
          {/* Seat layout */}
          <VStack style={styles.seatLayout}>
            {generateSeats()}
          </VStack>
        </VStack>
      </Card>
      
      {/* Price and Booking */}
      <Card style={styles.card}>
        <VStack space={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text style={styles.priceLabel}>Price per seat</Text>
              <Text style={styles.priceText}>${car.price.toFixed(2)}</Text>
            </VStack>
            
            <VStack>
              <Text style={styles.priceLabel}>Total amount</Text>
              <Text style={styles.totalPriceText}>
                ${(car.price * selectedSeats.length).toFixed(2)}
              </Text>
            </VStack>
          </HStack>
          
          <HStack>
            <Text>Selected seats: </Text>
            <Text style={styles.selectedSeatsText}>
              {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}
            </Text>
          </HStack>
          
          <Button
            size="lg"
            colorScheme="blue"
            onPress={generateTicketPDF}
            isDisabled={selectedSeats.length === 0}
            leftIcon={<Icon as={<FontAwesome5 name="ticket-alt" />} size={5} />}
          >
            Complete Payment & Book
          </Button>
        </VStack>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  typeBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  card: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  journeyContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  locationText: {
    fontSize: 16,
    color: '#555',
  },
  durationText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  journeyLine: {
    height: 2,
    width: '100%',
    marginVertical: 8,
  },
  dateText: {
    fontSize: 16,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  amenityBadge: {
    marginRight: 8,
    marginBottom: 8,
  },
  seatLegend: {
    justifyContent: 'center',
    marginVertical: 12,
  },
  availableSeatLegend: {
    width: 20,
    height: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  selectedSeatLegend: {
    width: 20,
    height: 20,
    backgroundColor: '#3182CE',
    borderRadius: 4,
  },
  bookedSeatLegend: {
    width: 20,
    height: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
  },
  busFront: {
    backgroundColor: '#ddd',
    width: '50%',
    height: 30,
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  busFrontText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  seatLayout: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  seatRow: {
    marginBottom: 12,
    justifyContent: 'center',
  },
  seat: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  selectedSeat: {
    backgroundColor: '#3182CE',
    borderColor: '#2C5282',
  },
  bookedSeat: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E0',
  },
  seatText: {
    fontSize: 14,
  },
  selectedSeatText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  aisle: {
    width: 20,
  },
  priceLabel: {
    fontSize: 14,
    color: '#777',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPriceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3182CE',
  },
  selectedSeatsText: {
    fontWeight: 'bold',
  },
});

export default CarDetailScreen;
