import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toast } from "toastify-react-native";
import { useState } from "react";
import { FlatList, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

type Plan = "free" | "premium";
type AuthMode = "login" | "restore";
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

const perks: { icon: IconName; title: string; desc: string }[] = [
  {
    icon: "cloud-outline",
    title: "Backup na nuvem",
    desc: "Seus dados seguros e em todos os aparelhos",
  },
  {
    icon: "infinity",
    title: "Cadastros ilimitados",
    desc: "Jogadores, times e partidas sem limite",
  },
  {
    icon: "file-chart-outline",
    title: "Relatórios avançados",
    desc: "Estatísticas e exportação em PDF",
  },
  {
    icon: "headset",
    title: "Suporte prioritário",
    desc: "Atendimento direto com nossa equipe",
  },
];

function Icon({
  name,
  className = "text-[#8b95b0]",
  size = 18,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  const color = className.includes("text-[#00e676]")
    ? "#00e676"
    : className.includes("text-[#f87171]")
      ? "#f87171"
      : className.includes("text-white")
        ? "#ffffff"
        : "#8b95b0";
  return <MaterialCommunityIcons name={name} size={size} color={color} />;
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`overflow-hidden rounded-xl border border-[#252f4a] bg-[#1c2438] ${className}`}
    >
      {children}
    </View>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Text className="mb-2 px-1 text-[11px] uppercase tracking-[1.5px] text-[#4b5780]">
      {children}
    </Text>
  );
}

function AuthDialog({
  open,
  mode,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  mode: AuthMode;
  onOpenChange: (value: boolean) => void;
  onSuccess: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const isRestore = mode === "restore";
  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 4;

  const submit = () => {
    if (!valid || loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(email);
      setPassword("");
    }, 1100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl border-[#2a3554] bg-[#1c2438]">
        <DialogHeader className="mb-2">
          <View className="flex-row items-center gap-3">
            <View className="rounded-lg border border-[#1a4d30] bg-[#1a3b2a] p-2.5">
              <Icon
                name={isRestore ? "restore" : "login"}
                className="text-[#00e676]"
              />
            </View>
            <View className="flex-1">
              <DialogTitle className="text-white">
                {isRestore ? "Restaurar compras" : "Entrar na sua conta"}
              </DialogTitle>
              <DialogDescription className="text-[#8b95b0]">
                {isRestore
                  ? "Entre com a conta usada na compra original."
                  : "Acesse seus dados e sua assinatura."}
              </DialogDescription>
            </View>
          </View>
        </DialogHeader>
        <View className="gap-3">
          <View className="gap-1.5">
            <Text className="text-xs text-[#8b95b0]">E-mail</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="voce@clube.com"
              placeholderTextColor="#4b5780"
              keyboardType="email-address"
              autoCapitalize="none"
              className="rounded-lg border border-[#252f4a] bg-[#161e30] px-3 py-2.5 text-[#e5e7eb]"
            />
          </View>
          <View className="gap-1.5">
            <Text className="text-xs text-[#8b95b0]">Senha</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#4b5780"
              secureTextEntry
              className="rounded-lg border border-[#252f4a] bg-[#161e30] px-3 py-2.5 text-[#e5e7eb]"
            />
          </View>
          <Button
            disabled={!valid || loading}
            onPress={submit}
            className="mt-2 rounded-lg bg-[#00e676] py-2.5"
          >
            <Text className="font-medium text-[#07130d]">
              {loading ? "Verificando..." : isRestore ? "Restaurar" : "Entrar"}
            </Text>
          </Button>
          <Text className="text-center text-[11px] text-[#4b5780]">
            Demonstração: qualquer e-mail válido e senha com 4+ caracteres.
          </Text>
        </View>
      </DialogContent>
    </Dialog>
  );
}

function LogoutDialog({ onConfirm }: { onConfirm: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="flex-1 rounded-lg border border-[#4a1a1a] bg-[#2e1a1a] py-2.5">
          <Icon name="logout" className="text-[#f87171]" size={16} />
          <Text className="text-sm text-[#f87171]">Sair</Text>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="rounded-2xl border-[#2a3554] bg-[#1c2438]">
        <AlertDialogTitle className="mb-1 text-white">
          Sair da conta?
        </AlertDialogTitle>
        <AlertDialogDescription className="mb-3 text-[#8b95b0]">
          Seus dados continuam salvos na nuvem. Você poderá entrar novamente a
          qualquer momento.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button className="rounded-lg border border-[#252f4a] bg-[#161e30]">
              <Text className="text-[#8b95b0]">Cancelar</Text>
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onPress={onConfirm} className="rounded-lg bg-[#f87171]">
              <Text className="text-[#1a0808]">Sair</Text>
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function Settings() {
  const [plan, setPlan] = useState<Plan>("free");
  const [email, setEmail] = useState("");
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [cloudSync, setCloudSync] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const isPremium = plan === "premium";
  const initial = email.charAt(0).toUpperCase() || "?";

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };
  const handleAuthSuccess = (mail: string) => {
    setAuthOpen(false);
    setEmail(mail);
    setPlan("premium");
    Toast.success(
      authMode === "restore"
        ? "Compra restaurada com sucesso"
        : "Login realizado",
    );
  };
  const handleLogout = () => {
    setPlan("free");
    setEmail("");
    Toast.success("Você saiu da conta");
  };

  const preferenceRows = [
    {
      icon: "cloud-sync-outline" as IconName,
      title: "Sincronização na nuvem",
      desc: isPremium
        ? "Mantém seus dados atualizados em todos os aparelhos"
        : "Disponível apenas no Premium",
      value: isPremium && cloudSync,
      set: setCloudSync,
      disabled: !isPremium,
    },
    {
      icon: "bell-outline" as IconName,
      title: "Notificações de partidas",
      desc: "Lembretes de jogos e convocações",
      value: notifications,
      set: setNotifications,
      disabled: false,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#13192b]">
      <ScrollView
        className="flex-1"
        contentContainerClassName="mx-auto w-full max-w-2xl px-4 pb-12 pt-4"
      >
        <View className="mb-6 flex-row items-center gap-3">
          <Button
            onPress={() => router.back()}
            className="rounded-lg border border-[#252f4a] bg-[#1c2438] px-3 py-2"
          >
            <Icon name="arrow-left" size={16} />
            <Text className="text-sm text-[#8b95b0]">Voltar</Text>
          </Button>
          <View className="flex-1 flex-row items-center gap-2">
            <View className="rounded-lg border border-[#1a4d30] bg-[#1a3b2a] p-2">
              <Icon name="cog-outline" className="text-[#00e676]" />
            </View>
            <View>
              <Text className="text-lg font-semibold leading-tight text-white">
                Configurações
              </Text>
              <Text className="text-xs text-[#8b95b0]">
                Conta, assinatura e preferências
              </Text>
            </View>
          </View>
        </View>

        {isPremium ? (
          <>
            <SectionLabel>Conta</SectionLabel>
            <Card className="mb-6">
              <View className="flex-row items-center gap-4 p-5">
                <View className="h-14 w-14 items-center justify-center rounded-full border border-[#1a4d30] bg-[#1a3b2a]">
                  <Text className="text-2xl text-[#00e676]">{initial}</Text>
                </View>
                <View className="min-w-0 flex-1">
                  <Text className="text-white">{email}</Text>
                  <View className="mt-1.5 flex-row items-center gap-1.5 self-start rounded-full border border-[#1a4d30] bg-[#1a3b2a] px-2.5 py-0.5">
                    <Icon
                      name="crown-outline"
                      className="text-[#00e676]"
                      size={12}
                    />
                    <Text className="text-xs text-[#00e676]">
                      Premium ativo
                    </Text>
                  </View>
                </View>
              </View>
              <FlatList
                data={[
                  {
                    icon: "check-decagram-outline" as IconName,
                    label: "Status da assinatura",
                    value: "Ativa",
                    accent: true,
                  },
                  {
                    icon: "calendar-clock-outline" as IconName,
                    label: "Próxima renovação",
                    value: "19 de nov. de 2026",
                  },
                  {
                    icon: "credit-card-outline" as IconName,
                    label: "Plano",
                    value: "Premium Anual",
                  },
                  {
                    icon: "cellphone-link" as IconName,
                    label: "Aparelhos conectados",
                    value: "2 de 3",
                  },
                ]}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                  <View
                    className={`flex-row items-center justify-between gap-3 border-t border-[#252f4a] bg-[#161e30] px-5 py-3 ${index === 0 ? "border-t-0" : ""}`}
                  >
                    <View className="flex-row items-center gap-2.5">
                      <Icon name={item.icon} size={15} />
                      <Text className="text-sm text-[#8b95b0]">
                        {item.label}
                      </Text>
                    </View>
                    <Text
                      className={`text-sm ${item.accent ? "text-[#00e676]" : "text-[#e5e7eb]"}`}
                    >
                      {item.value}
                    </Text>
                  </View>
                )}
              />
              <View className="flex-row gap-2 border-t border-[#252f4a] p-2">
                <LogoutDialog onConfirm={handleLogout} />
              </View>
            </Card>
            <SectionLabel>Uso do Premium</SectionLabel>
            <Card className="mb-6">
              <View className="flex-row justify-around p-5">
                {[
                  ["128", "Jogadores"],
                  ["14", "Times"],
                  ["362", "Partidas"],
                ].map(([value, label]) => (
                  <View key={label} className="items-center">
                    <Text className="text-2xl text-white">{value}</Text>
                    <Text className="text-xs text-[#8b95b0]">{label}</Text>
                  </View>
                ))}
              </View>
              <View className="flex-row items-center gap-2 border-t border-[#252f4a] bg-[#161e30] px-5 py-2.5">
                <Icon name="infinity" className="text-[#00e676]" size={14} />
                <Text className="text-xs text-[#8b95b0]">
                  Sem limites de cadastro no Premium
                </Text>
              </View>
            </Card>
          </>
        ) : (
          <>
            <View className="mb-6 rounded-2xl border border-[#1a4d30] bg-[#17382b] p-5">
              <View className="mb-4 self-start flex-row items-center gap-1.5 rounded-full border border-[#1a4d30] bg-[#1a3b2a] px-2.5 py-1">
                <Icon
                  name="crown-outline"
                  className="text-[#00e676]"
                  size={12}
                />
                <Text className="text-xs text-[#00e676]">PLANO PREMIUM</Text>
              </View>
              <Text className="mb-1.5 text-2xl font-semibold text-white">
                Desbloqueie nuvem e{"\n"}
                <Text className="text-[#00e676]">cadastros ilimitados</Text>
              </Text>
              <Text className="mb-5 text-sm text-[#8b95b0]">
                Você está no plano Gratuito. Passe para o Premium e leve todo o
                seu clube para qualquer lugar.
              </Text>
              <FlatList
                data={perks}
                scrollEnabled={false}
                numColumns={2}
                columnWrapperClassName="gap-4"
                renderItem={({ item }) => (
                  <View className="mb-3 flex-1 flex-row items-start gap-3">
                    <View className="rounded-md border border-[#1a4d30] bg-[#1a3b2a] p-1.5">
                      <Icon
                        name={item.icon}
                        className="text-[#00e676]"
                        size={14}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-white">{item.title}</Text>
                      <Text className="text-xs text-[#8b95b0]">
                        {item.desc}
                      </Text>
                    </View>
                  </View>
                )}
              />
              <Button
                onPress={() => Toast.success("Abrindo opções de assinatura...")}
                className="mt-3 self-start rounded-lg bg-[#00e676] px-5 py-2"
              >
                <Icon
                  name="crown-outline"
                  className="text-[#07130d]"
                  size={16}
                />
                <Text className="text-[#07130d]">Assinar Premium</Text>
                <Icon
                  name="chevron-right"
                  className="text-[#07130d]"
                  size={16}
                />
              </Button>
              <Text className="mt-3 text-xs text-[#8b95b0]">
                <Text className="text-white">R$ 19,90</Text>/mês · cancele
                quando quiser
              </Text>
            </View>
            <SectionLabel>Conta</SectionLabel>
            <Card className="mb-6">
              <View className="flex-row items-center gap-4 p-5">
                <View className="rounded-full border border-[#252f4a] bg-[#161e30] p-3">
                  <Icon name="cloud-outline" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-white">Você não está conectado</Text>
                  <Text className="text-xs text-[#8b95b0]">
                    Seus dados estão salvos apenas neste aparelho.
                  </Text>
                </View>
              </View>
              <View className="gap-2 border-t border-[#252f4a] p-4">
                <Button
                  onPress={() => openAuth("login")}
                  className="rounded-lg bg-[#00e676] py-2.5"
                >
                  <Icon name="login" className="text-[#07130d]" size={16} />
                  <Text className="text-sm text-[#07130d]">
                    Entrar / Fazer login
                  </Text>
                </Button>
                <Button
                  onPress={() => openAuth("restore")}
                  className="rounded-lg border border-[#252f4a] bg-[#161e30] py-2.5"
                >
                  <Icon name="restore" className="text-[#00e676]" size={16} />
                  <Text className="text-sm text-[#e5e7eb]">
                    Restaurar compras
                  </Text>
                </Button>
              </View>
              <Text className="border-t border-[#252f4a] bg-[#161e30] px-5 py-3 text-xs text-[#4b5780]">
                Já pagou em outro aparelho ou reinstalou o app? Use “Restaurar
                compras”.
              </Text>
            </Card>
            <SectionLabel>Limites do plano Gratuito</SectionLabel>
            <Card className="mb-6 p-5">
              <FlatList
                data={[
                  { label: "Jogadores", used: 24, max: 30 },
                  { label: "Times", used: 3, max: 4 },
                ]}
                scrollEnabled={false}
                renderItem={({ item }) => {
                  const percentage = (item.used / item.max) * 100;
                  return (
                    <View className="mb-4">
                      <View className="mb-1.5 flex-row justify-between">
                        <Text className="text-[#e5e7eb]">{item.label}</Text>
                        <Text className="text-[#8b95b0]">
                          {item.used}/{item.max}
                        </Text>
                      </View>
                      <View className="h-1.5 overflow-hidden rounded-full bg-[#252f4a]">
                        <View
                          className={`h-full rounded-full ${percentage > 75 ? "w-[80%] bg-orange-400" : "w-[75%] bg-[#00e676]"}`}
                        />
                      </View>
                    </View>
                  );
                }}
              />
            </Card>
          </>
        )}

        <Text className="mt-8 text-center text-xs text-[#4b5780]">
          Versão 1.0.0
        </Text>
      </ScrollView>
      <AuthDialog
        open={authOpen}
        mode={authMode}
        onOpenChange={setAuthOpen}
        onSuccess={handleAuthSuccess}
      />
    </SafeAreaView>
  );
}
