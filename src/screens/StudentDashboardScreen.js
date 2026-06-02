import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, CalendarDays, ChevronRight, Cross, Leaf, Play } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { lessons } from '../data/mockData';
import { formatPercent } from '../utils/formatters';
import { theme } from '../styles/theme';

const serifFont = Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' });
const jesusImageSource = require('../assets/jesus.png');

function JesusWatercolorIllustration() {
  return (
    <Svg width="150" height="184" viewBox="0 0 142 174" fill="none">
      <Circle cx="78" cy="54" r="42" fill="#F9E8B8" opacity="0.58" />
      <Circle cx="78" cy="54" r="48" stroke="#E9C978" strokeWidth="1.2" opacity="0.42" />
      <Ellipse cx="73" cy="62" rx="29" ry="37" fill="#9B643E" opacity="0.9" />
      <Path d="M43 65C44 35 61 23 82 26C107 30 118 54 109 83C102 105 86 112 66 104C48 97 41 82 43 65Z" fill="#7A4A33" opacity="0.88" />
      <Circle cx="77" cy="64" r="25" fill="#D8A36B" />
      <Path d="M54 60C62 36 88 35 102 54C92 51 83 45 75 38C70 50 61 58 54 60Z" fill="#6D3F2D" />
      <Path d="M58 87C66 99 85 102 96 88C92 119 62 119 58 87Z" fill="#B77B51" opacity="0.36" />
      <Path d="M31 167C36 119 52 99 79 98C107 98 124 119 131 167H31Z" fill="#F7F0E7" />
      <Path d="M72 102C54 113 43 134 38 167H79C82 139 83 120 72 102Z" fill="#FFFDF8" />
      <Path d="M77 100C101 108 116 131 127 167H76C71 141 69 119 77 100Z" fill="#5E8C6A" opacity="0.82" />
      <Path d="M78 104C71 120 71 141 78 167" stroke="#E8DAC8" strokeWidth="3" strokeLinecap="round" />
      <Path d="M99 112C113 127 121 145 127 167" stroke="#3F6F50" strokeWidth="3" strokeLinecap="round" opacity="0.42" />
      <Path d="M54 116C45 130 39 148 36 167" stroke="#E2D1BE" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      <Ellipse cx="78" cy="168" rx="58" ry="8" fill="#D7CDBD" opacity="0.2" />
    </Svg>
  );
}

export default function StudentDashboardScreen({ navigation }) {
  const { profile, user } = useAuth();
  const fullName = profile?.nome || user?.user_metadata?.nome || user?.email || 'Aluno';
  const firstName = fullName.trim().split(' ')[0] || 'Aluno';
  const average = lessons.reduce((sum, item) => sum + item.percentual, 0) / lessons.length;
  const nextLesson = lessons.find((lesson) => !lesson.concluida) || lessons[0];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView style={styles.screen} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <View style={styles.brand}>
            <Leaf size={32} color={theme.colors.primaryDark} strokeWidth={1.8} />
            <Text style={styles.brandTitle}>Minha jornada</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.greeting}>Olá, {firstName}</Text>
          </View>
        </View>

        <LinearGradient
          colors={['#456F4F', '#1F5435', '#173E28']}
          locations={[0, 0.54, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressGlow} />
          <View style={styles.progressTextWrap}>
            <Text style={styles.progressTitle} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.82}>
              Seu caminho de fé
            </Text>
            <Text style={styles.progressDescription}>Siga firme! Você está crescendo na fé.</Text>
          </View>
          <View style={styles.progressBadge}>
            <View style={styles.badgeRing}>
              <BookOpen size={35} color="#F7F0E7" strokeWidth={1.6} />
              <Cross size={22} color="#F7F0E7" strokeWidth={1.8} style={styles.badgeCross} />
            </View>
          </View>
          <View style={styles.progressFooter}>
            <View style={styles.percentRow}>
              <Text style={styles.percent}>{formatPercent(average)}</Text>
              <Text style={styles.percentLabel}>concluído</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(average, 100)}%` }]} />
            </View>
          </View>
        </LinearGradient>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('LessonDetail', { lessonId: nextLesson.id })}
          style={({ pressed }) => [pressed && styles.pressed]}
        >
          <LinearGradient
            colors={['#FFF7E2', '#FFFDF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.lessonCard}
          >
            <View style={styles.lessonCopy}>
              <Text style={styles.eyebrow}>CONTINUAR AULA</Text>
              <Text style={styles.lessonTitle}>Jesus, nosso mestre</Text>
              <Text style={styles.lessonDescription}>Uma aula sobre a vida de Jesus e seus ensinamentos centrais.</Text>
              <View style={styles.lessonButton}>
                <View style={styles.playCircle}>
                  <Play size={17} color={theme.colors.primaryDark} fill={theme.colors.primaryDark} />
                </View>
                <Text style={styles.lessonButtonText}>Continuar aula</Text>
              </View>
            </View>
            <View style={styles.lessonIllustration} pointerEvents="none">
              {jesusImageSource ? (
                <Image source={jesusImageSource} resizeMode="contain" style={styles.jesusPng} />
              ) : (
                <View style={styles.jesusImageFrame}>
                  <JesusWatercolorIllustration />
                </View>
              )}
            </View>
          </LinearGradient>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          onPress={() => navigation.navigate('Announcements')}
          style={({ pressed }) => [styles.meetingCard, pressed && styles.pressed]}
        >
          <View style={styles.calendarIcon}>
            <CalendarDays size={27} color={theme.colors.primaryDark} strokeWidth={2} />
          </View>
          <View style={styles.meetingText}>
            <Text style={styles.meetingTitle}>Próximo encontro presencial</Text>
            <Text style={styles.meetingDescription}>Sábado, 15h, no salão paroquial</Text>
          </View>
          <ChevronRight size={25} color={theme.colors.text} strokeWidth={2.1} />
        </Pressable>
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
    paddingHorizontal: 18,
    paddingTop: 2,
    paddingBottom: 104,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  brand: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    minWidth: 0,
  },
  brandTitle: {
    color: theme.colors.text,
    flexShrink: 1,
    fontFamily: serifFont,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 32,
  },
  pressed: {
    opacity: 0.86,
  },
  hero: {
    minHeight: 50,
    marginBottom: 2,
    overflow: 'hidden',
  },
  heroCopy: {
    paddingTop: 2,
    width: '68%',
  },
  greeting: {
    color: theme.colors.text,
    fontFamily: serifFont,
    fontSize: 31,
    fontWeight: '900',
    lineHeight: 36,
  },
  progressCard: {
    borderRadius: 23,
    marginBottom: 14,
    minHeight: 194,
    overflow: 'hidden',
    padding: 21,
    position: 'relative',
    shadowColor: '#23442C',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 6,
  },
  progressGlow: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 120,
    height: 184,
    position: 'absolute',
    right: -70,
    top: -50,
    width: 184,
  },
  progressTextWrap: {
    maxWidth: '100%',
    paddingRight: 84,
    zIndex: 2,
  },
  progressTitle: {
    color: '#FFFFFF',
    fontFamily: serifFont,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 30,
  },
  progressDescription: {
    color: '#EEF5EB',
    fontSize: 16,
    lineHeight: 22,
    marginTop: 11,
    maxWidth: 206,
  },
  progressBadge: {
    alignItems: 'center',
    borderColor: 'rgba(255, 255, 255, 0.17)',
    borderRadius: 68,
    borderWidth: 1,
    height: 92,
    justifyContent: 'center',
    position: 'absolute',
    right: 18,
    top: 48,
    width: 92,
  },
  badgeRing: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.09)',
    borderColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 50,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    width: 70,
  },
  badgeCross: {
    position: 'absolute',
    top: 16,
  },
  progressFooter: {
    bottom: 18,
    left: 21,
    position: 'absolute',
    right: 21,
  },
  percentRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  percent: {
    color: '#FFFFFF',
    fontFamily: serifFont,
    fontSize: 35,
    fontWeight: '900',
    lineHeight: 42,
  },
  percentLabel: {
    color: '#EEF5EB',
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 255, 255, 0.24)',
    borderRadius: 20,
    height: 12,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: '#D6E487',
    borderRadius: 20,
    height: '100%',
  },
  lessonCard: {
    borderColor: '#F0DFC0',
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 14,
    minHeight: 190,
    overflow: 'hidden',
    paddingLeft: 19,
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 12,
    position: 'relative',
    shadowColor: '#6F5844',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.11,
    shadowRadius: 22,
    elevation: 4,
  },
  lessonCopy: {
    justifyContent: 'flex-start',
    minWidth: 0,
    width: '64%',
    zIndex: 2,
  },
  eyebrow: {
    color: theme.colors.accent,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    marginBottom: 10,
  },
  lessonTitle: {
    color: theme.colors.text,
    fontFamily: serifFont,
    fontSize: 23,
    fontWeight: '900',
    lineHeight: 28,
  },
  lessonDescription: {
    color: theme.colors.text,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 9,
  },
  lessonButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary,
    borderRadius: 30,
    flexDirection: 'row',
    gap: 11,
    marginTop: 16,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  playCircle: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    height: 33,
    justifyContent: 'center',
    width: 33,
  },
  lessonButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  lessonIllustration: {
    alignItems: 'flex-end',
    bottom: -14,
    justifyContent: 'flex-end',
    overflow: 'visible',
    position: 'absolute',
    right: -10,
    width: 204,
  },
  jesusImageFrame: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    height: 188,
    width: 148,
  },
  jesusPng: {
    height: 259,
    width: 204,
  },
  meetingCard: {
    alignItems: 'center',
    backgroundColor: '#FFFDF8',
    borderColor: 'rgba(229, 216, 200, 0.85)',
    borderRadius: 22,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginBottom: 0,
    minHeight: 82,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#5E4D3E',
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 3,
  },
  calendarIcon: {
    alignItems: 'center',
    backgroundColor: theme.colors.softGreen,
    borderRadius: 15,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  meetingText: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
  },
  meetingTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 22,
  },
  meetingDescription: {
    color: theme.colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
