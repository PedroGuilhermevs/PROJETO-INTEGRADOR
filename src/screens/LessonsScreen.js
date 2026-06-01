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

// Proporção original da imagem trail-bg.png (largura x altura)
// A imagem tem proporção aproximada de 1:2.5 (retrato alongado)
const BG_IMAGE_RATIO = 2.5;
const BG_TILE_HEIGHT = SCREEN_WIDTH * BG_IMAGE_RATIO;

const ROW_HEIGHT = 260;
const HEADER_HEIGHT = 230;
const REWARD_HEIGHT = 130;
const TOTAL_CONTENT_HEIGHT = HEADER_HEIGHT + lessons.length * ROW_HEIGHT + REWARD_HEIGHT;

// Quantos tiles de background são necessários para cobrir todo o conteúdo
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
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          {Array.from({ length: TILE_COUNT }).map((_, i) => (
            <Image
              key={i}
              source={require('../assets/trail-bg.png')}
              style={{
                width: SCREEN_WIDTH,
                height: BG_TILE_HEIGHT,
                top: i * BG_TILE_HEIGHT,
                position: 'absolute',
              }}
              resizeMode="cover"
            />
          ))}
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
