import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import { Check, Lock, BookOpen } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const NODE_SIZE = 62;
const CARD_WIDTH = SCREEN_WIDTH * 0.43;
const NODE_LEFT = SCREEN_WIDTH * 0.52 - NODE_SIZE / 2;
const GAP = 10;
const ROW_HEIGHT = 190;

export default function TrailLessonCard({ lesson, index, onPress }) {
  const cardOnLeft = index % 2 === 0;

  const isLocked = lesson.status === 'locked';
  const isCompleted = lesson.status === 'completed';

  function getCircleColor() {
    if (isCompleted) return '#4F9B58';
    if (isLocked) return '#C8BFB0';
    return '#6DAA75';
  }

  function renderIcon() {
    if (isCompleted) return <Check color="#fff" size={24} strokeWidth={3} />;
    if (isLocked) return <Lock color="#fff" size={20} />;
    return <BookOpen color="#fff" size={22} />;
  }

  const cardLeft = cardOnLeft
    ? NODE_LEFT - GAP - CARD_WIDTH
    : NODE_LEFT + NODE_SIZE + GAP;

  return (
    <View style={{ height: ROW_HEIGHT, width: SCREEN_WIDTH }}>

      {/* ── Círculo — BOTÃO de acesso à aula ── */}
      <TouchableOpacity
        activeOpacity={0.8}
        disabled={isLocked}
        onPress={onPress}
        style={[
          styles.nodeOuter,
          { left: NODE_LEFT, top: ROW_HEIGHT / 2 - NODE_SIZE / 2 - 8 },
        ]}
      >
        {!isLocked && <Text style={styles.starAbove}>⭐</Text>}
        <View style={[styles.node, { backgroundColor: getCircleColor() }]}>
          {renderIcon()}
        </View>
      </TouchableOpacity>

      {/* ── Card — apenas visual, sem onPress ── */}
      <View
        style={[
          styles.card,
          {
            left: cardLeft,
            top: ROW_HEIGHT / 2 - 80,
            width: CARD_WIDTH,
            opacity: isLocked ? 0.75 : 1,
          },
        ]}
      >
        <Text style={styles.title}>
          {lesson.ordem}. {lesson.titulo}
        </Text>

        <Text style={styles.description} numberOfLines={4}>
          {lesson.descricao}
        </Text>

        <View style={styles.footer}>
          {isCompleted && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedText}>Concluído</Text>
            </View>
          )}
          {isLocked && (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedText}>Bloqueado</Text>
            </View>
          )}
          {lesson.status === 'current' && (
            <View style={styles.progressContainer}>
              <View style={[styles.progressFill, { width: `${lesson.percentual || 50}%` }]} />
            </View>
          )}
          <Text style={styles.xp}>⭐ {lesson.xp} XP</Text>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  nodeOuter: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },

  starAbove: {
    fontSize: 14,
    marginBottom: 2,
  },

  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#F5F0E8',
    elevation: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  card: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    zIndex: 5,
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2F2F2F',
    marginBottom: 6,
    lineHeight: 21,
  },

  description: {
    color: '#666',
    lineHeight: 18,
    fontSize: 13,
  },

  footer: {
    marginTop: 12,
  },

  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E9E2D6',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#5B9C67',
    borderRadius: 20,
  },

  xp: {
    marginTop: 6,
    fontWeight: '700',
    fontSize: 13,
    color: '#B38700',
  },

  completedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F3E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },

  completedText: {
    color: '#4F9B58',
    fontWeight: '700',
    fontSize: 13,
  },

  lockedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECE7DD',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 6,
  },

  lockedText: {
    color: '#7A7062',
    fontWeight: '700',
    fontSize: 13,
  },
});