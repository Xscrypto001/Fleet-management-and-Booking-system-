import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
// Login Screen Component
const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    // Validate fields
    if (!phoneNumber || !pin) {
      setError('Please fill in all fields');
      return;
    }
    
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    
    // Perform login logic here
    console.log('Logging in with:', phoneNumber, pin);
    setError('');
    
    // Navigate to main app
    // navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.logo}
            />
            <Text style={styles.appTitle}>BookMe</Text>
            <Text style={styles.appSubtitle}>Your booking companion</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.headerText}>Welcome Back</Text>
            <Text style={styles.subHeaderText}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="4-Digit PIN"
                placeholderTextColor="#aaa"
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Signup Screen Component
const SignupScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    // Validate fields
    if (!fullName || !phoneNumber || !pin) {
      setError('Please fill in all fields');
      return;
    }
    
    if (phoneNumber.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    
    if (pin.length !== 4) {
      setError('PIN must be 4 digits');
      return;
    }
    
    // Perform signup logic here
    console.log('Signing up with:', fullName, phoneNumber, pin);
    setError('');
    
    // Navigate to main app or verification
    // navigation.navigate('Verification');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
        >
          <View style={styles.logoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.logo}
            />
            <Text style={styles.appTitle}>BookMe</Text>
            <Text style={styles.appSubtitle}>Your booking companion</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.headerText}>Create Account</Text>
            <Text style={styles.subHeaderText}>Sign up to get started</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="call-outline" size={20} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#4c669f" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="4-Digit PIN"
                placeholderTextColor="#aaa"
                value={pin}
                onChangeText={setPin}
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSignup}>
              <Text style={styles.buttonText}>SIGN UP</Text>
            </TouchableOpacity>

            <View style={styles.footerContainer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.footerLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

// Shared styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#4c669f',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#4c669f',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

// Navigation setup (basic example)
const Nav= () => {
  // In a real app, you'd use React Navigation
  const [currentScreen, setCurrentScreen] = useState('Login');
  
  const navigation = {
    navigate: (screen) => setCurrentScreen(screen),
  };
  
  return (
    <>
      {currentScreen === 'Login' ? (
        <LoginScreen navigation={navigation} />
      ) : (
        <SignupScreen navigation={navigation} />
      )}
    </>
  );
};

export default Nav;
