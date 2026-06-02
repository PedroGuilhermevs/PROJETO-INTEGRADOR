import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import {
  BookOpen,
  CalendarDays,
  Check,
  Church,
  Clock3,
  Edit3,
  Flame,
  Hand,
  HandHeart,
  HandHelping,
  Lock,
  Sprout,
  Trophy,
  UsersRound,
  Wine,
} from 'lucide-react-native';
import { currentUser } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/formatters';
import { theme } from '../styles/theme';

const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });

const journeyItems = [
  { title: 'Boas-vindas', progress: 100, status: 'unlocked', icon: Hand },
  { title: 'Orações', progress: 75, status: 'unlocked', icon: HandHelping },
  { title: 'Bíblia', progress: 60, status: 'progress', icon: BookOpen },
  { title: 'Missa', progress: 40, status: 'progress', icon: Wine },
  { title: 'Mandamentos', progress: 0, status: 'locked', icon: BookOpen },
  { title: 'Sacramentos', progress: 0, status: 'locked', icon: CrossIcon },
  { title: 'Comunidade', progress: 0, status: 'locked', icon: UsersRound },
  { title: 'Presença', progress: 0, status: 'soon', icon: HandHeart },
];

const statusMeta = {
  unlocked: {
    label: 'Desbloqueada',
    color: '#2F7B4B',
    soft: '#EEF8EF',
    border: '#D3EBD7',
    Icon: Check,
  },
  progress: {
    label: 'Em progresso',
    color: '#D8A31C',
    soft: '#FFF8E8',
    border: '#F1DDA8',
    Icon: Clock3,
  },
  locked: {
    label: 'Bloqueada',
    color: '#8F918C',
    soft: '#F7F7F5',
    border: '#E2E0DA',
    Icon: Lock,
  },
  soon: {
    label: 'Em breve',
    color: '#8FAFC1',
    soft: '#F2F8FB',
    border: '#D9E8EF',
    Icon: Clock3,
  },
};

function CrossIcon(props) {
  return <Church {...props} />;
}

function ChurchBackdrop() {
  return (
    <Svg width="176" height="130" viewBox="0 0 176 130" style={styles.churchBackdrop} pointerEvents="none">
      <Path d="M95 51L132 29L169 51V119H95V51Z" fill="#FFFFFF" opacity="0.12" />
      <Path d="M107 51L132 36L157 51" stroke="#FFFFFF" strokeWidth="4" opacity="0.13" />
      <Rect x="123" y="73" width="18" height="46" rx="9" fill="#052F20" opacity="0.38" />
      <Rect x="114" y="58" width="11" height="18" rx="5.5" fill="#052F20" opacity="0.3" />
      <Rect x="140" y="58" width="11" height="18" rx="5.5" fill="#052F20" opacity="0.3" />
      <Path d="M132 8V29" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.14" />
      <Path d="M123 17H141" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.14" />
      <Path d="M8 111C35 83 58 82 91 115" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" opacity="0.08" />
      <Path d="M145 115C158 92 160 70 164 45" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.12" />
      <Path d="M148 83C162 80 169 71 172 60" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.12" />
      <Path d="M148 101C161 99 170 91 175 80" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.11" />
    </Svg>
  );
}

function ProgressTrack({ value, color, muted = false }) {
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(value, 100))}%`, backgroundColor: muted ? '#C7C7C2' : color }]} />
    </View>
  );
}

function StatusDot({ status }) {
  const meta = statusMeta[status];
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: meta.color }]} />
      <Text style={styles.legendText}>{meta.label}</Text>
    </View>
  );
}

function JourneyCard({ item }) {
  const meta = statusMeta[item.status];
  const Icon = item.icon;
  const StatusIcon = meta.Icon;
  const isLocked = item.status === 'locked' || item.status === 'soon';

  return (
    <View style={[styles.journeyCard, { backgroundColor: meta.soft, borderColor: meta.border }]}>
      <View style={[styles.cardIconWrap, { backgroundColor: item.status === 'locked' ? '#EFEDEA' : '#FFFDF8' }]}>
        <Icon size={42} color={meta.color} strokeWidth={1.8} />
      </View>

      <View style={styles.cardCopy}>
        <Text style={styles.journeyTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.78}>
          {item.title}
        </Text>
        {item.progress > 0 ? <Text style={[styles.cardPercent, { color: meta.color }]}>{item.progress}%</Text> : null}
        <ProgressTrack value={item.progress} color={meta.color} muted={isLocked} />
        <Text style={[styles.statusLabel, { color: meta.color }]}>{meta.label}</Text>
      </View>

      <View style={[styles.statusPill, { backgroundColor: meta.color }]}>
        <StatusIcon size={14} color="#FFFFFF" strokeWidth={2.6} />
      </View>
    </View>
  );
}

export default function ProfileScreen() {
  const { user, profile } = useAuth();
  const name = profile?.nome || user?.user_metadata?.nome || currentUser.nome;
  const parish = profile?.paroquias?.nome || currentUser.paroquia || 'Igreja Santa Cruz';
  const initials = getInitials(name);

  function handleEditProfile() {
    Alert.alert('Editar perfil', 'A edição do perfil será adicionada em breve.');
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#0C422B', '#115538', '#07341F']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHero}
        >
          <ChurchBackdrop />
          <View style={styles.avatar}>
            <View style={styles.avatarRing}>
              <Text style={styles.initials}>{initials}</Text>
            </View>
          </View>

          <View style={styles.heroCopy}>
            <Text style={styles.name} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.72}>
              {name}
            </Text>
            <Text style={styles.parish} numberOfLines={1}>
              {parish}
            </Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>ID 0345</Text>
            </View>
            <Pressable accessibilityRole="button" onPress={handleEditProfile} style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}>
              <Edit3 size={17} color="#F8E6B4" strokeWidth={2.1} />
              <Text style={styles.editText}>Editar perfil</Text>
            </Pressable>
          </View>
        </LinearGradient>

        <View style={styles.constancyCard}>
          <View style={styles.constancyIcon}>
            <CalendarDays size={37} color={theme.colors.primaryDark} strokeWidth={1.8} />
            <Flame size={20} color="#D8A31C" strokeWidth={2} style={styles.flameBadge} />
          </View>
          <View style={styles.constancyCopy}>
            <Text style={styles.constancyTitle}>Constância</Text>
            <Text style={styles.constancyText}>Cada encontro conta na sua caminhada.</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.presence}>
            <Text style={styles.presenceNumber}>5</Text>
            <Text style={styles.presenceText}>dias de{'\n'}presença</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sua jornada</Text>
          <View style={styles.legend}>
            <StatusDot status="unlocked" />
            <StatusDot status="progress" />
            <StatusDot status="locked" />
            <StatusDot status="soon" />
          </View>
        </View>

        <View style={styles.journeyGrid}>
          {journeyItems.map((item) => (
            <JourneyCard key={item.title} item={item} />
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View style={styles.summaryIcon}>
              <Svg width="58" height="58" viewBox="0 0 58 58">
                <Circle cx="29" cy="29" r="28" fill="#EAF3EC" />
                <Path d="M10 41C18 30 24 31 30 38C36 28 45 24 54 29V48H10V41Z" fill="#2F7B4B" opacity="0.95" />
                <Path d="M28 12V27" stroke="#2F7B4B" strokeWidth="3" strokeLinecap="round" />
                <Path d="M22 18H34" stroke="#2F7B4B" strokeWidth="3" strokeLinecap="round" />
                <Path d="M28 48C31 37 34 31 43 23" stroke="#FFF8E8" strokeWidth="4" strokeLinecap="round" />
              </Svg>
            </View>
            <View style={styles.summaryCopy}>
              <Text style={styles.summaryTitle}>Jornada catequética</Text>
              <Text style={styles.summarySubtitle}>4 de 8 trilhas iniciadas</Text>
            </View>
            <View style={styles.summaryTrophy}>
              <Trophy size={36} color="#D8A31C" strokeWidth={1.8} />
            </View>
          </View>
          <View style={styles.summaryProgressRow}>
            <Text style={styles.summaryPercent}>63%</Text>
            <View style={styles.summaryTrackWrap}>
              <ProgressTrack value={63} color={theme.colors.primaryDark} />
            </View>
          </View>
          <View style={styles.nextDivider} />
          <View style={styles.nextRow}>
            <View style={styles.nextIcon}>
              <Sprout size={18} color="#D8A31C" strokeWidth={2.4} />
            </View>
            <Text style={styles.nextText}>
              <Text style={styles.nextStrong}>Próxima conquista:</Text> complete mais 2 aulas para desbloquear{' '}
              <Text style={styles.nextStrong}>Mandamentos.</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.glow,
  },
  screen: {
    flex: 1,
    backgroundColor: theme.colors.glow,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 104,
  },
  pressed: {
    opacity: 0.78,
  },
  profileHero: {
    borderRadius: 24,
    flexDirection: 'row',
    minHeight: 166,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 20,
    position: 'relative',
    shadowColor: '#163B28',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 22,
    elevation: 6,
  },
  churchBackdrop: {
    bottom: -4,
    position: 'absolute',
    right: -4,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
    width: 105,
    zIndex: 2,
  },
  avatarRing: {
    alignItems: 'center',
    backgroundColor: '#0D432B',
    borderColor: '#D7B258',
    borderRadius: 52,
    borderWidth: 2,
    height: 104,
    justifyContent: 'center',
    shadowColor: '#071E14',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    width: 104,
  },
  initials: {
    color: '#F5D889',
    fontFamily: serifFont,
    fontSize: 43,
    fontWeight: '900',
    lineHeight: 50,
  },
  heroCopy: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    zIndex: 2,
  },
  name: {
    color: '#FFFDF8',
    fontFamily: serifFont,
    fontSize: 28,
    fontWeight: '900',
    lineHeight: 34,
  },
  parish: {
    color: '#F7D06A',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    marginTop: 4,
  },
  idBadge: {
    alignSelf: 'flex-start',
    borderColor: 'rgba(255, 255, 255, 0.22)',
    borderRadius: 9,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  idText: {
    color: '#F4F1E8',
    fontSize: 15,
    fontWeight: '700',
  },
  editButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
    paddingVertical: 3,
  },
  editText: {
    color: '#FFF7DB',
    fontSize: 16,
    fontWeight: '700',
  },
  constancyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderColor: 'rgba(229, 216, 200, 0.82)',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
    minHeight: 98,
    paddingHorizontal: 14,
    paddingVertical: 14,
    shadowColor: '#6F5844',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 3,
  },
  constancyIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.softGreen,
    borderRadius: 30,
    height: 60,
    justifyContent: 'center',
    position: 'relative',
    width: 60,
  },
  flameBadge: {
    position: 'absolute',
    right: 8,
    top: 28,
  },
  constancyCopy: {
    flex: 1,
    minWidth: 0,
  },
  constancyTitle: {
    color: theme.colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  constancyText: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 4,
  },
  divider: {
    backgroundColor: theme.colors.border,
    height: 62,
    width: 1,
  },
  presence: {
    alignItems: 'center',
    minWidth: 62,
  },
  presenceNumber: {
    color: theme.colors.primaryDark,
    fontFamily: serifFont,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 43,
  },
  presenceText: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'center',
  },
  sectionHeader: {
    marginTop: 26,
  },
  sectionTitle: {
    color: theme.colors.text,
    fontFamily: serifFont,
    fontSize: 29,
    fontWeight: '900',
    lineHeight: 35,
    marginBottom: 11,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
    paddingLeft: 2,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendDot: {
    borderRadius: 6,
    height: 10,
    width: 10,
  },
  legendText: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  journeyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  journeyCard: {
    borderRadius: 17,
    borderWidth: 1,
    flexBasis: '48%',
    flexDirection: 'row',
    minHeight: 104,
    overflow: 'hidden',
    padding: 11,
    position: 'relative',
    shadowColor: '#5E4D3E',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.06,
    shadowRadius: 13,
    elevation: 2,
  },
  cardIconWrap: {
    alignItems: 'center',
    borderRadius: 32,
    height: 64,
    justifyContent: 'center',
    marginRight: 11,
    width: 64,
  },
  cardCopy: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    paddingRight: 4,
  },
  journeyTitle: {
    color: theme.colors.text,
    fontFamily: serifFont,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 21,
  },
  cardPercent: {
    fontFamily: serifFont,
    fontSize: 24,
    fontWeight: '900',
    lineHeight: 29,
    marginTop: 2,
  },
  progressTrack: {
    backgroundColor: 'rgba(111, 124, 114, 0.18)',
    borderRadius: 10,
    height: 8,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: {
    borderRadius: 10,
    height: '100%',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 7,
  },
  statusPill: {
    alignItems: 'center',
    borderRadius: 15,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    width: 28,
  },
  summaryCard: {
    backgroundColor: '#FAFFF8',
    borderColor: '#D8E8D8',
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 20,
    padding: 18,
    shadowColor: '#5E4D3E',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  summaryTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  summaryIcon: {
    height: 58,
    width: 58,
  },
  summaryCopy: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    color: theme.colors.text,
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  summarySubtitle: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 20,
    marginTop: 2,
  },
  summaryTrophy: {
    opacity: 0.82,
    transform: [{ scale: 0.82 }],
  },
  summaryProgressRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  summaryPercent: {
    color: theme.colors.primaryDark,
    fontFamily: serifFont,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 44,
  },
  summaryTrackWrap: {
    flex: 1,
  },
  nextDivider: {
    backgroundColor: theme.colors.border,
    height: 1,
    marginTop: 13,
  },
  nextRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginTop: 13,
  },
  nextIcon: {
    alignItems: 'center',
    backgroundColor: '#FFF4D9',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  nextText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  nextStrong: {
    color: theme.colors.primaryDark,
    fontWeight: '900',
  },
});
