import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import AppButton from '../components/AppButton';
import InfoCard from '../components/InfoCard';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../services/supabase';
import { commonStyles } from '../styles/commonStyles';
import { theme } from '../styles/theme';
import { getFriendlyAuthError } from '../utils/authErrors';

export default function RegisterScreen({ navigation }) {
  const { ensureUserProfile, refreshProfile } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    setError('');
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setError('Preencha nome, e-mail e senha.');
      return;
    }

    if (password.length < 6) {
      setError('A senha precisa ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas nao conferem.');
      return;
    }

    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          nome: cleanName,
          tipo_usuario: 'aluno',
        },
      },
    });

    if (signUpError) {
      setError(getFriendlyAuthError(signUpError));
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) {
      setLoading(false);
      Alert.alert(
        'Conta ja existente',
        'Esse e-mail ja possui cadastro ou esta aguardando confirmacao. Verifique sua caixa de entrada ou tente fazer login.'
      );
      navigation.navigate('Login');
      return;
    }

    if (!data.session) {
      setLoading(false);
      Alert.alert(
        'Confirme seu e-mail',
        'Enviamos um link de confirmacao para seu e-mail. Depois de confirmar, volte ao app e faca login para informar o codigo da paroquia.'
      );
      navigation.navigate('Login');
      return;
    }

    const createdProfile = await ensureUserProfile(data.user);

    if (!createdProfile) {
      setError('Cadastro criado no Auth, mas o perfil foi bloqueado. Rode o SQL em docs/supabase-auth-setup.md.');
      setLoading(false);
      return;
    }

    await refreshProfile(data.user);
    setLoading(false);
  }

  return (
    <ScrollView style={commonStyles.screen} contentContainerStyle={commonStyles.container}>
      <ScreenHeader title="Crie sua conta" subtitle="Depois do cadastro, informe o codigo da sua paroquia ou comunidade." />
      <TextInput style={styles.input} placeholder="Nome completo" value={name} onChangeText={setName} />
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput
        style={styles.input}
        placeholder="Confirmar senha"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.action}>
        <AppButton title="Criar conta" icon={UserPlus} loading={loading} onPress={handleRegister} />
      </View>
      <InfoCard title="Tipo de usuario" description="Este aplicativo mobile e voltado ao catequizando. Novos cadastros entram como aluno." tone="gold" />
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
    fontSize: 16,
  },
  error: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  action: {
    marginVertical: theme.spacing.md,
  },
});
