import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyRound, LogOut } from 'lucide-react-native';
import AppButton from '../components/AppButton';
import InfoCard from '../components/InfoCard';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { commonStyles } from '../styles/commonStyles';
import { theme } from '../styles/theme';
import { getFriendlyAuthError } from '../utils/authErrors';

export default function ParishCodeScreen() {
  const { signOut, user, profile, refreshProfile } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCodeSubmit() {
    setError('');
    const cleanCode = code.trim().toUpperCase();

    if (!cleanCode) {
      setError('Informe o codigo da paroquia.');
      return;
    }

    if (!user?.id) {
      setError('Sessao nao encontrada. Faca login novamente.');
      return;
    }

    setLoading(true);

    const { data: parish, error: parishError } = await supabase
      .from('paroquias')
      .select('id, nome, cidade, codigo_acesso, status')
      .eq('codigo_acesso', cleanCode)
      .eq('status', 'ativa')
      .maybeSingle();

    if (parishError) {
      setError(getFriendlyAuthError(parishError));
      setLoading(false);
      return;
    }

    if (!parish) {
      setError('Codigo de paroquia invalido ou inativo.');
      setLoading(false);
      return;
    }

    const payload = {
      nome: profile?.nome || user.user_metadata?.nome || user.email,
      email: profile?.email || user.email,
      tipo_usuario: profile?.tipo_usuario || 'aluno',
      paroquia_id: parish.id,
    };

    const { data: updatedUser, error: updateError } = await supabase
      .from('usuarios')
      .update(payload)
      .eq('id', user.id)
      .select('*, paroquias(nome, cidade, codigo_acesso, status)')
      .maybeSingle();

    if (updateError) {
      setError(getFriendlyAuthError(updateError));
      setLoading(false);
      return;
    }

    if (!updatedUser) {
      const { error: upsertError } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          ...payload,
        });

      if (upsertError) {
        setError(getFriendlyAuthError(upsertError));
        setLoading(false);
        return;
      }
    }

    await refreshProfile(user.id);
    setLoading(false);
  }

  async function handleLogout() {
    await signOut();
  }

  return (
    <ScrollView style={commonStyles.screen} contentContainerStyle={commonStyles.container}>
      <ScreenHeader title="Codigo da paroquia" subtitle="Use o codigo entregue pelo catequista para vincular sua conta." />
      <TextInput
        style={styles.input}
        placeholder="Exemplo: FE2026"
        autoCapitalize="characters"
        value={code}
        onChangeText={setCode}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.actions}>
        <AppButton title="Vincular paroquia" icon={KeyRound} loading={loading} onPress={handleCodeSubmit} />
        <AppButton title="Sair da conta" icon={LogOut} variant="secondary" onPress={handleLogout} />
      </View>
      <InfoCard title="Como funciona" description="O app busca o codigo na tabela paroquias e salva o paroquia_id no seu usuario." tone="gold">
        <Text style={styles.note}>Depois disso, alunos entram direto no painel.</Text>
      </InfoCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  actions: {
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  note: {
    color: theme.colors.muted,
    fontSize: 13,
    marginTop: theme.spacing.sm,
  },
});
