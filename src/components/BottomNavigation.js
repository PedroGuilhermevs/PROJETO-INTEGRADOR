import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bell, BookOpen, Home, UserRound } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../styles/theme';

const tabs = [
  { label: 'Inicio', route: 'StudentDashboard', icon: Home },
  { label: 'Aulas', route: 'Lessons', icon: BookOpen },
  { label: 'Comunicados', route: 'Announcements', icon: Bell },
  { label: 'Perfil', route: 'Profile', icon: UserRound },
];

export default function BottomNavigation({ navigation, activeRoute }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      <View style={styles.bar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeRoute === tab.route;

          return (
            <Pressable
              key={tab.route}
              accessibilityRole="button"
              accessibilityState={isActive ? { selected: true } : undefined}
              onPress={() => {
                if (!isActive) {
                  navigation.navigate(tab.route);
                }
              }}
              style={({ pressed }) => [styles.item, pressed && styles.pressed]}
            >
              <View style={[styles.iconWrap, isActive && styles.activeIconWrap]}>
                <Icon size={24} color={isActive ? theme.colors.primaryDark : theme.colors.muted} strokeWidth={2.2} />
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]} numberOfLines={1}>
                {tab.label}
              </Text>
              <View style={[styles.indicator, isActive && styles.activeIndicator]} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.glow,
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  bar: {
    minHeight: 66,
    backgroundColor: '#FFFDF8',
    borderColor: 'rgba(229, 216, 200, 0.78)',
    borderWidth: 1,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    shadowColor: '#5E4D3E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
  item: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 5,
  },
  pressed: {
    opacity: 0.78,
  },
  iconWrap: {
    width: 50,
    height: 30,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIconWrap: {
    backgroundColor: theme.colors.softGreen,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 10.5,
    fontWeight: '600',
  },
  activeLabel: {
    color: theme.colors.primaryDark,
    fontWeight: '800',
  },
  indicator: {
    width: 17,
    height: 4,
    borderRadius: 4,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    backgroundColor: theme.colors.primaryDark,
  },
});
