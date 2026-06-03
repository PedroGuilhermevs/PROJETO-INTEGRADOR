import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ScreenHeader from '../components/ScreenHeader';
import TrailLessonCard from '../components/TrailLessonCard';
import TopProgressCard from '../components/TopProgressCard';

import { lessons } from '../data/mockData';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ROW_HEIGHT = 190;
const HEADER_HEIGHT = 230;
const REWARD_HEIGHT = 250;
const BG_IMAGE_RATIO = 2.5;
const BG_TILE_HEIGHT = SCREEN_WIDTH * BG_IMAGE_RATIO;

export default function LessonsScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(insets.top + 12, 44);
  const totalContentHeight =
    topPadding + HEADER_HEIGHT + lessons.length * ROW_HEIGHT + REWARD_HEIGHT;
  const tileCount = Math.ceil(totalContentHeight / BG_TILE_HEIGHT);

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Container com altura total do conteúdo */}
      <View style={{ width: SCREEN_WIDTH, height: totalContentHeight }}>

        {/* Background em tiles repetidos verticalmente */}
        <View style={styles.background} pointerEvents="none">
          {Array.from({ length: tileCount }).map((_, index) => (
            <Image
              key={`trail-bg-${index}`}
              source={require('../assets/trail-bg.png')}
              style={[styles.backgroundTile, { top: index * BG_TILE_HEIGHT }]}
              resizeMode="cover"
            />
          ))}
          <View style={styles.sunGlow} />
        </View>

        {/* Conteúdo da tela por cima do background */}
        <View style={[styles.content, { paddingTop: topPadding }]}>
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

  trailContainer: {
    width: '100%',
    marginTop: 8,
  },

  rewardBox: {
    marginHorizontal: 20,
    marginTop: 96,
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
