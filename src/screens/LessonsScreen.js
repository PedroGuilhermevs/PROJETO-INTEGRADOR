import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

import ScreenHeader from '../components/ScreenHeader';
import TrailLessonCard from '../components/TrailLessonCard';
import TopProgressCard from '../components/TopProgressCard';

import { lessons } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROW_HEIGHT = 260;
const HEADER_HEIGHT = 230;
const REWARD_HEIGHT = 130;
const TOTAL_CONTENT_HEIGHT = HEADER_HEIGHT + lessons.length * ROW_HEIGHT + REWARD_HEIGHT;
const BG_IMAGE_RATIO = 2.5;
const BG_TILE_HEIGHT = SCREEN_WIDTH * BG_IMAGE_RATIO;
const TILE_COUNT = Math.ceil(TOTAL_CONTENT_HEIGHT / BG_TILE_HEIGHT) + 1;

export default function LessonsScreen({ navigation }) {
  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Container com altura total do conteúdo */}
      <View style={{ width: SCREEN_WIDTH, minHeight: TOTAL_CONTENT_HEIGHT }}>

        {/* Background em tiles repetidos verticalmente */}
        <View style={styles.background} pointerEvents="none">
          {Array.from({ length: TILE_COUNT }).map((_, index) => (
            <Image
              key={`trail-bg-${index}`}
              source={require('../assets/trail-bg.png')}
              style={[styles.backgroundTile, { top: index * BG_TILE_HEIGHT }]}
              resizeMode="cover"
            />
          ))}
          <View style={styles.sunGlow} />
          <View style={styles.pathRibbon} />
          <View style={[styles.hill, styles.hillBack]} />
          <View style={[styles.hill, styles.hillFront]} />
        </View>

        {/* Conteúdo da tela por cima do background */}
        <View style={styles.content}>
          <ScreenHeader
            title="Trilha da catequese"
            subtitle="Avance na sua jornada de fé"
          />

          <TopProgressCard />

          <View style={styles.trailContainer}>
            {lessons.map((lesson, index) => (
              <TrailLessonCard
                key={lesson.id}
                lesson={lesson}
                index={index}
                onPress={() =>
                  navigation.navigate('LessonDetail', { lessonId: lesson.id })
                }
              />
            ))}
          </View>

          <View style={styles.rewardBox}>
            <Text style={styles.rewardText}>
              🎁 Complete todas as etapas e ganhe um prêmio especial!
            </Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#C5D9A8',
  },

  content: {
    flex: 1,
    paddingBottom: 40,
  },

  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#C5D9A8',
    overflow: 'hidden',
  },

  backgroundTile: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: BG_TILE_HEIGHT,
    opacity: 0.75,
  },

  sunGlow: {
    position: 'absolute',
    top: 36,
    right: -44,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#F4DF8A',
    opacity: 0.28,
  },

  pathRibbon: {
    position: 'absolute',
    left: SCREEN_WIDTH * 0.52 - 18,
    top: HEADER_HEIGHT - 18,
    width: 36,
    height: TOTAL_CONTENT_HEIGHT - HEADER_HEIGHT + 40,
    borderRadius: 30,
    backgroundColor: '#E7D5B8',
    opacity: 0.88,
  },

  hill: {
    position: 'absolute',
    width: SCREEN_WIDTH * 1.4,
    height: 260,
    borderRadius: 130,
  },

  hillBack: {
    left: -SCREEN_WIDTH * 0.35,
    top: HEADER_HEIGHT + 130,
    backgroundColor: '#B5CF90',
    opacity: 0.55,
  },

  hillFront: {
    right: -SCREEN_WIDTH * 0.45,
    top: HEADER_HEIGHT + 480,
    backgroundColor: '#9FC47A',
    opacity: 0.36,
  },

  trailContainer: {
    width: '100%',
    marginTop: 8,
  },

  rewardBox: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 40,
    backgroundColor: '#FFFFFFEE',
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  rewardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3A3A3A',
    textAlign: 'center',
  },
});
