import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { vendorService, userService } from '@/lib/supabase-service';
import { Colors } from '@/constants/Colors';
import { Spacing, FontSize } from '@/constants/Spacing';

export default function SupabaseTest() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    const results: string[] = [];
    
    try {
      // Test 1: Basic connection
      results.push('🔍 Testing basic connection...');
      const { data, error } = await supabase.from('vendors').select('count').limit(1);
      
      if (error) {
        throw error;
      }
      
      results.push('✅ Basic connection successful');
      setConnectionStatus('connected');
      
      // Test 2: Service layer
      results.push('🔍 Testing service layer...');
      const vendors = await vendorService.getAllVendors();
      results.push(`✅ Service layer working - Found ${vendors.length} vendors`);
      
      // Test 3: Environment validation
      results.push('🔍 Testing environment variables...');
      const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
      const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
      
      if (url && key && !url.includes('your-project') && !key.includes('your-anon')) {
        results.push('✅ Environment variables configured');
      } else {
        results.push('⚠️ Environment variables need to be set');
      }
      
    } catch (error: any) {
      results.push(`❌ Connection failed: ${error.message}`);
      setConnectionStatus('error');
    }
    
    setTestResults(results);
  };

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: 'test@hoppn.com',
        password: 'testpassword123'
      });
      
      if (error) {
        Alert.alert('Auth Test Failed', error.message);
      } else {
        Alert.alert('Auth Test Success', 'Test user created successfully');
      }
    } catch (error: any) {
      Alert.alert('Auth Test Error', error.message);
    }
  };

  const clearTestUser = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Alert.alert('Sign Out Error', error.message);
      } else {
        Alert.alert('Success', 'Test user signed out');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hoppn Supabase Test</Text>
        <Text style={styles.subtitle}>Testing database connection and services</Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Connection Status:</Text>
        <View style={[
          styles.statusIndicator,
          connectionStatus === 'connected' && styles.statusConnected,
          connectionStatus === 'error' && styles.statusError
        ]}>
          <Text style={styles.statusText}>
            {connectionStatus === 'testing' && '🔄 Testing...'}
            {connectionStatus === 'connected' && '✅ Connected'}
            {connectionStatus === 'error' && '❌ Error'}
          </Text>
        </View>
      </View>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Test Results:</Text>
        {testResults.map((result, index) => (
          <Text key={index} style={styles.resultText}>
            {result}
          </Text>
        ))}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.button} onPress={testConnection}>
          <Text style={styles.buttonText}>🔄 Retest Connection</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={testAuth}>
          <Text style={styles.buttonText}>🔐 Test Authentication</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={clearTestUser}>
          <Text style={styles.buttonText}>🚪 Clear Test User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Next Steps:</Text>
        <Text style={styles.infoText}>1. Set up your Supabase project</Text>
        <Text style={styles.infoText}>2. Run the database schema</Text>
        <Text style={styles.infoText}>3. Configure environment variables</Text>
        <Text style={styles.infoText}>4. Test on a physical device</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    padding: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontFamily: 'Montserrat-Bold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  statusLabel: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  statusIndicator: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    backgroundColor: Colors.gray[200],
  },
  statusConnected: {
    backgroundColor: Colors.success + '20',
  },
  statusError: {
    backgroundColor: Colors.error + '20',
  },
  statusText: {
    fontSize: FontSize.sm,
    fontFamily: 'Montserrat-SemiBold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
  },
  resultsTitle: {
    fontSize: FontSize.lg,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  resultText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  actionsContainer: {
    marginBottom: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
  },
  infoContainer: {
    backgroundColor: Colors.accent + '10',
    padding: Spacing.md,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: FontSize.md,
    fontFamily: 'Montserrat-SemiBold',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    fontSize: FontSize.sm,
    fontFamily: 'OpenSans-Regular',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
}); 