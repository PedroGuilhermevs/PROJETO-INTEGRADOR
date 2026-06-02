import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ParishCodeScreen from '../screens/ParishCodeScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import LessonsScreen from '../screens/LessonsScreen';
import LessonDetailScreen from '../screens/LessonDetailScreen';
import QuizScreen from '../screens/QuizScreen';
import ProgressScreen from '../screens/ProgressScreen';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomNavigation from '../components/BottomNavigation';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerShadowVisible: false,
  headerTintColor: theme.colors.text,
  headerTitleStyle: { fontWeight: '800' },
  contentStyle: { backgroundColor: theme.colors.background },
};

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Carregando sessao...</Text>
    </View>
  );
}

function withBottomNavigation(ScreenComponent, activeRoute) {
  return function ScreenWithBottomNavigation(props) {
    return (
      <View style={styles.withBottomNav}>
        <ScreenComponent {...props} />
        <BottomNavigation navigation={props.navigation} activeRoute={activeRoute} />
      </View>
    );
  };
}

const StudentDashboardWithNav = withBottomNavigation(StudentDashboardScreen, 'StudentDashboard');
const LessonsWithNav = withBottomNavigation(LessonsScreen, 'Lessons');
const LessonDetailWithNav = withBottomNavigation(LessonDetailScreen, 'Lessons');
const QuizWithNav = withBottomNavigation(QuizScreen, 'Lessons');
const ProgressWithNav = withBottomNavigation(ProgressScreen);
const AnnouncementsWithNav = withBottomNavigation(AnnouncementsScreen, 'Announcements');
const ProfileWithNav = withBottomNavigation(ProfileScreen, 'Profile');

function PublicStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Cadastro' }} />
    </Stack.Navigator>
  );
}

function ParishStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="ParishCode" component={ParishCodeScreen} options={{ title: 'Codigo da paroquia' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Stack.Navigator>
  );
}

function StudentStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="StudentDashboard" component={StudentDashboardWithNav} options={{ headerShown: false }} />
      <Stack.Screen name="Lessons" component={LessonsWithNav} options={{ headerShown: false }} />
      <Stack.Screen name="LessonDetail" component={LessonDetailWithNav} options={{ title: 'Detalhe da aula' }} />
      <Stack.Screen name="Quiz" component={QuizWithNav} options={{ title: 'Quiz' }} />
      <Stack.Screen name="Progress" component={ProgressWithNav} options={{ headerShown: false }} />
      <Stack.Screen name="Announcements" component={AnnouncementsWithNav} options={{ headerShown: false }} />
      <Stack.Screen name="Profile" component={ProfileWithNav} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { loading, isLoggedIn, profile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return <PublicStack />;
  }

  if (!profile?.paroquia_id) {
    return <ParishStack />;
  }

  return <StudentStack />;
}

const styles = StyleSheet.create({
  withBottomNav: {
    flex: 1,
    backgroundColor: theme.colors.glow,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  loadingText: {
    color: theme.colors.muted,
    fontSize: 15,
  },
});
